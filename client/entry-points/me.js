let { renderPage } = require('../ui/globals')
let content = require('../ui/page-content/me')
let { fetchUser } = require('../business-logic/user')
let { getDecks } = require('../business-logic/decks')
let { getStudySessionsAndBorrowedDecks } = require('../business-logic/study')
let { fetchStudyHistory } = require('../business-logic/study-history')
let { verifyEmail } = require('logic/login')
let { defaultDarkMode } = require('../browser-abstractions/darkmode')
let { getParam } = require('../browser-abstractions/url')
let { keyBy } = require('utils')
renderPage(content)
;(async () => {
  // Pull from userInfo
  defaultDarkMode()
  let [user, decks, studySessionsAndDecks, studyHistory] = await Promise.all([
    fetchUser(),
    getDecks(),
    getStudySessionsAndBorrowedDecks(),
    fetchStudyHistory()
  ])
  if (!user.verifiedEmail && getParam('verification')) {
    await verifyEmail()
    window.lc.setData('justVerifiedEmail', true)
    user.verifiedEmail = true
  }
  let studySessions = studySessionsAndDecks.sessions
  let borrowedDecks = studySessionsAndDecks.borrowedDecks
  // Pull from userInfo
  window.lc.setData('user', user)
  window.lc.setData('decks', decks)
  window.lc.setData('borrowedDecks', borrowedDecks)
  window.lc.setData('studyHistory', studyHistory)
  window.lc.setData('studySessionsByDeck', keyBy(studySessions || [], 'deck.ts.ts'))
  window.lc.setData('studySessions', studySessions)
})()
