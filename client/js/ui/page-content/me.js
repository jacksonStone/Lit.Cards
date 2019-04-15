const { html } = require('lit-html/lit-html')
const leftArrow = require('component/left-arrow')
const rightArrow = require('component/right-arrow')
module.exports = (data) => {
  return html`
    <div class="grid-container">
        <div class="grid-row">
        <div class="grid-col-2" style="text-align: center">  
           ${leftArrow(data)}
        </div>
        <div class="grid-col-8">
          <button class="usa-button usa-button--unstyled" style="position: absolute;top: 5px;right: 10px;">use image</button>
          <div id="editor" class="pell"></div>
            <div style="text-align: center">
                    <button class="usa-button usa-button--outline flip-card"
                        style="margin: 30px auto; min-width: 80%">
                    <div style="font-size: 22px">${data.decks}:${JSON.stringify(data.user)}</div>
                    </button>
            </div>
        </div>    
        <div class="grid-col-2" style="text-align: center">
            ${rightArrow(data)}
        </div> 
        </div>
    </div> 
    
`
}
