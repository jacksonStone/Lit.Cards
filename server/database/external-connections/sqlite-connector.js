/**
 * This writes parameterized SQL queries to a small go server I've written whose main job is interfacing with the SQLite driver locally
 * This sqlite wrapper is only intended to be run locally on the same machine as this service as it is unauthenticated
 */
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
async function executeSQLCommand(sqlQuery, table, params) {
    const start = Date.now()
    const result = await fetch(SQLiteUrl + "/execute", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: sqlQuery, parameters: params || [] })
    })
    // do some error handling
    if (!result.ok) {
        const errorMessage = await result.text(); // Read the error message from the response body
        throw new Error(`Failed to execute SQL Command: ${result.statusText} - ${errorMessage}`);
    }
    const end = Date.now()
    console.log(`took ${end - start}ms: Execution against table: ${table}`)
}
async function runSqlQueryAndGetBackRows(sqlQuery, table, params) {
    const start = Date.now()
    response = await fetch(`${SQLiteUrl}/query`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: sqlQuery, parameters: params || [] })
    })
    // do some error handling
    if (!response.ok) {
        const errorMessage = await response.text(); // Read the error message from the response body
        throw new Error(`Failed to execute SQL Query: ${response.statusText} - ${errorMessage}`);
    }
    const end = Date.now()
    console.log(`took ${end - start}ms: Query against table: ${table}`)
    return response.json()
}
async function getRecord(table, conditions, limit) {
    actualTable = getTableName(table)
    const orderedConditions = Object.keys(conditions).map(verifiyIdentifier)
    let sqlQuery = `SELECT * FROM ${actualTable} WHERE ${orderedConditions.map(k => `${k} = ?`).join(' AND ')}`;
    if (limit) {
        sqlQuery += ` LIMIT ${verifyNumber(limit)}`
    }
    results = await runSqlQueryAndGetBackRows(sqlQuery, actualTable, orderedConditions.map(k => conditions[k]))
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
    await executeSQLCommand(sqlQuery, actualTable, orderedColumns.map(k => values[k]))
    return values
}

async function unsetRecord(table, values) {
    actualTable = getTableName(table)
    const orderedConditions = Object.keys(values).map(verifiyIdentifier)
    let sqlQuery = `DELETE FROM ${actualTable} WHERE ${orderedConditions.map(k => `${k} = ?`).join(' AND ')}`;
    await executeSQLCommand(sqlQuery, actualTable, orderedConditions.map(k => values[k]))
}

async function editRecord(table, filter, values) {
    actualTable = getTableName(table)
    const orderedColumnsForValues = Object.keys(values).map(verifiyIdentifier)
    const orderedConditions = Object.keys(filter).map(verifiyIdentifier)
    let sqlQuery = `UPDATE ${actualTable} SET ${orderedColumnsForValues.map(k => `${k} = ?`).join(', ')} WHERE ${orderedConditions.map(k => `${k} = ?`).join(' AND ')}`
    return executeSQLCommand(sqlQuery, actualTable, orderedColumnsForValues.map(k => values[k]).concat(orderedConditions.map(k => filter[k])))
}

module.exports = { getRecord, setRecord, unsetRecord, editRecord, connectToDatabase: async () => { } }
