const { signup: signupTest } = require('../signup')
const { verify } = require('../login')
const { passwordReset, passwordResetVerify, changePassword } = require('../password')
const { resetData } = require('../../../database/external-connections/fake-database-connector')
const { User } = require('../../../database')
const { setTime, resetTime } = require('../../../node-abstractions/time')
const { resetTestEmails, getTestEmails } = require('../../../node-abstractions/email')
const assert = require('assert')

const userId = 'user10'
const password = 'somePassword'
const pathToToken = 'verify?token=';

// Over 9000
const fakeCurrent = 9001
const millisInADay = 24 * 60 * 60 * 1000
async function waitForEmail() {
  const start = Date.now();
  while (!getTestEmails().length) {
    //We do not await email sending, so wait for it
    await Promise.resolve()
    if(Date.now() - start > 300) {
      assert(false, 'timeout!')
    }
  }
}
describe('Login validates correctly', () => {
  beforeEach(async () => {
    await signupTest(userId, password)
    resetTestEmails()
    setTime(fakeCurrent)
  })
  afterEach(() => {
    resetData('user')
    resetTime()
    resetTestEmails()
  })
  it('resets password', async () => {
    const res = await passwordReset(userId)
    const updatedUser = await User.getUser(userId);
    assert(updatedUser.resetTokenExpiration === fakeCurrent + millisInADay * 3)
    await waitForEmail()
    const testEmail = getTestEmails()[0];
    assert(testEmail.to === updatedUser.userId)
    // verify that the hashed reset token in the DB IS NOT sent
    assert(testEmail.text.indexOf(updatedUser.resetToken) === -1)
    assert(testEmail.html.indexOf(updatedUser.resetToken) === -1)
  })
  it('passwordResetVerify', async () => {
    await passwordReset(userId)
    const updatedUser = await User.getUser(userId);
    await waitForEmail();
    const testEmail = getTestEmails()[0];
    const text = testEmail.text
    const [verifyToken, userParamInEmail] = text.substring(text.indexOf(pathToToken) + pathToToken.length).split('&')
    const userIdInEmail = userParamInEmail.split('=')[1]
    const newCookie = await passwordResetVerify(userIdInEmail, verifyToken, 'foo')
    assert(newCookie !== 'unauthorized')
    assert(newCookie !== 'same password')

    //Can login with new password
    const validPassword = await verify(userIdInEmail, 'foo')
    assert(validPassword);
    //Cannot login with old password
    assert(!await verify(userIdInEmail, password));

    const withNewPass = await User.getUser(userId);
    assert(withNewPass.validSession === 1)
    assert(withNewPass.resetToken === undefined)
    assert(withNewPass.resetTokenExpiration === 0)

  })
  it('passwordResetVerify - same password', async () => {
    await passwordReset(userId)
    const updatedUser = await User.getUser(userId);
    await waitForEmail();
    const testEmail = getTestEmails()[0];
    const text = testEmail.text
    const [verifyToken, userParamInEmail] = text.substring(text.indexOf(pathToToken) + pathToToken.length).split('&')
    const userIdInEmail = userParamInEmail.split('=')[1]
    const error = await passwordResetVerify(userIdInEmail, verifyToken, password)
    assert(error === 'same password')
  })
  it('passwordResetVerify - Bad token', async () => {
    await passwordReset(userId)
    const updatedUser = await User.getUser(userId);
    await waitForEmail();
    const testEmail = getTestEmails()[0];
    const text = testEmail.text
    const [verifyToken, userParamInEmail] = text.substring(text.indexOf(pathToToken) + pathToToken.length).split('&')
    const userIdInEmail = userParamInEmail.split('=')[1]
    //Change the verify token
    const error = await passwordResetVerify(userIdInEmail, verifyToken + '1', password)
    assert(error === 'unauthorized')
  })
  it('changePassword - same password', async () => {
    const user = await User.getUser(userId);
    const error = await changePassword(user, password)
    // Attempt to change passwords
    assert(error === 'same password')
  })
  it('changePassword', async () => {
    const user = await User.getUser(userId);
    await changePassword(user, 'foo')
    const newLoginWorks = await verify(user.userId, 'foo')
    assert(newLoginWorks)
  })
})
