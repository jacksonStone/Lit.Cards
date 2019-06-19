const { html } = require('lit-html/lit-html')
const { deleteSession: deleteSessionInServerAndState } = require('logic/study')
function getDeckId () {
  const deck = window.lc.getData('deck')
  return deck && deck.id
}
function getSessionId () {
  const session = window.lc.getData('session')
  return session && session.id
}
function deleteSession () {
  const id = getSessionId()
  deleteSessionInServerAndState(id)
}
module.exports = () => {
  return html`<ul class="site-sidenav usa-sidenav">
  <li class="usa-sidenav__item" >
    <a href="/site/me"><i class="far fa-arrow-alt-circle-left"></i>&nbsp;&nbsp;Decks</a>
  </li>
  ${getSessionId() ? html`
    <li class="usa-sidenav__item" >
        <a href="/site/me/study?id=${getSessionId()}"><i class="far fa-images"></i>&nbsp;&nbsp;Continue studying</a>
    </li>
        <li class="usa-sidenav__item" >
        <a href="#" @click=${deleteSession}><i class="far fa-times-circle"></i>&nbsp;&nbsp;End session</a>
    </li>
  ` : html`<li class="usa-sidenav__item" >
    <a href="/site/me/study?deck=${getDeckId()}&upsert=true"><i class="far fa-images"></i>&nbsp;&nbsp;Study</a>
  </li>`}
  </ul>`
}
