import { api } from './api-request';

export const getDecks = () => {
  return api('decks/me')
};

export const getDeck = (id) => {
  return api(`decks/${id}`)
};

export const createDeck = (name) => {
  return api('decks/create', { name })
};

export const makePublic = (id) => {
  return api('decks/make-public', { id })
};

export const deleteDeck = (id) => {
  return api('decks/delete', { id })
};
