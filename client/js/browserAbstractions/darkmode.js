const { $ } = require('./$')
const { get, set } = require('abstract/browser-storage')
function _setDarkMode (shouldBeDark) {
  if (shouldBeDark) {
    $('html').className = 'darkmode'
    $('body').className = 'darkmode'
  } else {
    $('html').className = ''
    $('body').className = ''
  }
}

function defaultDarkMode () {
  _setDarkMode(get('darkmode') === 'true')
}

function recordAndSetDarkMode (value) {
  set('darkmode', value)
  _setDarkMode(value)
}
module.exports = {
  recordAndSetDarkMode,
  defaultDarkMode
}
