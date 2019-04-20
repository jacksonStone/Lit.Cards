const { html } = require('lit-html/lit-html')

module.exports = (currentCard, cards) => {
  return html`${currentCard} : ${JSON.stringify(cards)}`
}
