const _ = require('lodash')

// password: somePassword
let fakeData = {
  user: [{
    userId: 'jackson@someemail.com',
    password: 'X0VIy9vshnkFZVZO8tLB4Uod5JDREmf1eIh9qIP6KR0=',
    salt: '8b73210c-8004-45b0-88eb-768ced89fc57'
  }],
  card: [
    { userId: 'jackson@someemail.com', deck: 'myDeck', content: { body: 'Blah' } },
    { userId: 'jackson@someemail.com', deck: 'myDeck', content: { body: 'Blah2' } }
  ],
  deck: [
    { userId: 'jackson@someemail.com', name: 'myDeck', cardCount: 2, date: Date.now() },
    { userId: 'jackson@someemail.com', name: 'Second study session', cardCount: 42, date: Date.now() },
    { userId: 'jackson@someemail.com', name: 'THIRD study session', cardCount: 122, date: Date.now() },
    { userId: 'jackson@someemail.com', name: 'Fourth study session', cardCount: 700, date: Date.now() }
  ]

}
const fakeDataBackup = _.cloneDeep(fakeData)

async function getRecord (table, conditions) {
  const tableData = fakeData[table]
  if (!tableData) return
  return _.map(
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
}

async function setRecord (table, values) {
  const tableData = fakeData[table]
  if (!tableData) return
  tableData.push(values)
  return values
}

// For testing
function setFakeData (newFakeData) {
  fakeData = newFakeData
}

function resetData () {
  fakeData = fakeDataBackup
}

module.exports = { getRecord, setRecord, setFakeData, resetData }
