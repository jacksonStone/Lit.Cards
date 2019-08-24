let { signup: signupTest } = require('../signup')
let { verify } = require('../login')
let assert = require('assert')
let { resetData } = require('../../../database/external-connections/fake-database-connector')
let { resetTestEmails } = require('../../../node-abstractions/email')
let userId = 'user11'
let plainTextPassword = 'somePassword'

describe('User signup', () => {
  afterEach(() => {
    resetData('user')
    resetTestEmails()
  })
  it('Populates user correctly', async () => {
    let result = await signupTest(userId, plainTextPassword)
    assert.notStrictEqual(result.password, plainTextPassword, 'Hashed password')
    assert.ok(result.salt, 'Has salt')
    let correctPasswordHash = await verify(result.userId, plainTextPassword)
    assert.strictEqual(correctPasswordHash, true, 'Provided correct creds')
    //Added a valid session tracker
    assert(result.validSession !== undefined)
    assert(result.verifiedEmail !== undefined)
  })
  it('Does not create duplicate user', async () => {
    await signupTest('user10', plainTextPassword)
    let result = await signupTest('user10', plainTextPassword)
    assert.strictEqual(result, undefined, 'did not create duplicate user')
  })
})
