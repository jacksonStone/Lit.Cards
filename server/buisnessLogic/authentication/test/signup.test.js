const { signup: signupTest } = require('../signup')
const { verify } = require('../login')
const assert = require('assert')
const { resetData } = require('../../../database/externalConnections/fakeData')
const userId = 'user11'
const plainTextPassword = 'somePassword'

describe('User signup', () => {
  beforeEach(resetData)
  afterAll(resetData)
  it('Populates password hash correctly', async () => {
    const result = await signupTest(userId, plainTextPassword)
    assert.notStrictEqual(result.password, plainTextPassword, 'Hashed password')
    assert.ok(result.salt, 'Has salt')
    const correctPasswordHash = await verify(result.userId, plainTextPassword)
    assert.strictEqual(correctPasswordHash, true, 'Provided correct creds')
  })
  it('Does not create duplicate user', async () => {
    const result = await signupTest('user10', plainTextPassword)
    assert.strictEqual(result, undefined, 'did not create duplicate user')
  })
})
