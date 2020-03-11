import { api } from './api-request';
import 'types';
export const getStudySessionsAndBorrowedDecks = () => {
  return api('study/me')
};

export const getStudySession = (id: string) => {
  return api(`study/${id}`)
};

export const getStudySessionForDeck = (deckId: string) => {
  return api(`study/deck/${deckId}`)
};

export const createStudySession = (deck: string, startingState?:startingStudyState) => {
  return api('study/create', { deck, startingState })
};

export const deleteStudySession = (id: string) => {
  return api('study/delete', { id })
};