const fileIO = require('../utils/file-io');

function handleGetRequest(path) {
  console.log(`Get: ${path}`);

  if (path === 'decks/me') {
    return meDecks();
  }

  if (path === 'study/me') {
    return meStudys();
  }

  if (path === 'study-history/me') {
    return meStudys();
  }

  if (path === 'user/me') {
    return meUser();
  }
}

async function meDecks(){
  const decks = await fileIO.getDirFiles('deck');
  return decks;
}
async function meStudys(){
  const sessions = await fileIO.getDirFiles('studySession');
  return sessions;
}
async function meStudyHistories(){
  const histories = await fileIO.getDirFiles('studyHistory');
  return histories;
}
async function meUser(){
  const userStr = await fileIO.getFile('user');
  const user = JSON.parse(userStr);
  return user;
}
module.exports = handleGetRequest;
