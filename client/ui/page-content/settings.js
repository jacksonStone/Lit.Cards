let { html } = require('lit')
let { grabFormData } = require('../../browser-abstractions/grab-form')
let { hash } = require('abstract/url')
let { navigateToSignupPage } = require('../../business-logic/login')
let errorableInput = require('../shared-components/errorable-input')
let {runNextRender} = require('abstract/rendering-meta')
let { stripeRenderer, createPaymentMethod } = require('./stripe')
let errorBanner = require('../shared-components/error-banner')
let { changePassword } = require('../../business-logic/login')
let darkmodeCheckbox = require('component/darkmode-checkbox')
let { waitForState } = require('abstract/rendering-meta')
let { $ } = require('abstract/$');
let checkboxHolder = require('component/checkbox-holder')
let changePasswordBtn = (event) => {
  event.preventDefault()
  let values = grabFormData('#password-change')
  changePassword(values.currentPassword, values.password, values.passwordRepeat)
}

function passwordField(error, label='Password', name='password') {
  return html`
      <label class="usa-label" for="password">${label}</label>
      <input class="usa-input" id=${name} name=${name} type="password" required aria-required="true">`
}

module.exports = (data) => {
  // add other screens to settings
  //
  let h = hash()
  return html`
    <div class="grid-container">
        <aside style="display: block;
            float: left;
            margin-bottom: 3rem;
            margin-top: 2rem;
            padding-right: 0;
            padding-left: 2rem;
            width: 15rem;
        ">
  <ul class="usa-sidenav" style="font-size: .9375rem;
    line-height: 1.35;
    border-radius: .25rem;
    padding: 0;">
    <li class="usa-sidenav__item">
    <a href="#" class="${h === '' ? 'usa-current' : ''}">Change Password</a>
  </li><li class="usa-sidenav__item">
    <a href="#subscription" class="${h === 'subscription' ? 'usa-current' : ''}">Subscription</a>
  </li>
  </ul>
    </aside>
    <div class="grid-container">
    <div class="grid-row">
        <div class="grid-col-1"></div>
        <div class="grid-col-10">
           ${getContents(data)}
        </div>
        <div class="grid-col-1"></div>
    </div>
    </div>
    </div>
    
    ${checkboxHolder([darkmodeCheckbox()])}
`
}

function getContents(data) {
  let currentHash = hash()
  if (!currentHash) {
    return changePasswordInterface(data)
  }
  if(currentHash === 'subscription') {
    return subscriptionSettingsInterface(data)
  }
}

function changePasswordInterface(data){
  let { fields: ef, abstract: ea } = data.errors
  let updatedPassword = window.lc.getData('updatedPassword')
  return html` <form class="usa-form" id="password-change">
              <fieldset class="usa-fieldset">
                ${updatedPassword ? html`Successfully updated password` : html``}
                ${ea.mismatchPasswords && errorBanner('Bad Passwords', 'Passwords did not match')}
                ${ea.wrongPassword && errorBanner('Incorrect password', 'Current password was incorrect')}
                ${ea.samePassword && errorBanner('Same Password', 'Must use a new password')}
                <legend class="usa-legend">Change password</legend>
                ${errorableInput(ef.currentPassword, 'Password is required', 'currentPassword', 'Current password', 'password')}
                ${errorableInput(ef.password, 'Password is required', 'password', 'New password', 'password')}
                ${errorableInput(ef.repeatPassword, 'Must repeat password', 'passwordRepeat', 'Repeat new password', 'password')}
              </fieldset>
              <button @click=${changePasswordBtn} class="usa-button continue-studying">Update Password</button>
            </form>`;
}

function updateUser(paymentMethodId) {
  window.lc.setPersistent('user.stripePaymentMethodId', paymentMethodId)
}

function subscriptionSettingsInterface(data) {

  if(!document.getElementById('stripe-stuff')) {
    runNextRender(() => waitForState('user', () => {
      const subscribed = window.lc.getData('user.activeSubscription');
      stripeRenderer("#stripe-stuff", subscribed)
    }));
  }
  return html`
    <h1>Subscription Details</h1>
    ${getStripeStuffElement()}
    <button @click=${()=>createPaymentMethod(updateUser)}>Foo</button>
  `
}
function getStripeStuffElement() {
  return html`<div><div id="stripe-stuff"></div><div>`;
}
