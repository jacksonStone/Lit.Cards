import { html } from 'lit';
import editView from './components/edit-view';
import './key-commands';

export default () => {
     return html`
          ${editView()}
     `
};
