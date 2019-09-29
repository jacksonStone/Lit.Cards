let assert = require('assert')
let fakeDataTest = require('../fake-database-connector')
let _ = require('lodash')
let testData = {
  fakeTable: [
    { userEmail: 'user10' },
    { userEmail: 'user11', example: 'foo' },
    { userEmail: 'user11.5', example: 'foo' }
  ],
  fakeTable2: [
    { userId2: 'user12' },
    { userId2: 'user13', example2: 'foo' }
  ]
}

describe('Verify set record', () => {
  it('setRecord', async () => {
    let privateTestData = _.cloneDeep(testData)
    fakeDataTest.setFakeData(privateTestData)
    let table = 'fakeTable2'
    let lengthBeforeInsert = privateTestData[table].length

    await fakeDataTest.setRecord(table, { userId2: 'user42' })

    let results = await Promise.all([
      fakeDataTest.getRecord(table, { userId2: 'user42' }),
      fakeDataTest.getRecord(table)
    ])
    let records = results[0]
    let allRecords = results[1]
    assert.strictEqual(allRecords.length, lengthBeforeInsert + 1)
    assert.strictEqual(records.length, 1)
  })
})
describe('Verify get record', () => {
  beforeAll(() => {
    fakeDataTest.setFakeData(_.cloneDeep(testData))
  })
  it('getRecord no condition', async () => {
    let table = 'fakeTable'
    let records = await fakeDataTest.getRecord(table)

    assert.strictEqual(records.length, testData[table].length)
    assert.strictEqual(records[0].userEmail, 'user10')
  })
  it('getRecord, condition', async () => {
    let records = await fakeDataTest.getRecord('fakeTable', { userEmail: 'user11', example: 'foo' })
    assert.strictEqual(records.length, 1)
    assert.strictEqual(records[0].userEmail, 'user11')

    let records0 = await fakeDataTest.getRecord('fakeTable', { example: 'foo' })
    assert.strictEqual(records0.length, 2)
    assert.strictEqual(records0[0].userEmail, 'user11')
    assert.strictEqual(records0[1].userEmail, 'user11.5')
  })
})
