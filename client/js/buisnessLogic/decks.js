const { getDecks, createDeck } = require('api/decks')
const { decks } = require('site/pages')
const { getParam } = require('abstract/url')

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
