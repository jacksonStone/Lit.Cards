const { $ } = require('./$')
function setFocusTo(selector) {
  const node = $(selector)
  node && node.focus()
}
module.exports.setFocusTo = setFocusTo
