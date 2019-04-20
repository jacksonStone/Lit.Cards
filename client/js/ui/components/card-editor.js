const { html } = require('lit-html/lit-html')
const leftArrow = require('component/left-arrow')
const rightArrow = require('component/right-arrow')
module.exports = (leftAction, rightAction, spaceAction, answerSide) => html`
    <div class="card-editor">

          <button class="usa-button usa-button--unstyled" style="position: absolute;top: 5px;right: 10px;">Add Image</button>
          <div id="editor" class="pell"></div>
            <div style="text-align: center">
            <div class="grid-row">
                 <div class="grid-col-2" style="text-align: center">  
                ${answerSide ? leftArrow(leftAction) : ''}
                </div>
                <div class="grid-col-8">
                <button class="usa-button usa-button--outline flip-card"
                        style="margin: 30px auto; min-width: 80%"
                        @click=${spaceAction}>
                    <div style="font-size: 22px">Flip</div><div style="font-size: 14px; margin-top: 5px">(press space)</div>
                    </button>
                </div>
                    
                  <div class="grid-col-2" style="text-align: center">
                  ${answerSide ? rightArrow(rightAction) : ''}
                  </div>
        </div> 
        </div>    
      </div>
`
