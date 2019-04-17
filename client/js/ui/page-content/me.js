const { html } = require('lit-html/lit-html')

// Keep  this in sync with col-n below
const numPerRow = 3
function deckPreview (deck) {
  return html`
    <div class="grid-col-4">
            <span class="deck-card-outline"
            style="
              position: absolute;
              top: -6px;
              left: 6px;
              ">
        </span>
        <span class="deck-card-outline" style="
              position: absolute;
              top: -3px;
              left: 3px;
              ">
        </span>
        <button class="usa-button deck-card-outline"
        style="
              position: absolute;
              top: 0;
              left: 0;
              "
              
        >
            <span style="
            position: absolute;
            top: 10px;
            left: 5px;
            font-size: 12px;
            ">${formatDate(deck.date)}</span>
  
        ${deck.name}<br><br><span style="
            font-size: 12px;
            ">Card Count: ${deck.cardCount}</span></button>
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

function deckRow (decks) {
  return html`<div class="grid-row">${decks.map(deckPreview)}</div>`
}

function deckRows (allDecks) {
  for (let i = 0; i < allDecks.length; i += numPerRow) {
    return deckRow(allDecks.splice(i, numPerRow))
  }
}

module.exports = (data = {}) => {
  return html`
    <div class="grid-container">
        ${data.decks && deckRows(data.decks)}
    </div> 
    
`
}
