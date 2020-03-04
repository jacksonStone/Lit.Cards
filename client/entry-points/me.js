import { renderPage } from '../ui/globals'
import content from '../ui/page-content/me'
import { fetchUser } from '../business-logic/user'
import { getDecks } from '../business-logic/decks'
import { getStudySessionsAndBorrowedDecks } from '../business-logic/study'
import { fetchStudyHistory } from '../business-logic/study-history'
import { verifyEmail } from 'logic/login'
import { defaultDarkMode } from '../browser-abstractions/darkmode'
import { getParam } from '../browser-abstractions/url'
import { keyBy } from 'utils'
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
  window.lc.setData('studySessionsByDeck', keyBy(studySessions || [], 'deck'))
  window.lc.setData('studySessions', studySessions)
})()
