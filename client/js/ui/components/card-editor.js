const { html } = require('lit-html/lit-html')
const { simulateKey, listenForKey, stopListeningForKey } = require('abstract/keyboard')
const { copyImageFromBackgroundtoImage } = require('abstract/file-upload')
const { runNextRender } = require('abstract/rendering-meta')
const spaceAction = () => {
  simulateKey('Space')
}
const removeImageAction = () => {
  simulateKey('KeyR')
}
const showPopup = () => {
  listenForKey('Escape', hidePopup)
  window.lc.setData('showingPopup', true)
}
const hidePopup = (e) => {
  e.preventDefault()
  stopListeningForKey('Escape')
  window.lc.setData('showingPopup', false)
}

const popupComponent = () => {
  if (!window.lc.getData('showingPopup')) {
    return null
  }
  runNextRender(() => {
    copyImageFromBackgroundtoImage('image-spot', 'popup-image')
  })
  return html`<div id="overlay" style="
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1;
    background-color: rgba(240,240,240,.9);
    "
    @click=${hidePopup}
    >
    <div class="popup" style="
    position: fixed;
    width: 800px;
    height: 600px;
    position: fixed;
    top: 50%;
    left: 50%;
    margin-top: -300px;
    margin-left: -400px;
    padding: 5px;">
    <img id="popup-image" 
    style="
    width:auto;
    border: #ddd 2px solid;
    height: auto;
    position:absolute;
    top:0;
    bottom:0;
    margin:auto;"/>
</div></div>`
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
