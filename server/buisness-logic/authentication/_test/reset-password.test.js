const { signup: signupTest } = require('../signup')
const { resetPassword } = require('../password-reset')
const { resetData } = require('../../../database/external-connections/fake-database-connector')
const { User } = require('../../../database')
const { setTime, resetTime } = require('../../../node-abstractions/time')
const { resetTestEmails, getTestEmails } = require('../../../node-abstractions/email')
const assert = require('assert')

const userId = 'user10'
const password = 'somePassword'
// Over 9000
const fakeCurrent = 9001
const millisInADay = 24 * 60 * 60 * 1000

describe('Login validates correctly', () => {
  beforeEach(async () => {
    await signupTest(userId, password)
    setTime(fakeCurrent)
  })
  afterEach(() => {
    resetData()
    resetTime()
    resetTestEmails()
  })
  it('resets password', async () => {
    const res = await resetPassword(userId)
    const updatedUser = await User.getUser(userId);
    assert(!!updatedUser.resetToken)
    //Has at least 32 chars
    assert(updatedUser.resetToken.length >= 32)
    //Expires three days later
    assert(updatedUser.resetTokenExpiration === fakeCurrent + millisInADay * 3)
    while (!getTestEmails().length) {
      //We do not await email sending, so wait for it
      await Promise.resolve()
    }
    const testEmail = getTestEmails()[0];
    assert(testEmail.to === updatedUser.userId)
    // At a minimum verify we have the reset token in the message body
    assert(testEmail.text.indexOf(updatedUser.resetToken > -1))
    assert(testEmail.html.indexOf(updatedUser.resetToken > -1))
  })
})
