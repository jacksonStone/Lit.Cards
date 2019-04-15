module.exports = (name, func) => {
  window.sn._clickHandler[name] = func
}
