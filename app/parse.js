'use strict';
const DEBUG = process.env.DEBUG ? process.env.DEBUG==='YES' : true

/**
 * Parse a line received by the server
 * 
 * @param {*} line The line to parse. Comma separated values, no new line character.
 * @param {*} param1 An object containing the regex to use when parsing the line and labels for the fields matching the regex.
 * 
 * @returns object|null Object with each value associated to the respective field name as determined by the labels provided. Null on failure.
 */

const line = (line,{regex:fieldRegexes,labels:fieldLabels,verify,actions}) => {
    
    const lineRegexpString = fieldRegexes.length>1 ? '('+fieldRegexes.join(')?,(')+')?' : fieldRegexes
    const matches = line.match(new RegExp(lineRegexpString))

    if(matches){
        if(!verify(matches[0])){
            if(DEBUG) console.log("Checksum error for: ",line)
            actions.fail(line,"Checksum error")
            return null
        }
    }

    if (matches && matches.length>1) {
        return fieldLabels.reduce((o, fieldName, idx) => {
            const nextO = Object.assign({},o)
            nextO[fieldName] = matches[idx + 1] ? matches[idx + 1].trim() : null
            return nextO
        }, {})
    }else if( matches && matches.length===1 && fieldLabels.length === 1){
        const obj = {}
        obj[fieldLabels[0]] = matches[0]
        return obj
    }
    return null
}

module.exports = line