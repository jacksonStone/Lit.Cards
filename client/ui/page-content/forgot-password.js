const { html } = require('lit')
const { grabFormData } = require('../../browser-abstractions/grab-form')
const { navigateToSignupPage } = require('../../business-logic/login')
const errorableInput = require('../shared-components/errorable-input')
const errorBanner = require('../shared-components/error-banner')

const { resetPassword } = require('../../business-logic/login')
const resetBtn = async (event) => {
  event.preventDefault()
  const values = grabFormData('#forgot-password')
  await resetPassword(values.email)
  window.lc.setData('requestSent', true)
}


module.exports = (data) => {
  const requestSent = window.lc.getData('requestSent')
  const { fields: ef } = data.errors

  return html`
    <div class="grid-container">
    <div class="grid-row">
        <div class="grid-col-4"></div>
        <div class="grid-col-4">
            ${(!requestSent) ? html`<form class="usa-form" id="forgot-password">
              <fieldset class="usa-fieldset">
                <legend class="usa-legend">Forgot Password</legend>
                ${errorableInput(ef.userId, 'Valid email is required', 'email', 'Email')}
              </fieldset>
              <button @click=${resetBtn} class="usa-button">Email password reset</button>
            </form>` : html`<h4>Request sent. Follow the link emailed to that address.</h4>`}
        </div>
        <div class="grid-col-4"></div>
    </div>
    </div> 
`
}
