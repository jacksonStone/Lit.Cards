import { api } from './api-request';

export const login = (userEmail, password) => {
  return api('login', { userEmail, password })
};

export const logout = () => {
  return api('logout')
};

export const signup = (userEmail, password, displayName) => {
  return api('signup', { userEmail, password, displayName })
};

export const verifyEmail = (emailVerificationKey) => {
  return api('signup/verify-email', { emailVerificationKey })
};

export const resendEmailVerification = () => {
  return api('signup/resend-verification-email')
};

export const resetPassword = (userEmail) => {
  return api('password-reset', { userEmail })
};

export const verifyPasswordReset = (userEmail, token, password) => {
  return api('password-reset/verify', { id: userEmail, token, newPassword: password })
};

export const changePassword = (currentPassword, newPassword) => {
  return api('password-reset/change', { currentPassword, newPassword })
};

