let { html } = require('lit')
let viewer = require('./card-viewer')
let cardStack = require('./right-wrong')
let sidenav = require('./sidenav')
let nextSteps = require('./end-of-session')
let { storeAllState, retrieveStateStored } = require('abstract/browser-storage')
let darkmodeCheckbox = require('component/darkmode-checkbox')
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
