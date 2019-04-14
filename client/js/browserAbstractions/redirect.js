const { testing } = require('../ui/globals')

function redirect (href) {
  if (testing.isTesting()) {
    testing.addTestRoute(href)
    return
  }
  window.location.href = href
}

exports.redirect = redirect
