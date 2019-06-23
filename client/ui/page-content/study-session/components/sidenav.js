const { html } = require('lit-html/lit-html')
const { deleteCurrentSessionWithConfirmation } = require('logic/study')

function getDeckId () {
  const deck = window.lc.getData('deck')
  return deck && deck.id
}
function getActiveCardId () {
  return window.lc.getData('activeCardId')
}
function getName () {
  return window.lc.getData('deck.name')
}
module.exports = () => {
  return html`<ul class="site-sidenav usa-sidenav">
  <li class="usa-sidenav__item" >
    <div style="margin:10px; border-top: none; border-left: none; border-right: none;">Studying: ${getName()}</div>
  </li>
  <li class="usa-sidenav__item" >
    <a href="/site/me"><i class="far fa-arrow-alt-circle-left"></i>&nbsp;&nbsp;Decks</a>
  </li>
  <li class="usa-sidenav__item" >
    <a href="/site/me/deck?deck=${getDeckId()}&card=${getActiveCardId()}"><i class="far fa-edit"></i>&nbsp;&nbsp;Edit</a>
  </li>
    <li class="usa-sidenav__item" >
    <a href="#" @click=${() => { deleteCurrentSessionWithConfirmation() }}><i class="far fa-times-circle"></i>&nbsp;&nbsp;End session</a>
  </li>
  </ul>`
}
