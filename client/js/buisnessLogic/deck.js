const { deck } = require('site/pages')

exports.navigateToDeckPage = (deckId) => {
  return deck({ deck: deckId })
}
