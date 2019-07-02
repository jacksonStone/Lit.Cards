const { html } = require('lit')
const viewer = require('./card-viewer')
const cardStack = require('./right-wrong')
const sidenav = require('./sidenav')
const nextSteps = require('./end-of-session')
const { storeAllState, retrieveStateStored } = require('abstract/browser-storage')
const darkmodeCheckbox = require('component/darkmode-checkbox')

module.exports = (cardId, cards, hasImage, showingAnswer, fontSize) => html`
<div class="grid-container">
    <div class="grid-row">
    <div class="grid-col-3"> 
        <div style="    margin-right: 40px;">
          ${sidenav()}
        </div>
    </div>
        <div class="grid-col-6">
            
            ${cards.length ? viewer(hasImage, showingAnswer, fontSize) : nextSteps()}
        </div>
        <div class="grid-col-3">
            ${cardStack(cardId, cards)}
        </div>
    </div>
</div>
${darkmodeCheckbox()}
`
