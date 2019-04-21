const { html } = require('lit-html/lit-html')
const editView = require('component/edit-view')
require('./key-commands')

module.exports = (data) => html`
     ${editView(data.activeCardId, data.cards)}
`
