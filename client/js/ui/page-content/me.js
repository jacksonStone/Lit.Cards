const { html } = require('lit-html/lit-html')
const { navigateToDeckPage } = require('logic/deck')
// Keep  this in sync with col-n below
const numPerRow = 3

function deckPreview (deck) {
  return html`
    <div class="mobile-lg:grid-col-4">
           <div style="position:relative">
           ${makeBackgroundCards(0, 0, deck.cardCount)}
           
        <button class="usa-button deck-card-outline deck-selection"
        style="
              position: absolute;
              top: 0;
              left: 0;
              "
         @click=${() => { navigateToDeckPage(deck.name) }}
        >
     
            <span style="
            position: absolute;
            top: 10px;
            left: 5px;
            font-size: 12px;
            ">${formatDate(deck.date)}</span>
  
        ${deck.name}</button>
        <button 
            class="usa-button usa-button--unstyled remove-button" >
                <i class="far fa-times-circle" aria-hidden="true"></i>
                <span style="display:none;">Remove this deck</span>
            </button>
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
  if (cardCount === 1) return 0
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

function deckRow (decks) {
  return html`<div class="grid-row" style="margin-bottom: 20px">${decks.map(deckPreview)}</div>`
}

function deckRows (allDecks) {
  const rows = []
  console.log(allDecks.length)
  for (let i = 0; i < allDecks.length; i = i + numPerRow) {
    rows.push(deckRow(allDecks.slice(i, i + numPerRow)))
  }
  console.log('rows.length', rows.length)
  console.log(rows)
  return rows
}

module.exports = (data = {}) => {
  return html`
    <div class="grid-container">
        ${data.decks && deckRows(data.decks)}
    </div> 
    
`
}
