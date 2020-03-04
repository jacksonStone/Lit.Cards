import { api } from './api-request';

export const getStudyhistory = () => {
  return api('study-history/me')
};
