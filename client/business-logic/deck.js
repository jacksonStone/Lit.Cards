const { deck: deckPage } = require('../routes/navigation/pages')
const { getParam } = require('abstract/url')
const { getDeck, createDeck, deleteDeck, renameDeck } = require('../routes/api/decks')
const { reject } = require('utils')
const { setEditorData, getFontSize, getTextOnly, childrenHaveTooMuchSpace } = require('abstract/editor')
const { getCardBody } = require('./card-bodies')
const { renderPreviewImageWithRawData, getFileData, getImageAtDifferentSize } = require('abstract/file-upload')
const { runNextRender } = require('abstract/rendering-meta')
const { compress } = require('shared/compress')

function navigateToDeckPage (deckId) {
  return deckPage({ deck: deckId })
}
getDeckLogic = async (deckId) => {
  deckId = deckId || getParam('deck')
  return JSON.parse(await getDeck(deckId))
}
createDeckLogic = async (name) => {
  const newDeck = JSON.parse(await createDeck(name))
  navigateToDeckPage(newDeck.id)
}

deleteDeckLogic = async (id) => {
  await deleteDeck(id)
  const decks = window.lc.getData('decks')
  const decksWithoutDeleted = reject(decks, { id })
  window.lc.setData('decks', decksWithoutDeleted)
}

updateDeckNameLogic = async (name, deckId) => {
  deckId = deckId || getParam('deck')
  return renameDeck(deckId, name)
}

async function handleImageUpload (e) {
  const imageData = await getFileData(e)
  let imagePreview
  if (showingAnswer()) {
    const [largeImage] = await getImageAtDifferentSize(imageData)
    setPersistentForCardBody('backHasImage', true)
    setPersistentForCardBodyCompressed('backImage', largeImage)
    imagePreview = largeImage
  } else {
    const [largeImage] = await getImageAtDifferentSize(imageData)
    setPersistentForCardBody('frontHasImage', true)
    setPersistentForCardBodyCompressed('frontImage', largeImage)
    imagePreview = largeImage
  }
  renderPreviewImageWithRawData(imagePreview, 'image-spot')
  refreshEditor()
}
function setPersistentForCardBodyCompressed (key, value) {
  const cardId = _getCurrentCardId()
  const changeKey = `cardBody.${cardId}.${key}`
  window.lc.setPersistentOnly(`cardBody.${cardId}._changeId`, Math.random())
  window.lc.setPersistentOnly(changeKey, compress(value))
  window.lc.setData(changeKey, value)
}
function setPersistentForCardBody (key, value) {
  const cardId = _getCurrentCardId()
  const changeKey = `cardBody.${cardId}.${key}`
  window.lc.setPersistentOnly(`cardBody.${cardId}._changeId`, Math.random())
  window.lc.setPersistent(changeKey, value)
}
function decreaseFontSizeIfOverflowing (oldFontSize = 1, frontOrBack) {
  let newFontSize = getFontSize(oldFontSize)
  if (newFontSize === oldFontSize) {
    return
  }
  setPersistentForCardBody(frontOrBack, newFontSize)
  //We may need to bump size multiple times
  runNextRender(() => {
    //We may need to decrease size multiple times
    decreaseFontSizeIfOverflowing(newFontSize, frontOrBack)
  });
}

function increaseFontIfLotsOfSpace (oldFontSize = 1, frontOrBack) {
  if(oldFontSize <= 1) {
    return
  }
  if(!childrenHaveTooMuchSpace()) {
    return
  }
  const newFontSize = oldFontSize - 1
  setPersistentForCardBody(frontOrBack, newFontSize)

  runNextRender(() => {
    //We may need to bump size multiple times
    increaseFontIfLotsOfSpace(newFontSize, frontOrBack)
  })
}
function updateFontSizeIfNecessary (oldCardBody, newText) {
  if (!oldCardBody) return
  if (showingAnswer()) {
    const deletedAChar = oldCardBody.back && (oldCardBody.back.length > newText.length)
    if (deletedAChar) {
      return increaseFontIfLotsOfSpace(oldCardBody.backFontSize, 'backFontSize')
    }
    decreaseFontSizeIfOverflowing(oldCardBody.backFontSize, 'backFontSize')
  } else {
    const deletedAChar = oldCardBody.front && (oldCardBody.front.length > newText.length)
    if (deletedAChar) {
      return increaseFontIfLotsOfSpace(oldCardBody.frontFontSize, 'frontFontSize')
    }
    decreaseFontSizeIfOverflowing(oldCardBody.frontFontSize, 'frontFontSize')
  }
}
function getPresentFontSize () {
  const cardBody = _getCurrentCardBody()
  if (!cardBody) return 1
  if (showingAnswer()) {
    return cardBody.backFontSize
  }
  return cardBody.frontFontSize
}

