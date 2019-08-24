let db = require('../external-connections/fake-database-connector')
let tableName = 'studyHistory'
let _ = require('lodash')
let { userExists } = require('./user')

async function getStudyHistory (userId) {
  let results = await db.getRecord(tableName, { userId })
  if(!results || !results.length) {
    return { userId, studied: JSON.stringify([]) }
  }
  return results[0];
}

async function editStudyHistory(studyHistory, history) {
  return db.editRecord(tableName, { userId: studyHistory.userId }, studyHistory);
}

async function upsertStudyHistory(studyHistory, history) {
  const studyHistoryRecords = await db.getRecord(tableName, { userId: studyHistory.userId })

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
