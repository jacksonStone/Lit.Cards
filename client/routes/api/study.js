import { api } from './api-request';

export const getStudySessionsAndBorrowedDecks = () => {
  return api('study/me')
};

export const getStudySession = (id) => {
  return api(`study/${id}`)
};

export const getStudySessionForDeck = (deckId) => {
  return api(`study/deck/${deckId}`)
};

export const createStudySession = (deck, startingState) => {
  return api('study/create', { deck, startingState })
};

export const deleteStudySession = (id) => {
  return api('study/delete', { id })
};