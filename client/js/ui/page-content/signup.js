const { html } = require('lit-html/lit-html')
const makeClickHandler = require('../click-handler')
const { grabFormData } = require('abstract/grabForm')
const { signup } = require('logic/login')
makeClickHandler('signup', (event) => {
  event.preventDefault()
  const signupData = grabFormData('#signup')
  if (!signupData.email || !signupData['password-repeat'] || !signupData.password) {
    // TODO::Handle this
    return
  }
  if (signupData['password-repeat'] !== signupData.password) {
    // TODO::Handle this
    return
  }
  return signup(signupData.email, signupData.password).catch(e => {
    console.log(e)
    // TODO::Handle this
  })
})
module.exports = () => html`
    <div class="grid-container">
    <div class="grid-row">
        <div class="grid-col-4"></div>
        <div class="grid-col-4">
             <form class="usa-form" id="signup">
              <fieldset class="usa-fieldset">
                <legend class="usa-legend">Sign-up</legend>
                <label class="usa-label" for="email">Email</label>
                <input class="usa-input" id="email" name="email" type="text" required aria-required="true">
                <label class="usa-label" for="password">Password</label>
                <input class="usa-input" id="password" name="password" type="password" required aria-required="true">
                <label class="usa-label" for="password-repeat">Repeat Password</label>
                <input class="usa-input" id="password-repeat" name="password-repeat" type="password" required aria-required="true">
              </fieldset>
              <button onclick="sn.clickHandler('signup')(event)" class="usa-button">Signup</button>
            </form>
        </div>
        <div class="grid-col-4"></div>
    </div>
    </div> 
`
