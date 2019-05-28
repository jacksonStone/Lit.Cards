// TODO:: STUDY
const { StudySession } = require('../database')
async function createSession (userId, deck, startingState) {
  return StudySession.createStudySession(userId, deck, startingState)
}
async function deleteSession (userId, id) {
  return StudySession.deleteStudySession(userId, id)
}
async function getSession (userId, id) {
  return StudySession.getStudySession(userId, id)
}
async function getSessions (userId) {
  return StudySession.getStudySessions(userId)
}

module.exports = {
  createSession,
  deleteSession,
  getSession,
  getSessions
}
