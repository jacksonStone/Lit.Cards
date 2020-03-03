let { html } = require('lit')
let { simulateKey } = require('abstract/keyboard')
let { removeCard, removeImage } = require('logic/deck.ts')
let { popupComponent, showPopup } = require('./card-image-popup')
let focusingOnTextProp = '_focusingOnText'

let spaceAction = () => {
  simulateKey('Space')
}
let newAction = () => {
  simulateKey('KeyS')
}

let cardLoading = () => {
  return window.lc.getData('_cardBodyLoading')
}
let removeImageAction = () => {
  removeImage()
}
let deckIsPublic = () => {
  let deck = window.lc.getData('deck.ts.ts');
  return deck && deck.public;
}
//TODO::Move to one place
function isMac () {
  return window.navigator.platform.indexOf('Mac') !== -1
}
function getNameOfShortcutKey() {
  if(isMac()) {
    return 'cmd'
  }
  return 'ctrl'
}
function ifTextNotSelected(htmlTemplate, textSelectedHTMLTemplate) {
  if(!window.lc.getData(focusingOnTextProp)) {
    return htmlTemplate
  }
  return textSelectedHTMLTemplate || html``;
}

function getSession () {
  return window.lc.getData('session')
}
function tooFewCardsToDeleteOne () {
  let cards = window.lc.getData('orderedCards')
  if (!cards || !cards.length || cards.length === 1) return true
  return false
}
function alertCantRemove () {
  // maybedo::Improve this
  window.alert('You cannot delete any cards while they are being studied, if it\'s the last card, or if the deck has been made public')
}

module.exports = (addImageAction, hasImage, showingAnswer, currentfontSize = 1) => {
  const width = window.lc.getData('screen.width');
  return html`
    <div class="card-editor ${hasImage ? 'card-editor-with-image' : ''}">
              ${popupComponent()}
                  <div class="card-viewer-outline">
              <div alt="preview-of-crad-image" 
                class="${hasImage ? 'image-spot-with-image' : 'image-spot-without-image'}" 
                id="image-spot" class="usa-button usa-button--outline"
                @click=${showPopup}></div>
              ${hasImage ? html`
              <button style="position: absolute; top: 202px; ${width >= 480 ? 'right: 10px' : (width >= 315 ? ( width >= 345 ? 'left: 60%' : 'left: 50%') : 'left: 60%')};"
                class="usa-button usa-button--unstyled" id="remove-image-from-card"
                @click=${removeImageAction}>
                <i class="far fa-times-circle" aria-hidden="true"></i>
                ${width >= 315 ? 'Remove image' : 'Image'}
              </button>
               ` : html`\

              
               <div class="upload-container" style="position: absolute;top: 5px;right: 10px;">
                <input @change=${addImageAction} type="file" name="upload" id="image-upload" accept="image/*" class="image-upload-input"/>
                <label for="upload" class="image-upload-label usa-button usa-button--unstyled" >Add Image</label>
              </div>
              `}
              <div style="position:absolute; left: 50%;">
                ${showingAnswer ? html`
                   <div class="label-pill" id="answer-pill">ANSWER</div>
                ` : html``}
              </div>
            <div id="editor" class="pell ${hasImage ? 'has-image-editor' : 'size-' + currentfontSize}"></div>
            </div>
            <div style="text-align: center">
            <div class="grid-row" style="margin-top:30px">
                    <div class="grid-col-3" style="text-align: left">
                    ${((!getSession() || getSession().none) && !tooFewCardsToDeleteOne() && !cardLoading() && !deckIsPublic()) ? html`<button class="usa-button usa-button--outline negative-button-no-outline"
                        @click=${removeCard}
                        id="remove-card-button-active"
                        style="
                               box-shadow: none;
                               width:100%;
                               margin-right:0; 
                        "><div><i class="far fa-times-circle" aria-hidden="true">
                    <span class="sr-only">Remove</span>
                    </i>${width >= 300 ? '  card' : ''}</div>
                    </button>` : html`<button class="usa-button usa-button--outline disabled-button-no-outline"
                        @click=${alertCantRemove}
                        id="remove-card-button-inactive"
                        style="
                             box-shadow: none;
                             width:100%;
                             margin-right:0; 
                        "><div><i class="far fa-times-circle" aria-hidden="true">
                    <span class="sr-only">Remove</span>
                    </i>${width >= 300 ? '  card' : ''}</div>
                    </button>`}  
                    </div>
                    <div class="grid-col-6">
                     <button id="flip-card" class="usa-button usa-button--primary flip-card"
                        @click=${spaceAction}
                        style="margin-right:0; width:100%;">
                    Flip
                    ${ifTextNotSelected(html`<div style="position: relative"><div aria-hidden="true" class="hotkey-indicator above-750" style="top: 20px;">( space )</div></div>`
                      ,html`<div style="position: relative"><div aria-hidden="true" class="hotkey-indicator above-750" style="top: 20px;">( ${getNameOfShortcutKey() } + f )</div></div>`)}
                    </button>
                    </div>
                    <div class="grid-col-3" style="text-align: right;">
                    <button class="usa-button usa-button--outline affermative-button-no-outline add-card"
                        id="add-card"
                        @click=${newAction}
                        style="margin-right:0; width: 100%; box-shadow: none;">
                    <div><i class="far fa-plus-square" aria-hidden="true"><span class="sr-only">New</span>
</i>${width >= 300 ? '  card' : ''}</div>
                    ${ifTextNotSelected(html`<div style="position: relative"><div aria-hidden="true" class="hotkey-indicator above-750">( s )</div></div>`
                    ,html`<div style="position: relative"><div aria-hidden="true" class="hotkey-indicator above-750" >( ${getNameOfShortcutKey() } + s )</div></div>`)}
                    </button>
                    </div>
                </div>
                </div>
        </div>    
      </div>
`
}
