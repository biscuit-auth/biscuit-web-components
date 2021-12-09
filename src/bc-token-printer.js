import { css, html, LitElement } from 'lit';
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
    this.biscuit = this.biscuit ?? "";
    for(const child of Array.from(this.children)) {
      this._blocks.push({ code: child.innerHTML });
    }

    this.started = false;
  }

  firstUpdated(changedProperties) {
    initialize().then(() => this.started = true);
  }

  update (changedProperties) {
    super.update(changedProperties);
  }

  _onUpdatedToken(e) {
    this.biscuit = e.target.value.trim();
  }

  renderTokenInput () {
    return html`
      <div class="code">
        <p>Encoded token</p>
        <textarea @input=${this._onUpdatedToken}>${this.biscuit}</textarea>
      </div>
    `;
  }

  renderNotStarted () {
    return html`
     ${this.renderTokenInput()}
     <div class="content">loading biscuit token</div>
    `;
  }

  renderEmptyToken () {
    return html`
     ${this.renderTokenInput()}
     <div class="content">Please enter a base64-encoded token</div>
    `;
  }

  renderResult () {
    console.log([this.error, this._blocks]);
    if(this.biscuit === "") {
      return html`
       ${this.renderTokenInput()}
       <div class="content">Please enter a base64-encoded token</div>
      `;
    }

    if(this.error) {
      return html`
     ${this.renderTokenInput()}
     <div class="content">${this.error}</div>
      `;
    }

    return html`
     ${this.renderTokenInput()}
      <div class="content">
      <p>Decoded token</p>
      ${this._blocks.map((block, index) => html`
        <div>
        <p>Block ${index}:</p>
        <bc-datalog-editor
          datalog=${block.code}
          readonly="true"
        </bc-datalog-editor>
        </div>
      `)}
      </div>
      `;
  }

  render () {
    if(!this.started) return this.renderNotStarted();

    const result = parse_token({ data: this.biscuit});
    console.log("parsed");
    console.log(result);
    this.error = result.error;
    this._blocks = [];

    for(let block of result.token_blocks) {
      this._blocks.push({
        code: block
      });
    }

    return this.renderResult();
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
          display: flex;
          flex-direction: column;
        }

        textarea {
          flex-grow: 1;
          border: 0;
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
