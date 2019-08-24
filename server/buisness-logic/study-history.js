let { getDeck } = require('../database/models/deck')
let { getStudyHistory, upsertStudyHistory, editStudyHistory } = require('../database/models/study-history')
let HISTORY_LIMIT = 6;

async function getDeckDetailsFromStudyHistory (userId) {
  let studyHistory = await getStudyHistory(userId);
  let history = JSON.parse(studyHistory.studied);
  let decks = await Promise.all(history.map(deckId => {
    return getDeck(userId, deckId);
  }));
  return decks;
}

async function removeFromStudyHistory (userId, deck) {
  let studyHistory = await getStudyHistory(userId);
  let history = JSON.parse(studyHistory.studied);
  let existingIndex = history.findIndex(entry => entry === deck);
  if(existingIndex !== -1) {
    // remove from list
    history.splice(existingIndex,1);
    studyHistory.studied = JSON.stringify(history);
    await editStudyHistory(studyHistory, history);
  }
}


async function pushStudyHistory (userId, deck) {
  let studyHistory = await getStudyHistory(userId);
  let history = JSON.parse(studyHistory.studied);
  let existingIndex = history.findIndex(entry => entry === deck);
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
  removeFromStudyHistory,
  pushStudyHistory
}
