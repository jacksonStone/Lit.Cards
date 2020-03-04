import { renderPage } from '../ui/globals'
import content from '../ui/page-content/deck'
import { initCommands } from '../ui/page-content/deck/key-commands'
import { initEditor } from 'abstract/editor'
import { runNextRender } from 'abstract/rendering-meta'
import { getParam } from 'abstract/url'
import { defaultDarkMode } from 'abstract/darkmode'
import { fetchUser } from 'logic/user'
import { getCardBody, getCardBodyForEmptyState } from 'logic/card-bodies'
import { getStudySession } from 'logic/study'
import { getDeck, handleEditorTextChange, refreshEditor } from 'logic/deck';
(async () => {
  defaultDarkMode()
  let [user, deck, studySession] = await Promise.all([fetchUser(), getDeck(), getStudySession()])
  let cards = deck.cards || ''
  // For when you navigate from study to edit
  let rawParam = getParam('card')
  window.lc.setData('deck', deck)
  let activeCard = rawParam ? window.decodeURIComponent(rawParam) : undefined
  let firstCardId = activeCard || (cards && cards.length && cards[0])
  let cardBody
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
