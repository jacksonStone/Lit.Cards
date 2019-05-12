const { html } = require('lit-html/lit-html')
const editor = require('./card-editor')
const cardEditStack = require('./card-edit-stack')

module.exports = (cardId, cards, addImage, hasImage, showingAnswer, fontSize) => html`
  <div class="grid-container">
        <div class="grid-row">
        <div class="grid-col-2"></div>
            <div class="grid-col-7">
                ${editor(addImage, hasImage, showingAnswer, fontSize)}
            </div>
            <div class="grid-col-1"></div>
            <div class="grid-col-2">
                ${cardEditStack(cardId, cards)}
            </div>
        </div>
</div>

`
