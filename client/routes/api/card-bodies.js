const { api } = require('./api-request')

exports.getCardBody = (deck, card = '') => {
  return api(`card-body?deck=${deck}&card=${card}`)
}

exports.editCardBody = (deck, card = '', changes) => {
  return api(`card-body/edit`, {deck, card, changes})
}
