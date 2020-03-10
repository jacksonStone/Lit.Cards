import { html } from 'lit';
import editor from './card-editor';
import { fullCardNavigation, cardCounter, upArrow, downArrow } from './side-numbers';
import sidenav from './sidenav';
import nameEdit from './name-edit';
import darkmodeCheckbox from 'component/darkmode-checkbox';
import checkboxHolder from 'component/checkbox-holder';

export default (cardId, cards) => {
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
                ${editor()}

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
};
