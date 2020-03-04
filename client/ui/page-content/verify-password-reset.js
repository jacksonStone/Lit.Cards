import { html } from 'lit';
import { grabFormData } from '../../browser-abstractions/grab-form';
import { verifyPasswordReset } from '../../business-logic/login';
import errorableInput from '../shared-components/errorable-input';
import errorBanner from '../shared-components/error-banner';
function confrimNewBtn (event) {
  event.preventDefault()
  let verifyData = grabFormData('#verify')
  return verifyPasswordReset(verifyData.password, verifyData['password-repeat'])
}

export default (data) => {
  let { fields: ef, abstract: ea } = data.errors
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
