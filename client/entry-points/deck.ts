import { renderPage } from '../ui/globals'
import content from '../ui/page-content/deck/index.js'
import { initCommands } from '../ui/page-content/deck/key-commands'
import { initEditor } from '../browser-abstractions/editor'
import { runNextRender } from '../browser-abstractions/rendering-meta'
import { getParam } from '../browser-abstractions/url'
import { defaultDarkMode } from '../browser-abstractions/darkmode'
import { fetchUser } from '../business-logic/user'
import { getCardBody, getCardBodyForEmptyState } from '../business-logic/card-bodies'
import { getStudySession } from '../business-logic/study'
import { getDeck, handleEditorTextChange, refreshEditor } from '../business-logic/deck';

declare global {
  interface Window {
    lc: any;
  }
}

(async () => {
  defaultDarkMode()
  let [user, deck, studySession] = await Promise.all([fetchUser(), getDeck(), getStudySession()])
  let cards = deck.cards || ''
  // For when you navigate from study to edit
  let rawParam = getParam('card')
  window.lc.setData('deck', deck)
  let activeCard = rawParam ? window.decodeURIComponent(rawParam) : undefined
  let firstCardId = activeCard || (cards && cards.length && cards[0])
  let cardBody: any;
  try {
    cardBody = await getCardBody(firstCardId, undefined, cards)
  } catch (e) {
    if (deck.cards.length === 1) {
      // We probably failed to add new card, due to server restart or some such
      cardBody = getCardBodyForEmptyState(firstCardId)
    }
  }

  if (!cardBody) {
    // In case something went sideways
    window.location.href = '/'
  }
  window.lc.setData('orderedCards', cards)
  window.lc.setData('activeCardId', firstCardId)
  window.lc.setData('user', user)
  window.lc.setData('session', studySession)
  window.lc.setData('showingAnswer', false)
  window.lc.setData(`cardBody.${firstCardId}`, cardBody)
  runNextRender(() => {
    initCommands()
    initEditor(cardBody.front, handleEditorTextChange)
    refreshEditor()
  })
  renderPage(content)
})()
