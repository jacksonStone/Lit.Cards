const { html } = require('lit')
const { grabFormData } = require('../../browser-abstractions/grab-form')
const { navigateToSignupPage } = require('../../business-logic/login')
const errorableInput = require('../shared-components/errorable-input')
const errorBanner = require('../shared-components/error-banner')
const { login } = require('../../business-logic/login')
const loginBtn = (event) => {
  event.preventDefault()
  const values = grabFormData('#login')
  login(values.email, values.password)
}
const signupBtn = (event) => {
  event.preventDefault()
  navigateToSignupPage()
}

function passwordField(error) {

  return html`
      <label class="usa-label" for="password">Password</label>
      <input class="usa-input" id="password" name="password" type="password" required aria-required="true">`
}

module.exports = (data) => {
  // TODO:: Add weird error message that
  // Changes based on how many failed logins
  const { fields: ef, abstract: ea } = data.errors
  return html`
    <div class="grid-container">
    <div class="grid-row">
        <div class="grid-col-4"></div>
        <div class="grid-col-4">
            <form class="usa-form" id="login">
              <fieldset class="usa-fieldset">
                ${ea.loginFailed && errorBanner('Bad login', 'Perhaps it is your next guess!')}
                <legend class="usa-legend">Login</legend>
                ${errorableInput(ef.userId, 'Valid email is required', 'email', 'Email')}
                ${passwordField(ef.password)}
              </fieldset>
              <button @click=${loginBtn} class="usa-button">Login</button>
            </form>
        </div>
        <div class="grid-col-4"></div>
    </div>
    </div> 
`
}
