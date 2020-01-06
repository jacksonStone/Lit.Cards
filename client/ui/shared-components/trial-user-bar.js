let { html } = require('lit')
let EMPTY = html``;
function navigateToPlan() {
    location.href = "/site/me/settings#plan-details";
}
module.exports = () => {
    const user = window.lc.getData('user');
    if(!user) {
        return EMPTY
    }
    
    if(user.trialUser) {
        const now = Date.now();
        let daysRemaining = 0;
        if(user.planExpiration > now) {
            daysRemaining = Math.ceil((user.planExpiration - now)/(1000*60*60*24))
        }
        return html`
        <div class="darkmode-checkbox-container" style="position: fixed; top: 0; left: 0; padding: 5px; font-size: 12px; border-radius:4px;">
            ${  daysRemaining == 0 ? `Trail expired` :
                (daysRemaining == 1 ? `${daysRemaining} trial day remaining` : `${daysRemaining} trial days remaining`)} - 
                <button @click=${navigateToPlan} class="usa-button usa-button--outline" style=" margin-right: 0; font-size: 12px; padding: 5px;">Buy full access</button>
        </div>
        `
    }
    return html``;
  
}
