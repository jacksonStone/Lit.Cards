const { html } = require('lit-html/lit-html')
const editor = require('./card-editor')
const cardEditStack = require('./card-edit-stack')
const sidenav = require('./sidenav')

module.exports = (cardId, cards, addImage, hasImage, showingAnswer, fontSize) => html`
  <div class="grid-container">
        <div class="grid-row">
        <div class="grid-col-3">
            <div style="    margin-right: 40px;">
             <label class="usa-label usa-sr-only" for="input-type-text">Text input label</label>
<!--             Add real value here-->
            <input class="usa-input" id="input-type-text" name="input-type-text" type="text" value="myDeck" style="
                margin-top:0;
                font-size:20px;
                border-color:rgba(10, 10, 10, 0.1);
                border-bottom:none;
            "/>
</div>
            
            ${sidenav()}
        </div>
            <div class="grid-col-6">
                ${editor(addImage, hasImage, showingAnswer, fontSize)}
            </div>
            <div class="grid-col-3">
                ${cardEditStack(cardId, cards)}
            </div>
        </div>
</div>

`
