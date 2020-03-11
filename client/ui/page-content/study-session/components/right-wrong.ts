
import { html } from 'lit';
import { getNumberRight, getNumberWrong } from 'logic/study';
import { nextCard, previousCard } from 'logic/deck';
function stillStudying() {
  let cards = window.lc.getData('orderedCards')
  if (!cards || !cards.length) return false
  return true
}

function cardStack() {
  // Humans are 1-based
const cards = window.lc.getData('orderedCards')
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

function smallCardStack() {
   // Humans are 1-based
   const cards = window.lc.getData('orderedCards')
   if (!cards) return
   return html`<div style="position: relative">
      <div style="text-align: center; width: 200px; margin-top: -40px; font-size:16px; position: absolute; top: 50px; margin-left: auto;
      margin-right: auto;
      left: 0;
      right: 0;
      " >${cards.length.toLocaleString()} left, <span class="right-count">${getNumberRight().toLocaleString()} Right</span>, <span class="wrong-count">${getNumberWrong().toLocaleString()} Wrong</span></div>
    </div>`
}

export {
  cardStack,
  smallCardStack
};
