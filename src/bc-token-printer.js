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
          <div class="code">
            <p>Encoded token</p>
            <code>${this.biscuit}</code>
          </div>
            <div class="content">${result.error}</div>
          `
      } else {
        return html`
            <div class="code">
              <p>Encoded token</p>
              <code>${this.biscuit}</code>
            </div>
            <div class="content">
            <p>Decoded token</p>
            ${this._blocks.map((block, index) => html`
              <div>
              <p>Block ${index}:</p>
              <bc-datalog-editor
                datalog=${block.code}
                @bc-datalog-editor:update="${(e) => { this._onUpdatedCode(block, e.detail.code) }}"}>
              </bc-datalog-editor>
              </div>
            `)}
            </div>
         `;
      }
    } else {
      return html`
      <div class="code">
        <p>Encoded token</p>
        <code>${this.biscuit}</code>
      </div>
        <div class="content">empty</div>
     `
    }
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        @media(min-width:576px) {
          :host {
            display: flex;
            flex-flow: row wrap;
            flex-direction: row;
          }

          .code {
            order: 1;
            width: 49%;
          }

          .content {
            order: 2;
            width: 49%;
          }
        }

        code {
          overflow-wrap: anywhere;
          padding: 0.2em;
          padding-top: 1em;
        }

        .code {
          background: white;
          border: 1px rgba(128, 128, 128, 0.4) solid;
        }

        .content {
          border-top: 1px rgba(128, 128, 128, 0.4) solid;
          border-right: 1px rgba(128, 128, 128, 0.4) solid;
          background: white;
        }

        p {
          border-bottom: 1px rgba(128, 128, 128, 0.4) solid;
          margin-block-start: 0px;
          margin-block-end: 0px;
          padding: 0.2em;
          font-size: 0.8em;
          color: grey;
        }

        bc-datalog-editor {
          border-bottom: 1px rgba(128, 128, 128, 0.4) solid;
        }
      `,
    ];
  }
}

window.customElements.define('bc-token-printer', BcTokenPrinter);
