const { html } = require('lit-html/lit-html')
module.exports = () => html`
    <div class="grid-container">
        <div class="grid-row">
        <div class="grid-col-2" style="text-align: center">  
            <button class="usa-button usa-button--outline flip-card"
              style="margin: 20px 20px; height: 280px; box-shadow: none;">
            <div style="font-size: 53px; margin-bottom: 10px">←</div>
            <div style="font-size: 14px; margin-bottom: 10px">previous</div>
            </button>
                    
        </div>
        <div class="grid-col-8">
          <button class="usa-button usa-button--unstyled" style="position: absolute;top: 5px;right: 10px;">use image</button>
          <div id="editor" class="pell"></div>
            <div style="text-align: center">
                    <button class="usa-button usa-button--outline flip-card"
                        style="margin: 30px auto; min-width: 80%">
                    <div style="font-size: 22px">Flip</div><div style="font-size: 14px; margin-top: 5px">(press space)</div>
                    </button>
            </div>
        </div>    
        <div class="grid-col-2" style="text-align: center">
         <button class="usa-button usa-button--outline flip-card"
              style="margin: 20px 20px; height: 280px; box-shadow: none;">
            <div style="font-size: 53px; margin-bottom: 10px">→</div>
            <div style="font-size: 14px; margin-bottom: 10px">next</div>
         </button>
        </div> 
        </div>
    </div> 
    
`
