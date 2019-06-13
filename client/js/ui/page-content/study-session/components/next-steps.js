const { html } = require('lit')
const { getNumberWrong, resetSession, deleteCurrentSession } = require('logic/study')

module.exports = () => {
  if (getNumberWrong()) {
    return someWrong()
  }
  return noneWrong()
}

function oneClick (clickHandler) {
  let clicked = false
  return () => {
    if (clicked) return
    clicked = true
    clickHandler()
  }
}
const resetSessionBtn = oneClick(resetSession)
const deleteCurrentSessionBtn = oneClick(deleteCurrentSession)
const restudyWrongBtn = oneClick(()=>{
  console.log("SOMETHING")
})

function noneWrong () {
  return html`
    <div style="text-align: center; border: 1px solid rgba(10, 10, 10, 0.1); height: 300px;">
    <h2>Well Done!</h2>
    <div style="margin-top: 40px"><button style="width: 180px; text-align: center;" class="usa-button" @click=${resetSessionBtn}>Study again</button></div>
    <div style="margin-top: 20px"><button style="width: 180px; text-align: center;" class="usa-button usa-button--outline" @click=${deleteCurrentSessionBtn}>Finish studying</button></div>
    </div>
    
  `
}
function someWrong () {
  return html`
    <div style="text-align: center; border: 1px solid rgba(10, 10, 10, 0.1); height: 300px;">
    <div style="margin-top: 80px"><button style="width: 180px; text-align: center;" class="usa-button" @click=${restudyWrongBtn}>Restudy wrong answers</button></div>
    <div style="margin-top: 20px"><button style="width: 180px; text-align: center;" class="usa-button usa-button--secondary" @click=${deleteCurrentSessionBtn}>End study session</button></div>
    </div>
    
  `
}
