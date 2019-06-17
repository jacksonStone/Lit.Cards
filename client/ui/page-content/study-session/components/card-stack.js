
const { html } = require('lit')
const { getNumberRight, getNumberWrong } = require('../../../../business-logic/study')
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
">${cards.length}</h1>
        <div>Remaining</div>
        <h1  style="
font-style: normal;
font-weight: normal;
font-size: 40px;
margin: 0;
margin-top: 20px;
"><span class="right-count">${getNumberRight() + 128}</span> | <span class="wrong-count">${getNumberWrong() + 423}</span></h1>
        <div style="margin-left:8px; margin-top: 5px">Right  |  Wrong</div>
    </div>`
}
