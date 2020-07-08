'use strict';

const env = require('./env')

//Implement your own authorization method here if you want to limit what data can be written to the database.

/**
 * Verify if a set of data identified by 'string' is eligible to be written into the database.
 * Default valid values for 'string' is an empty array, ie anything will match. 
 * If an environment variable named UNIT_IDS exists, it should be a comma separated list of strings.
 * 
 * @param {*} string String to compare to, for example the tracker imei code.
 */

const verify = (string) => {

    if( env.unitIds.length === 0 )
        return true;

    return env.unitIds.includes( string )
}

module.exports.verify = verify