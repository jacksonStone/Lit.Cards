let keyBindings = {}
let globalBindings = {}
let cmdKeyBindings = {}
function isMac () {
  return window.navigator.platform.indexOf('Mac') !== -1
}
function focusingOnSomething () {
  return window.document.activeElement !== window.document.body
}

function listenForCMDKey (key, callback) {
  cmdKeyBindings[key] = callback
}
function listenForKey (key, callback) {
  keyBindings[key] = callback
}

function listenForKeyGlobal (key, callback) {
  globalBindings[key] = callback
}

function resetKeyGlobal (key) {
  delete globalBindings[key]
}

function resetKey (key) {
  delete keyBindings[key]
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
  const keyForCMD = isMac() ? 'metaKey' : 'ctrlKey'
  if (e[keyForCMD] && cmdKeyBindings[e.code]) {
    e.preventDefault()
    return cmdKeyBindings[e.code](e)
  }
  // Let all other hotkeys through as normal
  if (isMultipleKeys(e)) {
    return
  }
  // console.log(e.code)
  if (keyBindings[e.code] && !focusingOnSomething()) {
    e.preventDefault()
    return keyBindings[e.code](e)
  }
  if (globalBindings[e.code] && !focusingOnSomething()) {
    e.preventDefault()
    return globalBindings[e.code](e)
  }
}

function simulateKey (code) {
  keyBindings[code]()
}
if (process.env.NODE_ENV !== 'test') {
  window.document.addEventListener('keydown', _handleKeyDown)
}

module.exports = {
  listenForKey,
  listenForKeyGlobal,
  resetKey,
  resetKeyGlobal,
  archiveCurrentKeyBindings,
  restoreArchivedKeyBindings,
  resetAllKeyBindings,
  listenForCMDKey,
  simulateKey
}
