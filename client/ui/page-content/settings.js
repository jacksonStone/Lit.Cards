import { html } from 'lit';
import { grabFormData } from '../../browser-abstractions/grab-form';
import { hash } from 'abstract/url';
import month_catalog from '../../../shared/month-cataloge.js';
import { each } from '../../utils';
import errorableInput from '../shared-components/errorable-input';
import { createStripeCheckoutSession } from './stripe';
import errorBanner from '../shared-components/error-banner';
import { changePassword } from '../../business-logic/login';
import darkmodeCheckbox from 'component/darkmode-checkbox';
import { $ } from 'abstract/$';
import checkboxHolder from 'component/checkbox-holder';
let changePasswordBtn = (event) => {
  event.preventDefault()
  let values = grabFormData('#password-change')
  changePassword(values.currentPassword, values.password, values.passwordRepeat)
}

export default (data) => {
  // add other screens to settings
  let user = window.lc.getData('user');
  let h = hash()
  return html`
    <div class="grid-container">
    <div class="above-750">
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
          <a href="#plan-details" class="${h === 'plan' ? 'usa-current' : ''}">Purchase more time</a>
        </li>
        </ul>
      </aside>
    </div>
    <div class="grid-container">
    <div class="grid-row">
        <div class="grid-col-1"></div>
        <div class="grid-col-10">
           ${(user && !user.verifiedEmail) ? html`<h3 style="margin-top:20px;">Must first confirm email before you can make edits to your account.</h3>` : getContents(data)}
        </div>
        <div class="grid-col-1"></div>
    </div>
    <div class="below-750">
      <aside style="margin: 40px">
        <ul class="usa-sidenav" style="font-size: .9375rem;
          line-height: 1.35;
          border-radius: .25rem;
          padding: 0;">
          <li class="usa-sidenav__item">
          <a href="#" class="${h === '' ? 'usa-current' : ''}">Change Password</a>
        </li><li class="usa-sidenav__item">
          <a href="#plan-details" class="${h === 'plan-details' ? 'usa-current' : ''}">Purchase more time</a>
        </li>
        </ul>
      </aside>
    </div>
    </div>
    </div>
    
    ${checkboxHolder([darkmodeCheckbox()])}
`
};

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
  if (expiration < now) {
    return daysRemaining;
  }
  let millisecondsRemaining = expiration - now;
  daysRemaining = Math.ceil(millisecondsRemaining/(1000*60*60*24));
  return daysRemaining;
}

function savingsBox(savings) {
  return html`<div style="
    position: absolute; 
    color: #005ea2; 
    right: -60px; 
    top: 0; 
    font-size: 1.06471rem;
    padding: 12px;
    ">save<br>${savings}%</div>`
}
function buyTimeInterface() {
    const user = window.lc.getData('user')
    if(!user) {
      return html`<h3 style="margin-top: 20px;">Loading...</h3>`;
    }
    const buttons_for_purchasing = [];
    each(month_catalog, (entry, months) => {
      buttons_for_purchasing.push(
        html`<div style="margin-top: 20px;">
        <button class="usa-button continue-studying" style="min-width: 250px; line-height: 20px; position: relative;" @click=${() => createStripeCheckoutSession(months|0)}>
          ${months} ${(months|0) == 1 ? 'Month' : 'Months'}<br>
          $${entry.price/100} ${(months|0) === 1 ? html`` : savingsBox(entry.savings)} </button>
          <div>`);
    });
    const daysRemaining = getRemainingDays();
    const daysOrDay = daysRemaining === 1 ? 'day' : 'days';
    let header;
    if(daysRemaining === 0 && user.trialUser) {
      header = html`<h2>Your trial has expired.</h2>`
    }  else if(user.trialUser) {
      header = html`<h2>Your free trial has ${daysRemaining + ' ' + daysOrDay} remaining.</h2>`
    }
    else if(daysRemaining === 0) {
      header = html`<h2>Your account has run out of access time</h2>`
    }
    else {
      header = html`<h2>${daysRemaining + ' ' + daysOrDay} of Lit.Cards access remaining.</h2>`
    }
    return html`
      ${header}
      <div class="fancy-line" style="margin-top:20px"></div>

      <h1>Purchase access time</h1>
      <h2>Features</h2>
      <ul style="margin-bottom: 40px; font-size: 18px; line-height: 25px">
            <li><b>Create, study, and share decks of online note cards</b></li>
            <li><b>Unlimited cards with any plan</b></li>
            <li><b>Decks support thousands of cards - no problem</b></li>
            <li><b>Faster load times than online alternatives</b></li>
            <li><b>Only pay for the time you need - no automatic renewals</b></li>
            <li><b>Hotkeys for almost everything - create cards without a mouse</b></li>
            <li><b>Customize the study interface</b></li>
            <li><b>Dark mode for those late study sessions</b></li>
            <li><b>Quickly edit a card while studying</b></li>
            <li><b>Images on both sides of the card</b></li>
      </ul>
      ${buttons_for_purchasing}
      <div style="margin-bottom: 40px"></div>
    `
}
