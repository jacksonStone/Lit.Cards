import { api } from './api-request';

export const getCardBody = (deckId, card = '') => {
  const deck = window.lc.getData('deck');
  let url;
  if(card) {
    card = encodeURI(card);
    url = `card-body/${deckId}?card=${card}&t=`
  } else {
    url = `card-body/${deckId}?t=`;
  }
  url += ((deck && deck.lastModified) ? deck.lastModified : '');
  return api(url);
};
