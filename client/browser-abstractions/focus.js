const { $ } = require('./$')
function setFocusTo(selector) {
  const node = $(selector)
  debugger;
  node && node.focus()
}
module.exports.setFocusTo = setFocusTo
