const { html } = require('lit')
const { navigateToDeckPage, createDeck, deleteDeck } = require('../../business-logic/deck')
const { createStudySession, navigateToStudySession } = require('../../business-logic/study')
// Keep numPerRow in sync with col-n below
const numPerRow = 3
function addDeckCard () {
  return html`<div class="mobile-lg:grid-col-4">
        <button class="usa-button deck-card-outline deck-selection"
        style="
              position: absolute;
              top: 0;
              left: 0;
              "
         @click=${() => { createDeck('Untitled') }}
        >
  
        <i class="far fa-plus-square" aria-hidden="true"><span class="sr-only">Add new</span>
</i>&nbsp;&nbsp;Deck </button>
    </div>`
}
function deleteDeckBtn (id) {
  if (window.confirm('Are you sure you want to delete this deck?')) {
    deleteDeck(id)
  }
}
function getStudyBtn (deck, sessionMapping) {
  const session = sessionMapping[deck.id]
  if (!session) {
    return html`<button
            @click=${() => { createStudySession(deck.id) }}
            class="usa-button">
                Study
            </button>`
  }
  return html`<button
            @click=${() => { navigateToStudySession(session.id) }} 
            class="usa-button">
                Continue Studying
            </button>`
}
function deckPreview (deck, sessionMapping) {
  if (deck.addDeck) {
    return addDeckCard()
  }
  return html`
    <div class="mobile-lg:grid-col-4">
           <div style="position:relative">
           ${makeBackgroundCards(0, 0, deck.cardCount)}
           
        <div class=" deck-card-outline"
        style="
              position: absolute;
              top: 0;
              left: 0;
              "
         
        >
            <span style="
            position: absolute;
            top: 10px;
            left: 10px;
            font-size: 12px;
            ">${formatDate(deck.date)}</span>
  
          <div style="
          margin-top: 40px;
          text-align: center;
          font-size: 20px;
          ">${deck.name}</div>
        </div>
        <button
            @click=${() => { deleteDeckBtn(deck.id) }} 
            class="usa-button usa-button--unstyled remove-button" >
                <i class="far fa-times-circle" aria-hidden="true"></i>
                <span style="display:none;">Remove this deck</span>
            </button>
            <button 
            style="position: absolute;
              top: 125px;
              left: 5px;
              padding: 10px;"
            class="usa-button usa-button--unstyled" @click=${() => { navigateToDeckPage(deck.id) }}
            >Edit</button>
            <div style="position: absolute; top:  175px; right: 60px;">
                ${getStudyBtn(deck, sessionMapping)}
            </div>
            
        </div>
        <div class="spacing" style="text-align: right;">
</div>
            
        
            
    </div>
`
}
const _memo = {}
function formatDate (date) {
  if (!_memo[date]) {
    _memo[date] = new Intl.DateTimeFormat().format(new Date(date))
  }
  return _memo[date]
}

function calculateNumOfBackgroundCards (cardCount) {
  if (cardCount <= 0) return 0
  if (cardCount < 3) return 1
  if (cardCount < 8) return 2
  if (cardCount < 21) return 3
  if (cardCount < 55) return 4
  if (cardCount < 144) return 5
  if (cardCount < 377) return 6
  return 7
}

function makeBackgroundCards (startingTop, startingLeft, cardCount) {
  const pixelGap = 2
  const cards = []
  const numOfBackgroundCards = calculateNumOfBackgroundCards(cardCount)
  let curTop = startingTop + (pixelGap * numOfBackgroundCards)
  let curLeft = startingLeft + (pixelGap * numOfBackgroundCards)
  for (let i = 0; i < numOfBackgroundCards; i++) {
    cards.push(html`<span class="deck-card-outline"
    style="
    position: absolute;
    top: -${curTop}px;
    left: ${curLeft}px;
    "></span>`)
    curTop -= pixelGap
    curLeft -= pixelGap
  }
  return cards
}

function deckRow (decks, studySessionsByDeck) {
  return html`<div class="grid-row" style="margin-bottom: 65px">${decks.map((deck) => { return deckPreview(deck, studySessionsByDeck) })}</div>`
}

function deckRows (allDecks, studySessionsByDeck) {
  allDecks = [...allDecks, { addDeck: true }]
  const rows = []
  for (let i = 0; i < allDecks.length; i = i + numPerRow) {
    rows.push(deckRow(allDecks.slice(i, i + numPerRow), studySessionsByDeck))
  }
  return rows
}

module.exports = (data = {}) => {
  return html`
    <div class="grid-container">
        <h1>Your Decks</h1>
        ${data.decks && deckRows(data.decks, data.studySessionsByDeck)}
    </div> 
    
`
  /**
   * <div class="fancy-line" style="border-top: 1px solid #d5d8df; margin-top:80px"></div>
   <h1>Others Decks</h1>
   ${data.decks && deckRows(data.decks, data.studySessionsByDeck)}
   */
}
