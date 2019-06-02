const { html } = require('lit')
const { grabFormData } = require('abstract/grabForm')
const { navigateToSignupPage } = require('logic/login')
const errorableInput = require('component/errorable-input')
const errorBanner = require('component/error-banner')

const { login } = require('logic/login')
const loginBtn = (event) => {
  event.preventDefault()
  const values = grabFormData('#login')
  login(values.email, values.password)
}
const signupBtn = (event) => {
  event.preventDefault()
  navigateToSignupPage()
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
                ${errorableInput(ef.password, 'Password is required', 'password', 'Password', 'password')}
              </fieldset>
              <button @click=${loginBtn} class="usa-button">Login</button>
              <button @click=${signupBtn} class="usa-button usa-button--outline">Signup</button>
            </form>
        </div>
        <div class="grid-col-4"></div>
    </div>
    </div> 
`
}
