'use strict';

const parseLine = require('./parse.js')
const xt009 = require('./xt009-fields.js')
const gprmc = require('./gprmc-fields')
const xexunCommands = require('./xexun-commands-fields')
const database = require('./mysql-database.js')
const env = require('./env')
database.connect(env.mysql)
const promises = []

xt009.on('success', (data) => {
    console.log("Successfully parsed xt009 data:", data)
    promises.push(database.write(data,xt009))

})

xt009.on('fail', (data,error) => {
    console.log("Failed to parse: ", data)
    console.log(error)
})

gprmc.on('success', (data) => {
    console.log("Successfully parsed GPRMC data:", data)
    promises.push(database.write(data,gprmc))
})

xexunCommands.on('success', (data) => {
    console.log("Successfully parsed Xexun command response:", data)
    promises.push(database.write(data,xexunCommands))
})



promises.push( new Promise( resolve => {

    const models = [gprmc,xt009,xexunCommands]
    
    const rawLine = '171003111211,+85296684810,GPRMC,031211.000,A,2222.9496,N,11415.7746,E,0.00,164.52,031017,,,A*6E,F,, imei:867965021634452,09,99.7,F:4.27V,1,139,6672,454,12,015E,11C8'
    
    
    models.forEach( model => {
        const parsed = parseLine(rawLine,model)
        if(parsed && model.actions.success){
            model.actions.success(parsed)
        }
    })
    
    console.log("Testing to parse a command.")
    
    const rawCommand = "readsd ok"
    
    models.forEach( model => {
        const parsed = parseLine(rawCommand,model)
        if(parsed && model.actions.success){
            model.actions.success(parsed)
        }
    })
    
    
    resolve()
}))

// const promises = []

// for(let i=0; i<10;i++){
//     const newObj = Object.assign({},obj)
//     newObj.altitude = "" + i
//     promises.push(database.write(newObj))
// }

Promise.all(promises)
    .then( () => {
        database.disconnect()
    })
    .catch( (err) => {
        console.log("Write failed.",err)
        database.disconnect()
    })
