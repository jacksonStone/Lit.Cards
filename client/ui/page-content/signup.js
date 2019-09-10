let { html } = require('lit')
let { grabFormData } = require('../../browser-abstractions/grab-form')
let { signup } = require('../../business-logic/login')
let errorableInput = require('../shared-components/errorable-input')
let errorBanner = require('../shared-components/error-banner')
function signupBtn (event) {
  event.preventDefault()
  let signupData = grabFormData('#signup')
  return signup(signupData.email, signupData.password, signupData['password-repeat'])
}
module.exports = (data) => {
  let { fields: ef, abstract: ea } = data.errors
  return html`
    <div class="grid-container">
    <div class="grid-row">
        <div class="grid-col-4"></div>
        <div class="grid-col-4">
             <form class="usa-form" id="signup">
              <fieldset class="usa-fieldset">
                <legend class="usa-legend">Sign-up</legend>
                ${ea.mismatchPasswords && errorBanner('Bad Passwords', 'Passwords did not match')}
                ${ea.usernameTaken && errorBanner('Bad  Email', 'Email already taken')}
                ${ea.badEmail && errorBanner('Bad  Email', 'Email is formatted incorrectly')}
                ${errorableInput(ef.userId, 'Valid email is required', 'email', 'Email')}
                ${errorableInput(ef.password, 'Password is required', 'password', 'Password', 'password')}
                ${errorableInput(ef.repeatPassword, 'Must repeat password', 'password-repeat', 'Repeat Password', 'password')}
              </fieldset>
              <button @click=${signupBtn} id="signup-button" class="usa-button">Signup</button>
            </form>
        </div>
        <div class="grid-col-4"></div>
    </div>
    </div> 
`
}
