
const { html } = require('lit-html/lit-html')
// TODO::FIGURE OUT IF THERE IS  A PLACE FOR ALL THIS
// const numberOfVisibleCards = 10
// const getVisibleCards = (currentCardId, cards) => {
//   if (!cards || !currentCardId) return []
//   const cardLength = cards.length
//   if (cardLength < numberOfVisibleCards) return cards
//   let currentIndex
//   for (let i = 0; i < cards.length; i++) {
//     if (cards[i].id === currentCardId) {
//       currentIndex = i
//       break
//     }
//   }
//
//   if (cardLength - (currentIndex + numberOfVisibleCards) > 0) {
//     return cards.slice(currentIndex, currentIndex + numberOfVisibleCards)
//   }
//   return cards.slice(cards.length - numberOfVisibleCards)
// }
//
// function getCardPreview (currentId, card) {
//   const activeCard = currentId === card.id
//   const className = activeCard ? 'activePreviewCard previewCard' : 'previewCard'
//   if (card.image) {
//     return html`<div class=${className}>
//         <div class="border">
//            <div style="background-image: url(${card.image});
//             height: 50px;
//             background-size: cover;
//             background-position: center center;
//             background-repeat: no-repeat;
//             width: 100%;">
//           </div>
//           <div>
//               ${card.summary}
//           </div>
//         </div>
//
//     </div>`
//   } else {
//     return html`<div class=${className}>
//         <div class="border">
//             <span>${card.summary}</span>
//         </div>
//     </div>`
//   }
//
// }
// module.exports = (currentCardId, cards) => {
//   return html`${cards && getVisibleCards(currentCardId, cards).map(card => getCardPreview(currentCardId, card))}`
// }
module.exports = (currentCardId, cards) => {
  // Humans are 1-based
  if (!cards) return
  const index = cards.findIndex(card => currentCardId === card.id) + 1
  return html`<div
style="text-align: center">
        <h1  style="
font-style: normal;
font-weight: normal;
font-size: 75px;
margin: 0;
">${index}</h1>
        <div>of ${cards.length}</div>
    </div>`
}


