const { api } = require('./apiRequest')

exports.getDecks = () => {
  return api('decks/me')
}

exports.getDeck = (id) => {
  return api(`decks/me/${id}`)
}

exports.createDeck = (name) => {
  console.log(name)
  return api('decks/create', { name })
}
