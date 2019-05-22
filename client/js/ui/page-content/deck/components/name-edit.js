const { html } = require('lit-html/lit-html')
const { getValueFromInput } = require('abstract/events')
function getName () {
  return window.lc.getData('deck.name')
}
function setName (e) {
  const value = getValueFromInput(e)
  return window.lc.setPersistent('deck.name', value)
}
module.exports = function () {
  return html`
    <label class="usa-label usa-sr-only" for="input-type-text">
        Deck Name
    </label>
    <input 
        class="usa-input" 
        id="deck-name" 
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
}
