
const { html } = require('lit-html/lit-html')
const { onPage } = require('abstract/url')
const { navigateToLoginPage } = require('logic/login')
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
  return html`<ul class="usa-nav__primary usa-accordion">
                <li class="usa-nav__primary-item">
                    <button class="usa-accordion__button usa-nav__link  usa-current" aria-expanded="false" aria-controls="basic-nav-section-one"><span>Current section</span></button>
                    <ul id="basic-nav-section-one" class="usa-nav__submenu">
                        <li class="usa-nav__submenu-item">
                        <a href="#foo">Navigation link</a>
                        </li>
                        <li class="usa-nav__submenu-item">
                        <a href="#frr">Navigation link</a>
                        </li>
                        <li class="usa-nav__submenu-item">
                        <a href="#fop">Navigation link</a>
                        </li>
                    </ul>
                </li>
                <li class="usa-nav__primary-item">
                    <button class="usa-accordion__button usa-nav__link" aria-expanded="false" aria-controls="basic-nav-section-two"><span>Section</span></button>
                    <ul id="basic-nav-section-two" class="usa-nav__submenu"><li class="usa-nav__submenu-item">
                        <a href="#">Navigation link</a>
                    </li><li class="usa-nav__submenu-item">
                        <a href="#">Navigation link</a>
                    </li><li class="usa-nav__submenu-item">
                        <a href="#">Navigation link</a>
                    </li></ul></li><li class="usa-nav__primary-item">
                    <a class="usa-nav__link" href="javascript:void(0)"><span>Simple link</span></a>
                </li>
            </ul>

            <form class="usa-search usa-search--small ">
                <div role="search">
                    <label class="usa-sr-only" for="basic-search-field-small">Search small</label>
                    <input class="usa-input" id="basic-search-field-small" type="search" name="search">
                    <button class="usa-button" type="submit"><span class="usa-sr-only">Search</span></button>
                </div>
            </form>`
}
