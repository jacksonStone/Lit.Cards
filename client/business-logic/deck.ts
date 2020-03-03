interface Deck {
  lastModified: number,
  userEmail: string,
  name: string,
  date: number,
  cards: string,
  id: string,
}


let { deck: deckPage } = require('../routes/navigation/pages')
let { getParam } = require('abstract/url')
let { getDeck, createDeck, deleteDeck, makePublic } = require('../routes/api/decks')
let { reject } = require('utils')
let { setEditorData, getFontSize, childrenHaveTooMuchSpace } = require('abstract/editor')
let { getCardBody } = require('./card-bodies')
let { renderPreviewImageWithRawData, getFileData, getImageAtDifferentSize } = require('abstract/file-upload')
let { runNextRender } = require('abstract/rendering-meta')
let { compress } = require('shared/compress')
let { intToChar, charToInt } = require('shared/char-encoding')

function navigateToDeckPage (deckId: string) {
  return deckPage({ deck: deckId })
}

async function makeDeckPublic (deckId: string) {
  deckId = deckId || getParam('deck.ts.ts')
  if (window.confirm('Once made public you will not be able to delete the deck or the cards, though you can still add and edit cards.')) {
    window.lc.setData(`deck.public`, true)
    await makePublic(deckId)
  }
}
let getDeckLogic = async (deckId: string): Promise<Deck> => {
  deckId = deckId || getParam('deck.ts.ts')
  return <Deck> JSON.parse(await getDeck(deckId))
}
let createDeckLogic = async (name: string) => {
  let newDeck = JSON.parse(await createDeck(name))
  navigateToDeckPage(newDeck.id)
}

let deleteDeckLogic = async (id: string) => {
  await deleteDeck(id)
  let decks = window.lc.getData('decks')
  let studyHistory = window.lc.getData('studyHistory')
  let decksWithoutDeleted = reject(decks, { id })
  let studyHistoryWithoutDeleted = reject(studyHistory || [], { id })
  window.lc.setData('decks', decksWithoutDeleted)
  window.lc.setData('studyHistory', studyHistoryWithoutDeleted)
}

async function handleImageUpload (e: any) {
  // Since image uploads can take a while - make sure we know we are
  // in the process of uploading a little early here for
  // reliable testing
  // TODO:: Maybe clean this up
  window.lc.setFileUploading(true)
  let imageData = await getFileData(e)
  let imagePreview
  if (showingAnswer()) {
    let [largeImage] = await getImageAtDifferentSize(imageData)
    setPersistentForCardBody('backHasImage', true)
    setPersistentForCardBodyCompressed('backImage', largeImage)
    imagePreview = largeImage
  } else {
    let [largeImage] = await getImageAtDifferentSize(imageData)
    setPersistentForCardBody('frontHasImage', true)
    setPersistentForCardBodyCompressed('frontImage', largeImage)
    imagePreview = largeImage
  }
  window.lc.setFileUploading(false)
  renderPreviewImageWithRawData(imagePreview, 'image-spot')
  refreshEditor()
}
function setPersistentForCardBodyCompressed (key: string, value: string) {
  let cardId = _getCurrentCardId()
  let changeKey = `cardBody.${cardId}.${key}`
  window.lc.setPersistentOnly(changeKey, compress(value))
  window.lc.setData(changeKey, value)
}
function setPersistentForCardBody (key: string, value: string | number | boolean) {
  let cardId = _getCurrentCardId()
  let changeKey = `cardBody.${cardId}.${key}`
  window.lc.setPersistentOnly(`cardBody.${cardId}.deck`, window.lc.getData('deck.ts.ts').id)
  window.lc.setPersistent(changeKey, value)
}
function decreaseFontSizeIfOverflowing (oldFontSize = 1, frontOrBack: string) {
  let newFontSize = getFontSize(oldFontSize)
  if (newFontSize === oldFontSize) {
    return
  }
  setPersistentForCardBody(frontOrBack, newFontSize)
  // We may need to bump size multiple times
  runNextRender(() => {
    // We may need to decrease size multiple times
    decreaseFontSizeIfOverflowing(newFontSize, frontOrBack)
  })
}

