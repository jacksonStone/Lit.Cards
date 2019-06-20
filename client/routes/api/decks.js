const { api } = require('./api-request')

exports.getDecks = () => {
  return api('decks/me')
}

exports.getDeck = (id) => {
  return api(`decks/${id}`)
}

exports.createDeck = (name) => {
  return api('decks/create', { name })
}
exports.deleteDeck = (id) => {
  return api('decks/delete', { id })
}
exports.renameDeck = (id, name) => {
  return api('decks/rename', { id, name })
}
