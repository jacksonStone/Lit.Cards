const { jcompress, jdecompress } = require('shared/compress')

function get (key) {
  return window.localStorage.getItem(key)
}
function set (key, value) {
  return window.localStorage.setItem(key, value)
}
function storeAllState () {
  const state = window.lc.data
  set('_latestState', jcompress(state))
}
function retrieveStateStored () {
  window.lc.data = jdecompress(get('_latestState'))
  window.lc._rerender()
}

module.exports = {
  get,
  set,
  storeAllState,
  retrieveStateStored
}
