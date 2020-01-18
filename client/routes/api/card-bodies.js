let { api } = require('./api-request')

exports.getCardBody = (deck, card = '') => {
  if(card) {
    card = encodeURI(card);
    return api(`card-body/${deck}?card=${card}`)
  }
  return api(`card-body/${deck}`);
}
