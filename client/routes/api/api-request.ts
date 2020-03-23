declare const URL_ROOT: string;

import { request } from '../../browser-abstractions/request';

async function api (url: string, body?: Object, options = {}): Promise<string> {
  if(!body) {
    while(true) {
      try {
        const result = await request((URL_ROOT || '') + '/api/' + url, body, options)
        return result;
      } catch(e) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
  return request( (URL_ROOT || '')  +'/api/' + url, body, options)
}

export { api };
