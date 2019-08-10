const { renderPage } = require('../ui/globals')
const content = require('../ui/page-content/me')
const { fetchUser } = require('../business-logic/user')
const { getDecks } = require('../business-logic/decks')
const { getStudySessionsAndBorrowedDecks } = require('../business-logic/study')
const { verifyEmail } = require('logic/login')
const { defaultDarkMode } = require('../browser-abstractions/darkmode')
const { getParam } = require('../browser-abstractions/url')
const { keyBy } = require('utils')
renderPage(content)
;(async () => {
  // Pull from userInfo
  defaultDarkMode()
  const [user, decks, studySessionsAndDecks] = await Promise.all([fetchUser(), getDecks(), getStudySessionsAndBorrowedDecks()])
  if (!user.verifiedEmail && getParam('verification')) {
    await verifyEmail()
    window.lc.setData('justVerifiedEmail', true)
    user.verifiedEmail = true
  }
  const studySessions = studySessionsAndDecks.sessions;
  const borrowedDecks = studySessionsAndDecks.borrowedDecks;
  // Pull from userInfo
  window.lc.setData('user', user)
  window.lc.setData('decks', decks)
  window.lc.setData('borrowedDecks', borrowedDecks)
  window.lc.setData('studySessionsByDeck', keyBy(studySessions || [], 'deck'))
  window.lc.setData('studySessions', studySessions)
})()
