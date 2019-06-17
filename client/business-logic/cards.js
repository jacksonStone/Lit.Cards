const { getCards, createCard } = require('../routes/api/cards')
const { getParam } = require('../browser-abstractions/url')

exports.getCards = async (deck) => {
  deck = deck || getParam('deck')
  return JSON.parse(await getCards(deck))
}

exports.getCardsForEmptyState = (newId) => {
  const emptyValue = { id: newId, isNew: true }
  // Record we made this on the fly
  window.lc.setData(`changes.card.${newId}`, emptyValue)
  return [emptyValue]
}

exports.createCard = (deckName, body) => {
  return createCard(deckName, body)
}
