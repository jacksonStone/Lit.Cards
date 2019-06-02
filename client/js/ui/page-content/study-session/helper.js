function markRight () {
  // Get session state, modify card to correct, then go to the next card that works
  // Push changed to session state to "persistent changes"
  // If it's the last card, show alert asking if they want to start over? (if all right)
  // or if some were wrong ask if they want to continue studying or stop studying
  console.log('RIGHT')
}
function markWrong () {
  // Get session state, modify card to wrong, then go to the next card that works
  // Push changed to session state to "persistent changes"
  // If it's the last card, show menu of if they want to study wrong ones or stop
  console.log('Wrong')
}
module.exports = {
  markRight,
  markWrong
}
