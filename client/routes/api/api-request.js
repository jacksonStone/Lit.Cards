let { request } = require('../../browser-abstractions/request')

function api (url, body) {
  try {
    return request('/api/' + url, body)
  } catch(e) {
    console.log("Failure in API");
    throw e;
  }
};

exports.api = api
