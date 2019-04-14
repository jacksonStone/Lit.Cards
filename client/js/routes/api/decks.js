const { api } = require('./apiRequest')

exports.getDecks = () => {
  return api('decks/me')
}

exports.createDeck = (name) => {
  console.log(name)
  return api('decks/create', { name })
}
