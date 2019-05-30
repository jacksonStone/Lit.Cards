const { study: studyPage } = require('site/pages')
const { getParam } = require('abstract/url')
const { createStudySession, getStudySession } = require('api/study')
// const { reject } = require('utils')

function navigateToStudySession (id) {
  return studyPage({ id })
}
exports.navigateToStudySession = navigateToStudySession
exports.getStudySession = async (id) => {
  id = id || getParam('id')
  return JSON.parse(await getStudySession(id))
}
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
