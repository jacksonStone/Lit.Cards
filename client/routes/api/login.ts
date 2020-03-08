import { api } from './api-request';

export const login = (userEmail: string, password: string) => {
  return api('login', { userEmail, password })
};

export const logout = () => {
  return api('logout')
};

export const signup = (userEmail: string, password: string, displayName: string) => {
  return api('signup', { userEmail, password, displayName })
};

export const verifyEmail = (emailVerificationKey: string) => {
  return api('signup/verify-email', { emailVerificationKey })
};

export const resendEmailVerification = () => {
  return api('signup/resend-verification-email')
};

export const resetPassword = (userEmail: string) => {
  return api('password-reset', { userEmail })
};

export const verifyPasswordReset = (userEmail: string, token: string, password: string) => {
  return api('password-reset/verify', { id: userEmail, token, newPassword: password })
};

export const changePassword = (currentPassword: string, newPassword: string) => {
  return api('password-reset/change', { currentPassword, newPassword })
};

