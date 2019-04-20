let keyBindings = {}
let cmdKeyBindings = {}
const isMac = navigator.platform.indexOf('Mac') !== -1
function focusingOnSomething () {
  return window.document.activeElement !== window.document.body
}

function listenForCMDKey (key, callback) {
  cmdKeyBindings[key] = callback
}
function listenForKey (key, callback) {
  keyBindings[key] = callback
}

function resetAllKeyBindings () {
  keyBindings = {}
  cmdKeyBindings = {}
}

// console.log(e.shiftKey)
// console.log(e.ctrlKey)
// console.log(e.metaKey)
// console.log(e.altKey)
// console.log(e.code === 'Space')

function _handleKeyDown (e) {
  const keyForCMD = isMac ? 'metaKey' : 'ctrlKey'
  console.log('META: ' + e.metaKey)
  console.log(e.code)
  if (e[keyForCMD] && cmdKeyBindings[e.code]) {
    e.preventDefault()
    return cmdKeyBindings[e.code]()
  }
  if (keyBindings[e.code] && !focusingOnSomething()) {
    e.preventDefault()
    return keyBindings[e.code]()
  }
}
window.document.addEventListener('keydown', _handleKeyDown)

module.exports = {
  listenForKey,
  resetAllKeyBindings,
  listenForCMDKey
}
