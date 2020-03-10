import { html } from 'lit';
import { navigateToDeckPage, createDeck, deleteDeck } from 'logic/deck';
import { createStudySession, navigateToStudySession } from 'logic/study';
import darkmodeCheckbox from 'component/darkmode-checkbox';
import checkboxHolder from 'component/checkbox-holder';
import trialUserBar from 'component/trial-user-bar';

// Keep numPerRow in sync with col-n below
let numPerRow = 3
function addDeckCard () {
  return html`
<div class="tablet:grid-col-4">
    <div style="width: 100%; max-width: 300px; margin: 0 auto;">
        <button id="add-deck-card" class="usa-button deck-card-outline deck-selection"
        style=""
         @click=${() => { createDeck('Untitled') }}
        >
  
        <i class="far fa-plus-square" aria-hidden="true"><span class="sr-only">Add new</span>
        </i>&nbsp;&nbsp;Deck </button>
    </div>
</div>`
}
function deleteDeckBtn (id: string) {
  if (window.confirm('Are you sure you want to delete this deck?')) {
    deleteDeck(id)
  }
}
interface SessionMapping {
  [key: string]: StudySession
}
function getStudyBtn (deck: Deck, sessionMapping: SessionMapping) {
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

function deckPreview (deckOrAdd: Deck | addDeckToken, sessionMapping: SessionMapping, forSession: boolean) {
  if ((<addDeckToken>deckOrAdd).addDeck) {
    return addDeckCard()
  }
  let deck = <Deck>deckOrAdd;
  let deckCount = deck.cards && deck.cards.length || 0
  if(deck.borrowed) {
    return html`
    <div class="tablet:grid-col-4">
           <div style="position:relative; max-width:300px; margin: 0 auto;">
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
            >Author: <br/>${deck.displayName}</div>
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
    <div class="tablet:grid-col-4">
           <div style="position:relative;  max-width:300px; margin: 0 auto;">
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
        ${getDeckButtons(forSession, deck.public, deck.id)}
        <div style="position: absolute; top:  175px; right: 60px;">
          ${getStudyBtn(deck, sessionMapping)}
        </div>
        </div>
        <div class="spacing" style="text-align: right;">
</div>
            
        
            
    </div>
`
}

function getDeckButtons(forSession: boolean, deckPublic: boolean, deckId: string) {

  return html`
    ${(deckPublic) ? html`<div class="public-deck-marker">Public</div>` : html``}
    ${(!forSession && !deckPublic) ? html`<button
    @click=${() => { deleteDeckBtn(deckId) }}
    class="usa-button usa-button--unstyled remove-button" >
        <i class="far fa-times-circle" aria-hidden="true"></i>
        <span class="sr-only">Remove Deck</span>
    </button>` : html``}
    ${(!forSession) ? html`<button
    style="position: absolute;
      top: 125px;
      left: 5px;
      padding: 10px;"
    class="usa-button usa-button--unstyled deck-edit-button" @click=${() => { navigateToDeckPage(deckId) }}
    >Edit</button>` : html``}
    `
}

function recentlyStudiedPreview (deck: Deck) {
  let deckCount = deck.cards && deck.cards.length || 0
  const borrowed = deck.borrowed;
  if(borrowed) {
    return html`
    <div class="tablet:grid-col-4">
           <div style="position:relative; max-width:300px; margin: 0 auto;">
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
            >Author: <br/>${deck.displayName}</div>
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
    <div class="tablet:grid-col-4">
           <div style="position:relative; max-width:300px; margin: 0 auto;">
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
let _memo: map = {}
function formatDate (date: number) {
  if (!_memo[date]) {
    _memo[date] = new Intl.DateTimeFormat().format(new Date(date))
  }
  return _memo[date]
}

function calculateNumOfBackgroundCards (cardCount: number) {
  if (cardCount <= 0) return 0
  if (cardCount < 3) return 1
  if (cardCount < 8) return 2
  if (cardCount < 21) return 3
  if (cardCount < 55) return 4
  if (cardCount < 144) return 5
  if (cardCount < 377) return 6
  return 7
}

function makeBackgroundCards (startingTop: number, startingLeft: number, cardCount: number) {
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

function deckRow (decks: Array<Deck | addDeckToken>, studySessionsByDeck: SessionMapping, session?: boolean) {
  return html`<div class="grid-row grouping-of-three">${decks.map((deck) => { return deckPreview(deck, studySessionsByDeck, session) })}</div>`
}

function recentlyStudiedRow (decks: Array<Deck>) {
  return html`<div class="grid-row grouping-of-three">${decks.map((deck) => { return recentlyStudiedPreview(deck) })}</div>`
}
interface addDeckToken {
  addDeck: boolean
}
function deckRows (allDecks: Array<Deck>, studySessionsByDeck: SessionMapping) {
  let decksAndAdd: Array<Deck | addDeckToken> = [...allDecks, { addDeck: true }]
  let rows = []
  for (let i = 0; i < decksAndAdd.length; i = i + numPerRow) {
    rows.push(deckRow(decksAndAdd.slice(i, i + numPerRow), studySessionsByDeck))
  }
  return rows
}
function studyHistoryRows (studyHistories: Array<Deck>) {
  studyHistories = [...studyHistories]
  let rows = []
  for (let i = 0; i < studyHistories.length; i = i + numPerRow) {
    rows.push(recentlyStudiedRow(studyHistories.slice(i, i + numPerRow)))
  }
  return rows
}
function studySessionRows (decks: Array<Deck>, borrowedDecks: Array<Deck>, studySessionsByDeck: SessionMapping) {
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

// This should wait till there are decks to be found. Otherwise what's the point
// function searchBtn() {
//   event.preventDefault()
//   let values = grabFormData('#search-public-decks')
// }

export default () => {
  let studySessions: Array<StudySession> = window.lc.getData('studySessions');
  let decks: Array<Deck> = window.lc.getData('decks');
  let borrowedDecks: Array<Deck> = window.lc.getData('borrowedDecks');
  let studySessionsByDeck: SessionMapping = window.lc.getData('studySessionsByDeck');
  let studyHistory: Array<Deck> = window.lc.getData('studyHistory');
  return html`
    <div class="grid-container">
        ${(studySessions && studySessions.length) ? html`<h1 class="deck-header">Active Study Sessions</h1>
        ${studySessions && studySessionRows(decks, borrowedDecks, studySessionsByDeck)}
         <div class="fancy-line" style="margin-top:80px"></div>`: html``}
        
        <h1 class="deck-header">Your Decks</h1>
        ${decks && deckRows(decks, studySessionsByDeck)}
        
        ${(studyHistory && studyHistory.length) ? html`
        <div class="fancy-line" style="margin-top:80px"></div>
        <h1 class="deck-header">Recently Studied</h1> 
        ${studyHistoryRows(studyHistory)}` : html``}
        <div style="margin-top:130px;"></div>
     </div>
     ${checkboxHolder([darkmodeCheckbox()])}
     ${trialUserBar()}
     `
  /**
   * This should wait till there are public decks to search for
   <div class="fancy-line" style="margin-top:80px"></div>
   <h1>Search Public Decks</h1>
   <form class="usa-form" id="search-public-decks">
   <fieldset class="usa-fieldset">
   <label class="usa-label" for="search">Deck Name</label>
   <input class="usa-input" id="search" name="search" type="text" required aria-required="true">
   <button @click=${searchBtn} class="usa-button">Search</button>
   </fieldset>
   </form>
   ${studyHistoryRows(data.searchResults || [])}
   <div style="margin-top:130px;"></divstyle>
   */
};
