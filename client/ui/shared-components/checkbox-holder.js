let { html } = require('lit')
let focusingOnTextProp = '_focusingOnText'
//You are working on this
module.exports = (checkboxes, right = '10px') => {
  let keyBoardInUse = window.lc.getData(focusingOnTextProp);
  let isMobile = window.lc.getData('screen.width') <= 750;
  if(keyBoardInUse && isMobile) return html``
  
  return html`
    <div class="usa-checkbox darkmode-checkbox-container" style="
    position: fixed;
    right: ${right};
    padding: 5px 5px 0 5px;
    bottom: 0;
    border-radius: 3px;
  ">
  <div style="opacity: .7">
        ${checkboxes}

  </div>
      </div>
`
}
