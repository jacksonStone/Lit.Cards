const { api } = require('./apiRequest')

exports.getCardBody = (deck, card = '') => {
  return api(`card-body?deck=${deck}&card=${card}`)
}
