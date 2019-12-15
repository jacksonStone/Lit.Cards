let { api } = require('./api-request')

exports.getDecks = () => {
  return api('decks/me')
}

exports.getDeck = (id) => {
  return api(`decks/${id}`)
}

exports.createDeck = (name) => {
  return api('decks/create', { name })
}
exports.makePublic = (id) => {
  return api('decks/make-public', { id })
}
exports.deleteDeck = (id) => {
  return api('decks/delete', { id })
}
