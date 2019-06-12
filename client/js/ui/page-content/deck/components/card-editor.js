const { html } = require('lit')
const { simulateKey } = require('abstract/keyboard')
const { runNextRender } = require('abstract/rendering-meta')
const { removeCard, removeImage, refreshEditor } = require('../helper')
const { popupComponent, showPopup } = require('./card-image-popup')
const spaceAction = () => {
  simulateKey('Space')
}
const newAction = () => {
  simulateKey('KeyN')
}
const removeImageAction = () => {
  removeImage()
}

function getSession () {
  return window.lc.getData('session')
}
function alertCantRemove() {
  // Todo::Improve this
  window.alert('You cannot delete any cards while they are being studied')
}

module.exports = (addImageAction, hasImage, showingAnswer, currentfontSize = 1) => {
  runNextRender(refreshEditor)
  return html`
    <div class="card-editor ${hasImage ? 'card-editor-with-image' : ''}">
              ${popupComponent()}
              <div alt="preview-of-crad-image" 
                class="${hasImage ? 'image-spot-with-image' : 'image-spot-without-image'}" 
                id="image-spot" class="usa-button usa-button--outline"
                @click=${showPopup}></div>
              ${hasImage ? html`
                <button style="position: absolute; top: 208px; right: 10px;"
                    class="usa-button usa-button--unstyled" id="remove-image-from-card"
                    @click=${removeImageAction}>
                <i class="far fa-times-circle" aria-hidden="true"></i>
                Remove image
                </button>` : html`
              
               <div class="upload-container" style="position: absolute;top: 5px;right: 10px;">
                <input @change=${addImageAction} type="file" name="upload" id="image-upload" accept="image/*" class="image-upload-input"/>
                <label for="upload" class="image-upload-label usa-button usa-button--unstyled" >Add Image</label>
              </div>
              `}
              <div style="position:absolute; left: 50%;">
                ${showingAnswer ? html`
                   <div class="label-pill">ANSWER</div>
                ` : html``}
              </div>
            <div id="editor" class="pell ${hasImage ? 'has-image-editor' : 'size-' + currentfontSize}"></div>
            <div style="text-align: center">
            <div class="grid-row" style="margin-top:10px">
                    <div class="grid-col-3" style="text-align: left">
                    ${(!getSession()) ? html`<button class="usa-button usa-button--outline negative-button-no-outline"
                        @click=${removeCard}
                        style="
                               box-shadow: none;
                               width:100%;
                               margin-right:0; 
                        "><div><i class="far fa-times-circle" aria-hidden="true">
                    <span class="sr-only">Remove</span>
                    </i>&nbsp;&nbsp;card</div>
                    </button>` : html`<button class="usa-button usa-button--outline disabled-button-no-outline"
                        @click=${alertCantRemove}
                        style="
                             box-shadow: none;
                             width:100%;
                             margin-right:0; 
                        "><div><i class="far fa-times-circle" aria-hidden="true">
                    <span class="sr-only">Remove</span>
                    </i>&nbsp;&nbsp;card</div>
                    </button>`}  
                    </div>
                    <div class="grid-col-6">
                     <button class="usa-button usa-button--primary flip-card"
                        @click=${spaceAction}
                        style="margin-right:0; width:100%;">
                    Flip
                    </button>
                    </div>
                    <div class="grid-col-3" style="text-align: right;">
                    <button class="usa-button usa-button--outline affermative-button-no-outline add-card"
                        @click=${newAction}
                        style="margin-right:0; width: 100%; box-shadow: none;">
                    <div><i class="far fa-plus-square" aria-hidden="true"><span class="sr-only">New</span>
</i>&nbsp;&nbsp;card </div>
                    </button>
                    </div>
                </div>
                </div>
        </div>    
      </div>
`
}
