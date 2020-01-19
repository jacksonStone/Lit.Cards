let { html } = require('lit')
module.exports = () => {
    return html`<div class="grid-container" style="text-align: center;">
    <div style="max-width: 650px; margin: 0 auto;">
        <div class="grid-row" style="margin-top:20px">
            <div class="grid-col-6">
                <img src="static-images/logo.svg" style="width: 250px; height: 219px"></img>
            </div>
            <div class="grid-col-6">
                <p style="text-align: left; max-width: 265px; font-weight: bold; font-size: 24px;">Fast and simple online note cards built for<br>
                <img src="static-images/highlighter-mark.png" style="position: absolute; left: -15px; opacity: .8;"></img>serious students</p>
                <div style="margin-top: 20px; text-align:left">
                    <div>
                    <button class="usa-button" style="font-size: 16px; text-align: center; width: 150px; background-color: #FF5E00">Try it free</button>
                    </div>
                    <div style="margin-top: 15px;">
                    <button class="usa-button usa-button--outline" style="font-size: 16px;  text-align: center; width: 150px; color: #FF5E00; box-shadow: inset 0 0 0 2px #FF5E00">Learn more</button>
                    </div>
                </div>
                
            </div>
        </div>
    </div>
    <div style="border-bottom: 1px solid #d5d8df; margin: 50px 0;"></div>
    </div>
`
}
