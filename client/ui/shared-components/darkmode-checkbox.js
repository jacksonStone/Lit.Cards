const { html } = require('lit')
const { getValueFromCheckbox } = require('abstract/events')
const { recordAndSetDarkMode } = require('abstract/darkmode')
const isDarkMode = () => {
  const user = window.lc.getData('user')
  return user && user.darkMode
}
const setDarkMode = (e) => {
  const value = getValueFromCheckbox(e)
  recordAndSetDarkMode(value)
  window.lc.setPersistent('user.darkMode', value, false)
}
module.exports = (cardId, cards, addImage, hasImage, showingAnswer, fontSize) => html`
    <div class="usa-checkbox darkmode-checkbox-container" style="
    position: fixed;
    right: 10px;
    padding: 5px 5px 0 5px;
    bottom: 0;
    border-radius: 3px;
">
      ${
        isDarkMode() ? html`<input @change=${setDarkMode} class="usa-checkbox__input" id="darkmode" type="checkbox" name="darkmode" value="true" checked/>` : html`
        <input @change=${setDarkMode} class="usa-checkbox__input" id="darkmode" type="checkbox" name="darkmode" value="false"/>`
      }
      <label class="usa-checkbox__label" for="darkmode">Dark mode</label>
    </div>
`
