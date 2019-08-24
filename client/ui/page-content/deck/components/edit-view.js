let { html } = require('lit')
let editor = require('./card-editor')
let cardEditStack = require('./side-numbers')
let sidenav = require('./sidenav')
let nameEdit = require('./name-edit')
let darkmodeCheckbox = require('component/darkmode-checkbox')

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
${darkmodeCheckbox()}
`
