const { deck: deckPage } = require('../routes/navigation/pages')
const { getParam } = require('../browser-abstractions/url')
const { getDeck, createDeck, deleteDeck } = require('../routes/api/decks')
const { reject } = require('utils')

function navigateToDeckPage (deckId) {
  return deckPage({ deck: deckId })
}
exports.navigateToDeckPage = navigateToDeckPage
exports.getDeck = async (deckId) => {
  deckId = deckId || getParam('deck')
  return JSON.parse(await getDeck(deckId))
}
exports.createDeck = async (name) => {
  const newDeck = JSON.parse(await createDeck(name))
  navigateToDeckPage(newDeck.id)
}

exports.deleteDeck = async (id) => {
  await deleteDeck(id)
  const decks = window.lc.getData('decks')
  const decksWithoutDeleted = reject(decks, { id })
  window.lc.setData('decks', decksWithoutDeleted)
}
