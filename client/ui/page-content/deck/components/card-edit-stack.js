
const { html } = require('lit')
module.exports = (currentCardId, cards) => {
  // Humans are 1-based
  if (!cards) return
  const index = cards.findIndex(card => currentCardId === card.id) + 1
  return html`<div
style="text-align: center">
        <h1  style="
font-style: normal;
font-weight: normal;
font-size: 75px;
margin: 0;
">${index}</h1>
        <div>of ${cards.length}</div>
    </div>`
}
