
const { html } = require('lit-html/lit-html')
const { onPage } = require('abstract/url')
const { navigateToLoginPage, logout } = require('logic/login')
const { makeClickHandler } = require('../globals')
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
         <button class="usa-nav__close"><img src="/assets/img/close.svg" alt="close"></button>

        <div class="usa-nav__inner">
            <div class="usa-nav__secondary" style="bottom: 1.5rem; right: 1rem; text-align: right">
             ${getNavOptions(userInfo)}
            </div>
        </div>
        </nav>
    </div>
</header>`

function getNavOptions (userInfo) {
  if (userInfo) {
    return loggedInHeader(userInfo)
  } else if (!onPage('login')) {
    return notLoggedInHeader()
  } else {
    return loginPageHeader()
  }
}
function loginPageHeader () {
}

function notLoggedInHeader () {
  makeClickHandler('navigateToLoginPage', navigateToLoginPage)
  return html`
             <button class="usa-button" onclick="sn.clickHandler('navigateToLoginPage')()">Login</button>
            `
}
function loggedInHeader (userInfo) {
  makeClickHandler('logout', logout)
  return html`
             <button class="usa-button usa-button--outline" onclick="sn.clickHandler('logout')()">Logout</button>
            `
}
