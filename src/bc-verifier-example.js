import { css, html, LitElement } from 'lit-element';
import { dispatchCustomEvent } from '../src/lib/events.js';
import init, {execute} from "@clevercloud/biscuit-component-wasm"
import './bc-verifier-editor.js';
import './bc-verifier-result.js';
import './bc-verifier-content.js';

/**
 * TODO DOCS
 */
export class BcVerifierExample extends LitElement {

  static get properties () {
    return {
      code: { type: String },
      defaultAllow: { type: Boolean },
      started: { tyope: Boolean },
    };
  }

  constructor () {
    super();
    if(this.children[0] != undefined) {
      this.code = this.children[0].innerText;
    } else {
      this.code = "";
    }

    this.defaultAllow = false;
    this.started = false;
  }

  _onUpdatedCode(code) {
    this.code = code;
    dispatchCustomEvent(this, 'update', {code: code});
  }

  firstUpdated(changedProperties) {
    init().then(() => this.started = true);
  }

  update (changedProperties) {
    super.update(changedProperties);
  }

  render () {
    var parseErrors = [];
    var markers = [];
    var verifier_result = "";
    var verifier_world = [];

    var code = this.code;
    if(this.defaultAllow) {
      code += "\n\nallow if true;";
    }

    if(this.started) {
      var state = {
        token_blocks:[],
        verifier_code: code,
        query: "",
      };
      var result = execute(state);

      verifier_result = result.verifier_result;
      verifier_world = result.verifier_world;

      if(result.verifier_editor != null) {

        for(let error of result.verifier_editor.errors) {
          parseErrors.push({
            message: error.message,
            severity: "error",
            from: CodeMirror.Pos(error.position.line_start, error.position.column_start),
            to: CodeMirror.Pos(error.position.line_end, error.position.column_end),
          });
        }

        for(let marker of result.verifier_editor.markers) {
          var css;
          if(marker.ok) {
            css = "background: #c1f1c1;";
          } else {
            css = "background: #ffa2a2;";
          }

          markers.push({
            from: {
              line: marker.position.line_start,
              ch: marker.position.column_start,
            },
            to: {
              line: marker.position.line_end,
              ch: marker.position.column_end,
            },
            options: { css: css},
          });
        }
      }
    }

    return html`
      <bc-verifier-editor
        code='${this.code}'
        parseErrors='${JSON.stringify(parseErrors)}'
        markers='${JSON.stringify(markers)}'
        @bc-verifier-editor:update="${(e) => { this._onUpdatedCode(e.detail.code) }}"}>
      </bc-verifier-editor>
      <em>Execution result</em>
      <bc-verifier-result content='${JSON.stringify(verifier_result)}'></bc-verifier-result>
      <details>
        <summary>Facts</summary>
        <bc-verifier-content content='${JSON.stringify(verifier_world)}'></bc-verifier-content>
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

window.customElements.define('bc-verifier-example', BcVerifierExample);
