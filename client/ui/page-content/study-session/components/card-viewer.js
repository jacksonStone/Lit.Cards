const { html } = require('lit')
const { simulateKey } = require('abstract/keyboard')
const { popupComponent, showPopup } = require('../../deck/components/card-image-popup')
const { getTextToShowForCard, refreshEditor } = require('logic/deck')
const { runNextRender } = require('abstract/rendering-meta')
const { showingAnswerKeyBindings, showingQuestionKeyBindings } = require('../key-commands')
const { unsafeHTML } = require('lit-html/directives/unsafe-html')
const spaceAction = () => {
  simulateKey('Space')
}
const rightAction = () => {
  simulateKey('ArrowRight')
}
const leftAction = () => {
  simulateKey('ArrowLeft')
}
module.exports = (hasImage, showingAnswer, currentfontSize = 1) => {
  if (showingAnswer) {
    showingAnswerKeyBindings()
  } else {
    showingQuestionKeyBindings()
  }
  runNextRender(refreshEditor)

  return html`
    <div class="card-editor ${hasImage ? 'card-editor-with-image' : ''}">
              ${popupComponent()}
              <div alt="preview-of-crad-image" 
                class="${hasImage ? 'image-spot-with-image' : 'image-spot-without-image'}" 
                id="image-spot" class="usa-button usa-button--outline"
                @click=${showPopup}></div>
            <div id="editor" class="pell ${hasImage ? 'has-image-editor study-card-with-image' : 'size-' + currentfontSize + ' study-card-no-image'}">
                <div id="card-content" class="pell-content">${unsafeHTML(getTextToShowForCard())} </div>
            </div>
            <div style="text-align: center">
            <div class="grid-row" style="margin-top:10px">
                    <div class="grid-col-3" style="text-align: left">
                    ${showingAnswer ? html`<button class="usa-button usa-button--outline negative-button-no-outline mark-wrong"
                        @click=${leftAction}
                        style="
                               box-shadow: none;
                               width:100%;
                               margin-right:0; 
                        ">
                    <div><i class="far fa-thumbs-down" aria-hidden="true">
                    <span class="sr-only">Mark Wrong</span>
                    </i>&nbsp;&nbsp;Wrong</div>
                    </button>` : html``}
                    </div>
                    <div class="grid-col-6">
                     <button class="usa-button usa-button--primary flip-card"
                        @click=${spaceAction}
                        style="margin-right:0; width:100%;">
                    Flip
                    </button>
                    </div>
                    <div class="grid-col-3" style="text-align: right;">

                    ${showingAnswer ? html`<button class="usa-button usa-button--outline affermative-button-no-outline mark-right"
                        @click=${rightAction}
                        style="margin-right:0; width: 100%; box-shadow: none;">
                    <div><i class="far fa-thumbs-up" aria-hidden="true"><span class="sr-only">Mark Correct</span>
                        </i>&nbsp;&nbsp;Right </div>
                    </button>` : html``}
                    </div>
                </div>
                </div>
        </div>    
      </div>
`
}
