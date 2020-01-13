let db = require('../external-connections/configured-connector')
let tableName = 'studyHistory'
let _ = require('lodash')

async function getStudyHistory (userEmail) {
  let results = await db.getRecord(tableName, { userEmail }, 1)
  if(!results) {
    return { userEmail, studied: JSON.stringify([])}
  }
  return results;
}

async function editStudyHistory(studyHistory, history) {
  return db.editRecord(tableName, { userEmail: studyHistory.userEmail }, studyHistory);
}

async function upsertStudyHistory(studyHistory, history) {
  let studyHistoryRecord = await db.getRecord(tableName, { userEmail: studyHistory.userEmail }, 1)

  //If we have a length of one, was a new array that had first item appended
  if(!studyHistoryRecord) {
    await db.setRecord(tableName, studyHistory);
  } else {
    await editStudyHistory(studyHistory, history)
  }
}

module.exports = {
  getStudyHistory,
  upsertStudyHistory,
  editStudyHistory
}
