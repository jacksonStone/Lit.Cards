import { html } from 'lit';
import editView from './components/edit-view';
import './key-commands';

export default () => {
     const activeCardId = window.lc.getData('activeCardId');
     const orderedCards = window.lc.getData('orderedCards');
     return html`
          ${editView(activeCardId, orderedCards)}
     `
};
