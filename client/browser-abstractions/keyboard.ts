// TODO:: Move all this to watchers
let textFocusedPropName = '_focusingOnText'
interface keyBinding {
  [key: string]: (event?: KeyboardEvent) => void
}
let keyBindings: keyBinding = {}
let globalBindings: keyBinding = {}
let cmdKeyBindings: keyBinding = {}

// TODO::Move to one place
function isMac (): boolean {
  return window.navigator.platform.indexOf('Mac') !== -1
}
function dataSaysTextIsFocused (): boolean {
  return window.lc.getData(textFocusedPropName)
}

function listenForCMDKey (key: string, callback:  () => void) {
  cmdKeyBindings[key] = callback
}
function listenForKey (key: string, callback:  () => void) {
  keyBindings[key] = callback
}

function listenForKeyGlobal (key: string, callback:  () => void) {
  globalBindings[key] = callback
}

function resetKeyGlobal (key: string) {
  delete globalBindings[key]
}

function resetKey (key: string) {
  delete keyBindings[key]
}
interface archivedKeyBindingsI {
  keyBindings?: keyBinding,
  cmdKeyBindings?: keyBinding
}
let archivedKeyBindings: archivedKeyBindingsI = {}
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

function isMultipleKeys (e: KeyboardEvent) {
  return e.altKey || e.ctrlKey || e.metaKey || e.shiftKey
}

function _handleKeyDown (e: KeyboardEvent) {
  let isCMD: Boolean = isMac() ? e.metaKey : e.ctrlKey;
  if (isCMD) {
    if (cmdKeyBindings[e.code]) {
      if (e.code !== 'Tab') {
        e.preventDefault()
      }
      return cmdKeyBindings[e.code](e)
    }
  }
  // Let all other hotkeys through as normal
  if (isMultipleKeys(e)) {
    return
  }
  if (keyBindings[e.code] && !dataSaysTextIsFocused()) {
    if (e.code !== 'Tab') {
      e.preventDefault()
    }
    return keyBindings[e.code](e)
  }
  if (globalBindings[e.code] && !dataSaysTextIsFocused()) {
    if (e.code !== 'Tab') {
      e.preventDefault()
    }
    return globalBindings[e.code](e)
  }
}

function simulateKey (code: string) {
  keyBindings[code]()
}
if (process.env.NODE_ENV !== 'test') {
  window.document.addEventListener('keydown', _handleKeyDown)
}

export {
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
