'use strict';

const actions = {
    'success': () => {},
    'fail': () => {},
    'timeout': () => {}
}

/**
 * Regexes to validate the comma separated fields received from a client 
 */

const regexes = [
    'GPRMC',							//NMEA identifier http://www.gpsinformation.org/dale/nmea.htm#2.3
    '[0-9]{6}\\.[0-9]{1,3}',			//UTC time HHMMSS.S(SS)
    'A|V',							    //Status (A = valid, V = invalid)
    '[0-9]{4}\\.[0-9]{3,4}',			//DDMM.MMM(M) Latitude in degrees, minutes, and decimal minutes
    'N|S',							    //Latitude location (N = North latitude, S = South latitude)
    '[0-9]{5}\\.[0-9]{3,4}',			//DDDMM.MMM(M) Longitude in degrees, minutes, and decimal minutes
    'E|W',							    //Longitude location (E  = East longitude, W = West longitude)
    '[0-9]{1,3}\\.[0-9]{1,3}',			//Ground speed, in knots
    '[0-9]{1,3}\\.[0-9]{1,3}',			//Track made good, reference to true north
    '[0-9]{6,8}',						//DDMMYY UTC date of position fix in day, month, and year
    '[0-9]{1,2}\\.[0-9]{1,3}',		    //Magnetic Variation, in degrees
    'E|W',							    //Variation sense (E = East, W = West)
    '[NADPRFEMS]{1}\\*[A-Fa-f0-9]{2}', 	//Mode indicator and checksum http://www.hemispheregps.com/gpstechinfo/GPRMC.htm
]

const labels = [
    'nmea',							    //NMEA identifier
    'utc',				                //UTC time HHMMSS.S(SS)
    'status',							//Status (A = valid, V = invalid)
    'lat',				                //DDMM.MMM(M) Latitude in degrees, minutes, and decimal minutes
    'lat_loc',							//Latitude location (N = North latitude, S = South latitude)
    'long',				                //DDDMM.MMM(M) Longitude in degrees, minutes, and decimal minutes
    'long_loc',							//Longitude location (E  = East longitude, W = West longitude)
    'gs',			                    //Ground speed, in knots
    'track',			                //Track made good, reference to true north
    'position_utc',						//DDMMYY UTC date of position fix in day, month, and year
    'var',		                        //Magnetic Variation, in degrees
    'var_sense',						//Variation sense (E = East, W = West)
    'mode', 	                        //Mode indicator http://www.hemispheregps.com/gpstechinfo/GPRMC.htm
]

/**
 * Map the data fields from the tracker to database fields.
 */

const databaseMap = {
    utc: 'gprmc_time',
    status: 'gprmc_status',
    lat: 'gprmc_lat',
    lat_loc: 'gprmc_lat_loc',
    long: 'gprmc_long',
    long_loc: 'gprmc_long_loc',
    gs: 'gprmc_gs',
    track: 'gprmc_track',
    position_utc: 'gprmc_date',
    var: 'gprmc_var',
    var_sense: 'gprmc_var_sense',
    mode: 'gprmc_mode',
}

const on = (action, callback) => {
    actions[action] = callback
}

/**
 * Verify checksum for a data string.
 * 
 * @param {*} rawData The data string, including the checksum received from the tracker.
 * 
 * @returns true|false Result of checksum verification.
 */

const verify = (rawData) => {
    const matches = rawData.match(/\*[A-Fa-f0-9]{2}/)
    if(matches && matches.length === 1){
        const messageString = rawData.substring(0,matches.index)
        const checkSum = rawData.substring(matches.index+1,matches.index+3)
        return verifyChecksum(messageString,checkSum)
    }
    return false
}

/**
 * Verify checksum of received dataset.
 * 
 * @param {*} cmd The string to calculate the checksum for.
 * @param {*} receivedChecksum The received checksum.
 * 
 * @returns true|false Result of checksum verification.
 */

const verifyChecksum = (cmd,receivedChecksum) =>
{
  // Compute the checksum by XORing all the character values in the string.
  var checksum = 0;
  for(var i = 0; i < cmd.length; i++) {
    checksum = checksum ^ cmd.charCodeAt(i);
  }

  // Convert it to hexadecimal (base-16, upper case, most significant nybble first).
  var hexsum = Number(checksum).toString(16).toUpperCase();
  if (hexsum.length < 2) {
    hexsum = ("00" + hexsum).slice(-2);
  }
  
  return hexsum === receivedChecksum
}

module.exports.on = on
module.exports.verify = verify
module.exports.regex = regexes
module.exports.labels = labels 
module.exports.databaseMap = databaseMap
module.exports.actions = actions