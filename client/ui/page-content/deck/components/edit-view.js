let { html } = require('lit')
let editor = require('./card-editor')
let {fullCardNavigation, cardCounter, upArrow, downArrow} = require('./side-numbers')
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
            <div style="margin-right: 40px;">
            ${width >= 640 ? nameEdit() : ''}
            ${width >= 640 ? sidenav() : ''}
            </div>
        </div>
            <div class="tablet:grid-col-6 mobile-lg:grid-col-10">
                ${editor(addImage, hasImage, showingAnswer, fontSize)}

            </div>
            <div class="tablet:grid-col-3 mobile-lg:grid-col-2">
                ${width >= 480 ? fullCardNavigation(cardId, cards) : html``}
            </div>
            ${width < 480 ? html`
                <div style="margin: 10px auto;"><span style="margin-right: 20px;">${upArrow()}</span><span>${downArrow()}</span>${cardCounter(cardId, cards)}</div>` : html``}
        </div>
    </div>
    ${checkboxHolder([darkmodeCheckbox()])}
    `
}
