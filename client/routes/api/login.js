const { api } = require('./api-request')

exports.login = (userId, password) => {
  return api('login', { userId, password })
}
exports.logout = () => {
  return api('logout')
}
exports.signup = (userId, password) => {
  return api('signup', { userId, password })
}
exports.verifyEmail = (emailVerificationKey) => {
  return api('signup/verify-email', { emailVerificationKey })
}
exports.resendEmailVerification = () => {
  return api('signup/resend-verification-email')
}
exports.resetPassword = (userId) => {
  return api('password-reset', { userId })
}
exports.verifyPasswordReset = (userId, token, password) => {
  return api('password-reset/verify', { id: userId, token, newPassword: password })
}
exports.changePassword = (newPassword) => {
  return api('password-reset/change', { newPassword })
}

