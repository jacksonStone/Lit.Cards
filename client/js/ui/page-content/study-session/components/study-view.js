const { html } = require('lit')
const viewer = require('./card-viewer')
const cardStack = require('./card-stack')
const sidenav = require('./sidenav')
const nextSteps = require('./next-steps')
const { storeAllState, retrieveStateStored } = require('abstract/browser-storage')
module.exports = (cardId, cards, hasImage, showingAnswer, fontSize) => html`
    ${window.lc.debugging() ? html`
   <button style="position:absolute; top: 0; left: 0;" @click=${storeAllState}>Store state</button>
  <button style="position:absolute; top: 20px; left: 0;" @click=${retrieveStateStored}>Restore state</button>` : html``}
  
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

`
