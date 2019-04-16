const { html } = require('lit-html/lit-html')
const makeClickHandler = require('../click-handler')
const { grabFormData } = require('abstract/grabForm')
const { navigateToSignupPage } = require('logic/login')
const errorableInput = require('component/errorable-input')
const errorBanner = require('component/error-banner')

const { login } = require('logic/login')
makeClickHandler('login', (event) => {
  event.preventDefault()
  const values = grabFormData('#login')
  login(values.email, values.password)
})
makeClickHandler('signup', (event) => {
  event.preventDefault()
  navigateToSignupPage()
})
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
              <button onclick="sn.clickHandler('login')(event)" class="usa-button">Login</button>
              <button onclick="sn.clickHandler('signup')(event)" class="usa-button usa-button--outline">Signup</button>
            </form>
        </div>
        <div class="grid-col-4"></div>
    </div>
    </div> 
`
}
