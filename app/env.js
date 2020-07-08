/**
 * MySQL Database 
 */

const mysql = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "tracker",
    password: process.env.DB_PASSWORD || "secretpassword",
    database: process.env.DB || "gps",
    connectionLimit: 100
}

/**
 * InfluxDB 
 */

const influxdb = {
    host: process.env.DB_HOST || "localhost",
    port: process.env.INFLUX_PORT || 8086,
    database: process.env.DB || "gps"
}

/**
 * If set, a comma separated list of allowed tracker ids (imei codes).
 */
const unitIds = process.env.UNIT_IDS ? process.env.UNIT_IDS.split(',') : []

module.exports.mysql = mysql
module.exports.influx = influxdb
module.exports.unitIds = unitIds