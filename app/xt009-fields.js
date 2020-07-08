'use strict';

const actions = {
    'success': () => {},
    'fail': () => {},
    'timeout': () => {}
}

//Regexes to validate the comma separated fields received from a client
const fieldRegexes = [
    '[0-9]{12}',						//Serial number (date&time)
    '[0-9\\+\\-]+',						//Authorized number
    'GPRMC',							//NMEA identifier http://www.gpsinformation.org/dale/nmea.htm#2.3
    '[0-9]{6}\\.[0-9]{1,3}',				//UTC time HHMMSS.S(SS)
    'A|V',							//Status (A = valid, V = invalid)
    '[0-9]{4}\\.[0-9]{3,4}',				//DDMM.MMM(M) Latitude in degrees, minutes, and decimal minutes
    'N|S',							//Latitude location (N = North latitude, S = South latitude)
    '[0-9]{5}\\.[0-9]{3,4}',				//DDDMM.MMM(M) Longitude in degrees, minutes, and decimal minutes
    'E|W',							//Longitude location (E  = East longitude, W = West longitude)
    '[0-9]{1,3}\\.[0-9]{1,3}',			//Ground speed, in knots
    '[0-9]{1,3}\\.[0-9]{1,3}',			//Track made good, reference to true north
    '[0-9]{6,8}',						//DDMMYY UTC date of position fix in day, month, and year
    '[0-9]{1,2}\\.[0-9]{1,3}',		//Magnetic Variation, in degrees
    'E|W',							//Variation sense (E = East, W = West)
    '[NADPRFEMS]{1}\\*[A-Fa-f0-9]{2}', 	//Mode indicator and checksum http://www.hemispheregps.com/gpstechinfo/GPRMC.htm
    'F|L',							//F=== Full GPS signal L=== No GPS signal
    '[A-Za-z0-9!\\s]{0,}',					//tracker message
    '[\\s]?imei:[0-9]{15,16}'						//unit imei number
]

const extendedFieldsRegexes = [
    '[0-9]{2}', 						//Number of satellites
    '-{0,1}[0-9]{1,5}\\.[0-9]{1}',				//Altitude as reported by gps
    '[FL]{1}:[0-9]{1,2}\\.[0-9]{1,2}V',	//Battery voltage and charge level (F/L)
    '[0-1]{1}',							//Charging status
    '[0-9]{2,3}',						//Message length so far
    '[0-9]{2,5}',							//crc16
    '[0-9]{3}',							//MCC Mobile Country Code
    '[0-9]{2,3}',						//MNC Mobile Network Code
    '[0-9A-F]{1,5}',						//LAC Location Area Code
    '[0-9A-F]{4}',						//CellID GSM Cell identification
]

const fieldLabels = [
    'serial',						//Serial number (date&time)
    'authorized_number',						//Authorized number
    'nmea',							//GPRMC identifier
    'utc',				//UTC time HHMMSS.S(SS)
    'status',							//Status (A = valid, V = invalid)
    'lat',				//DDMM.MMM(M) Latitude in degrees, minutes, and decimal minutes
    'lat_loc',							//Latitude location (N = North latitude, S = South latitude)
    'long',				//DDDMM.MMM(M) Longitude in degrees, minutes, and decimal minutes
    'long_loc',							//Longitude location (E  = East longitude, W = West longitude)
    'gs',			//Ground speed, in knots
    'track',			//Track made good, reference to true north
    'position_utc',						//DDMMYY UTC date of position fix in day, month, and year
    'var',		//Magnetic Variation, in degrees
    'var_sense',							//Variation sense (E = East, W = West)
    'mode', 	//Mode indicator http://www.hemispheregps.com/gpstechinfo/GPRMC.htm
    'gps_signal',							//F=== Full GPS signal L=== No GPS signal
    'message',					//tracker message
    'imei'						//unit imei number
]

const extendedFieldsLabels = [
    'satellites', 						//Number of satellites
    'altitude',				//Altitude as reported by gps
    'voltage',	//Battery voltage and charge level (F/L)
    'charging',							//Charging status
    'length',						//Message length so far
    'crc',							//crc16
    'mcc',							//MCC Mobile Country Code
    'mnc',						//MNC Mobile Network Code
    'lac',						//LAC Location Area Code
    'cellid',						//CellID GSM Cell identification
]

const databaseMap =
    {
        ip: 'ip',
        serial: 'serial',
        authorized_number: 'authorized_number',
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
        gps_signal: 'gps_signal',
        message: 'message',
        imei: 'unit_id',
        satellites: 'satellites',
        altitude: 'altitude',
        voltage: 'charge',
        charging: 'charging',
        crc: 'crc16',
        mcc: 'mcc',
        mnc: 'mnc',
        lac: 'lac',
        cellid: 'cellid'
    }



const fullSet = fieldRegexes.slice().concat(extendedFieldsRegexes)
const allFields = fieldLabels.slice().concat(extendedFieldsLabels)

const on = (action, callback) => {
    actions[action] = callback
}

const verify = (rawData) => {
    const parts = rawData.split(",")
    if(parts.length>23){
        let dataString = ""
        for(let i=0;i<23;i++){
            dataString += parts[i] + ","
        }
        const crc16String = crc16Xmodem(dataString) + ""
        return crc16String === parts[23]
    }
    return false   
}

const crc16Xmodem = (data) => {
    let str = data;
    let crc = 0;
    for (let c = 0; c < str.length; c++) {
        crc ^= str.charCodeAt(c) << 8;
        for (let i = 0; i < 8; i++) {
            if (crc & 0x8000)
                crc = (crc << 1) ^ 0x1021;
            else
                crc = crc << 1;
        }
    }
    return crc & 0xFFFF;
}

module.exports.on = on
module.exports.verify = verify
module.exports.regex = fullSet
module.exports.labels = allFields 
module.exports.databaseMap = databaseMap
module.exports.actions = actions