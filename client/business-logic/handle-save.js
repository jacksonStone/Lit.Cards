const { updateDeckName } = require('logic/deck')
const { editCardBody, addCardBody } = require('logic/card-bodies')
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
  console.log(changes)
  if (changes.deck) {
    if (changes.deck.name) {
      handleNameChange(changes)
      // delete changes.deck.name
    }
  }
  if (changes.cardBody) {
    handleCardBodyChange(changes)
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
const addedCardsTempIdToTrueId = {}
async function handleCardBodyChange (changes) {
  // Edit cardBodeis
  // Delete cardBodies
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
    }
  }
}
module.exports = listenToSaveableChanges
