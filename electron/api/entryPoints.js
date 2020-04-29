
//These below dependencies are copied from the ../../server folder during a build
//and are shared between the web version of the app and the electron version

//***DO NOT EDIT THESE REQUIRED FILES DIRECTLY***
const deckController = require('../server/buisness-logic/deck');
const userController = require('../server/buisness-logic/users/userDetails');
const studyController = require('../server/buisness-logic/study');
const cardController = require('../server/buisness-logic/card-body');
const studyHistoryController = require('../server/buisness-logic/study-history');
const transactionController = require('../server/buisness-logic/transaction');
//***DO NOT EDIT THE ABOVE REQUIRED FILES DIRECTLY***

function handleGetRequest(path) {

  if (path.startsWith('decks')) {
    if(path.includes('/me')) {
      // deck/me
      return deckController.getDecks();
    } else {
      // deck/:id
      const deckId = path.split('/')[1];
      return deckController.getDeck(undefined, deckId);
    }
  }

  if (path === 'study-history/me') {
    return studyHistoryController.getDeckDetailsFromStudyHistory();
  }

  if(path.startsWith('study/')) {
    if(path.includes('/me')) {
      // study/me
      return studyController.getSessionsAndBorrowedDecks();
    }
    if(path.includes('/deck/')) {
      // study/deck/:id
      const deckId = path.split('/')[2];
      return studyController.getSessionByDeck(undefined, deckId);
    }
    else {
      // study/:id
      const id = path.split('/')[1];
      return studyController.getSession(undefined, id);
    }
  }

  if(path.startsWith('card-body/')) {
    /**
     * card-body/:deck?card=card
     * card-body/:deck?card=card&t=foo
     * card-body/:deck
    */
    let deckId, cardId;

    if(!path.includes('?')) {
      deckId = path.split('/')[1];
    }
    else {
      deckId = path.split('/')[1].split('?')[0];
      cardId = decodeURIComponent(path.split('card=')[1].split('&')[0]);
    }
    return cardController.getCardBody(undefined, deckId, cardId);
  }

  if (path === 'user/me') {
    return userController.getUserDetails();
  }
  console.log("UNSUPPORTED GET: " + path);
  throw Error("Unsupported get");

}

function handlePostRequest(path, body) {
  console.log(`Post: ${path}, ${JSON.stringify(body)}`);

  if(path === "transaction") {
    return transactionController.handleTransaction(undefined, body);
  }
  if(path === "decks/create") {
    return deckController.addDeck(undefined, body.name);
  }
  if(path === "decks/delete") {
    return deckController.deleteDeck(undefined, body.id);
  }
  if(path === "decks/make-public") {
    return deckController.makeDeckPublic(undefined, body.id);
  }
  if(path === "study/create") {
    return studyController.createSession(undefined, body.deck, body.startingState)
  }
  if(path === "study/delete") {
    return studyController.deleteSession(undefined, body.id)
  }
  console.log("UNSUPPORTED POST", path, body);
  throw Error("Unsupported POST");
}


module.exports = {
  handleGetRequest,
  handlePostRequest
};