function increaseFontIfLotsOfSpace (oldFontSize = 1, frontOrBack: string) {
  if (oldFontSize <= 1) {
    return
  }
  if (!childrenHaveTooMuchSpace()) {
    return
  }
  let newFontSize = oldFontSize - 1
  setPersistentForCardBody(frontOrBack, newFontSize)

  runNextRender(() => {
    // We may need to bump size multiple times
    increaseFontIfLotsOfSpace(newFontSize, frontOrBack)
  })
}
function updateFontSizeIfNecessary (oldCardBody: any, newText: string) {
  if (!oldCardBody) return
  if (showingAnswer()) {
    let deletedAChar = oldCardBody.back && (oldCardBody.back.length > newText.length)
    if (deletedAChar) {
      return increaseFontIfLotsOfSpace(oldCardBody.backFontSize, 'backFontSize')
    }
    decreaseFontSizeIfOverflowing(oldCardBody.backFontSize, 'backFontSize')
  } else {
    let deletedAChar = oldCardBody.front && (oldCardBody.front.length > newText.length)
    if (deletedAChar) {
      return increaseFontIfLotsOfSpace(oldCardBody.frontFontSize, 'frontFontSize')
    }
    decreaseFontSizeIfOverflowing(oldCardBody.frontFontSize, 'frontFontSize')
  }
}
function getPresentFontSize () {
  let cardBody = _getCurrentCardBody()
  if (!cardBody) return 1
  if (showingAnswer()) {
    return cardBody.backFontSize
  }
  return cardBody.frontFontSize
}

function handleEditorTextChange (newText: string) {
  if (window.lc.getData('_cardBodyLoading')) {
    return
  }
  let oldCardBody = JSON.parse(JSON.stringify(_getCurrentCardBody()))
  runNextRender(() => {
    updateFontSizeIfNecessary(oldCardBody, newText)
  })
  if (showingAnswer()) {
    if (newText.length > (oldCardBody.backWatermark || 0)) {
      setPersistentForCardBody('backWatermark', newText.length)
    }
    return setPersistentForCardBody('back', newText)
  }
  if (newText.length > (oldCardBody.frontWatermark || 0)) {
    setPersistentForCardBody('frontWatermark', newText.length)
  }
  setPersistentForCardBody('front', newText)
}

function getCardsForEmptyState (newId: string) {
  // Record we made this on the fly
  window.lc.setPersistent(`deck.cards`, newId)
  return newId
}

function getImageData () {
  if (!hasImage()) return ''
  let cardBody = _getCurrentCardBody()
  if (showingAnswer()) {
    return cardBody.backImage
  }
  return cardBody.frontImage
}

function nextCard () {
  let index = _getCurrentCardIndex()
  let cards = window.lc.getData('orderedCards')
  index++
  let newCard = cards[(index % cards.length)]
  window.lc.setData('activeCardId', newCard)
  updateCardBody(newCard, cards)
}

function removeCard () {
  let index = _getCurrentCardIndex()
  let cards = window.lc.getData('orderedCards')
  cards = cards.slice(0, index).concat(cards.slice(index + 1))
  window.lc.setData('deck.ts.ts.cards', cards)
  window.lc.setData('orderedCards', cards)
  setPersistentForCardBody('deleted', true)
  index--
  if (index === -1) {
    index = 0
  }
  let newCard = cards[index]
  window.lc.setData('activeCardId', newCard)
  updateCardBody(newCard, cards)
}

function previousCard () {
  let index = _getCurrentCardIndex()
  let cards = window.lc.getData('orderedCards')
  index--
  let newCard = cards[((index + cards.length) % cards.length)]
  window.lc.setData('activeCardId', newCard)
  updateCardBody(newCard, cards)
}

function flipCard () {
  let showingAnswer = window.lc.getData('showingAnswer')
  window.lc.setData('showingAnswer', !showingAnswer)
  refreshEditor()
}

