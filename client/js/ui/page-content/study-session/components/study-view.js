const { html } = require('lit-html/lit-html')
const viewer = require('./card-viewer')
const cardStack = require('./card-stack')
const sidenav = require('./sidenav')

module.exports = (cardId, cards, hasImage, showingAnswer, fontSize) => html`
  <div class="grid-container">
        <div class="grid-row">
        <div class="grid-col-3"> 
            <div style="    margin-right: 40px;">
              ${sidenav()}
            </div>
        </div>
            <div class="grid-col-6">
                ${viewer(hasImage, showingAnswer, fontSize)}
            </div>
            <div class="grid-col-3">
                ${cardStack(cardId, cards)}
            </div>
        </div>
</div>

`
