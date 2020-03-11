import { getCardBody as apiGetCardBody } from '../routes/api/card-bodies'
import { getParam } from '../browser-abstractions/url'
import { LZString } from 'shared/compress'
import 'types';

const decompress = LZString.decompress

function getDefaultDeck (deckId ?:string) :string {
  if (!deckId) {
    deckId = getParam('deck')
    if (!deckId) {
      let dataDeck = window.lc.getData('deck')
      if (dataDeck && dataDeck.id) {
        deckId = dataDeck.id
      }
    }
  }
  return deckId
}
interface InProgressRequests {
  [key: string]: Promise<string>
}
let inProgressRequests: InProgressRequests = {}

export const getCardBody = async (card: string, deckId: string, visibleCards: string) : Promise<CardBody> => {
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
  deckId = getDefaultDeck(deckId)
  let targetCard = card
  // don't wait on other fetches
  return new Promise(async (resolve, reject) => {
    cardsToFetch.forEach(async (card) => {
      let cardBodyDataId = `cardBody.${card}`
      let cachedCard = window.lc.getData(cardBodyDataId)
      try {
        if (!cachedCard && !inProgressRequests[cardBodyDataId]) {
          // No cache
          inProgressRequests[cardBodyDataId] = apiGetCardBody(deckId, card)
          let cardData = await inProgressRequests[cardBodyDataId]
          delete inProgressRequests[cardBodyDataId]
          let cardDataAsJSON = <CardBody>JSON.parse(cardData)
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
          if (card === targetCard) {
            window.lc.setData(cardBodyDataId, cardDataAsJSON)
            resolve(cardDataAsJSON)
          } else {
            window.lc.setData(cardBodyDataId, cardDataAsJSON, false)
          }
        } else if (inProgressRequests[cardBodyDataId]) {
          return inProgressRequests[cardBodyDataId]
        } else if (card === targetCard) {
          resolve(cachedCard)
        }
      } catch (e) {
        return reject(e)
      }
    })
  })
}

export const getCardBodyForEmptyState = (newId: string) :CardBody => {
  let emptyValue = { id: newId, isNew: true, front: '', back: '', deck: getDefaultDeck() }
  // Record we made this on the fly
  window.lc.setPersistent(`cardBody.${newId}`, emptyValue)
  return emptyValue
}

export const persistCardBodyChange = (cardBody: CardBody, key: string, value: any) => {
  let changeCardBodyId = getCardBodyChangeId(cardBody)
  let changePath = `${changeCardBodyId}.${key}`
  window.lc.setPersistent(changePath, value)
  let changes = window.lc.getPersistentChanges()
  if (!changes.cardBody[cardBody.id].deck) {
    let deckPath = `${changeCardBodyId}.deck`
    window.lc.setPersistent(deckPath, getDefaultDeck())
  }
}

function getCardBodyChangeId (cardBody: CardBody) :string {
  return `cardBody.${cardBody.id}`
}
