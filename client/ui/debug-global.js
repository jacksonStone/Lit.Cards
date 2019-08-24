let { listenForKeyGlobal, resetKeyGlobal } = require('../browser-abstractions/keyboard')
let { storeAllState, retrieveStateStored } = require('../browser-abstractions/browser-storage')
let { api } = require('api/api-request')
function initDebug (rerender) {
  window.lc._debugging = true
  rerender && window.lc._rerender()
  window.lc.getServerDBState = getServerDBState
  listenForKeyGlobal('KeyR', retrieveStateStored)
  listenForKeyGlobal('KeyS', storeAllState)
}
function deactivateDebug () {
  window.lc._debugging = false
  window.lc._rerender()
  resetKeyGlobal('KeyR')
  resetKeyGlobal('KeyS')
}
async function getServerDBState () {
  console.info(JSON.parse(await api('debug')))
}

module.exports = {
  initDebug,
  deactivateDebug
}
