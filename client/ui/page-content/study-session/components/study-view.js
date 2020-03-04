import { html } from 'lit';
import viewer from './card-viewer';
import { cardStack, smallCardStack } from './right-wrong';
import sidenav from './sidenav';
import nextSteps from './end-of-session';

// let { storeAllState, retrieveStateStored } = require('abstract/browser-storage')
import darkmodeCheckbox from 'component/darkmode-checkbox';

import { hideSideNav, hideProgress } from 'component/focus-mode-checkboxes';
import checkboxHolder from 'component/checkbox-holder';
let getUser = () => {
  const user = window.lc.getData('user');
  return user || {};
}

export default (cardId, cards, hasImage, showingAnswer, fontSize) => {

  screenWidth = window.lc.getData('screen.width');
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
            ${getUser().hideProgress ? html``: smallCardStack(cardId, cards) }
        </div>
        `}
        
    </div>
    ${checkboxHolder([hideProgress(), hideSideNav(), darkmodeCheckbox()])}
  `
};
