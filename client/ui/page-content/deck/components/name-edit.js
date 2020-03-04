import { html } from 'lit';
import { getValueFromInput } from '../../../../browser-abstractions/events';
import { getParam } from '../../../../browser-abstractions/url';
function getName () {
  return window.lc.getData('deck.ts.ts.name')
}
function setName (e) {
  let value = getValueFromInput(e)
  window.lc.setPersistent('deck.ts.ts.name', value)
  window.lc.setPersistent('deck.ts.ts.id', getParam('deck.ts.ts'))
}

export default function () {
  return html`
    <label class="usa-label usa-sr-only" for="input-type-text">
        Deck Name
    </label>
    <input 
        class="usa-input" 
        id="deck-name" 
        maxlength="45"
        name="deck-name"
        @change=${setName}
        type="text" 
        value=${getName()}
        style="margin-top:0;
            font-size:20px;
            border-color:rgba(10, 10, 10, 0.1);
            border-bottom:none;"
    />
    `
};
