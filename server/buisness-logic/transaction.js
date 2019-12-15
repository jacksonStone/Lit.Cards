const { renameDeck } = require('./deck')
const { editCardBody, upsertCardBody, deleteCardBody } = require('./card-body')
const { setMisc } = require('./users/userDetails.js')
const { editSessionState } = require('./study')

// TODO:: Do better
let alertIt = (e) => {
  console.error(e)
}

async function handleTransaction (userEmail, transaction) {
  const promises = []
  if (transaction.deck) {
    if (transaction.deck.name && transaction.deck.id) {
      // TODO:: Verify id gets passed up in transaction
      promises.push(renameDeck(userEmail, transaction.deck.id, transaction.deck.name).catch(alertIt))
    }
  }
  if (transaction.cardBody) {
    promises.push(handleCardBodyChange(userEmail, transaction))
  }
  if (transaction.session) {
    promises.push(editSessionState(userEmail, transaction.session).catch(alertIt))
  }
  if (transaction.user) {
    promises.push(handleUserChange(userEmail, transaction))
  }
  await Promise.all(promises)
}

async function handleCardBodyChange (userEmail, transaction) {
  let promises = []
  let cardsWithChanges = Object.keys(transaction.cardBody)
  for (let i = 0; i < cardsWithChanges.length; i++) {
    let cardId = cardsWithChanges[i]
    let cardBody = transaction.cardBody[cardId]
    let deck = cardBody.deck
    delete cardBody.deck
    if (!deck) {
      console.log('No deck!', cardBody)
      continue
    }
    if (!cardBody.isNew && !cardBody.deleted) {
      // Is an edit
      let edit = editCardBody(userEmail, deck, cardId, cardBody).catch(alertIt)
      promises.push(edit)
    } else if (cardBody.isNew && !cardBody.deleted) {
      cardBody.id = cardId
      let add = upsertCardBody(userEmail, deck, cardBody).catch(alertIt)
      promises.push(add)
    } else if (cardBody.deleted) {
      let del = deleteCardBody(userEmail, deck, cardId).catch(alertIt)
      promises.push(del)
    }
  }
  return Promise.all(promises)
}

async function handleUserChange (userEmail, transaction) {
  let user = transaction.user
  return setMisc(userEmail, user)
}

module.exports = {
  handleTransaction
}
