const { html } = require('lit-html/lit-html')
const editor = require('component/card-editor')
const cardEditStack = require('component/card-edit-stack')

module.exports = (leftAction, rightAction, spaceAction, answerSide, currentCard, cards) => html`
  <div class="grid-container">
        <div class="grid-row">
            <div class="grid-col-9">
                ${editor(leftAction, rightAction, spaceAction, answerSide)}
            </div>
            <div class="grid-col-3">
                ${cardEditStack(currentCard, cards)}
            </div>
        </div>
</div>

`
