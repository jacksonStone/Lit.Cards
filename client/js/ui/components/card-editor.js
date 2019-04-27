const { html } = require('lit-html/lit-html')
const { simulateKey } = require('abstract/keyboard')
const { popupComponent, showPopup } = require('./card-image-popup')
const spaceAction = () => {
  simulateKey('Space')
}
const removeImageAction = () => {
  simulateKey('KeyR')
}

module.exports = (addImageAction, hasImage) => {
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
            <div id="editor" class="pell ${hasImage ? 'has-image-editor' : ''}"></div>
            <div style="text-align: center">
            <div class="grid-row">
                 <div class="grid-col-2" style="text-align: center">  
          
                </div>
                <div class="grid-col-8">
                <button class="usa-button usa-button--outline flip-card"
                        style="margin: 30px auto; min-width: 80%"
                        @click=${spaceAction}>
                    <div style="font-size: 22px">Flip</div><div style="font-size: 14px; margin-top: 5px">(press space)</div>
                    </button>
                </div>
                    
                  <div class="grid-col-2" style="text-align: center">
                  </div>
                </div>
       
        </div>    
      </div>
`
}
