const { html } = require('lit-html')
module.exports = () => {
  return html`<ul class="site-sidenav usa-sidenav"
style="margin-right: 40px;">
  <li class="usa-sidenav__item">
    <a href="/site/me"><i class="far fa-arrow-alt-circle-left"></i>&nbsp;Back to decks</a>
  </li>
  </ul>`
}
