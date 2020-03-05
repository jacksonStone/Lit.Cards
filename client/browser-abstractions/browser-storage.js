import { LZString } from 'shared/compress'
const jcompress = LZString.jcompress
const jdecompress = LZString.jdecompress
function get (key) {
  return window.localStorage.getItem(key)
}
function set (key, value) {
  return window.localStorage.setItem(key, value)
}
function storeAllState () {
  let data = window.lc.data
  let path = window.location.pathname
  set('_latestState', jcompress({ data, path }))
}
function retrieveStateStored () {
  let result = get('_latestState')
  if (!result) {
    window.alert('nothing stored')
    return
  }
  let { data, path } = jdecompress(result)
  if (path !== window.location.pathname || !path) {
    window.alert('No data for this page')
    return
  }
  window.lc.data = data
  window.lc._rerender()
}

export {
  get,
  set,
  storeAllState,
  retrieveStateStored
}
