const { renderPage } = require('../ui/globals')
const content = require('../ui/page-content/me')
const { fetchUser } = require('logic/getUser')
const { getDecks } = require('logic/decks')
const { defaultDarkMode } = require('abstract/darkmode')
renderPage(content)
;(async () => {
  // Pull from userInfo
  defaultDarkMode()
  const [user, decks] = await Promise.all([fetchUser(), getDecks()])
  // Pull from userInfo
  window.lc.setData('user', user)
  window.lc.setData('decks', decks)
})()
