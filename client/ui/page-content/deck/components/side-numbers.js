
import { html } from 'lit';
import { nextCard, previousCard } from 'logic/deck.ts';
let fullCardNavigation = (currentCardId, cards) => {
  if (!cards) return
  const width = window.lc.getData('screen.width');
  // Humans are 1-based
  let index = cards.indexOf(currentCardId) + 1

  return html`<div
style="text-align: center;">
        <h1  style="
              font-style: normal;
              font-weight: normal;
              font-size: ${width >= 640 ? '75px' : '44px'};
              margin: 0;
              ">${(index).toLocaleString()}</h1>
        <div>of ${cards.length.toLocaleString()}</div>
        <div style="margin-top:20px"><button class="usa-button usa-button--outline prev-next" @click=${()=>{previousCard()}}><i class="far fa-caret-square-up"><span class="sr-only">Previous card</span></i></button></div>
        <div><button class="usa-button usa-button--outline prev-next" @click=${()=>{nextCard()}}><i class="far fa-caret-square-down"><span class="sr-only">Next card</span></i></button></div>
    </div>`
}

let upArrow = () => {
  return html`<button class="usa-button usa-button--outline prev-next" @click=${()=>{previousCard()}}><i class="far fa-caret-square-up"><span class="sr-only">Previous card</span></i></button>`;
}
let downArrow = () => {
  return html`<button class="usa-button usa-button--outline prev-next" @click=${()=>{nextCard()}}><i class="far fa-caret-square-down"><span class="sr-only">Next card</span></i></button>`;
}
let cardCounter = (currentCardId, cards) => {
  if (!cards) return
  const width = window.lc.getData('screen.width');
  // Humans are 1-based
  let index = cards.indexOf(currentCardId) + 1

  return html`<div style="margin: 10px auto; text-align: center; display: block;"><h1  style="
  font-style: normal;
  font-weight: normal;
  font-size: 24px;
  margin: 0;
  ">${(index).toLocaleString()}<span style="font-size: 20px"> of ${cards.length.toLocaleString()}</span></h1></div>`
}

export default {fullCardNavigation, cardCounter, upArrow, downArrow};
