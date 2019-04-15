const { html } = require('lit-html/lit-html')

module.exports = (data) => {
  return html`
<button class="usa-button usa-button--outline flip-card"
style="margin: 20px 20px; height: 280px; box-shadow: none;">
    <div style="font-size: 53px; margin-bottom: 10px">←</div>
<div style="font-size: 14px; margin-bottom: 10px">previous</div>
    </button>`
}
