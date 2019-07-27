const { renderPage } = require('../ui/globals')
const content = require('../ui/page-content/settings')
const { defaultDarkMode } = require('abstract/darkmode')
const { fetchUser } = require('logic/user')

renderPage(content)
;(async () => {
  defaultDarkMode()
  let [user] = await Promise.all([fetchUser()])
  window.lc.setData('user', user)
})()
