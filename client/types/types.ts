interface Window {
  lc: any;
  Stripe: (key: string) => StripeAPI;
}

interface StripeAPI {
  redirectToCheckout: any
}

interface Deck {
  lastModified: number,
  userEmail: string,
  displayName: string,
  name: string,
  date: number,
  cards: string,
  public: boolean,
  borrowed: boolean,
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
interface startingStudyState {
  ordering: string,
  studyState: string
}
interface StudyHistory {
  userEmail: string,
  studied: string //Stringified Array of strings
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

interface Transaction {
  session?: {[key: string]: StudySession},
  cardBody?: {[key: string]: CardBody},
  deck?: {[key: string]: Deck},
  user?: {[key: string]: User},
}

interface map {
  [key: string]:  string
}
interface map_of_maps {
  [key: string]: map
}