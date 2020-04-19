const fileIO = require('../utils/file-io');
const deckController = require('../server/buisness-logic/deck');

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
  console.log("UNSUPPORTED GET: " + path);
  throw Error("Unsupported get");

}

function handlePostRequest(path, body) {
  console.log(`Post: ${path}, ${JSON.stringify(body)}`);

  if(path === "transaction") {
    return handleTransaction(body);
  }
  if(path === "decks/create") {
    return deckController.addDeck(undefined, body.name);
  }
  console.log("UNSUPPORTED POST", path, body);
  return JSON.stringify([]);
}


async function meDecks(){
  const decks = await fileIO.getDirFiles('deck');
  const deckPayloads = await Promise.all(decks.map(async deckId => {
    return JSON.parse(await fileIO.getFile('deck/' + deckId));
  }));
  return deckPayloads;
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




async function createDeck(body) {
  const id = uuidv4();
  const name = body.name || 'Untitled';

}

async function handleTransaction(transaction) {
  if (transaction.user) {
    const userStr = await fileIO.getFile('user');
    let user = JSON.parse(userStr);
    user = {...user, ...transaction.user};
    await fileIO.setFile('user', JSON.stringify(user));
  }
  if(transaction.deck) {
    console.log(transaction.deck);
  }

}
module.exports = {
  handleGetRequest,
  handlePostRequest
};


function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
