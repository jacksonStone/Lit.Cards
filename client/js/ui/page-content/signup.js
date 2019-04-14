const { html } = require('lit-html/lit-html')
const { makeClickHandler } = require('../globals')
makeClickHandler('login', (event) => {
    event.preventDefault()
    console.log(event)
})
makeClickHandler('signup', (event) => {
    event.preventDefault()
    console.log(event)
})
module.exports = () => html`
    <div class="grid-container">
    <form class="usa-form" id="signup">
      <fieldset class="usa-fieldset">
        <legend class="usa-legend">Sign-up</legend>
        <label class="usa-label" for="email">Email</label>
        <input class="usa-input" id="email" name="email" type="text" required aria-required="true">
        <label class="usa-label" for="username">Password</label>
        <input class="usa-input" id="password" name="password" type="password" required aria-required="true">
        <label class="usa-label" for="username">Repeat Password</label>
        <input class="usa-input" id="password-repeat" name="password-repeat" type="password" required aria-required="true">
      </fieldset>
      <button onclick="sn.clickHandler('signup')(event)" class="usa-button--outline">Signup</button>
    </form>
    </div> 
`
