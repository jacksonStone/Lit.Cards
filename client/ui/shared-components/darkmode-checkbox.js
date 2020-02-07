let { html } = require('lit')
let { getValueFromCheckbox } = require('abstract/events')
let { recordAndSetDarkMode } = require('abstract/darkmode')

let isDarkMode = () => {
  let user = window.lc.getData('user')
  return user && user.darkMode
}
let setDarkMode = (e) => {
  let value = getValueFromCheckbox(e)
  recordAndSetDarkMode(value)
  window.lc.setPersistent('user.darkMode', value, false)
}
module.exports = () => {
  
return  html`
      ${
        isDarkMode() ? html`<input @change=${setDarkMode} class="usa-checkbox__input" id="darkmode" type="checkbox" name="darkmode" value="true" checked/>` : html`
        <input @change=${setDarkMode} class="usa-checkbox__input" id="darkmode" type="checkbox" name="darkmode" value="false"/>`
      }
      <label class="usa-checkbox__label" for="darkmode">Dark mode</label>
  `
}
