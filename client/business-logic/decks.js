import { getDecks, createDeck } from '../routes/api/decks';
import { decks } from '../routes/navigation/pages';
import { getParam } from '../browser-abstractions/url';

export const getDecks = async () => {
  return JSON.parse(await getDecks())
};

export const createDeck = (name) => {
  return createDeck(name)
};

export const navigatgeToDeckListPage = () => {
  return decks()
};

export const getDeckNameFromPage = () => {
  return getParam('deck.ts.ts')
};
