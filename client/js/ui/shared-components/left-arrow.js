const { html } = require('lit')

module.exports = (action) => {
  return html`
<button class="usa-button usa-button--outline flip-card"
style=" box-shadow: none;"
@click="${action}">
    <div style="font-size: 53px; margin-bottom: 10px">←</div>
<div style="font-size: 14px; margin-bottom: 10px">Missed</div>
    </button>`
}
