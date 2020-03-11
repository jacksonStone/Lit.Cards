import { html } from 'lit-html/lit-html';
import { deleteSession as deleteSessionInServerAndState } from 'logic/study';
import { makeDeckPublic as makePublicInServerAndState } from 'logic/deck';
function getDeckId () {
  let deck = window.lc.getData('deck')
  return deck && deck.id
}
function deckIsPublic () {
  let deck = window.lc.getData('deck')
  return deck && deck.public;
}
function getSessionId () {
  let session = window.lc.getData('session')
  return session && session.id
}
function deleteSession () {
  let id = getSessionId()
  deleteSessionInServerAndState(id)
}
function makePublic () {
  let id = getDeckId()
  if (!id) return;
  makePublicInServerAndState(id)
}
function copySharableLink () {
  // TODO::Probably better in abstract
  let link = window.location.origin + `/site/me/study?deck=${getDeckId()}&upsert=true`;
  let textArea = document.createElement("textarea");
  textArea.value = link;
  document.body.appendChild(textArea);
  textArea.focus()
  textArea.select()
  document.execCommand("copy");
  textArea.remove();
  alert('Copied sharable link!');
}

//SHAREABLE LINK IS USED IN TEST SCRIPTS
export default () => {
  return html`<ul class="site-sidenav usa-sidenav">
  <li class="usa-sidenav__item" >
    <a href="/site/me"><i class="far fa-arrow-alt-circle-left"></i>&nbsp;&nbsp;Decks</a>
  </li>
  ${getSessionId() ? html`
    <li class="usa-sidenav__item">
        <a href="/site/me/study?id=${getSessionId()}"><i class="far fa-images"></i>&nbsp;&nbsp;Continue studying</a>
    </li>
        <li class="usa-sidenav__item" >
        <a href="#" @click=${deleteSession}><i class="far fa-times-circle"></i>&nbsp;&nbsp;End session</a>
    </li>
  ` : html`<li class="usa-sidenav__item" >
    <a id="no-study-session-creation-button" href="/site/me/study?deck=${getDeckId()}&upsert=true"><i class="far fa-images"></i>&nbsp;&nbsp;Study</a>
  </li>`}
  ${deckIsPublic() ? html`<li class="usa-sidenav__item" >
    <a id="copy-sharable-link" href="#" @click="${copySharableLink}"><i class="far fa-paper-plane"></i>&nbsp;&nbsp;Copy sharable link</a>
  </li>` : html`<li class="usa-sidenav__item" >
    <a id="share-deck-button" href="#" @click=${makePublic}><i class="far fa-share-square"></i>&nbsp;&nbsp;Make deck public</a>
  </li>`}
  </ul>`
};
