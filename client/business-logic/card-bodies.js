const { getCardBody, editCardBody, addCardBody, deleteCardBody } = require('../routes/api/card-bodies')
const { getParam } = require('../browser-abstractions/url')
const { decompress } = require('shared/compress')
const cachedCardBodies = {}
function getDefaultDeck (deck) {
  if (!deck) {
    deck = getParam('deck')
    if (!deck) {
      const dataDeck = window.lc.getData('deck')
      if (dataDeck && dataDeck.id) {
        deck = dataDeck.id
      }
    }
  }
  return deck
}
exports.getCardBody = async (card, deck, visibleCards) => {
  if (!card) {
    return
  }
  let cardsToFetch = [card];
  if (visibleCards) {
    let indexOfCard = visibleCards.findIndex(entry => {
      return entry.id === card
    });
    indexesToFetch = [
      (indexOfCard + 1) % visibleCards.length,
      (indexOfCard + 2) % visibleCards.length,
      (indexOfCard - 1) % visibleCards.length,
    ]
    for(let i = 0; i < indexesToFetch.length; i++) {
      const index = indexesToFetch[i]
      if(visibleCards[index]) {
        cardsToFetch.push(visibleCards[index].id)
      }
    }
  }
  deck = getDefaultDeck(deck)
  let firstCardBody
  //don't wait on other fetches
  return new Promise(async (resolve, reject) => {
    for(let i = 0; i < cardsToFetch.length; i++) {
      let card = cardsToFetch[i];
      try {
        if (!cachedCardBodies[`${deck}:${card}`]) {

          let cardData = await getCardBody(deck, card)
          const cardDataAsJSON = JSON.parse(cardData)
          if (cardDataAsJSON) {
            // Decompress images
            if (cardDataAsJSON.frontHasImage) {
              cardDataAsJSON.frontImage = decompress(cardDataAsJSON.frontImage)
            }
            if (cardDataAsJSON.backHasImage) {
              cardDataAsJSON.backImage = decompress(cardDataAsJSON.backImage)
            }
          }
          cachedCardBodies[`${deck}:${card}`] = cardDataAsJSON
          if(!firstCardBody) {
            firstCardBody = cardDataAsJSON;
            resolve(JSON.parse(JSON.stringify(firstCardBody)))
          }
        } else { //No cache
          if(!firstCardBody) {
            firstCardBody = cachedCardBodies[`${deck}:${card}`]
            resolve(JSON.parse(JSON.stringify(firstCardBody)))
          }
        }
      } catch (e) {
        return reject(e)
      }
    }
  })
}

exports.getCardBodyForEmptyState = (newId) => {
  const emptyValue = { id: newId, isNew: true, front: '', back: '' }
  // Record we made this on the fly
  window.lc.setPersistent(`cardBody.${newId}`, emptyValue)
  return emptyValue
}

exports.persistCardBodyChange = (cardBody, key, value) => {
  const changeCardBodyId = getCardBodyChangeId(cardBody)
  const changePath = `${changeCardBodyId}.${key}`
  window.lc.setPersistent(changePath, value)
}
function getCardBodyChangeId (cardBody) {
  return `cardBody.${cardBody.id}`
}
exports.editCardBody = (card, changes, deck) => {
  if (!card) {
    return
  }
  deck = getDefaultDeck(deck)
  return editCardBody(deck, card, changes)
}
exports.deleteCardBody = (card, deck) => {
  if (!card) {
    return
  }
  deck = getDefaultDeck(deck)
  return deleteCardBody(deck, card)
}
exports.addCardBody = async (changes, deck) => {
  deck = getDefaultDeck(deck)
  return addCardBody(deck, changes)
}
