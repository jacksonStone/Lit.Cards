let { listToStr, intToChar } = require('../shared/char-encoding')
let fakeCardBody = require('./fake-card-body.json')

fakeCardBody.id = intToChar(0);
// fakeCardBody.lastModified = Date.now();
// password: somePassword
let fakeData = {
  user: [{
    userEmail: 'jackson@someemail.com',
    displayName:'Jackson',

    //Auth stuff
    password: 'X0VIy9vshnkFZVZO8tLB4Uod5JDREmf1eIh9qIP6KR0=',
    salt: '8b73210c-8004-45b0-88eb-768ced89fc57',
    validSession: 0,

    //User settings
    darkMode: true,
    hideNavigation: false,
    hideProgress: false,

    //Email verification
    verifiedEmail: true,
    emailVerificationKey: undefined,

    createdAt: Date.now(), //TODO::Maybe have a free trial?

    //TODO::Add this
    trialUser: false,

    // Fields for purchase info
    stripeCustomerId: "cus_GTvjSgfJdc0JDl",
    //To handle potiential for double events according to Stripe docs -
    //or with resolving missed transactions during server downtime
    //This is the id for the last confirmed session we processed and added
    //to plan expiration
    stripeLastProcessedSessionId: "",
    
    //Will be set once stripePaymentIntentConfirmed becomes true
    planExpiration: Date.now() + 1000*60*60, //epoch_time
    
  },{
    userEmail: 'jackson@someemail2.com',
    password: 'X0VIy9vshnkFZVZO8tLB4Uod5JDREmf1eIh9qIP6KR0=',
    salt: '8b73210c-8004-45b0-88eb-768ced89fc57',
    darkMode: true,
    validSession: 0,
    verifiedEmail: true,
    displayName:'Jackson2',
    emailVerificationKey: undefined
  }],
  studySession: [
    // Current card is the index of the card in the initial ordered deck
    { userEmail: 'jackson@someemail.com', studyState: '___', currentCard: 0, ordering: listToStr([2, 1, 0]), deck: 'foo', id: 'fee' },
    { userEmail: 'jackson@someemail.com', studyState: '___', currentCard: 0, ordering: listToStr([2, 1, 3, 0]), deck: 'asd', id: 'gee', borrowed: true }
  ],
  cardBody: [
    fakeCardBody,
    { userEmail: 'jackson@someemail.com', deck: 'foo', front: 'This is the front of card 2', back: 'This is the back of card 2', id: intToChar(1) },
    { userEmail: 'jackson@someemail.com', deck: 'foo', front: 'This is the front of card 3', back: 'This is the back of card 3', id: intToChar(2) },
    { userEmail: 'jackson@someemail.com', deck: 'foo', front: 'This is the front of card 4', back: 'This is the back of card 4', id: intToChar(3) },

    { userEmail: 'jackson@someemail2.com', deck: 'asd', front: 'This is the front of card 2 - Public!', back: 'This is the back of card 2 - Public!', id: intToChar(0), public: true },
    { userEmail: 'jackson@someemail2.com', deck: 'asd', front: 'This is the front of card 3 - Public!', back: 'This is the back of card 3 - Public!', id: intToChar(1), public: true },
    { userEmail: 'jackson@someemail2.com', deck: 'asd', front: 'This is the front of card 4 - Public!', back: 'This is the back of card 4 - Public!', id: intToChar(2), public: true },
    { userEmail: 'jackson@someemail2.com', deck: 'asd', front: 'This is the front of card 1 - Public!', back: 'This is the back of card 1 - Public!', id: intToChar(3), public: true }
  ],
  deck: [
    { lastModified: Date.now(), userEmail: 'jackson@someemail.com', name: 'This is my deck about biology - for another biology class', date: Date.now(), cards: listToStr([0,1,2]), id: 'foo' },
    { userEmail: 'jackson@someemail.com', name: 'Second study session', date: Date.now(), id: 'fee' },
    { userEmail: 'jackson@someemail.com', name: 'THIRD study session',  date: Date.now(), id: 'fii' },
    { userEmail: 'jackson@someemail.com', name: 'Fourth study session', date: Date.now(), id: 'fum' },

    { userEmail: 'jackson@someemail2.com', displayName:'Jackson2', name: 'Publically Available deck', cards: listToStr([0,1,2,3]), date: Date.now(), id: 'asd', public: true }
  ],
  studyHistory: [
    // { userEmail: 'jackson@someemail.com', studied: JSON.stringify(['foo', 'asd']) }
  ]
}

module.exports = fakeData
