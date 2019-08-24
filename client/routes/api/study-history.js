let{ api } = require('./api-request')

exports.getStudyhistory = () => {
  return api('study-history/me')
}
