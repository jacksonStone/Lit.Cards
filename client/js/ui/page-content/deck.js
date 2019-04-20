const { html } = require('lit-html/lit-html')
const cardEditor = require('component/card-editor')
module.exports = (data) => html`
    
    
    <div class="grid-container">
    <div>${JSON.stringify(data.cards)}</div>
    ${cardEditor()}
    </div>
`
