let { html } = require('lit')
let { grabFormData } = require('../../browser-abstractions/grab-form')
let { hash } = require('abstract/url')
let  month_catalog = require('../../../shared/month-cataloge.js')
let { each } = require('../../utils');
let errorableInput = require('../shared-components/errorable-input')
let {runNextRender} = require('abstract/rendering-meta')
let { createStripeCheckoutSession } = require('./stripe')
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
    <a href="#plan-details" class="${h === 'plan' ? 'usa-current' : ''}">Plan Details</a>
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
  if(currentHash === 'plan-details') {
    return buyTimeInterface(data)
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
function getRemainingDays() {
  let daysRemaining = 0;
  let user = window.lc.getData('user');
  let expiration = user.planExpiration;
  let now = Date.now();
  debugger;
  if (expiration < now) {
    return daysRemaining;
  }
  let millisecondsRemaining = expiration - now;
  daysRemaining = Math.ceil(millisecondsRemaining/(1000*60*60*24));
  return daysRemaining;
}
function buyTimeInterface() {
    if(!window.lc.getData('user')) {
      return html`Loading...`;
    } 
    const buttons_for_purchasing = [];
    each(month_catalog, (entry, months) => {
      buttons_for_purchasing.push(
        html`<div style="margin-top: 20px;"><button class="usa-button continue-studying" style="min-width: 250px;" @click=${() => createStripeCheckoutSession(months|0)}>
          ${months} ${(months|0) == 1 ? 'Month' : 'Months'}<br><br>$${entry.price/100}</button><div>`);
    });
    const daysRemaining = getRemainingDays();
    return html`
      <h2>${daysRemaining} ${daysRemaining == 1 ? 'Day' : 'Days'} of Lit.Cards remaining.</h3>
      <p>*If you run out of time, we will keep your cards around for a year - though you will not be able to study them again unless you renew.</p>
      <div class="fancy-line" style="margin-top:40px"></div>

      <h1>Purchase additional time</h1>
      <h2>Features</h2>
      <ul style="margin-bottom: 40px;">
      <li style="margin-bottom: 10px;">Unlimited Cards with images <span style="font-size: 9px">(Just be reasonable, please!)<span></li>
      <li style="margin-bottom: 10px;">Unrivled speed - even with decks containing thousands of cards</li>
      <li style="margin-bottom: 10px;">Share decks with fellow students, and vice versa</li>
      <li style="margin-bottom: 10px;">Hotkeys for everything to help you zip along</li>
      <li style="margin-bottom: 10px;">Dark mode that was about as dark as I could make it <br><span style="font-size: 10px">(You can demo it with the check box in the bottom right)</span></li>
      <li style="margin-bottom: 10px;">Customizable study interface</li>
      <li style="margin-bottom: 10px;">No automatic renewals - just pay for how much time you'd like</li>
      <li style="margin-bottom: 10px;">No ads! They suck!</li>
      </ul>
      ${buttons_for_purchasing}
      <div style="margin-bottom: 40px"></div>
    `
}
