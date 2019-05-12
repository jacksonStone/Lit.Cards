const { $ } = require('./$')

function setDarkMode (shouldBeDark) {
  if (shouldBeDark) {
    $('html').className = 'darkmode'
    $('body').className = 'darkmode'
  } else {
    $('html').className = ''
    $('body').className = ''
  }
}

module.exports = {
  setDarkMode
}
