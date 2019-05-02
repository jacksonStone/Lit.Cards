const { html } = require('lit-html/lit-html')
const numberOfVisibleCards = 6
const getVisibleCards = (currentCardId, cards) => {
  if (!cards || !currentCardId) return []
  const cardLength = cards.length
  if (cardLength < numberOfVisibleCards) return cards
  let currentIndex
  for (let i = 0; i < cards.length; i++) {
    if (cards[i].id === currentCardId) {
      currentIndex = i
      break
    }
  }

  if (cardLength - (currentIndex + numberOfVisibleCards) > 0) {
    return cards.slice(currentIndex, currentIndex + numberOfVisibleCards)
  }
  return cards.slice(cards.length - numberOfVisibleCards)
}
module.exports = (currentCardId, cards) => {
  return html`${JSON.stringify(getVisibleCards(currentCardId, cards))}`
}
