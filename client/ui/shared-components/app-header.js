
const { html } = require('lit')
const { onPage } = require('abstract/url')
const { navigateToLoginPage, logout } = require('logic/login')
const { navigateToSettingsPage } = require('logic/settings')
const { resendEmailVerification } = require('logic/login')

module.exports = (userInfo) => html`
    <a class="usa-skipnav" href="#main-content">Skip to main content</a>
    <header class="usa-header usa-header--extended" role="banner">
    <div class="usa-nav-container">
        <div class="usa-navbar">
            <div class="usa-logo" id="basic-logo">
                <em class="usa-logo__text"><a href="/" title="Home" aria-label="Home">Lit.Cards</a><div style="font-size:12px">Get lit!<span style="font-size:8px">&nbsp About studying!</span></div></em>
            </div>
            <button class="usa-menu-btn">Menu</button>
        </div>      
       
        <nav role="navigation" class="usa-nav">
         <button class="usa-nav__close">Close</button>

        <div class="usa-nav__inner">
            <div class="usa-nav__secondary" style="bottom: 1.5rem; right: 1rem; text-align: right">
             ${getNavOptions(userInfo)}
            </div>
        </div>
        </nav>
        <div style="position: relative"><div style="position:absolute; width: 100%">${emailVerificationLink()}</div></div>
    </div>
</header>`

function waitingOnEmailVerification() {
  const user = window.lc.getData('user')
  if (!user || user.verifiedEmail) {
    return false
  }
  return true
}

function emailVerificationLink() {
  if(justVerifiedEmail()) {
    setTimeout(()=> {
      window.lc.setData('justVerifiedEmail', false)
    }, 2000)
    return html`<div style="font-size: 12px; padding: 8px;
    text-align: center;
    background: #b5ee85;"
    >Email verified!</div>`
  }
  if(window.lc.getData('resentEmailConfirmation')) {
    return html`<div style="font-size: 12px; padding: 8px;
    text-align: center;
    background: #eee;"
    >Confirmation email resent.</div>`
  }
  if(waitingOnEmailVerification()) {
    return html`<div style="font-size: 12px; padding: 8px;
    text-align: center;
    background: #eee;"

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
             <button class="usa-button" @click=${navigateToLoginPage}>Login</button>
            `
}
function loggedInHeader (userInfo) {
  return html`
             <button class="usa-button usa-button--unstyled" @click=${settings} style="margin-right: 10px">Account Settings</button>
             <button class="usa-button usa-button--outline" @click=${logout}>Logout</button>
            `
}
function settings() {
  navigateToSettingsPage();
}
