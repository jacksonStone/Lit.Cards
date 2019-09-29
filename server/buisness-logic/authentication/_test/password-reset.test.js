let { signup: signupTest } = require('../signup')
let { verify } = require('../login')
let { passwordReset, passwordResetVerify, changePassword } = require('../password')
let { resetData } = require('../../../database/external-connections/fake-database-connector')
let { User } = require('../../../database')
let { setTime, resetTime } = require('../../../node-abstractions/time')
let { resetTestEmails, getTestEmails } = require('../../../node-abstractions/email')
let assert = require('assert')

let userEmail = 'user10'
let password = 'somePassword'
let pathToToken = 'verify?token=';

// Over 9000
let fakeCurrent = 9001
let millisInADay = 24 * 60 * 60 * 1000
async function waitForEmail() {
  let start = Date.now();
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
    await signupTest(userEmail, password)
    resetTestEmails()
    setTime(fakeCurrent)
  })
  afterEach(() => {
    resetData('user')
    resetTime()
    resetTestEmails()
  })
  it('resets password', async () => {
    let res = await passwordReset(userEmail)
    let updatedUser = await User.getUser(userEmail);
    assert(updatedUser.resetTokenExpiration === fakeCurrent + millisInADay * 3)
    await waitForEmail()
    let testEmail = getTestEmails()[0];
    assert(testEmail.to === updatedUser.userEmail)
    // verify that the hashed reset token in the DB IS NOT sent
    assert(testEmail.text.indexOf(updatedUser.resetToken) === -1)
    assert(testEmail.html.indexOf(updatedUser.resetToken) === -1)
  })
  it('passwordResetVerify', async () => {
    await passwordReset(userEmail)
    let updatedUser = await User.getUser(userEmail);
    await waitForEmail();
    let testEmail = getTestEmails()[0];
    let text = testEmail.text
    let [verifyToken, userParamInEmail] = text.substring(text.indexOf(pathToToken) + pathToToken.length).split('&')
    let userIdInEmail = userParamInEmail.split('=')[1]
    let newCookie = await passwordResetVerify(userIdInEmail, verifyToken, 'foo')
    assert(newCookie !== 'unauthorized')
    assert(newCookie !== 'same password')

    //Can login with new password
    let validPassword = await verify(userIdInEmail, 'foo')
    assert(validPassword);
    //Cannot login with old password
    assert(!await verify(userIdInEmail, password));

    let withNewPass = await User.getUser(userEmail);
    assert(withNewPass.validSession === 1)
    assert(withNewPass.resetToken === undefined)
    assert(withNewPass.resetTokenExpiration === 0)

  })
  it('passwordResetVerify - same password', async () => {
    await passwordReset(userEmail)
    let updatedUser = await User.getUser(userEmail);
    await waitForEmail();
    let testEmail = getTestEmails()[0];
    let text = testEmail.text
    let [verifyToken, userParamInEmail] = text.substring(text.indexOf(pathToToken) + pathToToken.length).split('&')
    let userIdInEmail = userParamInEmail.split('=')[1]
    let error = await passwordResetVerify(userIdInEmail, verifyToken, password)
    assert(error === 'same password')
  })
  it('passwordResetVerify - Bad token', async () => {
    await passwordReset(userEmail)
    let updatedUser = await User.getUser(userEmail);
    await waitForEmail();
    let testEmail = getTestEmails()[0];
    let text = testEmail.text
    let [verifyToken, userParamInEmail] = text.substring(text.indexOf(pathToToken) + pathToToken.length).split('&')
    let userIdInEmail = userParamInEmail.split('=')[1]
    //Change the verify token
    let error = await passwordResetVerify(userIdInEmail, verifyToken + '1', password)
    assert(error === 'unauthorized')
  })
  it('changePassword - same password', async () => {
    let user = await User.getUser(userEmail);
    let error = await changePassword(user, password, password)
    // Attempt to change passwords
    assert(error === 'same password')
  })
  it('changePassword - wrong password with same password', async () => {
    let user = await User.getUser(userEmail);
    let error = await changePassword(user, password, password + '1')
    // Attempt to change passwords
    assert(error === 'wrong password')
  })
  it('changePassword - wrong password', async () => {
    let user = await User.getUser(userEmail);
    let error = await changePassword(user, 'fooey', password + '1')
    // Attempt to change passwords
    assert(error === 'wrong password')
  })
  it('changePassword', async () => {
    let user = await User.getUser(userEmail);
    await changePassword(user, 'foo', password)
    let newLoginWorks = await verify(user.userEmail, 'foo')
    assert(newLoginWorks)
  })
})
