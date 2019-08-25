let { html } = require('lit')
let { navigateToDeckPage, createDeck, deleteDeck } = require('../../business-logic/deck')
let { createStudySession, navigateToStudySession } = require('../../business-logic/study')
let darkmodeCheckbox = require('component/darkmode-checkbox')

// Keep numPerRow in sync with col-n below
let numPerRow = 3
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
  let session = sessionMapping[deck.id]
  if (!session) {
    return html`<button
            @click=${() => { createStudySession(deck.id) }}
            class="usa-button continue-studying">
                Study
            </button>`
  }
  return html`<button
            @click=${() => { navigateToStudySession(session.id) }} 
            class="usa-button continue-studying">
                Continue Studying
            </button>`
}
function deckPreview (deck, sessionMapping, forSession) {
  if (deck.addDeck) {
    return addDeckCard()
  }
  let deckCount = deck.cards && deck.cards.length || 0
  if(deck.borrowed) {
    return html`
    <div class="mobile-lg:grid-col-4">
           <div style="position:relative">
           ${makeBackgroundCards(0, 0, deckCount)}
           
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
          margin-top: 20px;
          text-align: center;
          font-size: 20px;
          overflow-wrap: break-word;
          ">${deck.name}</div>
        </div>
            <div 
            style="position: absolute;
              top: 110px;
              left: 0;
              padding: 10px; font-size: 14px"
            >Author: <br/>${deck.userId}</div>
            <div style="position: absolute; top:  175px; right: 60px;">
                ${getStudyBtn(deck, sessionMapping)}
            </div>
            
        </div>
        <div class="spacing" style="text-align: right;">
    </div>
                
            
                
        </div>
    `
  }
  return html`
    <div class="mobile-lg:grid-col-4">
           <div style="position:relative">
           ${makeBackgroundCards(0, 0, deckCount)}
           
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
          margin-top: 20px;
          text-align: center;
          font-size: 20px;
          overflow-wrap: break-word;
          ">${deck.name}</div>
        </div>
        ${(forSession || deck.public) ? ((deck.public ) ? html`<div class="public-deck-marker">Public</div>` : html``): html`
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
        `}
        <div style="position: absolute; top:  175px; right: 60px;">
          ${getStudyBtn(deck, sessionMapping)}
        </div>
        </div>
        <div class="spacing" style="text-align: right;">
</div>
            
        
            
    </div>
`
}

function recentlyStudiedPreview (deck) {
  let deckCount = deck.cards && deck.cards.length || 0
  const borrowed = window.lc.getData('user.userId') !== deck.userId;
  if(borrowed) {
    return html`
    <div class="mobile-lg:grid-col-4">
           <div style="position:relative">
           ${makeBackgroundCards(0, 0, deckCount)}
           
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
          margin-top: 20px;
          text-align: center;
          font-size: 20px;
          overflow-wrap: break-word;
          ">${deck.name}</div>
        </div>
            <div 
            style="position: absolute;
              top: 110px;
              left: 0;
              padding: 10px; font-size: 14px"
            >Author: <br/>${deck.userId}</div>
            <div style="position: absolute; top:  175px; right: 60px;">
                <button
            @click=${() => { createStudySession(deck.id) }}
            class="usa-button continue-studying">
                Study Again
            </button>
            </div>
            
        </div>
        <div class="spacing" style="text-align: right;">
    </div>
                
            
                
        </div>
    `
  }
  return html`
    <div class="mobile-lg:grid-col-4">
           <div style="position:relative">
           ${makeBackgroundCards(0, 0, deckCount)}
           
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
          margin-top: 20px;
          text-align: center;
          font-size: 20px;
          overflow-wrap: break-word;
          ">${deck.name}</div>
        </div>
        ${(deck.public ) ? html`<div class="public-deck-marker">Public</div>` : html``}
        <div style="position: absolute; top:  175px; right: 60px;">
                          <button
            @click=${() => { createStudySession(deck.id) }}
            class="usa-button continue-studying">
                Study Again
            </button>
        </div>
        </div>
        <div class="spacing" style="text-align: right;">
</div>
            
        
            
    </div>
`
}
let _memo = {}
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
  let pixelGap = 2
  let cards = []
  let numOfBackgroundCards = calculateNumOfBackgroundCards(cardCount)
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

function deckRow (decks, studySessionsByDeck, session) {
  return html`<div class="grid-row" style="margin-bottom: 65px">${decks.map((deck) => { return deckPreview(deck, studySessionsByDeck, session) })}</div>`
}

function recentlyStudiedRow (decks) {
  return html`<div class="grid-row" style="margin-bottom: 65px">${decks.map((deck) => { return recentlyStudiedPreview(deck) })}</div>`
}

function deckRows (allDecks, studySessionsByDeck) {
  allDecks = [...allDecks, { addDeck: true }]
  let rows = []
  for (let i = 0; i < allDecks.length; i = i + numPerRow) {
    rows.push(deckRow(allDecks.slice(i, i + numPerRow), studySessionsByDeck))
  }
  return rows
}
function studyHistoryRows (allDecks) {
  allDecks = [...allDecks]
  let rows = []
  for (let i = 0; i < allDecks.length; i = i + numPerRow) {
    rows.push(recentlyStudiedRow(allDecks.slice(i, i + numPerRow)))
  }
  return rows
}
function studySessionRows (decks, borrowedDecks, studySessionsByDeck) {
  let studySessions = decks.filter(deck => !!studySessionsByDeck[deck.id]);
  studySessions = studySessions.concat(borrowedDecks.filter(deck => {
      let hasSession = !!studySessionsByDeck[deck.id]
      if (hasSession) {
        deck.borrowed = true;
        return hasSession
      }
      return false;
  }));
  let rows = []
  for (let i = 0; i < studySessions.length; i = i + numPerRow) {
    rows.push(deckRow(studySessions.slice(i, i + numPerRow), studySessionsByDeck, true))
  }
  return rows
}

module.exports = (data = {}) => {
  return html`
    <div class="grid-container">
        ${(data.studySessions && data.studySessions.length) ? html`<h1>Active Study Sessions</h1>
        ${data.studySessions && studySessionRows(data.decks, data.borrowedDecks, data.studySessionsByDeck)}
         <div class="fancy-line" style="margin-top:80px"></div>`: html``}
        
        <h1>Your Decks</h1>
        ${data.decks && deckRows(data.decks, data.studySessionsByDeck)}
        
        ${(data.studyHistory && data.studyHistory.length) ? html`
        <div class="fancy-line" style="margin-top:80px"></div>
        <h1>Recently Studied</h1> 
        ${studyHistoryRows(data.studyHistory)}` : html``}
        
     </div> 
    ${darkmodeCheckbox()}
`
  /**
   <h1>Others Decks</h1>
   ${data.decks && deckRows(data.decks, data.studySessionsByDeck)}
   */
}
