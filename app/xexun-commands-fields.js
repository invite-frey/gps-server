'use strict';

const actions = {
    'success': () => {},
    'fail': () => {},
    'timeout': () => {}
}

//Regexes to validate the comma separated fields received from a client
const commandResponseRegex = [
    '[\\s\\*a-zA-Z0-9]{1,} ok'
]

const fieldLabels = [
    'message'
]

const databaseMap =
{
    message: 'message'
}

const on = (action, callback) => {
    actions[action] = callback
}

const verify = (rawData) => {
    return true   
}

module.exports.on = on
module.exports.verify = verify
module.exports.regex = commandResponseRegex
module.exports.labels = fieldLabels 
module.exports.databaseMap = databaseMap
module.exports.actions = actions
