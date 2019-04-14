const { getCards, createCard } = require('api/cards')

exports.getCards = async (deck) => {
  return JSON.parse(await getCards(deck))
}

exports.createCard = (deckName, body) => {
  return createCard(deckName, body)
}
