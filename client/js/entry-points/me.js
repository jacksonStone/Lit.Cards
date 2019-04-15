const render = require('../ui/render-page')
const content = require('../ui/page-content/me.js')
const { fetchUser } = require('logic/getUser')
const { getDecks } = require('logic/decks')
;(async () => {
  const [user, decks] = await Promise.all([fetchUser(), getDecks()])
  render(content, { user, decks })
})()
