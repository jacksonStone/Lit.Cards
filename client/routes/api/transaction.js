let { api } = require('./api-request')

exports.handleTransaction = (changes) => {
  return api(`transaction`, changes, {binary: true})
}