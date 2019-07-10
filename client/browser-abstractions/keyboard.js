let keyBindings = {}
let globalBindings = {}
let cmdKeyBindings = {}
let keysToStillLetThrough = {
  'Tab' : true
};
function isMac () {
  return window.navigator.platform.indexOf('Mac') !== -1
}
function focusingOnTextInput () {
  if (window.document.activeElement === window.document.body) {
    return false
  }
  return isTextField(window.document.activeElement)
}
function isTextField (activeElement) {
  return activeElement.classList.contains('pell-content') || activeElement.id === 'deck-name';
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
  if (e[keyForCMD]) {
    if(cmdKeyBindings[e.code]) {
      if(!keysToStillLetThrough[(e.code)]) {
        e.preventDefault()
      }
      return cmdKeyBindings[e.code](e)
    // } else if (focusingOnTextInput() && keyBindings[e.code]) {
    //   e.preventDefault()
    //   return keyBindings[e.code](e)
    }
  }
  // Let all other hotkeys through as normal
  if (isMultipleKeys(e)) {
    return
  }
  // console.info(e.code)
  if (keyBindings[e.code] && !focusingOnTextInput()) {
    if(!keysToStillLetThrough[(e.code)]) {
      e.preventDefault()
    }
    return keyBindings[e.code](e)
  }
  if (globalBindings[e.code] && !focusingOnTextInput()) {
    if(!keysToStillLetThrough[(e.code)]) {
      e.preventDefault()
    }
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
