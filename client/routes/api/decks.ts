import { api } from './api-request';

export const getDecks = (): Promise<string> => {
  return api('decks/me')
};

export const getDeck = (id: string): Promise<string> => {
  return api(`decks/${id}`)
};

export const createDeck = (name: String): Promise<string> => {
  return api('decks/create', { name })
};

export const makePublic = (id: string): Promise<string> => {
  return api('decks/make-public', { id })
};

export const deleteDeck = (id: string) : Promise<string>=> {
  return api('decks/delete', { id })
};
