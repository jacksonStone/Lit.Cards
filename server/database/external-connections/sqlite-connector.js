/**
 * This writes parameterized SQL queries to a small go server I've written whose main job is interfacing with the SQLite driver locally
 * This sqlite wrapper is only intended to be run locally on the same machine as this service as it is unauthenticated
 */
let _ = require('lodash')
const SQLiteUrl = process.env.SQLITE_URL;
const identifierRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/
const numberRegex = /^[0-9]*$/
const crypto = require('crypto')

function verifiyIdentifier(identifier) {
    if (!identifier.match(identifierRegex)) {
        throw new Error('Invalid identifier')
    }
    return identifier
}
function verifyNumber(number) {
    number = number + ''
    if (!number.match(numberRegex)) {
        throw new Error('Invalid number')
    }
    return number
}
function getTableName(table) {
    verifiyIdentifier(table)
    return "libby_cards_" + table
}
function executeSQLCommand(sqlQuery, params) {
    return fetch(SQLiteUrl+"/execute", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({query: sqlQuery, parameters: params || []})
    })
}
async function runSqlQueryAndGetBackRows(sqlQuery, params) {
    response = await fetch(`${SQLiteUrl}/query`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({query: sqlQuery, parameters: params || []})
    })
    return response.json()
}
async function getRecord(table, conditions, limit) {
    actualTable = getTableName(table)
    const orderedConditions = Object.keys(conditions).map(verifiyIdentifier)
    let sqlQuery = `SELECT * FROM ${actualTable} WHERE ${orderedConditions.map(k => `${k} = ?`).join(' AND ')}`;
    if (limit) {
        sqlQuery += ` LIMIT ${verifyNumber(limit)}`
    }
    results = await runSqlQueryAndGetBackRows(sqlQuery, orderedConditions.map(k => conditions[k]))
    if (limit === 1 && results && results.length) {
        return results[0]
    } else if (limit === 1) {
        return;
    } 
    return results
}

async function setRecord(table, values) {
    actualTable = getTableName(table)
    values["_id"] = crypto.randomUUID()
    const orderedColumns = Object.keys(values).map(verifiyIdentifier)
    let sqlQuery = `INSERT INTO ${actualTable} (${orderedColumns.join(', ')}) VALUES (${orderedColumns.map(() => '?').join(', ')})`
    const result = await executeSQLCommand(sqlQuery, orderedColumns.map(k => values[k]))
    console.log(result)
    return values
}

async function unsetRecord(table, values) {
    actualTable = getTableName(table)
    const orderedConditions = Object.keys(values).map(verifiyIdentifier)
    let sqlQuery = `DELETE FROM ${actualTable} WHERE ${orderedConditions.map(k => `${k} = ?`).join(' AND ')}`;    
    await executeSQLCommand(sqlQuery, orderedConditions.map(k => values[k]))
}

async function editRecord(table, filter, values) {
    actualTable = getTableName(table)
    const orderedColumnsForValues = Object.keys(values).map(verifiyIdentifier)
    const orderedConditions = Object.keys(filter).map(verifiyIdentifier)
    let sqlQuery = `UPDATE ${actualTable} SET ${orderedColumnsForValues.map(k => `${k} = ?`).join(', ')} WHERE ${orderedConditions.map(k => `${k} = ?`).join(' AND ')}`
    return executeSQLCommand(sqlQuery, orderedColumnsForValues.map(k => values[k]).concat(orderedConditions.map(k => filter[k])))
}

module.exports = { getRecord, setRecord, unsetRecord, editRecord, connectToDatabase: async () => { } }
