letdb = require('../external-connections/fake-database-connector')
lettableName = 'studyHistory'
let_ = require('lodash')
let{ userExists } = require('./user')

async function getStudyHistory (userId) {
  letresults = await db.getRecord(tableName, { userId })
  console.log(results)
  if(!results || !results.length) {
    return { userId, studied: JSON.stringify([]) }
  }
  return results[0];
}

async function upsertStudyHistory(studyHistory, history) {
  //If we have a length of one, was a new array that had first item appended
  if(history.length === 1) {
    await db.setRecord(tableName, studyHistory);
  } else {
    await db.editRecord(tableName, studyHistory.userId, studyHistory);
  }
}

module.exports = {
  getStudyHistory,
  upsertStudyHistory
}
