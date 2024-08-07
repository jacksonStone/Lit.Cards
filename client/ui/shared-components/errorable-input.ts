import { html } from 'lit';

export default (error: boolean, errorText:string, name:string, label:string, type = 'text', length?:number) => {
  if (error) {
    return html`
      <div class="usa-form-group usa-form-group--error">
        <label class="usa-label usa-label--error" for="${name}">${label}</label>
        <span class="usa-error-message" id="input-error-message" role="alert">${errorText}</span>
        <input class="usa-input usa-input--error" id="${name}" name="${name}" type="${type}" required aria-required="true" maxlength="${length ? length : 125}">
      </div>`
  }
  return html`
      <label class="usa-label" for="${name}">${label}</label>
      <input class="usa-input" id="${name}" name="${name}" type="${type}" required aria-required="true">`
};
