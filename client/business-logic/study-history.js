let { getStudyhistory } = require('../routes/api/study-history')

async function fetchStudyHistory () {
  let deckHistory = await getStudyhistory()
  try {
    deckHistory = JSON.parse(deckHistory)
  } catch (e) {
    return []
  }
  if (deckHistory.none) {
    return []
  }
  return deckHistory
}

module.exports = {
  fetchStudyHistory
}
