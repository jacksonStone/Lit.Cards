import { api } from './api-request';

export const handleTransaction = (changes) => {
  return api(`transaction`, changes, {binary: true})
};