function handleEditorTextChange (newText) {
  const oldCardBody = JSON.parse(JSON.stringify(_getCurrentCardBody()))
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

function getImageData () {
  if (!hasImage()) return ''
  const cardBody = _getCurrentCardBody()
  if (showingAnswer()) {
    return cardBody.backImage
  }
  return cardBody.frontImage
}

function nextCard () {
  let index = _getCurrentCardIndex()
  const cards = window.lc.getData('orderedCards')
  index++
  const newCard = cards[(index % cards.length)]
  window.lc.setData('activeCardId', newCard.id)
  updateCardBody(newCard.id)
}

function removeCard () {
  let index = _getCurrentCardIndex()
  let id = _getCurrentCardId()
  const cards = window.lc.getData('orderedCards')
  cards.splice(index, 1)
  // Card bodies handle "card" creation/deletion
  // window.lc.setDeleted('card', id)
  window.lc.setDeleted('cardBody', id)
  index--
  const newCard = cards[((index + cards.length) % cards.length)]
  window.lc.setData('activeCardId', newCard.id)
  updateCardBody(newCard.id)
}

function previousCard () {
  let index = _getCurrentCardIndex()
  const cards = window.lc.getData('orderedCards')
  index--
  const newCard = cards[((index + cards.length) % cards.length)]
  window.lc.setData('activeCardId', newCard.id)
  updateCardBody(newCard.id)
}

function flipCard () {
  const showingAnswer = window.lc.getData('showingAnswer')
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
    setPersistentForCardBody('backImage', undefined)
  } else {
    setPersistentForCardBody('frontHasImage', false)
    setPersistentForCardBody('frontImage', undefined)
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
function getCardMapping (cards) {
  const mapping = {}
  for (let i = 0; i < cards.length; i++) {
    mapping[cards[i].id] = cards[i]
  }
  return mapping
}

function addNewCard () {
  const newId = window.lc.generateNewId()
  // Cardbodies handle card creation/deletion
  // const changeKeyCard = `card.${newId}`
  const card = { id: newId, isNew: true }
  // window.lc.setPersistent(changeKeyCard, card)

  const changeKeyCardBody = `cardBody.${newId}`
  const cardBody = { id: newId, isNew: true, front: '', back: '' }
  window.lc.setPersistent(changeKeyCardBody, cardBody)
  window.lc.addDataListEntry('orderedCards', card)
  window.lc.setData('activeCardId', newId)
  _flipToQuestionSide()
  refreshEditor()
}
function _flipToQuestionSide () {
  window.lc.setData('showingAnswer', false)
}

async function updateCardBody (id) {
  _flipToQuestionSide()
  const currentCardBody = window.lc.getData('cardBody.' + id)
  if (!currentCardBody) {
    const cardBody = await getCardBody(id)
    window.lc.setData('cardBody.' + id, cardBody)
  }
  refreshEditor()
}
// Re-renders the card area
function refreshEditor () {
  if (hasImage()) {
    renderPreviewImageWithRawData(getImageData())
  }
  _updateEditorData()
}
function _getCurrentCardBody () {
  const id = _getCurrentCardId()
  return window.lc.getData(`cardBody.${id}`)
}
function getTextToShowForCard () {
  const cardBody = _getCurrentCardBody()
  if (!cardBody) return ''
  const showingAnswer = window.lc.getData('showingAnswer')
  if (showingAnswer) {
    // Show answer
    return cardBody.back
  }
  return cardBody.front
}

function _updateEditorData () {
  setEditorData(getTextToShowForCard())
}
function _getCurrentCardId () {
  return window.lc.getData('activeCardId')
}
function _getCurrentCardIndex () {
  const currentId = _getCurrentCardId()
  const cards = window.lc.getData('orderedCards')
  let currentIndex
  for (let i = 0; i < cards.length; i++) {
    if (cards[i].id === currentId) {
      currentIndex = i
      break
    }
  }
  return currentIndex
}

module.exports = {
  navigateToDeckPage,
  getDeck: getDeckLogic,
  updateDeckName: updateDeckNameLogic,
  deleteDeck: deleteDeckLogic,
  createDeck: createDeckLogic,
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
  getCardMapping,
  removeCard,
  refreshEditor,
  getTextToShowForCard,
  handleEditorTextChange,
  getPresentFontSize
}
