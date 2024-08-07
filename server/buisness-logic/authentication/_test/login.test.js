let loginTest = require('../login')
let { signup: signupTest } = require('../signup')
let { resetData } = require('../../../database/external-connections/fake-database-connector')
let { resetTestEmails } = require('../../../node-abstractions/email')
let assert = require('assert')
let userEmail = 'user10'
let password = 'somePassword'

describe('Login validates correctly', () => {
  beforeEach(async () => {
    await signupTest(userEmail, password)
  })
  afterEach(() => {
    resetTestEmails()
    resetData('user')
  })
  it('correct password', async () => {
    let result = await loginTest.verify(userEmail, password)
    assert.strictEqual(result, true, 'Provided correct creds')
  })
})
