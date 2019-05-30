const { getCards, createCard } = require('api/cards')
const { getParam } = require('abstract/url')

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
