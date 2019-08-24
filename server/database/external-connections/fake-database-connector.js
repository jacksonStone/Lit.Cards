let _ = require('lodash')
let fakeDatabaseConnector = require('../../mocked-data')
let fakeDataBackup = _.cloneDeep(fakeDatabaseConnector)

async function getRecord (table, conditions, limit) {
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
  if (limit) {
    return results.slice(0, limit)
  }
  return results
}

async function setRecord (table, values) {
  let tableData = fakeDatabaseConnector[table]
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

// For testing
function setFakeData (newFakeData) {
  fakeDatabaseConnector = newFakeData
}
function resetData (table) {
  if(table && typeof table === 'string') {
    return fakeDatabaseConnector[table] = _.cloneDeep(fakeDataBackup[table]);
  }
  fakeDatabaseConnector = _.cloneDeep(fakeDataBackup)
}
function getAllData() {
  return fakeDatabaseConnector
}

module.exports = { getRecord, setRecord, setFakeData, resetData, unsetRecord, editRecord, getAllData }
