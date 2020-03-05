import { getDecks as getDecksAPI, createDeck as createDeckAPI } from '../routes/api/decks'
import { decks } from '../routes/navigation/pages'
import { getParam } from '../browser-abstractions/url'

export const getDecks = async () => {
  return JSON.parse(await getDecksAPI())
}

export const createDeck = (name) => {
  return createDeckAPI(name)
}

export const navigatgeToDeckListPage = () => {
  return decks()
}

export const getDeckNameFromPage = () => {
  return getParam('deck')
}
