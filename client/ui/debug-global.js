import { listenForKeyGlobal, resetKeyGlobal } from '../browser-abstractions/keyboard'
import { storeAllState, retrieveStateStored } from '../browser-abstractions/browser-storage'
import { api } from 'api/api-request'
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
async function getServerDBState (userEmail) {
  let state
  if (userEmail) {
    state = JSON.parse(await api('debug', { userEmail }))
  } else {
    state = JSON.parse(await api('debug'))
  }
  return state
}
async function resetServerDBState () {
  console.info(JSON.parse(await api('debug-reset')))
}

export {
  initDebug,
  deactivateDebug
}
