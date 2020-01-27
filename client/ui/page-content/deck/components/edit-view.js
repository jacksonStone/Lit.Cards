let { html } = require('lit')
let editor = require('./card-editor')
let cardEditStack = require('./side-numbers')
let sidenav = require('./sidenav')
let nameEdit = require('./name-edit')
let darkmodeCheckbox = require('component/darkmode-checkbox')
let checkboxHolder = require('component/checkbox-holder')

module.exports = (cardId, cards, addImage, hasImage, showingAnswer, fontSize) => {
    // 480
    const width = window.lc.getData('screen.width');
   return html`
    <div class="grid-container">
        <div class="grid-row">
        <div class="tablet:grid-col-3">
            <div class="above-750" style="margin-right: 40px;">
            ${nameEdit()}
            ${sidenav()}
            </div>
        </div>
            <div class="tablet:grid-col-6 mobile-lg:grid-col-10">
                ${editor(addImage, hasImage, showingAnswer, fontSize)}
            </div>
            <div class="tablet:grid-col-3 mobile-lg:grid-col-2">
                ${width >= 480 ? cardEditStack(cardId, cards) : html``}//TODO::Make this work.
            </div>
        </div>
    </div>
    ${checkboxHolder([darkmodeCheckbox()])}
    `
}
