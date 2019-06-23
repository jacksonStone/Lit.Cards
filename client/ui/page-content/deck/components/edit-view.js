const { html } = require('lit')
const editor = require('./card-editor')
const cardEditStack = require('./side-numbers')
const sidenav = require('./sidenav')
const nameEdit = require('./name-edit')

module.exports = (cardId, cards, addImage, hasImage, showingAnswer, fontSize) => html`
  <div class="grid-container">
        <div class="grid-row">
        <div class="grid-col-3">
            <div style="    margin-right: 40px;">
              ${nameEdit()}
              ${sidenav()}
            </div>
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
