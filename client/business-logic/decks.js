let { getDecks, createDeck } = require('../routes/api/decks')
let { decks } = require('../routes/navigation/pages')
let { getParam } = require('../browser-abstractions/url')

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
  return getParam('deck.ts.ts')
}
