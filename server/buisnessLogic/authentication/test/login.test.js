const loginTest = require('../login')
const assert = require('assert')
const userId = 'user10'
const password = 'somePassword'

describe('Login validates correctly', () => {
  it('correct password', async () => {
    const result = await loginTest.verify(userId, password)
    assert.strictEqual(result, true, 'Provided correct creds')
  })
})
