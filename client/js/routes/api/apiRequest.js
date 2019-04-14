const { request } = require('abstract/request')

function api (url, body) {
  return request('/api/' + url, body)
};

exports.api = api
