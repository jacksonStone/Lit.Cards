const { html } = require('lit-html/lit-html')
const { simulateKey } = require('abstract/keyboard')
const { removeCard } = require('../helper')
const { popupComponent, showPopup } = require('./card-image-popup')
const spaceAction = () => {
  simulateKey('Space')
}
const newAction = () => {
  simulateKey('KeyN')
}
const removeImageAction = () => {
  simulateKey('KeyR')
}

module.exports = (addImageAction, hasImage, showingAnswer) => {
  return html`
    <div class="card-editor ${hasImage ? 'card-editor-with-image' : ''}">
              ${popupComponent()}
              <div alt="preview-of-crad-image" 
                class="${hasImage ? 'image-spot-with-image' : 'image-spot-without-image'}" 
                id="image-spot" class="usa-button usa-button--outline"
                @click=${showPopup}></div>
              ${hasImage ? html`
                <button style="position: absolute; top: 208px; right: 49px;"
                    class="usa-button usa-button--unstyled" id="remove-image-from-card"
                    @click=${removeImageAction}>
                <i class="far fa-times-circle" aria-hidden="true"></i>
                Remove image
                </button>` : html`
              
               <div class="upload-container" style="position: absolute;top: 5px;right: 50px;">
                <input @change=${addImageAction} type="file" name="upload" id="image-upload" accept="image/*" class="image-upload-input"/>
                <label for="upload" class="image-upload-label usa-button usa-button--unstyled" >Add Image</label>
              </div>
              `}
              <div style="position:absolute; left: 50%;">
                ${showingAnswer ? html`
                   <div class="bg-secondary label-pill">ANSWER</div>
                ` : html`
                   <div class="bg-primary label-pill">QUESTION</div>
                `}
              </div>
            <div id="editor" class="pell ${hasImage ? 'has-image-editor' : ''}"></div>
            <div style="text-align: center">
            <div class="grid-row">
                    <div class="grid-col-3">
                    <button class="usa-button usa-button--outline"
                        @click=${removeCard}
                        style="
                               color:#d83933;
                               box-shadow: inset 0 0 0 2px #d83933;
                        ">
                    <div><i class="far fa-times-circle" aria-hidden="true">
                    <span class="sr-only">Remove</span>
                    </i>&nbsp;card</div>
                    </button>
                    </div>
                    <div class="grid-col-6">
                     <button class="usa-button usa-button--primary flip-card"
                        style=""
                        @click=${spaceAction}>
                    <div>Flip <span style="font-size: 14px; margin-top: 5px"> (space)</span></div>
                    </button>
                    </div>
                    <div class="grid-col-3">
                    <button class="usa-button usa-button--outline"
                        @click=${newAction}
                        style="">
                    <div><i class="far fa-plus-square" aria-hidden="true"><span class="sr-only">New</span>
</i>&nbsp;card <span style="font-size: 14px; margin-top: 5px"> (n)</span></div>
                    </button>
                    </div>
                </div>
                </div>
        </div>    
      </div>
`
}
