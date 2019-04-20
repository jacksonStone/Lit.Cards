const { html } = require('lit-html/lit-html')
const editView = require('component/edit-view')
const { setEditorData } = require('abstract/editor')
const { listenForKey, resetAllKeyBindings, listenForCMDKey } = require('abstract/listen-to-keyboard')

resetAllKeyBindings()

function rightAction () {
  const showingAnswer = window.sn.getData('showingAnswer')
  if (!showingAnswer) return
  console.log('RIGHT')
}
listenForKey('ArrowRight', rightAction)

function leftAction () {
  const showingAnswer = window.sn.getData('showingAnswer')
  if (!showingAnswer) return
  console.log('LEFT')
}
listenForKey('ArrowLeft', leftAction)

function spaceAction () {
  const showingAnswer = window.sn.getData('showingAnswer')
  window.sn.setData('showingAnswer', !showingAnswer)
  const currentCardBody = window.sn.getData('cardBody')
  if (!showingAnswer) {
    // Show answer
    setEditorData(currentCardBody.back)
  } else {
    setEditorData(currentCardBody.front)
  }
}
listenForKey('Space', spaceAction)

listenForCMDKey('KeyS', ()=>{
  console.log("CMD + S")
})

module.exports = (data) => html`
     ${editView(rightAction, leftAction, spaceAction, data.showingAnswer, 1, data.cards)}
`
