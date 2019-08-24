let { request } = require('../../browser-abstractions/request')

function api (url, body) {
  return request('/api/' + url, body)
};

exports.api = api
