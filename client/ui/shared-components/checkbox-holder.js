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

//You are working on this
module.exports = (checkboxes, right = '10px') => html`
    <div class="usa-checkbox darkmode-checkbox-container" style="
    position: fixed;
    right: ${right};
    padding: 5px 5px 0 5px;
    bottom: 0;
    border-radius: 3px;
">
<div style="opacity: .7">
      ${checkboxes}

</div>
    </div>
`
