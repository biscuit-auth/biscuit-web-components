import { css, html, LitElement } from 'lit-element';
import './bc-datalog-editor.js';
import { dispatchCustomEvent } from '../src/lib/events.js';

/**
 * TODO DOCS
 */
export class BcVerifierEditor extends LitElement {

  static get properties () {
    return {
      code: { type: String },
      parseErrors: { type: Array },
      markers: { type: Array },
    };
  }

  constructor () {
    super();
    if(this.children[0] != undefined) {
      this.code = this.children[0].innerHTML;
    } else {
      this.code = "";
    }
    this.parseErrors = [];
    this.markers = [];
  }

  _onUpdatedCode(code) {
    this.code = code;
    dispatchCustomEvent(this, 'update', {code: code});
  }

  update (changedProperties) {
    super.update(changedProperties);
  }

  render () {
    return html`
      <bc-datalog-editor
        datalog=${this.code}
        parseErrors='${JSON.stringify(this.parseErrors)}'
        markers='${JSON.stringify(this.markers)}'
        @bc-datalog-editor:update="${(e) => { this._onUpdatedCode(e.detail.code) }}"}>
      </bc-datalog-editor>
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          display: block;
        }
      `,
    ];
  }
}

window.customElements.define('bc-verifier-editor', BcVerifierEditor);
