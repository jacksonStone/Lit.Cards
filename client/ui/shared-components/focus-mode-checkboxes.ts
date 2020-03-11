import { html } from 'lit';
import { getValueFromCheckbox } from 'abstract/events';
let isHidingProgress= () => {
  let user = window.lc.getData('user')
  return user && user.hideProgress
}
let isHidingNavigation= () => {
  let user = window.lc.getData('user')
  return user && user.hideNavigation
}
let setHidingNavigation = (e: Event) => {
  let value = getValueFromCheckbox(e)
  window.lc.setPersistent('user.hideNavigation', value)
}
let setHidingProgress = (e: Event) => {
  let value = getValueFromCheckbox(e)
  window.lc.setPersistent('user.hideProgress', value)
}


//Components

const hideSideNav = () => html`
      ${
  isHidingNavigation() ? html`<input @change=${setHidingNavigation} class="usa-checkbox__input" id="hiding-navigation" type="checkbox" name="hiding-navigation" value="true" checked/>` : html`
        <input @change=${setHidingNavigation} class="usa-checkbox__input" id="hiding-navigation" type="checkbox" name="hiding-navigation" value="false"/>`
  }
      <label class="usa-checkbox__label" for="hiding-navigation">Hide navigation</label>
`

const hideProgress = () => html`
      ${
  isHidingProgress() ? html`<input @change=${setHidingProgress} class="usa-checkbox__input" id="hiding-progress" type="checkbox" name="hiding-progress" value="true" checked/>` : html`
        <input @change=${setHidingProgress} class="usa-checkbox__input" id="hiding-progress" type="checkbox" name="hiding-progress" value="false"/>`
  }
      <label class="usa-checkbox__label" for="hiding-progress">Hide progress</label>
`

export {
  hideSideNav,
  hideProgress
};
