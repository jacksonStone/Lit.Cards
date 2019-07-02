const { updateDeckName } = require('logic/deck')
const { editCardBody, addCardBody, deleteCardBody } = require('logic/card-bodies')
const { editStudySessionState } = require('logic/study')
const { updateDarkMode } = require('logic/user')
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
  }, 1000)
}

async function _handleChanges () {
  const changes = window.lc.getPersistentChanges()
  if (changes.deck) {
    if (changes.deck.name) {
      handleNameChange(changes)
      // delete changes.deck.name
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
  const deck = changes.deck
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

const cardsBeingEdited = {}
const cardsBeingAdded = {}
const cardsBeingDeleted = {}
const addedCardsTempIdToTrueId = {}
async function handleCardBodyChange (changes) {
  const cardsWithChanges = Object.keys(changes.cardBody)
  for (let i = 0; i < cardsWithChanges.length; i++) {
    const cardId = cardsWithChanges[i]
    const cardBody = changes.cardBody[cardId]
    const changeId = cardBody._changeId
    if (!cardBody.isNew && !cardBody.deleted) {
      // Is an edit
      if (cardsBeingEdited[cardId]) continue
      cardsBeingEdited[cardId] = true
      const idToSend = addedCardsTempIdToTrueId[cardId] || cardId
      editCardBody(idToSend, cardBody).then(() => {
        if (changeId === cardBody._changeId) {
          delete changes.cardBody[cardId]
          if (Object.keys(changes.cardBody).length === 0) {
            delete changes.cardBody
          }
        }
        delete cardsBeingEdited[cardId]
      }).catch(() => {
        // delete cardsBeingEdited[cardId]
        // TODO:: Think of what to do here
      })
    } else if (cardBody.isNew && !cardBody.deleted) {
      if (cardsBeingAdded[cardId]) {
        continue
      }
      cardsBeingAdded[cardId] = true
      addCardBody(cardBody).then((newId) => {
        addedCardsTempIdToTrueId[cardId] = newId
        if (changeId === cardBody._changeId) {
          delete changes.cardBody[cardId]
          if (Object.keys(changes.cardBody).length === 0) {
            delete changes.cardBody
          }
        } else {
          delete changes.cardBody[cardId].isNew
        }
        delete cardsBeingAdded[cardId]
      }).catch(() => {
        // delete cardsBeingAdded[cardId]
        // TODO:: Think of what to do here
      })
    } else if(cardBody.deleted) {
      if (cardsBeingDeleted[cardId]) {
        continue
      }
      cardsBeingDeleted[cardId] = true
      deleteCardBody(cardId).then(()=>{
        delete changes.cardBody[cardId]
        delete cardsBeingDeleted[cardId]
      }).catch(()=>{
        delete changes.cardBody[cardId]
      })

    }
  }
}
module.exports = listenToSaveableChanges

let savingSession = false
async function handleSessionStateChanges(changes) {
  if(savingSession) {
    return
  }
  savingSession = true
  let currentlySaving = changes.session.studyState
  editStudySessionState(changes.session).then(()=>{
    if(currentlySaving === changes.studyState) {
      //All caught up
      delete changes.session.studyState
      if(!Object.key(changes.session).length) {
        delete changes.session
      }
      savingSession = false
    }
  }).catch(()=>{
    savingSession = false
  })
}

let savingDarkMode = false
async function handleUserChange(changes) {
  const user = changes.user
  debugger
  if(user.darkMode !== undefined) {
    const startingValue = user.darkMode
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
}
