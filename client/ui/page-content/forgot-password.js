import { html } from 'lit';
import { grabFormData } from '../../browser-abstractions/grab-form';
import { navigateToSignupPage } from '../../business-logic/login';
import errorableInput from '../shared-components/errorable-input';
import errorBanner from '../shared-components/error-banner';
import { resetPassword } from '../../business-logic/login';
let resetBtn = async (event) => {
  event.preventDefault()
  let values = grabFormData('#forgot-password')
  await resetPassword(values.email)
  window.lc.setData('requestSent', true)
}


export default (data) => {
  let requestSent = window.lc.getData('requestSent')
  let { fields: ef } = data.errors

  return html`
    <div class="grid-container">
    <div class="grid-row">
        <div class="grid-col-4"></div>
        <div class="grid-col-4">
            ${(!requestSent) ? html`<form class="usa-form" id="forgot-password">
              <fieldset class="usa-fieldset">
                <legend class="usa-legend">Forgot Password</legend>
                ${errorableInput(ef.userEmail, 'Valid email is required', 'email', 'Email')}
              </fieldset>
              <button @click=${resetBtn} class="usa-button">Email password reset</button>
            </form>` : html`<h4>Request sent. Follow the link emailed to that address.</h4>`}
        </div>
        <div class="grid-col-4"></div>
    </div>
    </div> 
`
};
