const { getCards, createCard } = require('api/cards')
const { getParam } = require('abstract/url')

exports.getCards = async () => {
  const deck = getParam('deck')
  return JSON.parse(await getCards(deck))
}

exports.createCard = (deckName, body) => {
  return createCard(deckName, body)
}
