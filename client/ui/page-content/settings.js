let { html } = require('lit')
let { grabFormData } = require('../../browser-abstractions/grab-form')
let { hash } = require('abstract/url')
let { navigateToSignupPage } = require('../../business-logic/login')
let errorableInput = require('../shared-components/errorable-input')
let errorBanner = require('../shared-components/error-banner')
let { changePassword } = require('../../business-logic/login')
let darkmodeCheckbox = require('component/darkmode-checkbox')
let { runNextRender } = require('abstract/rendering-meta')
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
                ${errorableInput(ef.currentPassword, 'Password is required', 'currentPassword', 'Current Password', 'password')}
                ${errorableInput(ef.password, 'Password is required', 'password', 'Password', 'password')}
                ${errorableInput(ef.repeatPassword, 'Must repeat password', 'passwordRepeat', 'Repeat Password', 'password')}
              </fieldset>
              <button @click=${changePasswordBtn} class="usa-button continue-studying">Update Password</button>
            </form>`;
}
let stripe;
async function stripRenderer() {
  if (stripe) return true;
  while (!window.Stripe) {
    await new Promise(resolve => setTimeout(resolve, 20));
  }
  console.log(STRIPE_PUBLIC_KEY)
  stripe = Stripe(STRIPE_PUBLIC_KEY);
  let elements = stripe.elements();
  let style = {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  };

  let card = elements.create('card', {style: style});

  card.mount('#stripe-stuff');
}

function subscriptionSettingsInterface(data) {
  runNextRender(stripRenderer);
  return html`
    <h1>Subscription Details</h1>
<div id="stripe-stuff"></div>`
}
