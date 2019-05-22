const { deck: deckPage } = require('site/pages')
const { getParam } = require('abstract/url')
const { getDeck } = require('api/decks')

exports.navigateToDeckPage = (deckId) => {
  return deckPage({ deck: deckId })
}
exports.getDeck = async (deckId) => {
  deckId = deckId || getParam('deck')
  return JSON.parse(await getDeck(deckId))
}
