const { renderPage } = require('../ui/globals')
const content = require('../ui/page-content/deck')
const { handleEditorTextChange, getCardMapping } = require('../ui/page-content/deck/helper')

const { initEditor } = require('abstract/editor')
const { fetchUser } = require('logic/getUser')
const { getCards } = require('logic/cards')
const { getCardBody } = require('logic/cardBodies')
renderPage(content)
;(async () => {
  const [user, cards, cardBody] = await Promise.all([fetchUser(), getCards(), getCardBody()])
  const firstCardId = (cards && cards.length && cards[0].id) || undefined
  window.lc.setData('orderedCards', cards)
  window.lc.setData('activeCardId', firstCardId)
  window.lc.setData('user', user)
  window.lc.setData('showingAnswer', false)
  window.lc.setData('card', getCardMapping(cards))
  window.lc.setData(`cardBody.${firstCardId}`, cardBody)
  initEditor(cardBody.front, handleEditorTextChange)
})()
