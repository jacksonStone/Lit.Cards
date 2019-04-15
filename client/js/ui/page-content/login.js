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
module.exports = (data) => {
  const { fields: ef, abstract: ea } = data.errors
  return html`
    <div class="grid-container">
    <div class="grid-row">
        <div class="grid-col-4"></div>
        <div class="grid-col-4">
            <form class="usa-form" id="login">
              <fieldset class="usa-fieldset">
              ${ea.loginFailed && html`
              <div class="usa-alert usa-alert--error" role="alert">
  <div class="usa-alert__body">
    <h3 class="usa-alert__heading">Bad login</h3>
    <p class="usa-alert__text">Either your email is bad, your password, or both :)</p>
  </div>
</div>
              `}
              
                <legend class="usa-legend">Login</legend>
                ${!ef.userId ? html`
      <label class="usa-label" for="email">Email</label>
      <input class="usa-input" id="email" name="email" type="text" required aria-required="true">`
    : html`
      <div class="usa-form-group usa-form-group--error">
        <label class="usa-label usa-label--error" for="input-error">Email</label>
        <span class="usa-error-message" id="input-error-message" role="alert">Valid email is required</span>
        <input class="usa-input usa-input--error" id="email" name="email" type="text" required aria-required="true">
      </div>
`
}

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
}
