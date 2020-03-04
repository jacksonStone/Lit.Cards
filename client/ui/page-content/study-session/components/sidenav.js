import { html } from 'lit-html/lit-html';
import { deleteCurrentSessionWithConfirmation } from 'logic/study';

function getDeckId () {
  let deck = window.lc.getData('deck.ts.ts')
  return deck && deck.id
}
function getActiveCardId () {
  return window.lc.getData('activeCardId')
}
function getName () {
  return window.lc.getData('deck.ts.ts.name')
}

export default () => {
  return html`<ul class="site-sidenav usa-sidenav">
  <li class="usa-sidenav__item" >
    <div style="margin:10px; border-top: none; border-left: none; border-right: none; overflow-wrap: break-word">Studying: ${getName()}</div>
  </li>
  <li class="usa-sidenav__item" >
    <a href="/site/me"><i class="far fa-arrow-alt-circle-left"></i>&nbsp;&nbsp;Decks</a>
  </li>
  <li class="usa-sidenav__item" >
    <a href="/site/me/deck?deck=${getDeckId()}&card=${window.encodeURIComponent(getActiveCardId())}"><i class="far fa-edit"></i>&nbsp;&nbsp;Edit</a>
  </li>
    <li class="usa-sidenav__item" >
    <a href="#" id="end-session-link" @click=${() => { deleteCurrentSessionWithConfirmation() }}><i class="far fa-times-circle"></i>&nbsp;&nbsp;End session</a>
  </li>
  </ul>`
};
