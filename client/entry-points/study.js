import { renderPage } from '../ui/globals'
import { home as homePage } from '../routes/navigation/pages'
import content from '../ui/page-content/study-session'
import { initKeyCommands } from '../ui/page-content/study-session/key-commands'
import { defaultDarkMode } from 'abstract/darkmode'
import { runNextRender } from 'abstract/rendering-meta'
import { fetchUser } from 'logic/user'
import { getCardBody } from 'logic/card-bodies'
import { getDeck } from 'logic/deck'
import { getStudySession, sortCardsBySession, trimCardsToOnesAwaitingAnswers, accountForNewCards } from 'logic/study';
(async () => {
  defaultDarkMode()
  let [user, studySession] = await Promise.all([fetchUser(), getStudySession()])
  let deckId = studySession.deck
  let [deck] = await Promise.all([getDeck(deckId)])
  let cards = deck.cards || ''
  window.lc.setData('deck', deck)
  if (studySession) {
    studySession = accountForNewCards(studySession, cards)
  }
  let firstCardId = (cards && cards.length && cards[studySession.currentCard || 0]) || undefined
  let sessionOrderedCards = sortCardsBySession(cards, studySession)
  let visibleCards = trimCardsToOnesAwaitingAnswers(sessionOrderedCards, studySession)
  let cardBody = await getCardBody(firstCardId, deckId, visibleCards)
  if (!cards || !cardBody) {
    return homePage()
  }
  window.lc.setData('orderedCards', visibleCards)
  window.lc.setData('sessionShuffledCards', sessionOrderedCards)
  window.lc.setData('session', studySession)
  window.lc.setData('deck', deck)
  window.lc.setData('activeCardId', firstCardId)
  window.lc.setData('user', user)
  window.lc.setData('showingAnswer', false)
  window.lc.setData('originalCardOrder', cards)
  window.lc.setData(`cardBody.${firstCardId}`, cardBody)
  runNextRender(initKeyCommands)
  renderPage(content)
})()
