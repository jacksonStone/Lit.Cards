const { html } = require('lit')
const { grabFormData } = require('../../browser-abstractions/grab-form')
const { hash } = require('abstract/url')
const { navigateToSignupPage } = require('../../business-logic/login')
const errorableInput = require('../shared-components/errorable-input')
const errorBanner = require('../shared-components/error-banner')
const { changePassword } = require('../../business-logic/login')
const darkmodeCheckbox = require('component/darkmode-checkbox')

const changePasswordBtn = (event) => {
  event.preventDefault()
  const values = grabFormData('#password-change')
  changePassword(values.currentPassword, values.password, values.passwordRepeat)
}

function passwordField(error, label='Password', name='password') {
  return html`
      <label class="usa-label" for="password">${label}</label>
      <input class="usa-input" id=${name} name=${name} type="password" required aria-required="true">`
}

module.exports = (data) => {
  // add other screens to settings
  //
  const h = hash()
  return html`
    <div class="grid-container">
        <aside style="display: block;
            float: left;
            margin-bottom: 3rem;
            margin-top: 2rem;
            padding-right: 0;
            padding-left: 2rem;
            width: 15rem;
        ">
  <ul class="usa-sidenav" style="font-size: .9375rem;
    line-height: 1.35;
    border-radius: .25rem;
    padding: 0;">
    <li class="usa-sidenav__item">
    <a href="#" class="${h === '' ? 'usa-current' : ''}">Change Password</a>
  </li><li class="usa-sidenav__item">
    <a href="#subscription" class="${h === 'subscription' ? 'usa-current' : ''}">Subscription</a>
  </li>
  </ul>
    </aside>
    <div class="grid-container">
    <div class="grid-row">
        <div class="grid-col-1"></div>
        <div class="grid-col-10">
           ${getContents(data)}
        </div>
        <div class="grid-col-1"></div>
    </div>
    </div>
    </div>
    
    ${darkmodeCheckbox()}
`
}

function getContents(data) {
  const currentHash = hash()
  if (!currentHash) {
    return changePasswordInterface(data)
  }
  if(currentHash === 'subscription') {
    return subscriptionSettingsInterface(data)
  }
}

function changePasswordInterface(data){
  const { fields: ef, abstract: ea } = data.errors
  const updatedPassword = window.lc.getData('updatedPassword')
  return html` <form class="usa-form" id="password-change">
              <fieldset class="usa-fieldset">
                ${updatedPassword ? html`Successfully updated password` : html``}
                ${ea.mismatchPasswords && errorBanner('Bad Passwords', 'Passwords did not match')}
                ${ea.wrongPassword && errorBanner('Incorrect password', 'Current password was incorrect')}
                ${ea.samePassword && errorBanner('Same Password', 'Must use a new password')}
                <legend class="usa-legend">Change password</legend>
                ${errorableInput(ef.currentPassword, 'Password is required', 'currentPassword', 'Current Password', 'password')}
                ${errorableInput(ef.password, 'Password is required', 'password', 'Password', 'password')}
                ${errorableInput(ef.repeatPassword, 'Must repeat password', 'passwordRepeat', 'Repeat Password', 'password')}
              </fieldset>
              <button @click=${changePasswordBtn} class="usa-button continue-studying">Update Password</button>
            </form>`;
}
function subscriptionSettingsInterface(data) {
  return html`<h1>TODO</h1>`
}
