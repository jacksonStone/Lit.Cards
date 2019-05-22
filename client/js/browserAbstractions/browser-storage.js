function get (key) {
  return window.localStorage.getItem(key)
}
function set (key, value) {
  return window.localStorage.setItem(key, value)
}

module.exports = {
  get,
  set,
}
