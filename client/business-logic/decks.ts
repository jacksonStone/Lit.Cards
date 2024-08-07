import { getDecks as getDecksAPI, createDeck as createDeckAPI } from '../routes/api/decks'
import { decks } from '../routes/navigation/pages'
import { getParam } from '../browser-abstractions/url'
import 'types';

export const getDecks = async (): Promise<Array<Deck>> => {
  return JSON.parse(await getDecksAPI())
}

export const createDeck = (name: string) : Promise<string> => {
  return createDeckAPI(name)
}

export const navigatgeToDeckListPage = () => {
  decks();
}

export const getDeckNameFromPage = () :string => {
  return getParam('deck')
}
