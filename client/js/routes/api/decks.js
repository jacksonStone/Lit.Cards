const { api } = require('./apiRequest')

exports.getDecks = () => {
  return api('decks/me')
}

exports.getDeck = (id) => {
  return api(`decks/${id}`)
}

exports.createDeck = (name) => {
  console.log(name)
  return api('decks/create', { name })
}
exports.deleteDeck = (id) => {
  return api('decks/delete', { id })
}
