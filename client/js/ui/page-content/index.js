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
          <div id="editor" class="pell"></div>
            <div style="text-align: center">
                    <button class="usa-button usa-button--outline usa-button--accent-cool flip-card"
                        style="margin: 20px auto; min-width: 80%">
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
