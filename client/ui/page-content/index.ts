import { html } from 'lit';

export default () => {
    return html`<div class="grid-container" style="text-align: center;">
    <div style="max-width: 650px; margin: 0 auto;">
<div class="below-750">
                <div style="margin-top:20px">

                <div>
                    <img alt="Libby.cards logo" src="/static-images/logo.svg" style="width: 200px; height: 175px"/>
                </div>
                <div style=" text-align: center;">
                <div style="position: relative; max-width: 265px;  margin: 0 auto;">
                 <p style=" font-weight: bold; font-size: 24px;">Fast and simple online note cards built for<br>
                    s<img aria-hidden="true" src="/static-images/highlighter-mark.png" style="position: absolute; left: 20px; opacity: .8;"/>erious students</p>
                    <div style="margin-top: 20px;">
                        <div>
                        <button class="usa-button" style="font-size: 16px; text-align: center; width: 150px; background-color: #FF5E00" @click=${tryItButton}>Try it free</button>
                        </div>
                        <div style="margin-top: 15px;">
                        <button class="usa-button usa-button--outline" style="font-size: 16px;  text-align: center; width: 150px; color: #FF5E00; box-shadow: inset 0 0 0 2px #FF5E00" @click=${learnMoreButton}>Learn more</button>
                        </div>
                    </div>
                </div>
                </div>
            </div>
</div>

<div class="above-750">
    <div class="grid-row" style="margin-top:20px">
        <div class="grid-col-6">
            <img alt="Libby.cards logo" src="/static-images/logo.svg" style="width: 250px; height: 219px"/>
        </div>
        <div class="grid-col-6">
            <p style="text-align: left; max-width: 265px; font-weight: bold; font-size: 24px;">Fast and simple online note cards built for<br>
            <img aria-hidden="true" src="/static-images/highlighter-mark.png" style="position: absolute; left: -15px; opacity: .8;"/>serious students</p>
            <div style="margin-top: 20px; text-align:left">
                <div>
                <button class="usa-button" style="font-size: 16px; text-align: center; width: 150px; background-color: #FF5E00" @click=${tryItButton}>Try it free</button>
                </div>
                <div style="margin-top: 15px;">
                <button class="usa-button usa-button--outline" style="font-size: 16px;  text-align: center; width: 150px; color: #FF5E00; box-shadow: inset 0 0 0 2px #FF5E00" @click=${learnMoreButton}>Learn more</button>
                </div>
            </div>
            
        </div>
    </div>
</div>

</div>

    <div style="border-bottom: 1px solid #d5d8df; margin: 50px 0;" id="learnmore"></div>
    <h3 style="font-size: 24px;">Why Libby.Cards?</h3>
    
<div class="above-750">
         <div class="grid-row" style="max-width: 750px; margin: 20px auto;">
            <div class="grid-col-4">
               ${cardFlipper("/static-images/minimalistic.svg", "Minimalistic", "We only do note cards. Nothing more and nothing less.")}
            </div>
             <div class="grid-col-4">
               ${cardFlipper("/static-images/easy_to_use.svg", "Easy to use", "Intuitive interface with hotkeys for nearly everything.")}
            </div>
            <div class="grid-col-4">
               ${cardFlipper("/static-images/fast.svg", "Fast", "Built for doctoral students in mind, with thousands of cards.")}
            </div>
        </div>
</div>

<div class="below-750">
    <div style="max-width: 230px; margin: 0 auto;">
    <div style="margin-bottom: 20px;">       ${cardFlipper("/static-images/minimalistic.svg", "Minimalistic", "We only do note cards. Nothing more and nothing less.")}
    </div>
    <div style="margin-bottom: 20px;">       ${cardFlipper("/static-images/easy_to_use.svg", "Easy to use", "Intuitive interface with hotkeys for nearly everything.")}
    </div>

    <div style="margin-bottom: 20px;">       ${cardFlipper("/static-images/fast.svg", "Fast", "Built for doctoral students in mind, with thousands of cards.")}
    </div>
            
    </div>
            
</div>

    <div style="border-bottom: 1px solid #d5d8df; margin: 50px 0;"></div>
        <h3 style="font-size: 24px;">Features</h3>
        <ul style="max-width: 600px; margin: 0 auto 30px auto; text-align: left; font-size: 18px; line-height: 25px">
            <li><b>Create, study, and share decks of online note cards</b></li>
            <li><b>Unlimited cards with any plan</b></li>
            <li><b>Decks support thousands of cards - no problem</b></li>
            <li><b>Faster load times than online alternatives</b></li>
            <li><b>Only pay for the time you need - no automatic renewals</b></li>
            <li><b>Hotkeys for almost everything - create cards without a mouse</b></li>
            <li><b>Customize the study interface</b></li>
            <li><b>Dark mode for those late study sessions</b></li>
            <li><b>Quickly edit a card while studying</b></li>
            <li><b>Images on both sides of the card</b></li>
        </ul>
        <button class="usa-button" style="font-size: 16px; text-align: center; width: 150px; background-color: #FF5E00" @click=${tryItButton}>Try it free</button>

    <div style="border-bottom: 1px solid #d5d8df; margin: 50px 0;"></div>
        <h3 style="font-size: 24px;">Contact/About</h3>
        <div style="max-width: 505px; margin: 0 auto 50px auto; text-align: left; font-size: 18px;">
        <p>
            I created Libby.Cards because my wife, a med-student, was unable to
            find a suitable app to handle her study work load of 1000’s of cards. 
            Now onto her third year she’s beyond the need for many note cards, but 
            I hope this app can serve those like her and get out of your way 
            while you try to learn.
        </p>
             <p>
           If you have any questions, issues or ideas for the application, you 
           can contact me, the creator of the app, directly at:
           <a href="https://www.jacksonstone.info/contact">jacksonstone.info/contact</a>
        </p><br>
        <b>- Jackson Stone</b>
        </div>
                
    </div>
`
};

function cardFlipper(url: string, description: string, backContent: string) {
    return html` <div class="flip-container">
            <div class="flipper">
                <div class="front">
                    <div class="homepage-card" style="
                         height: 150px;
                        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
                        border-radius: 4px;
                        padding: 30px 20px;
                        margin: 10px"
                    >
                       <div class="homepage-card-img" style="margin-bottom: 10px;"><img alt="${description}" src="${url}"/></div>
                       <b  class="homepage-card-b" style="color: #FF7C00; font-size: 16px;">${description}</b>
                    </div>
                </div>
                <div class="back">
                <div class="homepage-card" style="
                        height: 150px;
                        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
                        border-radius: 4px;
                        padding: 30px 15px;
                        margin: 10px"
                    >
                    <div style="margin-top: 10px"><b>${backContent}</b></div>
                    
                </div>
                </div>
            </div>
        </div>`
}
function tryItButton() {
    window.location.href = '/site/signup';
}
function learnMoreButton() {
    let learnMore: HTMLElement = document.querySelector('#learnmore');
    document.documentElement.scrollTop = learnMore.offsetTop;
    document.documentElement.scrollLeft = learnMore.offsetLeft;
}
