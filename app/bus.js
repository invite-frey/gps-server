'use strict';
const DEBUG = process.env.DEBUG ? process.env.DEBUG==='YES' : true
const database = require('./mysql-database.js')
const influx = require('./influx-database')
const env = require('./env')
const xt009 = require('./xt009-fields.js')
const gprmc = require('./gprmc-fields')
const xexunCommand = require('./xexun-commands-fields')
//Send commands to the tracker at this interval in seconds
const xexunDataInterval = 30

xt009.on('success', (data) => {
    if(DEBUG) console.log("Successfully parsed xt009 data:", data)
    database.write(data,xt009)
    influx.write(data,xt009)
})

gprmc.on('success', (data) => {
    if(DEBUG) console.log("Successfully parsed GPRMC data:", data)
    database.write(data,gprmc)
    influx.write(data,gprmc)
})

xexunCommand.on('success', (data) => {
    if(DEBUG){
        console.log("Xexun command successful: " + data.message)
    }
})

const dataIntervalString = xexunDataInterval < 100 ? `0${xexunDataInterval}s` : `${xexunDataInterval}s`
const admin_pwd = '123456'
const gps_setting_commands = [
	{command: `t${dataIntervalString}***n`, value: ''},
	{command: 'tlimit', value: '0'},
    {command: 'readsd', value: '1'},
    {command: 'sdlog', value: '1'}
]

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