const { renderPage } = require('../ui/globals')
const content = require('../ui/page-content/deck')
const { initEditor } = require('abstract/editor')
const { fetchUser } = require('logic/getUser')
const { getCards } = require('logic/cards')
const { getCardBody } = require('logic/cardBodies')
renderPage(content)
;(async () => {
  const [user, cards, cardBody] = await Promise.all([fetchUser(), getCards(), getCardBody()])
  const firstCardId = (cards && cards.length && cards[0].id) || undefined
  window.sn.setData('user', user)
  window.sn.setData('cards', cards)
  window.sn.setData('activeCardId', firstCardId)
  window.sn.setData('cardBody', cardBody)
  window.sn.setData('showingAnswer', false)
  initEditor(cardBody.front, () => {
    console.log('changed')
  })
})()
