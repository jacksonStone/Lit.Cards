
let { html } = require('lit')
let { onExactPage, onPage } = require('abstract/url')
let { navigateToLoginPage, logout } = require('logic/login')
let { navigateToSettingsPage } = require('logic/settings')
let { resendEmailVerification } = require('logic/login')
let shouldHideNavigation = () => {
  const user = window.lc.getData('user') || {};
  //TODO:: Swap true for on study page
  if (user.hideNavigation && window.location.href.indexOf('/me/study') !== -1) {
    return true;
  }
}
module.exports = (userInfo) => {
  if(shouldHideNavigation()) {
    return html`<div style="margin-top: 108px;"></div>`;
  }
  return html`
    <div class="grid-container">
            <div class="navbar-custom"  style="height: 110px">
             <div class="usa-logo" id="basic-logo" style="float:left; position: relative;">
                <em class="usa-logo__text"><a href="/" title="Home" aria-label="Home" style="font-size:35px">L<img src="/static-images/dot.svg" style="position: absolute; top: 4px; left: 19px;"></img>it.Cards</a><div style="font-size:12px">Get lit!<span style="font-size:8px">&nbsp About studying!</span></div></em>
            </div>  
            <div style="float:right; margin-top:40px;">
                ${getNavOptions(userInfo)}
            </div>
    
            </div>
            <div id="email-verification-bar" style="position: relative"><div style="position:absolute; width: 100%">${emailVerificationLink()}</div></div>

     </div>`
}

function waitingOnEmailVerification() {
  let user = window.lc.getData('user')
  if (!user || user.verifiedEmail) {
    return false
  }
  return true
}

function emailVerificationLink() {
  if(!onExactPage('me/settings') && !onExactPage('me')) {
    return html``;
  }
  if(justVerifiedEmail()) {
    setTimeout(()=> {
      window.lc.setData('justVerifiedEmail', false)
    }, 2000)
    return html`<div style="font-size: 12px; padding: 8px;
    text-align: center;
    background: #b5ee85;" id="email-verified"
    >Email verified!</div>`
  }
  if(window.lc.getData('resentEmailConfirmation')) {
    return html`<div class="background-bars" style="font-size: 12px; padding: 8px;
    text-align: center;"
    >Confirmation email resent.</div>`
  }
  if(waitingOnEmailVerification()) {
    return html`<div class="background-bars" style="font-size: 12px; padding: 8px;
    text-align: center;"
    >Please verify your email by clicking the confirmation link emailed to your address. <button class="usa-button usa-button--outline" style="margin-left: 10px; font-size: 12px; padding: 5px;" @click=${() => {
      resendEmailVerification()
      window.lc.setData('resentEmailConfirmation', true)
    }}>Resend confirmation email</button></div>`
  }
  return html``
}

function justVerifiedEmail () {
  return window.lc.getData('justVerifiedEmail')
}

function getNavOptions (userInfo) {
  if (userInfo) {
    return loggedInHeader(userInfo)
  } else if (!onPage('login') && !onPage('signup')) {
    return notLoggedInHeader()
  } else {
    return loginPageHeader()
  }
}
function loginPageHeader () {
}

function notLoggedInHeader () {
  return html`
             <button class="usa-button" id="login-button" @click=${navigateToLoginPage}>Login</button>
            `
}
function loggedInHeader (userInfo) {
  return html`
             <a href="#" class="usa-button usa-button--unstyled" id="settings-page-link" @click=${settings} style="margin-right: 10px">Account Settings</a>
             <a href="#" class="usa-button usa-button--outline" id="logout-link" @click=${logout}>Logout</a>
            `
}
function settings() {
  navigateToSettingsPage();
}
