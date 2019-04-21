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

function _handleKeyDown (e) {
  const keyForCMD = isMac ? 'metaKey' : 'ctrlKey'
  if (e[keyForCMD] && cmdKeyBindings[e.code]) {
    e.preventDefault()
    return cmdKeyBindings[e.code]()
  }
  if (keyBindings[e.code] && !focusingOnSomething()) {
    e.preventDefault()
    return keyBindings[e.code]()
  }
}

function simulateKey (code) {
  keyBindings[code]()
}

window.document.addEventListener('keydown', _handleKeyDown)

module.exports = {
  listenForKey,
  resetAllKeyBindings,
  listenForCMDKey,
  simulateKey
}
