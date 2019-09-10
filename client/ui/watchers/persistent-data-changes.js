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
  }, 100);
}

async function _handleChanges () {
  let changes = window.lc.getPersistentChanges()
  if (changes.deck) {
    if (changes.deck.name) {
      handleNameChange(changes)
    }
  }
  if (changes.cardBody) {
    handleCardBodyChange(changes)
  }
  if(changes.session) {
    handleSessionStateChanges(changes)
  }
  if(changes.user) {
    handleUserChange(changes)
  }
}

let currentlySavingName
async function handleNameChange (changes) {
  let deck = changes.deck
  let originalName = deck.name
  if (currentlySavingName) {
    return
  }
  currentlySavingName = true
  updateDeckName(deck.name).then(() => {
    currentlySavingName = false
    if (deck.name === originalName) {
      // Did not make changes while waiting
      // Remove the fact that we have changes here
      delete deck.name
      if (Object.keys(deck).length === 0) {
        delete changes.deck
      }
    }
  }).catch(() => {
    // TODO:: Think of something to do here
  })
}

let cardsBeingChanged = {}
async function handleCardBodyChange (changes) {
  let cardsWithChanges = Object.keys(changes.cardBody)
  for (let i = 0; i < cardsWithChanges.length; i++) {
    let cardId = cardsWithChanges[i]
    let cardBody = changes.cardBody[cardId]
    let changeId = cardBody._changeId
    //Ensure we do not step on our own toes
    if(cardsBeingChanged[cardId]) {
      continue;
    } else {
      cardsBeingChanged[cardId] = true;
    }
    if (!cardBody.isNew && !cardBody.deleted) {
      // Is an edit
      let idToSend = cardId
      editCardBody(idToSend, cardBody).then(() => {
        if (changeId === cardBody._changeId) {
          delete changes.cardBody[cardId]
          if (Object.keys(changes.cardBody).length === 0) {
            delete changes.cardBody
          }
        }
        delete cardsBeingChanged[cardId]
      }).catch(() => {
        delete cardsBeingChanged[cardId]
        // TODO:: Think of what to do here
      })
    } else if (cardBody.isNew && !cardBody.deleted) {
      addCardBody(cardBody).then((newId) => {
        if (changeId === cardBody._changeId) {
          delete changes.cardBody[cardId]
          if (Object.keys(changes.cardBody).length === 0) {
            delete changes.cardBody
          }
        } else {
          delete changes.cardBody[cardId].isNew
        }
        delete cardsBeingChanged[cardId]
      }).catch(() => {
        delete cardsBeingChanged[cardId]
        // TODO:: Think of what to do here
      })
    } else if(cardBody.deleted) {
      cardsBeingDeleted[cardId] = true
      deleteCardBody(cardId).then(()=>{
        if (changeId === cardBody._changeId) {
          delete changes.cardBody[cardId]
          if (Object.keys(changes.cardBody).length === 0) {
            delete changes.cardBody
          }
        } else {
          delete changes.cardBody[cardId].deleted
        }
        delete cardsBeingChanged[cardId]
      }).catch(()=>{
        delete cardsBeingChanged[cardId]
        // TODO:: Think of what to do here
      })

    }
  }
}

let savingSession = false
async function handleSessionStateChanges(changes) {
  if(savingSession) {
    return
  }
  savingSession = true
  let currentlySavingState = changes.session.studyState
  let currentlySavingCurrent = changes.session.currentCard
  let currentlySavingOrdering = changes.session.ordering
  editStudySessionState(changes.session).then(()=>{
    if(currentlySavingState === changes.session.studyState) {
      //All caught up
      delete changes.session.studyState
    }
    if(currentlySavingOrdering === changes.session.ordering) {
      //All caught up
      delete changes.session.ordering
    }
    if(currentlySavingCurrent === changes.session.currentCard) {
      //All caught up
      delete changes.session.currentCard
    }
    if(!Object.keys(changes.session).length) {
      delete changes.session
    }
    savingSession = false
  }).catch(()=>{
    savingSession = false
  })
}

let savingDarkMode = false
let savingHideProgress = false
let savingHideNavigation = false
//TODO:: Consider deduping code
async function handleUserChange(changes) {
  let user = changes.user
  if(user.darkMode !== undefined) {
    let startingValue = user.darkMode
    savingDarkMode = true
    updateDarkMode(user.darkMode).then(() => {
      if(startingValue === changes.user.darkMode) {
        delete changes.user.darkMode
      }
      savingDarkMode = false
      if(Object.keys(changes.user).length === 0) {
        delete changes.user
      }
    }).catch(() => {
      savingDarkMode = false
    })
  }
  if(user.hideProgress !== undefined) {
    let startingValue = user.hideProgress
    savingHideProgress = true
    updateHideProgress(user.hideProgress).then(() => {
      if(startingValue === changes.user.hideProgress) {
        delete changes.user.hideProgress
      }
      savingHideProgress = false
      if(Object.keys(changes.user).length === 0) {
        delete changes.user
      }
    }).catch(() => {
      savingHideProgress = false
    })
  }
  if(user.hideNavigation !== undefined) {
    let startingValue = user.hideNavigation
    savingHideNavigation = true
    updateHideNavigation(user.hideNavigation).then(() => {
      if(startingValue === changes.user.hideNavigation) {
        delete changes.user.hideNavigation
      }
      savingHideNavigation = false
      if(Object.keys(changes.user).length === 0) {
        delete changes.user
      }
    }).catch(() => {
      savingHideNavigation = false
    })
  }
}

module.exports = listenToSaveableChanges
