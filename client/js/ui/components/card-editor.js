const { html } = require('lit-html/lit-html')
const { simulateKey } = require('abstract/keyboard')
const spaceAction = () => {
  simulateKey('Space')
}
module.exports = (addImageAction) => html`
    <div class="card-editor">
              <div class="upload-container" style="position: absolute;top: 5px;right: 10px;">
                <input @change=${addImageAction} type="file" name="upload" id="image-upload" accept="image/*" class="image-upload-input"/>
                <label for="upload" class="image-upload-label usa-button usa-button--unstyled" >Add Image</label>
              </div>
          <div id="editor" class="pell"></div>
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
                      <div>
              <img src="" alt="" id="image-spot">
</div> 
        </div>    
      </div>
`
