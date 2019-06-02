const { html } = require('lit')
const cardEditor = require('./deck/components/card-editor')
module.exports = () => html`
<div class="grid-container">
<div class="usa-prose">
    <header>
        <h1>Online notecards that Don't Suck.</h1>
    </header>
    <p>
    Typesetting controls the readability of a text with the size, style, and spacing of its type. 
    It’s a function of microtypography (how text is styled within a text block) and macrotypography 
    (how content elements are arranged on the page). The more readable a text the more easily users 
    can understand its content. Text with poor readability turns off readers and can make it 
    challenging for them to stay focused.
    </p>
    
</div>
</div>
    <br>     
    <br>     
    <br>     
    <br>     
    <br>     
    <br>     
    <br>     
    <br>     
    <br>     
    <br>     
${cardEditor()}
    
`
