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

let archivedKeyBindings = {}
function archiveCurrentKeyBindings () {
  archivedKeyBindings = {
    keyBindings: Object.assign(keyBindings),
    cmdKeyBindings: Object.assign(cmdKeyBindings)
  }
  keyBindings = {}
  cmdKeyBindings = {}
}
function restoreArchivedKeyBindings () {
  keyBindings = archivedKeyBindings.keyBindings || {}
  cmdKeyBindings = archivedKeyBindings.cmdKeyBindings || {}
  archivedKeyBindings = {}
}

function resetAllKeyBindings () {
  keyBindings = {}
  cmdKeyBindings = {}
  archivedKeyBindings = {}
}

function isMultipleKeys (e) {
  return e.altKey || e.ctrlKey || e.metaKey || e.shiftKey
}

function _handleKeyDown (e) {
  const keyForCMD = isMac ? 'metaKey' : 'ctrlKey'
  if (e[keyForCMD] && cmdKeyBindings[e.code]) {
    e.preventDefault()
    return cmdKeyBindings[e.code](e)
  }
  // Let all other hotkeys through as normal
  if (isMultipleKeys(e)) {
    return
  }
  if (keyBindings[e.code] && !focusingOnSomething()) {
    e.preventDefault()
    return keyBindings[e.code](e)
  }
}

function simulateKey (code) {
  keyBindings[code]()
}

window.document.addEventListener('keydown', _handleKeyDown)

module.exports = {
  listenForKey,
  archiveCurrentKeyBindings,
  restoreArchivedKeyBindings,
  resetAllKeyBindings,
  listenForCMDKey,
  simulateKey
}
