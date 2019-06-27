
const { html } = require('lit')
const { getNumberRight, getNumberWrong } = require('logic/study')
const { nextCard, previousCard } = require('logic/deck')
function stillStudying() {
  const cards = window.lc.getData('orderedCards')
  if (!cards || !cards.length) return false
  return true
}
module.exports = (currentCardId, cards) => {
  // Humans are 1-based
  if (!cards) return
  return html`<div
style="text-align: center">
        <h1  style="
font-style: normal;
font-weight: normal;
font-size: 75px;
margin: 0;
">${cards.length.toLocaleString()}</h1>
        <div>Remaining</div>
        <h1  style="
font-style: normal;
font-weight: normal;
font-size: 40px;
margin: 0;
margin-top: 20px;
"><span class="right-count">${getNumberRight().toLocaleString()}</span> | <span class="wrong-count">${getNumberWrong().toLocaleString()}</span></h1>
        <div style="margin-left:8px; margin-top: 5px">Right  |  Wrong</div>
        ${stillStudying() ? html`<div style="margin-top:20px"><button class="usa-button usa-button--outline prev-next" @click=${()=>{previousCard()}}><i class="far fa-caret-square-up"><span class="sr-only">Previous card</span></i></button></div>
        <div><button class="usa-button usa-button--outline prev-next" @click=${()=>{nextCard()}}><i class="far fa-caret-square-down"><span class="sr-only">Next card</span></i></button></div>`:
        html``}
    </div>`
}
