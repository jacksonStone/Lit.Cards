import { html } from 'lit';
import { simulateKey } from 'abstract/keyboard';
import { popupComponent, showPopup } from '../../deck/components/card-image-popup';
import { getTextToShowForCard, refreshEditor } from 'logic/deck';
import { runNextRender } from 'abstract/rendering-meta';
import { showingAnswerKeyBindings, showingQuestionKeyBindings } from '../key-commands';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import { hasImage as calculateHasImage, getPresentFontSize } from 'logic/deck';
let spaceAction = () => {
  simulateKey('Space')
}
let rightAction = () => {
  simulateKey('ArrowRight')
}
let leftAction = () => {
  simulateKey('ArrowLeft')
}

export default () => {
  const showingAnswer = window.lc.getData('showingAnswer');
  const currentfontSize = getPresentFontSize() || 1;
  const hasImage = calculateHasImage();
  const width = window.lc.getData('screen.width');

  if (showingAnswer) {
    showingAnswerKeyBindings()
  } else {
    showingQuestionKeyBindings()
  }
  runNextRender(refreshEditor)
  let getTextForCard = getTextToShowForCard();
  return html`
    <div class="card-editor ${hasImage ? 'card-editor-with-image study-card' : ''}">
    <div class="card-viewer-outline">
        ${getTextForCard === false ? html`<div style="height: 298px">Loading...</div>`: html` ${popupComponent()}
              <div alt="preview-of-crad-image" 
                class="${hasImage ? 'image-spot-with-image' : 'image-spot-without-image'}" 
                id="image-spot" class="usa-button usa-button--outline"
                @click=${showPopup}></div>
            <div id="editor" class="pell ${hasImage ? 'has-image-editor study-card-with-image' : 'size-' + currentfontSize + ' study-card-no-image'}">
                <div id="card-content" aria-live="polite" class="pell-content">${unsafeHTML(getTextForCard)} </div>
            </div>`}
    </div>
            <div style="text-align: center">
                <div class="grid-row" style="margin-top:30px">
                    <div class="grid-col-3" style="text-align: left">
                    ${showingAnswer ? html`<button class="usa-button usa-button--outline negative-button-no-outline mark-wrong" id="wrong-button"
                        @click=${leftAction}
                        style="
                               box-shadow: none;
                               width:100%;
                               margin-right:0; 
                        ">
                    <div><i class="far fa-thumbs-down" aria-hidden="true">
                    <span class="sr-only">Mark Wrong</span>
                    </i>${width > 340 ? '  Wrong' : '' }</div>
                    <div style="position: relative"><div aria-hidden="true" class="hotkey-indicator above-750">( ⇦ )</div></div>
                    </button>` : html`<div></div>`}
                    </div>
                    <div class="grid-col-6">
                     <button id="flip-card-study" class="usa-button usa-button--primary flip-card"
                        @click=${spaceAction}
                        style="margin-right:0; width:100%;">
                    Flip
                    <div style="position: relative"><div aria-hidden="true" class="hotkey-indicator above-750" style="top: 20px;">( space )</div></div>
                    </button>
                    </div>
                    <div class="grid-col-3" style="text-align: right;">

                    ${showingAnswer ? html`<button class="usa-button usa-button--outline affermative-button-no-outline mark-right" id="right-button"
                        @click=${rightAction}
                        style="margin-right:0; width: 100%; box-shadow: none;">
                    <div><i class="far fa-thumbs-up" aria-hidden="true"><span class="sr-only">Mark Correct</span>
                        </i>${width > 340 ? '  Right' : '' }</div>
                        <div style="position: relative"><div aria-hidden="true" class="above-750 hotkey-indicator">( ⇨ )</div></div>
                    </button>` :  html`<div></div>`}
                    </div>
                </div></div>
            </div>    
      </div>
`
};
