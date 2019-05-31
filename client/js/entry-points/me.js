const { renderPage } = require('../ui/globals')
const content = require('../ui/page-content/me')
const { fetchUser } = require('logic/getUser')
const { getDecks } = require('logic/decks')
const { getStudySessions } = require('logic/study')
const { defaultDarkMode } = require('abstract/darkmode')
const { keyBy } = require('utils')
renderPage(content)
;(async () => {
  // Pull from userInfo
  defaultDarkMode()
  const [user, decks, studySessions] = await Promise.all([fetchUser(), getDecks(), getStudySessions()])
  // Pull from userInfo
  window.lc.setData('user', user)
  window.lc.setData('decks', decks)
  window.lc.setData('studySessionsByDeck', keyBy(studySessions || [], 'deck'))
  window.lc.setData('studySessions', studySessions)
})()
