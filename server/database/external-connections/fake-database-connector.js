const _ = require('lodash')
let fakeDatabaseConnector = require('../../mocked-data')
const fakeDataBackup = _.cloneDeep(fakeDatabaseConnector)

async function getRecord (table, conditions, limit) {
  const tableData = fakeDatabaseConnector[table]
  if (!tableData) return
  const results = _.map(
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
  const tableData = fakeDatabaseConnector[table]
  if (!tableData) return
  tableData.push(values)
  return values
}

async function unsetRecord (table, values) {
  const tableData = fakeDatabaseConnector[table]
  if (!tableData) return
  fakeDatabaseConnector[table] = _.reject(tableData, values)
}

async function editRecord (table, filter, values) {
  console.log(values)
  const tableData = fakeDatabaseConnector[table]
  if (!tableData) return
  const entries = _.filter(tableData, filter)
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i]
    Object.assign(entry, values)
  }
}

// For testing
function setFakeData (newFakeData) {
  fakeDatabaseConnector = newFakeData
}

function resetData () {
  fakeDatabaseConnector = fakeDataBackup
}

module.exports = { getRecord, setRecord, setFakeData, resetData, unsetRecord, editRecord }
