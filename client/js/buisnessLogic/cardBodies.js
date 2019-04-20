const { getCardBody } = require('api/cardBodies')
const { getParam } = require('abstract/url')
exports.getCardBody = async (deck, card) => {
  if (!deck) {
    deck = getParam('deck')
  }
  return JSON.parse(await getCardBody(deck, card))
}
//
// exports.createCard = (deckName, body) => {
//   return createCard(deckName, body)
// }
