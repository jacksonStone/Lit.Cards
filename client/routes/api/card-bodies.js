const { api } = require('./api-request')

exports.getCardBody = (deck, card = '') => {
  return api(`card-body`, { deck, card })
}

exports.editCardBody = (deck, card = '', changes) => {
  return api(`card-body/edit`, { deck, card, changes })
}

exports.addCardBody = (deck, changes) => {
  return api(`card-body/add`, { deck, changes })
}

exports.deleteCardBody = (deck, card) => {
  return api(`card-body/delete`, { deck, card })
}
