import { html } from 'lit';
import { grabFormData } from '../../browser-abstractions/grab-form';
import { signup } from '../../business-logic/login';
import errorableInput from '../shared-components/errorable-input';
import errorBanner from '../shared-components/error-banner';
function signupBtn (event) {
  event.preventDefault()
  let signupData = grabFormData('#signup')
  return signup(signupData.email, signupData.password, signupData['password-repeat'], signupData['display-name'])
}

export default (data) => {
  let { fields: ef, abstract: ea } = data.errors
  return html`
    <div class="grid-container">
    <div class="grid-row">
        <div class="tablet:grid-col-4 mobile-lg:grid-col-2"></div>
        <div class="tablet:grid-col-4 mobile-lg:grid-col-8">
             <form class="usa-form" id="signup">
              <fieldset class="usa-fieldset">
                <legend class="usa-legend">Sign-up</legend>
                ${ea.mismatchPasswords && errorBanner('Bad Passwords', 'Passwords did not match')}
                ${ea.usernameTaken && errorBanner('Bad  Email', 'Email already taken')}
                ${ea.badEmail && errorBanner('Bad  Email', 'Email is formatted incorrectly')}
                ${errorableInput(ef.userEmail, 'Valid email is required', 'email', 'Email')}
                ${errorableInput(ef.displayName, 'Display name required', 'display-name', 'Display Name', 'text', 30)}
                ${errorableInput(ef.password, 'Password is required', 'password', 'Password', 'password')}
                ${errorableInput(ef.repeatPassword, 'Must repeat password', 'password-repeat', 'Repeat Password', 'password')}
              </fieldset>
              <button @click=${signupBtn} id="signup-button" class="usa-button">Signup</button>
            </form>
        </div>
        <div class="tablet:grid-col-4 mobile-lg:grid-col-2"></div>
    </div>
    </div> 
`
};
