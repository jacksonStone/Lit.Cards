import { api } from './api-request';

export const handleTransaction = (changes: ArrayBuffer) => {
  return api(`transaction`, changes, {binary: true})
};