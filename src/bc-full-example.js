import { css, html, LitElement } from 'lit';
import {customElement, property} from 'lit/decorators.js';
import { dispatchCustomEvent } from '../src/lib/events.js';
import {execute,parse_token} from "@geal/biscuit-component-wasm"
import './bc-authorizer-editor.js';
import './bc-authorizer-result.js';
import './bc-authorizer-content.js';
import {initialize} from './wasm.js'

/**
 * TODO DOCS
 */
export class BcFullExample extends LitElement {

  static get properties () {
    return {
      blocks: { type: Array },
      _authorizer: { type: String },

      _started: { type: Boolean },
    };
  }

  constructor () {
    super();
    this.blocks = [];

    for(let block of this.querySelectorAll(".block")) {
      console.log("block: "+block.innerHTML);
      this.blocks.push({ code: block.innerHTML });
    }

    let auth = this.querySelector(".authorizer");
    if(auth !== null) {
      this._authorizer = auth.innerHTML;
    }
    console.log("authorizer: "+this._authorizer);

    this._started = false;
  }

  _onUpdatedBlock(index, code) {
    console.log("full::_onUpdatedCode");
    console.log(code);
    this.blocks[index].code = code;
    console.log(this.blocks);
    dispatchCustomEvent(this, 'update', {blocks: this.blocks});
    this.requestUpdate();
  }

  _onUpdatedAuthorizer(code) {
    this._authorizer = code;
    dispatchCustomEvent(this, 'update', {_authorizer: code});
    this.requestUpdate();
  }

  firstUpdated(changedProperties) {
    initialize().then(() => {
      console.log("start");
      this._started = true
    });
  }

  update (changedProperties) {
    super.update(changedProperties);
  }

  render () {
    console.log("render0");
   if(!this._started) {
     return html``;
   }

    console.log(this.blocks);
    let blocks = [];
    for(let b of this.blocks) {
      blocks.push(b.code);
    }
    var state = {
      token_blocks: blocks,
      authorizer_code: this._authorizer,
      query: "",
    };

    console.log("WILL EXECUTE");
    var result = execute(state);
    console.log(result);

    var parseErrors = [];
    var markers = [];
    var authorizer_result = "";
    var authorizer_world = [];
    var blockParseErrors = [];
    var blockMarkers = [];

    for(let b of result.token_blocks){
      var errors = [];
      var marks = [];
      for(let error of b.errors) {
        errors.push({
          message: error.message,
          severity: "error",
          line_start: error.position.line_start,
          from: error.position.start,
          to: error.position.end,
        });
      }

      for(let marker of b.markers) {
        marks.push({
          from: {
            line: marker.position.line_start,
            ch: marker.position.column_start,
          },
          to: {
            line: marker.position.line_end,
            ch: marker.position.column_end,
          },
          start: marker.position.start,
          end: marker.position.end,
          ok: marker.ok,
        });
      }

      blockParseErrors.push(errors);
      blockMarkers.push(marks);
    }

    for(let error of result.authorizer_editor.errors) {
      parseErrors.push({
        message: error.message,
        severity: "error",
        line_start: error.position.line_start,
        from: error.position.start,
        to: error.position.end,
      });
    }

    for(let marker of result.authorizer_editor.markers) {
      console.log(marker);
      markers.push({
        from: {
          line: marker.position.line_start,
          ch: marker.position.column_start,
        },
        to: {
          line: marker.position.line_end,
          ch: marker.position.column_end,
        },
        start: marker.position.start,
        end: marker.position.end,
        ok: marker.ok,
      });
    }

    return html`
      ${this.blocks.map((block, index) => html`
        <bc-datalog-editor
          datalog=${block.code}
          parseErrors='${JSON.stringify(blockParseErrors[index])}'
          markers='${JSON.stringify(blockMarkers[index])}'
          @bc-datalog-editor:update="${(e) => { this._onUpdatedBlock(index, e.detail.code) }}"}>
        </bc-datalog-editor>
      `)}

      <bc-authorizer-editor
        code='${this._authorizer}'
        parseErrors='${JSON.stringify(parseErrors)}'
        markers='${JSON.stringify(markers)}'
        @bc-authorizer-editor:update="${(e) => { this._onUpdatedAuthorizer(e.detail.code) }}"}>
      </bc-authorizer-editor>

      <em>Execution result</em>
      <bc-authorizer-result content='${JSON.stringify(result.authorizer_result)}'></bc-authorizer-result>
      <details>
        <summary>Facts</summary>
        <bc-authorizer-content content='${JSON.stringify(result.authorizer_world)}'></bc-authorizer-content>
      </details>
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

window.customElements.define('bc-full-example', BcFullExample);
