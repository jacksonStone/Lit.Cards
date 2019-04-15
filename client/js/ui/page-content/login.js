const { html } = require('lit-html/lit-html')
const makeClickHandler = require('../click-handler')
const { grabFormData } = require('abstract/grabForm')
const { navigateToSignupPage } = require('logic/login')

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
module.exports = () => html`
    <div class="grid-container">
    <div class="grid-row">
        <div class="grid-col-4"></div>
        <div class="grid-col-4">
            <form class="usa-form" id="login">
              <fieldset class="usa-fieldset">
                <legend class="usa-legend">Login</legend>
                <label class="usa-label" for="email">Email</label>
                <input class="usa-input" id="email" name="email" type="text" required aria-required="true">
                <label class="usa-label" for="password">Password</label>
                <input class="usa-input" id="password" name="password" type="password" required aria-required="true">
              </fieldset>
              <button onclick="sn.clickHandler('login')(event)" class="usa-button">Login</button>
              <button onclick="sn.clickHandler('signup')(event)" class="usa-button usa-button--outline">Signup</button>
            </form>
        </div>
        <div class="grid-col-4"></div>
    </div>
    </div> 
`
