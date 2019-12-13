let { updateDeckName } = require('logic/deck')
let { editCardBody, addCardBody, deleteCardBody } = require('logic/card-bodies')
let { editStudySessionState } = require('logic/study')
let { updateDarkMode, updateHideProgress, updateHideNavigation } = require('logic/user')
function listenToSaveableChanges () {
  let runningAlready = false
  setInterval(() => {
    if (runningAlready || !window.lc.hasPersistentChanges()) {
      return
    }
    runningAlready = true

    // TODO:: Maybe do something more intelligent here
    _handleChanges().then(() => {
      runningAlready = false
    }).catch(() => {
      runningAlready = false
    })
  }, 20);
}
async function _handleChanges () {
  window.lc.transaction_debug = window.lc.transaction_debug || {};
  let changeObj = window.lc.getPersistentChanges()
  let transaction = JSON.parse(JSON.stringify(changeObj));
  window.lc.setSaving(true);
  window.lc.flushPersistentChanges()
  await handleTransaction(transaction);
  window.lc.setSaving(false);
}

async function handleTransaction(transaction) {
  const promises = [];
  if (transaction.deck) {
    if (transaction.deck.name) {
      promises.push(handleNameChange(transaction));
    }
  }
  if (transaction.cardBody) {
    promises.push(handleCardBodyChange(transaction))
  }
  if(transaction.session) {
    promises.push(handleSessionStateChanges(transaction))
  }
  if(transaction.user) {
    promises.push(handleUserChange(transaction))
  }
  await Promise.all(promises);
}
//TODO:: Do something better
function alertIt(e) {
  console.error(e);
}
async function handleNameChange (changes) {
  let deck = changes.deck
  return updateDeckName(deck.name).catch(alertIt);
}

async function handleCardBodyChange (changes) {
  let promises = [];
  let cardsWithChanges = Object.keys(changes.cardBody)
  for (let i = 0; i < cardsWithChanges.length; i++) {
    let cardId = cardsWithChanges[i]
    let cardBody = changes.cardBody[cardId]
    //Ensure we do not step on our own toes
  
    if (!cardBody.isNew && !cardBody.deleted) {
      // Is an edit
      let idToSend = cardId
      let edit = editCardBody(idToSend, cardBody).catch(alertIt)
      promises.push(edit);
    } else if (cardBody.isNew && !cardBody.deleted) {
      let add = addCardBody(cardBody).catch(alertIt)
      promises.push(add);
    } else if(cardBody.deleted) {
      let del = deleteCardBody(cardId).catch(alertIt)
      promises.push(del);
    }
  }
  return Promise.all(promises);
}

async function handleSessionStateChanges(changes) {
  return editStudySessionState(changes.session).catch(alertIt)
}


async function handleUserChange(changes) {
  let user = changes.user
  let promises = [];
  if(user.darkMode !== undefined) {
    savingDarkMode = true
    let dark = updateDarkMode(user.darkMode).catch(alertIt);
    promises.push(dark);
  }
  if(user.hideProgress !== undefined) {
    let hideProgress = updateHideProgress(user.hideProgress).catch(alertIt);
    promises.push(hideProgress);
  }
  if(user.hideNavigation !== undefined) {
    let hideNav = updateHideNavigation(user.hideNavigation).catch(alertIt)
    promises.push(hideNav);
  }
  return Promise.all(promises);
}

module.exports = listenToSaveableChanges
