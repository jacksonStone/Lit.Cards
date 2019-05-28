// TODO:: STUDY
const { api } = require('./apiRequest')

exports.getStudySessions = () => {
  return api('study/me')
}
exports.getStudySession = (id) => {
  return api(`study/${id}`)
}
exports.createStudySession = (deck, startingState) => {
  return api('study/create', { deck, startingState })
}
exports.deleteStudySession = (id) => {
  return api('study/delete', { id })
}
