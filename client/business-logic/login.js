import {
  login as loginAPI,
  logout as logoutAPI,
  verifyPasswordReset as verifyPasswordResetAPI,
  resetPassword as resetPasswordAPI,
  signup as signupAPI,
  resendEmailVerification as resendEmailVerificationAPI,
  verifyEmail as verifyEmailAPI,
  changePassword as changePasswordAPI
} from '../routes/api/login'
import { fetchUserNoCache, clearUserData } from './user'
import code from '../routes/api/response-codes'
import pages, { login as loginPage, signup as signupPage } from '../routes/navigation/pages'
import { getParam } from 'abstract/url'
import { emailIsValid } from 'shared/email-address-validation'

export const login = async (userEmail, password) => {
  window.lc.resetErrors() // make sure we have no field failures hanging around
  let recordError = window.lc.recordError
  if (!userEmail || !password) {
    if (!userEmail) {
      recordError('fields.userEmail', 'empty')
    }
    if (!password) {
      recordError('fields.password', 'empty')
    }
    return
  }
  let result = await loginAPI(userEmail, password)
  await fetchUserNoCache()
  if (code.ok(result)) {
    pages.home()
    return
  }
  recordError('abstract.loginFailed', true)
}

export const resetPassword = async (userEmail) => {
  window.lc.resetErrors() // make sure we have no field failures hanging around
  let recordError = window.lc.recordError
  if (!userEmail) {
    recordError('fields.userEmail', 'empty')
    return
  }
  if (!emailIsValid(userEmail)) {
    recordError('abstract.badEmail', true)
    return
  }
  return resetPasswordAPI(userEmail)
}

export const verifyPasswordReset = async (password, repeatPassword) => {
  let recordError = window.lc.recordError
  window.lc.resetErrors() // make sure we have no field failures hanging around

  if (!password || !repeatPassword) {
    if (!password) {
      recordError('fields.password', 'empty')
    }
    if (!repeatPassword) {
      recordError('fields.repeatPassword', 'empty')
    }
    return
  }
  if (password !== repeatPassword) {
    recordError('abstract.mismatchPasswords', true)
    return
  }
  // TODO:: Maybe redirect them to a different page that
  // doesn't have it in the URL to prevent leaking on referer if they leave page
  // before finishing reset
  let result = await verifyPasswordResetAPI(getParam('user'), getParam('token'), password)
  await fetchUserNoCache()
  if (code.ok(result)) {
    return pages.home()
  }
}

export const navigateToLoginPage = async () => {
  return loginPage()
}

export const navigateToSignupPage = async () => {
  return signupPage()
}

export const signup = async (userEmail, password, repeatPassword, displayName) => {
  window.lc.resetErrors() // make sure we have no field failures hanging around
  let recordError = window.lc.recordError

  if (!userEmail || !password || !repeatPassword || !displayName) {
    if (!userEmail) {
      recordError('fields.userEmail', 'empty')
    }
    if (!password) {
      recordError('fields.password', 'empty')
    }
    if (!repeatPassword) {
      recordError('fields.repeatPassword', 'empty')
    }
    if (!displayName) {
      recordError('fields.displayName', 'empty')
    }
    return
  }
  if (password !== repeatPassword) {
    recordError('abstract.mismatchPasswords', true)
    return
  }
  if (!emailIsValid(userEmail)) {
    recordError('abstract.badEmail', true)
    return
  }

  let result = await signupAPI(userEmail, password, displayName)
  await fetchUserNoCache()
  if (code.ok(result)) {
    return pages.home()
  }
  recordError('abstract.usernameTaken', true)
}

export const changePassword = async (currentPassword, password, repeatPassword) => {
  window.lc.resetErrors() // make sure we have no field failures hanging around
  window.lc.setData('updatedPassword', false)
  let recordError = window.lc.recordError

  if (!password || !repeatPassword || !currentPassword) {
    if (!password) {
      recordError('fields.password', 'empty')
    }
    if (!repeatPassword) {
      recordError('fields.repeatPassword', 'empty')
    }
    if (!currentPassword) {
      recordError('fields.currentPassword', 'empty')
    }
    return
  }
  if (password !== repeatPassword) {
    recordError('abstract.mismatchPasswords', true)
    return
  }

  let result = await changePasswordAPI(currentPassword, password)
  if (code.ok(result)) {
    return window.lc.setData('updatedPassword', true)
  }
  if (result === 'same password') {
    recordError('abstract.samePassword', true)
  }
  if (result === 'wrong password') {
    recordError('abstract.wrongPassword', true)
  }
}

export const logout = async () => {
  await logoutAPI()
  clearUserData()
  pages.landingPage()
}

export const verifyEmail = async () => {
  let token = getParam('verification')
  if (!token) {
    return
  }
  await verifyEmailAPI(token)
}

export const resendEmailVerification = async () => {
  await resendEmailVerificationAPI()
}
