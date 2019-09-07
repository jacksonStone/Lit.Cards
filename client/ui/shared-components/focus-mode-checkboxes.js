let { html } = require('lit')
let { getValueFromCheckbox } = require('abstract/events')
let { recordAndSetDarkMode } = require('abstract/darkmode')
let isHidingProgress= () => {
  let user = window.lc.getData('user')
  return user && user.hideProgress
}
let isHidingNavigation= () => {
  let user = window.lc.getData('user')
  return user && user.hideNavigation
}
let setHidingNavigation = (e) => {
  let value = getValueFromCheckbox(e)
  window.lc.setPersistent('user.hideNavigation', value)
}
let setHidingProgress = (e) => {
  let value = getValueFromCheckbox(e)
  window.lc.setPersistent('user.hideProgress', value)
}


//Components

hideSideNav = () => html`
      ${
  isHidingNavigation() ? html`<input @change=${setHidingNavigation} class="usa-checkbox__input" id="hiding-navigation" type="checkbox" name="hiding-navigation" value="true" checked/>` : html`
        <input @change=${setHidingNavigation} class="usa-checkbox__input" id="hiding-navigation" type="checkbox" name="hiding-navigation" value="false"/>`
  }
      <label class="usa-checkbox__label" for="hiding-navigation">Hide navigation</label>
`

hideProgress = () => html`
      ${
  isHidingProgress() ? html`<input @change=${setHidingProgress} class="usa-checkbox__input" id="hiding-progress" type="checkbox" name="hiding-progress" value="true" checked/>` : html`
        <input @change=${setHidingProgress} class="usa-checkbox__input" id="hiding-progress" type="checkbox" name="hiding-progress" value="false"/>`
  }
      <label class="usa-checkbox__label" for="hiding-progress">Hide progress</label>
`

module.exports = {
  hideSideNav,
  hideProgress
}
