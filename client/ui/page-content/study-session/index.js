import { html } from 'lit';
import studyView from './components/study-view';
import './key-commands';
import { hasImage, getPresentFontSize } from 'logic/deck';

export default (data) => html`
     ${studyView(data.activeCardId, data.orderedCards, hasImage(), data.showingAnswer, getPresentFontSize())}
`;
