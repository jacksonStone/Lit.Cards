import { html } from 'lit';

export default (heading, subtext) => {
  return html`
  <div class="usa-alert usa-alert--error" role="alert">
  <div class="usa-alert__body">
    <h3 class="usa-alert__heading">${heading}</h3>
    ${subtext && html`<p class="usa-alert__text">${subtext}</p>`}
  </div>
  </div>`
};
