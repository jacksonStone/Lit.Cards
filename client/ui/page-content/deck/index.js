import { html } from 'lit';
import editView from './components/edit-view';
import './key-commands';
import { handleImageUpload, hasImage, getPresentFontSize } from 'logic/deck.ts';

export default (data) => html`
     ${editView(data.activeCardId, data.orderedCards, handleImageUpload, hasImage(), data.showingAnswer, getPresentFontSize())}
`;
