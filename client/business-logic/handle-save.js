const { updateDeckName } = require('logic/deck')
const { editCardBody } = require('logic/card-bodies')
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
  await updateDeckName(deck.name)
  currentlySavingName = false
  if (deck.name === originalName) {
    // Did not make changes while waiting
    // Remove the fact that we have changes here
    delete deck.name
    if (Object.keys(deck).length === 0) {
      delete changes.deck
    }
  }
}

const cardsBeingEdited = {}
async function handleCardBodyChange (changes) {
  // Edit cardBodeis
  // Delete cardBodies
  const cardsWithChanges = Object.keys(changes.cardBody)
  for (let i = 0; i < cardsWithChanges.length; i++) {
    const cardId = cardsWithChanges[i]
    const cardBody = changes.cardBody[cardId]
    const changeId = cardBody._changeId
    if (!cardBody.isNew || !cardBody.deleted) {
      // Is an edit
      if (cardsBeingEdited[cardId]) return
      cardsBeingEdited[cardId] = true
      editCardBody(cardId, cardBody).then(res => {
        if (changeId === cardBody._changeId) {
          delete changes.cardBody[cardId]
        }
        delete cardsBeingEdited[cardId]
      }).catch(() => {
        delete cardsBeingEdited[cardId]
        // TODO:: Think of what to do here
      })
    }
  }
}
module.exports = listenToSaveableChanges
