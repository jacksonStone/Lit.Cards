//Paths in here are relative to the electron/database/external-connections.
//This file will get copied over to electron folder - and is only intended
//to be used in an electron context.
let fakeDatabaseConnector = require('../../mocked-data');
let _ = require('lodash')

console.log("LOADING ELECTRON FILE SYSTEM DATA INTERFACE");
async function getRecord (table, conditions, limit) {
  if(conditions && conditions.userEmail) {
    delete conditions.userEmail;
  }
  let tableData = fakeDatabaseConnector[table]
  if (!tableData) return
  let results = _.map(
    _.filter(tableData, dbEntry => {
      let match = true
      _.each(conditions, (conditionValue, conditionKey) => {
        if (dbEntry[conditionKey] !== conditionValue) {
          match = false
          return false
        }
      })
      return match
    }), v => {
      return _.cloneDeep(v)
    }
  )
  if (limit === 1 && results && results.length) {
    return results[0]
  } else if(limit === 1) {
    return;
  } else if(limit) {
    return results.slice(0, limit)
  }
  return results
}

async function setRecord (table, values) {
  let tableData = fakeDatabaseConnector[table]
  if (values.userEmail) {
    delete values.userEmail;
  }
  if (!tableData) return
  tableData.push(values)
  return values
}

async function unsetRecord (table, values) {
  let tableData = fakeDatabaseConnector[table]
  if (!tableData) return
  fakeDatabaseConnector[table] = _.reject(tableData, values)
}

async function editRecord (table, filter, values) {
  let tableData = fakeDatabaseConnector[table]
  if (!tableData) return
  let entries = _.filter(tableData, filter)
  for (let i = 0; i < entries.length; i++) {
    let entry = entries[i]
    Object.assign(entry, values)
  }
}
module.exports = { getRecord, setRecord, unsetRecord, editRecord }
