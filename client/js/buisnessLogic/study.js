const { study: studyPage } = require('site/pages')
// const { getParam } = require('abstract/url')
const { createStudySession } = require('api/study')
// const { reject } = require('utils')

function navigateToStudySession (id) {
  return studyPage({ id })
}
exports.navigateToStudySession = navigateToStudySession
// exports.getDeck = async (deckId) => {
//   deckId = deckId || getParam('deck')
//   return JSON.parse(await getDeck(deckId))
// }
exports.createStudySession = async (deck, startingState) => {
  const newSession = JSON.parse(await createStudySession(deck, startingState))
  navigateToStudySession(newSession.id)
}
//
// exports.deleteDeck = async (id) => {
//   await deleteDeck(id)
//   const decks = window.lc.getData('decks')
//   const decksWithoutDeleted = reject(decks, { id })
//   window.lc.setData('decks', decksWithoutDeleted)
// }
