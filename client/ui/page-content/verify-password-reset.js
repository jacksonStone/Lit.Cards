const { html } = require('lit')
const { grabFormData } = require('../../browser-abstractions/grab-form')
const { verifyPasswordReset } = require('../../business-logic/login')
const errorableInput = require('../shared-components/errorable-input')
const errorBanner = require('../shared-components/error-banner')
function confrimNewBtn (event) {
  event.preventDefault()
  const verifyData = grabFormData('#verify')
  return verifyPasswordReset(verifyData.password, verifyData['password-repeat'])
}
module.exports = (data) => {
  const { fields: ef, abstract: ea } = data.errors
  return html`
    <div class="grid-container">
    <div class="grid-row">
        <div class="grid-col-4"></div>
        <div class="grid-col-4">
             <form class="usa-form" id="verify">
              <fieldset class="usa-fieldset">
                <legend class="usa-legend">Sign-up</legend>
                ${ea.mismatchPasswords && errorBanner('Bad Passwords', 'Passwords did not match')}
                ${errorableInput(ef.password, 'Password is required', 'password', 'New Password', 'password')}
                ${errorableInput(ef.repeatPassword, 'Must repeat password', 'password-repeat', 'Repeat New Password', 'password')}
              </fieldset>
              <button @click=${confrimNewBtn} class="usa-button">Confirm new password</button>
            </form>
        </div>
        <div class="grid-col-4"></div>
    </div>
    </div> 
`
}
