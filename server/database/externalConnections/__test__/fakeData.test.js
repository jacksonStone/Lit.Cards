const assert = require('assert')
const fakeDataTest = require('../fakeData')
const _ = require('lodash')
const testData = {
  fakeTable: [
    { username: 'user10' },
    { username: 'user11', example: 'foo' },
    { username: 'user11.5', example: 'foo' }
  ],
  fakeTable2: [
    { username2: 'user12' },
    { username2: 'user13', example2: 'foo' }
  ]
}

describe('Verify set record', () => {
  it('setRecord', async () => {
    const privateTestData = _.cloneDeep(testData)
    fakeDataTest.setFakeData(privateTestData)
    const table = 'fakeTable2'
    const lengthBeforeInsert = privateTestData[table].length

    await fakeDataTest.setRecord(table, { username2: 'user42' })

    const results = await Promise.all([
      fakeDataTest.getRecord(table, { username2: 'user42' }),
      fakeDataTest.getRecord(table)
    ])
    const records = results[0]
    const allRecords = results[1]
    assert.strictEqual(allRecords.length, lengthBeforeInsert + 1)
    assert.strictEqual(records.length, 1)
  })
})
describe('Verify get record', () => {
  beforeAll(() => {
    fakeDataTest.setFakeData(_.cloneDeep(testData))
  })
  it('getRecord no condition', async () => {
    const table = 'fakeTable'
    const records = await fakeDataTest.getRecord(table)

    assert.strictEqual(records.length, testData[table].length)
    assert.strictEqual(records[0].username, 'user10')
  })
  it('getRecord, condition', async () => {
    const records = await fakeDataTest.getRecord('fakeTable', { username: 'user11', example: 'foo' })
    assert.strictEqual(records.length, 1)
    assert.strictEqual(records[0].username, 'user11')

    const records0 = await fakeDataTest.getRecord('fakeTable', { example: 'foo' })
    assert.strictEqual(records0.length, 2)
    assert.strictEqual(records0[0].username, 'user11')
    assert.strictEqual(records0[1].username, 'user11.5')
  })
})
