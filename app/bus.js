'use strict';
const DEBUG = process.env.DEBUG ? process.env.DEBUG==='YES' : true
const database = require('./mysql-database.js')
const influx = require('./influx-database')
const env = require('./env')
const auth = require('./auth')
const xt009 = require('./xt009-fields.js')
const gprmc = require('./gprmc-fields')
const xexunCommand = require('./xexun-commands-fields')

/**
 * Ask the tracker to report position at this interval in seconds.
 */

const xexunDataInterval = 30

/**
 * Make a string out of the reporting interval
 */

const dataIntervalString = xexunDataInterval < 100 ? `0${xexunDataInterval}s` : `${xexunDataInterval}s`

/**
 * Tracker password
 */

const admin_pwd = '123456'

/**
 * Commands to send to the tracker each time it opens a new TCP/IP connection
 */

const gps_setting_commands = [
	{command: `t${dataIntervalString}***n`, value: ''},
	{command: 'tlimit', value: '0'},
    {command: 'readsd', value: '1'},
    {command: 'sdlog', value: '1'}
]

/**
 * Event on server receiving data and parsing a valid Xexun data string.
 */

xt009.on('success', (data) => {
    if(DEBUG) console.log("Successfully parsed xt009 data:", data)
    if( auth.verify(data.imei) ){
        database.write(data,xt009)
        influx.write(data,xt009)
    }
})

/**
 * Event on server receiving data and parsing a valid GPRMC data set from the data.
 */

gprmc.on('success', (data) => {
    if(DEBUG) console.log("Successfully parsed GPRMC data:", data)
    //GRPMC data itself does not include any information identifying the unit, so access can only be limited based on ip address
    if( auth.verify(data.ip) ){
        database.write(data,gprmc)
        influx.write(data,gprmc)
    }
})

/**
 * Event after the tracker reports successfully having executed a command.
 */

xexunCommand.on('success', (data) => {
    if(DEBUG){
        console.log("Xexun command successful: " + data.message)
    }
})



const getCommandsOnConnect = (unitId) => {
    return gps_setting_commands.map( cmd => `${cmd.command}${admin_pwd} ${cmd.value}`)
}


module.exports.getCommandsOnConnect = getCommandsOnConnect
module.exports.init = () => {
    database.connect(env.mysql)
    influx.connect(env.influx,xexunDataInterval)
}

//Provide the models in order of preference if the received data might be parsable with more than one model
module.exports.models = [xt009,gprmc,xexunCommand]