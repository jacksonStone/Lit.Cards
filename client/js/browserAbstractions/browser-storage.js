const { jcompress, jdecompress } = require('shared/compress')

function get (key) {
  return window.localStorage.getItem(key)
}
function set (key, value) {
  return window.localStorage.setItem(key, value)
}
function storeAllState () {
  const data = window.lc.data
  const path = window.location.pathname
  set('_latestState', jcompress({ data, path }))
}
function retrieveStateStored () {
  const result = get('_latestState')
  if (!result) {
    window.alert('nothing stored')
    return
  }
  const { data, path } = jdecompress(result)
  if (path !== window.location.pathname || !path) {
    window.alert('No data for this page')
    return
  }
  window.lc.data = data
  window.lc._rerender()
}

module.exports = {
  get,
  set,
  storeAllState,
  retrieveStateStored
}
