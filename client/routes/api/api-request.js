let { request } = require('../../browser-abstractions/request')

async function api (url, body) {
  if(!body) {
    while(true) {
      try {
        const result = await request('/api/' + url, body)
        return result;
      } catch(e) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
  return request('/api/' + url, body)
};

exports.api = api
