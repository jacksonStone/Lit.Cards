const { signup: signupTest } = require('../signup')
const { verify } = require('../login')
const assert = require('assert')
const { resetData } = require('../../../database/external-connections/fake-database-connector')
const userId = 'user11'
const plainTextPassword = 'somePassword'

describe('User signup', () => {
  afterEach(() => {resetData('user')})
  it('Populates user correctly', async () => {
    const result = await signupTest(userId, plainTextPassword)
    assert.notStrictEqual(result.password, plainTextPassword, 'Hashed password')
    assert.ok(result.salt, 'Has salt')
    const correctPasswordHash = await verify(result.userId, plainTextPassword)
    assert.strictEqual(correctPasswordHash, true, 'Provided correct creds')
    //Added a valid session tracker
    assert(result.validSession !== undefined)
  })
  it('Does not create duplicate user', async () => {
    await signupTest('user10', plainTextPassword)
    const result = await signupTest('user10', plainTextPassword)
    assert.strictEqual(result, undefined, 'did not create duplicate user')
  })
})
