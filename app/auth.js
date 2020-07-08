'use strict';

const env = require('./env')

//Implement your own authorization method here if you want to limit what data can be written to the database.

const verify = (string) => {

    if( env.unitIds.length === 0 )
        return true;

    return env.unitIds.includes( string )
}

module.exports.verify = verify