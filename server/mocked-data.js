const { listToStr } = require('../shared/char-encoding')
const { compress } = require('../shared/compress')
const fakeCardBody = require('./fake-card-body.json')
fakeCardBody.frontImage = compress(fakeCardBody.frontImage)
fakeCardBody.backImage = compress(fakeCardBody.backImage)
// password: somePassword
let fakeData = {
  user: [{
    userId: 'jackson@someemail.com',
    password: 'X0VIy9vshnkFZVZO8tLB4Uod5JDREmf1eIh9qIP6KR0=',
    salt: '8b73210c-8004-45b0-88eb-768ced89fc57',
    darkMode: true,
    validSession: 0
  }],
  studySession: [
    // Current card is the index of the card in the initial ordered deck
    { userId: 'jackson@someemail.com', studyState: '___', currentCard: 0, ordering: listToStr([2, 1, 0]), deck: 'foo', id: 'fee' }
  ],
  card: [
    { userId: 'jackson@someemail.com', deck: 'foo', id: 'fe' },
    { userId: 'jackson@someemail.com', deck: 'foo', id: 'fo' },
    { userId: 'jackson@someemail.com', deck: 'foo', id: 'fi' },
    { userId: 'jackson@someemail.com', deck: 'foo', id: 'fum' }
  ],
  cardBody: [
    fakeCardBody,
    { userId: 'jackson@someemail.com', deck: 'foo', front: 'This is the front of card 2', back: 'This is the back of card 2', id: 'fo' },
    { userId: 'jackson@someemail.com', deck: 'foo', front: 'This is the front of card 3', back: 'This is the back of card 3', id: 'fi' },
    { userId: 'jackson@someemail.com', deck: 'foo', front: 'This is the front of card 4', back: 'This is the back of card 4', id: 'fum' }
  ],
  deck: [
    { userId: 'jackson@someemail.com', name: 'This is my deck about biology', cardCount: 4, date: Date.now(), id: 'foo' },
    { userId: 'jackson@someemail.com', name: 'Second study session', cardCount: 42, date: Date.now(), id: 'fee' },
    { userId: 'jackson@someemail.com', name: 'THIRD study session', cardCount: 122, date: Date.now(), id: 'fii' },
    { userId: 'jackson@someemail.com', name: 'Fourth study session', cardCount: 700, date: Date.now(), id: 'fum' }
  ]
}

module.exports = fakeData
