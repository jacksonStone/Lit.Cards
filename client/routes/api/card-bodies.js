const { api } = require('./api-request')

exports.getCardBody = (deck, card = '') => {
  return api(`card-body?deck=${deck}&card=${card}`)
}
