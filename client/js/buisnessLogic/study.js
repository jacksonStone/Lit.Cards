const { study: studyPage } = require('site/pages')
const { getParam } = require('abstract/url')
const { strToList } = require('shared/char-encoding')
const { createStudySession, getStudySession, getStudySessions } = require('api/study')
// const { reject } = require('utils')

function navigateToStudySession (id) {
  return studyPage({ id })
}
exports.navigateToStudySession = navigateToStudySession
exports.getStudySession = async (id) => {
  id = id || getParam('id')
  return JSON.parse(await getStudySession(id))
}
exports.getStudySessions = async () => {
  return JSON.parse(await getStudySessions())
}
exports.createStudySession = async (deck, startingState) => {
  const newSession = JSON.parse(await createStudySession(deck, startingState))
  navigateToStudySession(newSession.id)
}
exports.sortCardsBySession = (cards, session) => {
  const ordering = strToList(session.ordering)
  const shuffledCards = []
  for (let i = 0; i < cards.length; i++) {
    shuffledCards[i] = cards[ordering[i]]
  }
  return shuffledCards
}
//
// exports.deleteDeck = async (id) => {
//   await deleteDeck(id)
//   const decks = window.lc.getData('decks')
//   const decksWithoutDeleted = reject(decks, { id })
//   window.lc.setData('decks', decksWithoutDeleted)
// }
