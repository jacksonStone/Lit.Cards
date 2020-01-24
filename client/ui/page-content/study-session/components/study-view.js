let { html } = require('lit')
let viewer = require('./card-viewer')
let cardStack = require('./right-wrong')
let sidenav = require('./sidenav')
let nextSteps = require('./end-of-session')
let { storeAllState, retrieveStateStored } = require('abstract/browser-storage')
let darkmodeCheckbox = require('component/darkmode-checkbox')
let { hideSideNav, hideProgress } = require('component/focus-mode-checkboxes')
let checkboxHolder = require('component/checkbox-holder')
let getUser = () => {
  const user = window.lc.getData('user');
  return user || {};
}
module.exports = (cardId, cards, hasImage, showingAnswer, fontSize) => {

  screenWidth = window.lc.getData('screen.width');
  if(screenWidth >= 750) {

  }
  return html`
    <div class="grid-container">
        ${screenWidth >= 750 ? html`
        <div class="grid-row">
          <div class="grid-col-3 study-side-nav"> 
            ${getUser().hideNavigation ? html``: html`
             <div style="margin-right: 40px;">
              ${sidenav()}
            </div>` }
          </div>
          <div class="grid-col-6">      
            ${cards.length ? viewer(hasImage, showingAnswer, fontSize) : nextSteps()}
          </div>
          <div class="grid-col-3 study-side-nav">
            ${getUser().hideProgress ? html``: cardStack(cardId, cards) }
          </div>
        </div>` : html`
        <div style="max-width: 450px; margin: 0 auto">
            ${cards.length ? viewer(hasImage, showingAnswer, fontSize) : nextSteps()}
        </div>
        `}
        
    </div>
    ${checkboxHolder([hideProgress(), hideSideNav(), darkmodeCheckbox()])}
  `
}
