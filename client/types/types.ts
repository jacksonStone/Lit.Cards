interface Deck {
    lastModified: number,
    userEmail: string,
    name: string,
    date: number,
    cards: string,
    id: string,
}

interface StudySession {
  userEmail: string,
  studyState: string,
  currentCard: number,
  ordering: string,
  deck: string,
  id: string
}

interface User {
  userEmail: string,
  displayName: string,
  darkMode: boolean,
  hideNavigation: boolean,
  hideProgress: boolean,
  verifiedEmail: boolean,
  createdAt: number,
  trialUser: boolean,
  planExpiration: number
}

interface CardBody {
  userEmail?: string, //Undefined in the event of new card
  deck: string,
  id: string,
  front: string,
  back: string,
  frontHasImage?: boolean,
  backHasImage?: boolean,
  frontImage?: string,
  backImage?: string
}