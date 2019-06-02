const { html } = require('lit-html')
function getDeckId () {
  const deck = window.lc.getData('deck')
  return deck && deck.id
}
module.exports = () => {
  return html`<ul class="site-sidenav usa-sidenav">
  <li class="usa-sidenav__item" >
    <a href="/site/me"><i class="far fa-arrow-alt-circle-left"></i>&nbsp;&nbsp;Back to decks</a>
  </li>
  <li class="usa-sidenav__item" >
    <a href="/site/me/study?deck=${getDeckId()}"><i class="far fa-images"></i>&nbsp;&nbsp;Study</a>
  </li>
  </ul>`
}
