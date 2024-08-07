import { html } from 'lit';
import { grabFormData } from '../../browser-abstractions/grab-form';
import { navigateToSignupPage } from '../../business-logic/login';
import errorableInput from '../shared-components/errorable-input';
import errorBanner from '../shared-components/error-banner';
import { login } from '../../business-logic/login';
let loginBtn = (event: Event) => {
  event.preventDefault()
  let values = grabFormData('#login')
  login(<string>values.email, <string>values.password)
}
let signupBtn = (event: Event) => {
  event.preventDefault()
  navigateToSignupPage()
}

function passwordField(error: boolean) {
  if (error) {
    return html`
      <div class="usa-form-group usa-form-group--error">
        <label class="usa-label usa-label--error" for="password">Password <a 
        style="
        position: absolute;
        right: 0;
        top: 25px;
        font-weight:normal"
        href="/site/forgot-password"
        >Forgot password?</a></label>
        <span class="usa-error-message" id="input-error-message" role="alert">Password is required</span>
        <input class="usa-input usa-input--error" id="password" name="password" type="password" required aria-required="true">
      </div>`
  }
  return html`
      <label class="usa-label" for="password" style="position: relative;">Password <a 
        style="
        position: absolute;
        right: 0;"
        href="/site/forgot-password">
      Forgot password?</a></label>
      <input class="usa-input" id="password" name="password" type="password" required aria-required="true">`
}

export default () => {
  // TODO:: Add weird error message that
  // Changes based on how many failed logins
  let errors = window.lc.getData('errors');
  let { fields: ef, abstract: ea } = errors
  return html`
    <div class="grid-container">
    <div class="grid-row">
        <div class="tablet:grid-col-4 mobile-lg:grid-col-2"></div>
        <div class="tablet:grid-col-4 mobile-lg:grid-col-8">
            <form class="usa-form" id="login">
              <fieldset class="usa-fieldset">
                ${ea.loginFailed && errorBanner('Bad login', 'Perhaps it is your next guess!')}
                <legend class="usa-legend">Login</legend>
                ${errorableInput(ef.userEmail, 'Valid email is required', 'email', 'Email')}
                ${passwordField(ef.password)}
              </fieldset>
              <button @click=${loginBtn} id="login-button" class="usa-button">Login</button>
              <button @click=${signupBtn} id="signup-button" class="usa-button usa-button--outline">Signup</button>
            </form>
        </div>
        <div class="tablet:grid-col-4 mobile-lg:grid-col-2"></div>
    </div>
    </div> 
`
};
