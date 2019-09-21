let { listenForKeyGlobal, resetKeyGlobal } = require('../browser-abstractions/keyboard')
let { storeAllState, retrieveStateStored } = require('../browser-abstractions/browser-storage')
let { api } = require('api/api-request')
function initDebug (rerender) {
  window.lc._debugging = true
  rerender && window.lc._rerender()
  window.lc.getServerDBState = getServerDBState
  window.lc.resetServerDBState = resetServerDBState
  listenForKeyGlobal('KeyR', retrieveStateStored)
  listenForKeyGlobal('KeyS', storeAllState)
}
function deactivateDebug () {
  window.lc._debugging = false
  window.lc._rerender()
  resetKeyGlobal('KeyR')
  resetKeyGlobal('KeyS')
}
async function getServerDBState (userId) {
  let state
  if (userId) {
    state = JSON.parse(await api('debug', { userId }))
  } else {
    state = JSON.parse(await api('debug'))
  }
  console.info(state)
  return state
}
async function resetServerDBState () {
  console.info(JSON.parse(await api('debug-reset')))
}
module.exports = {
  initDebug,
  deactivateDebug
}
