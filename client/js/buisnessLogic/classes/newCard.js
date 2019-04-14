const { createCard } = require('logic/cards')

class newCard {
  constructor (state, deck) {
    if (!state || !deck) throw new Error('Missing arguments!')
    this.cardContent = convertStateToCardContent(state)
    this.deck = deck
  }
  save () {
    return createCard(this.deck, this.cardContent)
  }
}

function convertStateToCardContent (state) {
  const answerIsText = state.answerIsText
  const answerContent = {
    content: answerIsText ? state.answerTextContent : state.answerImageContent,
    isText: answerIsText,
    fontSize: answerIsText ? state.answerFontSize : null
  }
  const questionIsText = state.questionIsText
  const questionContent = {
    content: questionIsText ? state.questionTextContent : state.questionImageContent,
    isText: questionIsText,
    fontSize: questionIsText ? state.questionFontSize : null
  }
  return {
    question: questionContent,
    answer: answerContent
  }
}

module.exports = newCard
