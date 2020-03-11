import { html } from 'lit';
import { grabFormData } from '../../browser-abstractions/grab-form';
import { verifyPasswordReset } from '../../business-logic/login';
import errorableInput from '../shared-components/errorable-input';
import errorBanner from '../shared-components/error-banner';
function confrimNewBtn (event: Event) {
  event.preventDefault()
  let verifyData = grabFormData('#verify')
  return verifyPasswordReset(<string>verifyData.password, <string>verifyData['password-repeat'])
}

export default () => {
  let errors = window.lc.getData('errors');
  let { fields: ef, abstract: ea } = errors
  return html`
    <div class="grid-container">
    <div class="grid-row">
        <div class="grid-col-4"></div>
        <div class="grid-col-4">
             <form class="usa-form" id="verify">
              <fieldset class="usa-fieldset">
                <legend class="usa-legend">Sign-up</legend>
                ${ea.mismatchPasswords && errorBanner('Bad Passwords', 'Passwords did not match')}
                ${ea.badEmail && errorBanner('Bad  Email', 'Email is formatted incorrectly')}
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
};
