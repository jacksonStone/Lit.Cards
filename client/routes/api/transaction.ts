import { api } from './api-request';

export const handleTransaction = (changes: ArrayBuffer|Transaction) => {
  return api(`transaction`, changes, {binary: true})
};
