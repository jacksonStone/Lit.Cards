const { listenForKeyGlobal, resetKeyGlobal } = require('../browser-abstractions/keyboard')
const { storeAllState, retrieveStateStored } = require('../browser-abstractions/browser-storage')
function initDebug (rerender) {
  window.lc._debugging = true
  rerender && window.lc._rerender()
  listenForKeyGlobal('KeyR', retrieveStateStored)
  listenForKeyGlobal('KeyS', storeAllState)
}
function deactivateDebug () {
  window.lc._debugging = false
  window.lc._rerender()
  resetKeyGlobal('KeyR')
  resetKeyGlobal('KeyS')
}

module.exports = {
  initDebug,
  deactivateDebug
}
