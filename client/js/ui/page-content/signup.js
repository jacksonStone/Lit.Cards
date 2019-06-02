const { html } = require('lit')
const { grabFormData } = require('abstract/grabForm')
const { signup } = require('logic/login')
const errorableInput = require('component/errorable-input')
const errorBanner = require('component/error-banner')
function signupBtn (event) {
  event.preventDefault()
  const signupData = grabFormData('#signup')
  return signup(signupData.email, signupData.password, signupData['password-repeat'])
}
module.exports = (data) => {
  const { fields: ef, abstract: ea } = data.errors
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
                ${errorableInput(ef.userId, 'Valid email is required', 'email', 'Email')}
                ${errorableInput(ef.password, 'Password is required', 'password', 'Password', 'password')}
                ${errorableInput(ef.repeatPassword, 'Must repeat password', 'password-repeat', 'Repeat Password', 'password')}
              </fieldset>
              <button @click=${signupBtn} class="usa-button">Signup</button>
            </form>
        </div>
        <div class="grid-col-4"></div>
    </div>
    </div> 
`
}
