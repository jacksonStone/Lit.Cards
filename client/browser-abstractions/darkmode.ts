import { $ } from './$'
import { get, set } from './browser-storage'
function _setDarkMode (shouldBeDark: boolean) {
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

function recordAndSetDarkMode (value: boolean) {
  set('darkmode', value)
  _setDarkMode(value)
}

export {
  recordAndSetDarkMode,
  defaultDarkMode
}
