const { updateDeckName } = require('logic/deck')
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
}

let currentlySaving
async function handleNameChange (changes) {
  const deck = changes.deck
  let originalName = deck.name
  if (currentlySaving) {
    return
  }
  currentlySaving = true
  await updateDeckName(deck.name)
  currentlySaving = false
  if (deck.name === originalName) {
    // Did not make changes while waiting
    // Remove the fact that we have changes here
    delete deck.name
    if (Object.keys(deck).length === 0) {
      delete changes.deck
    }
  }
}

module.exports = listenToSaveableChanges
