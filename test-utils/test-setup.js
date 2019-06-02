global.window = {
  location: {
    search: '?foo=bar&bar=baz',
    href: '/site/foo'
  }
}
const { initLC } = require('../client/js/ui/globals')
window.lc = initLC()
