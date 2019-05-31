const { html } = require('lit-html/lit-html')
const { simulateKey } = require('abstract/keyboard')
const { popupComponent, showPopup } = require('../../deck/components/card-image-popup')
const spaceAction = () => {
  simulateKey('Space')
}

module.exports = (hasImage, showingAnswer, currentfontSize = 1) => {
  return html`
    <div class="card-editor ${hasImage ? 'card-editor-with-image' : ''}">
              ${popupComponent()}
              <div alt="preview-of-crad-image" 
                class="${hasImage ? 'image-spot-with-image' : 'image-spot-without-image'}" 
                id="image-spot" class="usa-button usa-button--outline"
                @click=${showPopup}></div>
            <div id="editor" class="pell ${hasImage ? 'has-image-editor' : 'size-' + currentfontSize}">
                <div id="card-content"><!-- TODO:: Put content here --> </div>
            </div>
            <div style="text-align: center">
            <div class="grid-row" style="margin-top:10px">
                    <div class="grid-col-3" style="text-align: left">
                    ${showingAnswer ? html`<button class="usa-button usa-button--outline remove-card"
                        @click=${() => { console.log('WRONG') }}
                        style="
                               box-shadow: none;
                               width:100%;
                               margin-right:0; 
                        ">
                    <div><i class="far fa-times-circle" aria-hidden="true">
                    <span class="sr-only">Mark Wrong</span>
                    </i>&nbsp;&nbsp;Wrong</div>
                    </button>` : html``}
                    </div>
                    <div class="grid-col-6">
                     <button class="usa-button usa-button--primary flip-card"
                        @click=${spaceAction}
                        style="margin-right:0; width:100%;">
                    <div>Flip <span style="font-size: 14px; margin-top: 5px"> (space)</span></div>
                    </button>
                    </div>
                    <div class="grid-col-3" style="text-align: right;">

                    ${showingAnswer ? html`<button class="usa-button usa-button--outline add-card"
                        @click=${() => { console.log('Mark Right') }}
                        style="margin-right:0; width: 100%; box-shadow: none;">
                    <div><i class="far fa-check-circle" aria-hidden="true"><span class="sr-only">Mark Correct</span>
                        </i>&nbsp;&nbsp;Right </div>
                    </button>` : html``}
                    </div>
                </div>
                </div>
        </div>    
      </div>
`
}
