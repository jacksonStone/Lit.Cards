let { api } = require('./api-request')

exports.login = (userEmail, password) => {
  return api('login', { userEmail, password })
}
exports.logout = () => {
  return api('logout')
}
exports.signup = (userEmail, password, displayName) => {
  return api('signup', { userEmail, password, displayName })
}
exports.verifyEmail = (emailVerificationKey) => {
  return api('signup/verify-email', { emailVerificationKey })
}
exports.resendEmailVerification = () => {
  return api('signup/resend-verification-email')
}
exports.resetPassword = (userEmail) => {
  return api('password-reset', { userEmail })
}
exports.verifyPasswordReset = (userEmail, token, password) => {
  return api('password-reset/verify', { id: userEmail, token, newPassword: password })
}
exports.changePassword = (currentPassword, newPassword) => {
  return api('password-reset/change', { currentPassword, newPassword })
}