function pickImage () {
  if (hasImage()) return
  window.document.getElementById('image-upload').click()
}

function removeImage () {
  if (!hasImage()) return
  if (showingAnswer()) {
    setPersistentForCardBody('backHasImage', false)
    setPersistentForCardBody('backImage', '')
  } else {
    setPersistentForCardBody('frontHasImage', false)
    setPersistentForCardBody('frontImage', '')
  }
  refreshEditor()
}

function hasImage () {
  let hasImage
  if (showingAnswer()) {
    hasImage = window.lc.getData(`cardBody.${_getCurrentCardId()}.backHasImage`)
  } else {
    hasImage = window.lc.getData(`cardBody.${_getCurrentCardId()}.frontHasImage`)
  }
  return hasImage || false
}

function showingAnswer () {
  return window.lc.getData('showingAnswer') || false
}

function addNewCard () {
  let deck = window.lc.getData('deck.ts.ts')
  let newIdAsInt = charToInt(deck.cards[deck.cards.length - 1]) + 1
  let newId = intToChar(newIdAsInt)
  let changeKeyCardBody = `cardBody.${newId}`
  let cardBody = { id: newId, isNew: true, front: '', back: '', deleted: false, deck: deck.id }
  let updatedCards = (deck.cards || '') + newId
  window.lc.setData('deck.ts.ts.cards', updatedCards)
  window.lc.setData('orderedCards', updatedCards)
  window.lc.setData('activeCardId', newId)
  window.lc.setPersistent(changeKeyCardBody, cardBody)
  _flipToQuestionSide()
  refreshEditor()
}
function _flipToQuestionSide () {
  window.lc.setData('showingAnswer', false)
}

async function updateCardBody (id:string, cards:any) {
  _flipToQuestionSide()
  let currentCardBody = window.lc.getData('cardBody.' + id)
  if (!currentCardBody) {
    refreshEditor('loading...')
    window.lc.setData('_cardBodyLoading', true, false)
    try{
      await getCardBody(id, undefined, cards)
      window.lc.setData('_cardBodyLoading', false)
      refreshEditor()
    } catch(e) {
      refreshEditor('Failed to load card');
      window.lc.setData('_cardBodyLoading', false)
      refreshEditor()
    }
    // window.lc.setData('cardBody.' + id, cardBody)
  } else {
    getCardBody(id, undefined, cards) // We call this anyway to fetch next card
    refreshEditor()
  }
}
// Re-renders the card area
function refreshEditor (data? :any) {
  if (hasImage()) {
    renderPreviewImageWithRawData(getImageData())
  }
  _updateEditorData(data)
}
function _getCurrentCardBody () {
  let id = _getCurrentCardId()
  return window.lc.getData(`cardBody.${id}`)
}
function getTextToShowForCard () {
  let cardBody = _getCurrentCardBody()
  if (cardBody === undefined) return false
  let showingAnswer = window.lc.getData('showingAnswer')
  if (showingAnswer) {
    // Show answer
    return cardBody.back
  }
  return cardBody.front
}

function _updateEditorData (data? :any) {
  setEditorData(data || getTextToShowForCard())
}
function _getCurrentCardId () {
  return window.lc.getData('activeCardId')
}
function _getCurrentCardIndex () {
  let currentId = _getCurrentCardId()
  let cards = window.lc.getData('orderedCards')
  let currentIndex
  for (let i = 0; i < cards.length; i++) {
    if (cards[i] === currentId) {
      currentIndex = i
      break
    }
  }
  return currentIndex
}

module.exports = {
  navigateToDeckPage,
  getDeckLogic,
  deleteDeck: deleteDeckLogic,
  createDeck: createDeckLogic,
  makeDeckPublic,
  removeImage,
  pickImage,
  flipCard,
  addNewCard,
  previousCard,
  updateCardBody,
  nextCard,
  handleImageUpload,
  hasImage,
  getImageData,
  removeCard,
  refreshEditor,
  getTextToShowForCard,
  handleEditorTextChange,
  getPresentFontSize,
  getCardsForEmptyState
}
