const { api } = require('./api-request')

exports.getStudySessions = () => {
  return api('study/me')
}
exports.getStudySession = (id) => {
  return api(`study/${id}`)
}
exports.getStudySessionForDeck = (deckId) => {
  return api(`study/deck/${deckId}`)
}
exports.createStudySession = (deck, startingState) => {
  return api('study/create', { deck, startingState })
}
exports.deleteStudySession = (id) => {
  return api('study/delete', { id })
}
