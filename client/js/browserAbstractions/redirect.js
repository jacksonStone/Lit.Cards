const globals = require('../ui/globals')

function redirect (href) {
  if (globals.testing.isTesting()) {
    globals.testing.addTestRoute(href)
    return
  }
  window.location.href = href
}

exports.redirect = redirect
