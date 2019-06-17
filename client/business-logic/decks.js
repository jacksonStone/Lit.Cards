const { getDecks, createDeck } = require('../routes/api/decks')
const { decks } = require('../routes/navigation/pages')
const { getParam } = require('../browser-abstractions/url')

exports.getDecks = async () => {
  return JSON.parse(await getDecks())
}

exports.createDeck = (name) => {
  return createDeck(name)
}

exports.navigatgeToDeckListPage = () => {
  return decks()
}

exports.getDeckNameFromPage = () => {
  return getParam('deck')
}
