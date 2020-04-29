import { html } from 'lit';
import { getValueFromCheckbox } from 'abstract/events';
import { recordAndSetDarkMode } from 'abstract/darkmode';

let isDarkMode = () => {
  let user = window.lc.getData('user')
  let dm = user && user.darkMode;
  return dm;
}
let setDarkMode = (e: Event) => {
  let value = getValueFromCheckbox(e)
  recordAndSetDarkMode(value)
  window.lc.setPersistent('user.darkMode', value, false)
}

export default () => {
return  html`
      ${
        isDarkMode() ? html`<input @change=${setDarkMode} class="usa-checkbox__input" id="darkmode" type="checkbox" name="darkmode" value="true" checked/>` : html`
        <input @change=${setDarkMode} class="usa-checkbox__input" id="darkmode" type="checkbox" name="darkmode" value="false"/>`
      }
      <label class="usa-checkbox__label" for="darkmode">Dark mode</label>
  `
};
