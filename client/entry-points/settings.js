let { renderPage } = require('../ui/globals')
let content = require('../ui/page-content/settings')
let { defaultDarkMode } = require('abstract/darkmode')
let { fetchUser } = require('logic/user')

renderPage(content)
;(async () => {
  defaultDarkMode()
  let [user] = await Promise.all([fetchUser()])
  window.lc.setData('user', user)
})()
