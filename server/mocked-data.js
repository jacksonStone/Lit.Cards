const { listToStr, intToChar } = require('../shared/char-encoding')
const fakeCardBody = require('./fake-card-body.json')

fakeCardBody.id = intToChar(0);
// password: somePassword
let fakeData = {
  user: [{
    userId: 'jackson@someemail.com',
    password: 'X0VIy9vshnkFZVZO8tLB4Uod5JDREmf1eIh9qIP6KR0=',
    salt: '8b73210c-8004-45b0-88eb-768ced89fc57',
    darkMode: true,
    validSession: 0,
    verifiedEmail: true,
    emailVerificationKey: undefined
  },{
    userId: 'jackson@someemail2.com',
    password: 'X0VIy9vshnkFZVZO8tLB4Uod5JDREmf1eIh9qIP6KR0=',
    salt: '8b73210c-8004-45b0-88eb-768ced89fc57',
    darkMode: true,
    validSession: 0,
    verifiedEmail: true,
    emailVerificationKey: undefined
  }],
  studySession: [
    // Current card is the index of the card in the initial ordered deck
    { userId: 'jackson@someemail.com', studyState: '___', currentCard: 0, ordering: listToStr([2, 1, 0]), deck: 'foo', id: 'fee' },
    { userId: 'jackson@someemail.com', studyState: '___', currentCard: 0, ordering: listToStr([2, 1, 3, 0]), deck: 'asd', id: 'gee', borrowed: true }
  ],
  cardBody: [
    fakeCardBody,
    { userId: 'jackson@someemail.com', deck: 'foo', front: 'This is the front of card 2', back: 'This is the back of card 2', id: intToChar(1) },
    { userId: 'jackson@someemail.com', deck: 'foo', front: 'This is the front of card 3', back: 'This is the back of card 3', id: intToChar(2) },
    { userId: 'jackson@someemail.com', deck: 'foo', front: 'This is the front of card 4', back: 'This is the back of card 4', id: intToChar(3) },

    { userId: 'jackson@someemail2.com', deck: 'asd', front: 'This is the front of card 2', back: 'This is the back of card 2', id: intToChar(0) },
    { userId: 'jackson@someemail2.com', deck: 'asd', front: 'This is the front of card 3', back: 'This is the back of card 3', id: intToChar(1) },
    { userId: 'jackson@someemail2.com', deck: 'asd', front: 'This is the front of card 4', back: 'This is the back of card 4', id: intToChar(2) },
    { userId: 'jackson@someemail2.com', deck: 'asd', front: 'This is the front of card 1', back: 'This is the back of card 1', id: intToChar(3) }
  ],
  deck: [
    { userId: 'jackson@someemail.com', name: 'This is my deck about biology - for another biology class', date: Date.now(), cards: listToStr([0,1,2,3]), nextId:4, id: 'foo' },
    { userId: 'jackson@someemail.com', name: 'Second study session', date: Date.now(), id: 'fee' },
    { userId: 'jackson@someemail.com', name: 'THIRD study session',  date: Date.now(), id: 'fii' },
    { userId: 'jackson@someemail.com', name: 'Fourth study session', date: Date.now(), id: 'fum' },

    { userId: 'jackson@someemail2.com', name: 'Publically Available deck', cards: listToStr([0,1,2,3]), nextId:4, date: Date.now(), id: 'asd', public: true }
  ]
}

module.exports = fakeData
