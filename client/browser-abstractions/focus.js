let { $ } = require('./$')
function setFocusTo (selector) {
  let node = $(selector)
  node && node.focus()
}
module.exports.setFocusTo = setFocusTo
