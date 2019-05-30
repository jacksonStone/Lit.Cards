const _ = require('lodash')
const { listToStr } = require('../../../shared/char-encoding')
const fakeCardBody = require('./fakeCardBody.json')
// password: somePassword
let fakeData = {
  user: [{
    userId: 'jackson@someemail.com',
    password: 'X0VIy9vshnkFZVZO8tLB4Uod5JDREmf1eIh9qIP6KR0=',
    salt: '8b73210c-8004-45b0-88eb-768ced89fc57',
    darkMode: false
  }],
  studySession: [
    { userId: 'jackson@someemail.com', studyState: 'RW_M', currentCard: 2, ordering: listToStr([1, 2, 3, 0]), deck: 'foo', id: 'fee' }
  ],
  card: [
    { userId: 'jackson@someemail.com', deck: 'foo', id: 'fe' },
    { userId: 'jackson@someemail.com', deck: 'foo', id: 'fo' },
    { userId: 'jackson@someemail.com', deck: 'foo', id: 'fi' },
    { userId: 'jackson@someemail.com', deck: 'foo', id: 'fum' }
  ],
  cardBody: [
    fakeCardBody,
    { userId: 'jackson@someemail.com', deck: 'foo', front: 'This is the front of card 2', back: 'This is the back of card 2', id: 'fo' },
    { userId: 'jackson@someemail.com', deck: 'foo', front: 'This is the front of card 3', back: 'This is the back of card 3', id: 'fi' },
    { userId: 'jackson@someemail.com', deck: 'foo', front: 'This is the front of card 4', back: 'This is the back of card 4', id: 'fum' }
  ],
  deck: [
    { userId: 'jackson@someemail.com', name: 'myDeck', cardCount: 4, date: Date.now(), id: 'foo' },
    { userId: 'jackson@someemail.com', name: 'Second study session', cardCount: 42, date: Date.now(), id: 'fee' },
    { userId: 'jackson@someemail.com', name: 'THIRD study session', cardCount: 122, date: Date.now(), id: 'fii' },
    { userId: 'jackson@someemail.com', name: 'Fourth study session', cardCount: 700, date: Date.now(), id: 'fum' }
  ]

}
const fakeDataBackup = _.cloneDeep(fakeData)

async function getRecord (table, conditions, limit) {
  const tableData = fakeData[table]
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
  const tableData = fakeData[table]
  if (!tableData) return
  tableData.push(values)
  return values
}

async function unsetRecord (table, values) {
  const tableData = fakeData[table]
  if (!tableData) return
  fakeData[table] = _.reject(tableData, values)
}

// For testing
function setFakeData (newFakeData) {
  fakeData = newFakeData
}

function resetData () {
  fakeData = fakeDataBackup
}

module.exports = { getRecord, setRecord, setFakeData, resetData, unsetRecord }
