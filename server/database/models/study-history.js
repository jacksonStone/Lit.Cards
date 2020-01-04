let db = require('../external-connections/fake-database-connector')
let tableName = 'studyHistory'
let _ = require('lodash')

async function getStudyHistory (userEmail) {
  let results = await db.getRecord(tableName, { userEmail })
  if(!results || !results.length) {
    return { userEmail, studied: JSON.stringify([]) }
  }
  return results[0];
}

async function editStudyHistory(studyHistory, history) {
  return db.editRecord(tableName, { userEmail: studyHistory.userEmail }, studyHistory);
}

async function upsertStudyHistory(studyHistory, history) {
  let studyHistoryRecords = await db.getRecord(tableName, { userEmail: studyHistory.userEmail })

  //If we have a length of one, was a new array that had first item appended
  if(studyHistoryRecords.length === 0) {
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
