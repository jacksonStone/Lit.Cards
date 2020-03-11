import { api } from './api-request';

export const getUserDetails = () => {
  return api('user/me')
};