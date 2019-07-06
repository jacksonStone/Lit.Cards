const loginTest = require('../login')
const { signup: signupTest } = require('../signup')
const { resetData } = require('../../../database/external-connections/fake-database-connector')
const assert = require('assert')
const userId = 'user10'
const password = 'somePassword'

describe('Login validates correctly', () => {
  beforeEach(async () => {
    await signupTest(userId, password)
  })
  afterEach(() => resetData('user'))
  it('correct password', async () => {
    const result = await loginTest.verify(userId, password)
    assert.strictEqual(result, true, 'Provided correct creds')
  })
})
