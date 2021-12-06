import { css, html, LitElement } from 'lit-element';
import './bc-datalog-editor.js';
import { dispatchCustomEvent } from '../src/lib/events.js';
import {initialize} from './wasm.js';
import {parse_token} from "@geal/biscuit-component-wasm";

/**
 * TODO DOCS
 */
export class BcTokenPrinter extends LitElement {

  static get properties () {
    return {
      biscuit: { type: String },
      _blocks: { type: Array },
      _error: { type: String },
      started: { type: Boolean },
    };
  }

  constructor () {
    super();
    this._blocks = [];
    this._error = "";
    for(const child of Array.from(this.children)) {
      this._blocks.push({ code: child.innerHTML });
    }

    this.started = false;
  }

  firstUpdated(changedProperties) {
    initialize().then(() => this.started = true);
  }

  _onAddBlock () {
    this._blocks = [...this._blocks, { code: '' }];
  }

  _onRemoveBlock (block) {
    this._blocks = this._blocks.filter((b) => b !== block);
  }

  _onUpdatedCode(block, code) {
    block.code = code;
    dispatchCustomEvent(this, 'update', {blocks: this._blocks});
  }

  update (changedProperties) {
    super.update(changedProperties);
  }

  render () {
    if(this.started) {
      var result = parse_token({ data: this.biscuit});
      console.log("parsed");
      console.log(result);
      this._blocks = [];

      for(let block of result.token_blocks) {
        this._blocks.push({
          code: block
        });
      }

      if(result.error !== undefined && result.error !== null && result.error != "") {
        return html`
          <code>${this.biscuit}</code>
          <div>${result.error}</div>`
      } else {
        return html`
          <code>${this.biscuit}</code>
          ${this._blocks.map((block, index) => html`
            <bc-datalog-editor
              datalog=${block.code}
              @bc-datalog-editor:update="${(e) => { this._onUpdatedCode(block, e.detail.code) }}"}>
            </bc-datalog-editor>
          `)}
        `;
      }
    } else {
      return html`
        <code>${this.biscuit}</code>
        <div>empty</div>`
    }
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

window.customElements.define('bc-token-printer', BcTokenPrinter);
