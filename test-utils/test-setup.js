global.window = {
  location: {
    search: '?foo=bar&bar=baz',
    href: '/site/foo'
  }
}
let { initLC } = require('../client/ui/globals')
window.lc = initLC()
