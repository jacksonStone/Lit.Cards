let { getCardBody } = require('../routes/api/card-bodies')
let { getParam } = require('../browser-abstractions/url')
let { decompress } = require('shared/compress')
let cachedCardBodies = {}
function getDefaultDeck (deck) {
  if (!deck) {
    deck = getParam('deck')
    if (!deck) {
      let dataDeck = window.lc.getData('deck')
      if (dataDeck && dataDeck.id) {
        deck = dataDeck.id
      }
    }
  }
  return deck
}
let inProgressRequests = {};
exports.getCardBody = async (card, deck, visibleCards) => {
  if (!card) {
    return
  }
  let cardsToFetch = [card]
  if (visibleCards) {
    let indexOfCard = visibleCards.indexOf(card)
    let indexesToFetch = [
      (indexOfCard + 1) % visibleCards.length,
      (indexOfCard - 1) % visibleCards.length,
      (indexOfCard + 2) % visibleCards.length,
      (indexOfCard - 2) % visibleCards.length
    ]
    for (let i = 0; i < indexesToFetch.length; i++) {
      let index = indexesToFetch[i]
      if (visibleCards[index]) {
        cardsToFetch.push(visibleCards[index])
      }
    }
  }
  deck = getDefaultDeck(deck)
  let firstCardBody
  // don't wait on other fetches
  return new Promise(async (resolve, reject) => {
    for (let i = 0; i < cardsToFetch.length; i++) {
      let card = cardsToFetch[i]
      let cardBodyDataId = `cardBody.${card}`;
      try {
        if (!window.lc.getData(cardBodyDataId) && !inProgressRequests[cardBodyDataId]) {
          // No cache
          inProgressRequests[cardBodyDataId] = getCardBody(deck, card)
          let cardData = await inProgressRequests[cardBodyDataId];
          delete inProgressRequests[cardBodyDataId];
          let cardDataAsJSON = JSON.parse(cardData)
          if (cardDataAsJSON) {
            cardDataAsJSON.front = cardDataAsJSON.front || ''
            cardDataAsJSON.back = cardDataAsJSON.back || ''

            // Decompress images
            if (cardDataAsJSON.frontHasImage) {
              cardDataAsJSON.frontImage = decompress(cardDataAsJSON.frontImage)
            }
            if (cardDataAsJSON.backHasImage) {
              cardDataAsJSON.backImage = decompress(cardDataAsJSON.backImage)
            }
          }
          if (!firstCardBody) {
            firstCardBody = cardDataAsJSON
            window.lc.setData(cardBodyDataId, cardDataAsJSON);
            resolve(JSON.parse(JSON.stringify(firstCardBody)))
          } else {
            window.lc.setData(cardBodyDataId, cardDataAsJSON, false);
          }
        } else if (inProgressRequests[cardBodyDataId]) {
          return inProgressRequests[cardBodyDataId]
        } else if (!firstCardBody) {
          firstCardBody = window.lc.getData(cardBodyDataId);
          resolve(JSON.parse(JSON.stringify(firstCardBody)))
        }
      } catch (e) {
        return reject(e)
      }
    }
  })
}

exports.getCardBodyForEmptyState = (newId) => {
  let emptyValue = { id: newId, isNew: true, front: '', back: '', deck: getDefaultDeck() }
  // Record we made this on the fly
  window.lc.setPersistent(`cardBody.${newId}`, emptyValue)
  return emptyValue
}

exports.persistCardBodyChange = (cardBody, key, value) => {
  let changeCardBodyId = getCardBodyChangeId(cardBody)
  let changePath = `${changeCardBodyId}.${key}`
  window.lc.setPersistent(changePath, value)
  let changes = window.lc.getPersistentChanges()
  if (!changes.cardBody[cardBody.id].deck) {
    let deckPath = `${changeCardBodyId}.deck`
    window.lc.setPersistent(deckPath, getDefaultDeck())
  }
}
function getCardBodyChangeId (cardBody) {
  return `cardBody.${cardBody.id}`
}
