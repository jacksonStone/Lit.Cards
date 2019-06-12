const { html } = require('lit')
const { getNumberWrong } = require('logic/study')

module.exports = () => {
  if (getNumberWrong()) {
    return someWrong()
  }
  return noneWrong()
}

function noneWrong () {
  return html`<div>Well done!</div>`
}
function someWrong () {
  return html`
    <div style="text-align: center; border: 1px solid rgba(10, 10, 10, 0.1); height: 300px;">
    <div style="margin-top: 80px"><button style="width: 180px; text-align: center;" class="usa-button">Restudy wrong answers</button></div>
    <div style="margin-top: 20px"><button style="width: 180px; text-align: center;" class="usa-button usa-button--secondary">End study session</button></div>
    </div>
    
  `
}
