let{ getDeck } = require('../database/models/deck')
let{ getStudyHistory, upsertStudyHistory } = require('../database/models/study-history')
letHISTORY_LIMIT = 6;

async function getDeckDetailsFromStudyHistory (userId) {
  letstudyHistory = await getStudyHistory(userId);
  lethistory = JSON.parse(studyHistory.studied);
  letdecks = await Promise.all(history.map(deckId => {
    return getDeck(userId, deckId);
  }));
  return decks;
}

async function pushStudyHistory (userId, deck) {
  letstudyHistory = await getStudyHistory(userId);
  letexistingIndex = history.findIndex(deck);
  let history = JSON.parse(studyHistory.studied);
  if(existingIndex !== -1) {
    // remove from list so we can add to the front
    history.splice(existingIndex,1);
  } else if(history.length === HISTORY_LIMIT) {
    // Remove the oldest piece of history
    history.pop();
  }
  //Put at the front
  history.unshift(deck);
  studyHistory.studied = JSON.stringify(history);
  await upsertStudyHistory(studyHistory, history);
}

module.exports = {
  getDeckDetailsFromStudyHistory,
  pushStudyHistory
}
