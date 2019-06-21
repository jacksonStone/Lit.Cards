const { api } = require('./api-request')

exports.getCardBody = (deck, card = '') => {
  return api(`card-body?deck=${deck}&card=${card}`)
}

exports.editCardBody = (deck, card = '', changes) => {
  debugger
  return api(`card-body/edit`, { deck, card, changes })
}

exports.addCardBody = (deck, changes) => {
  return api(`card-body/add`, { deck, changes })
}
