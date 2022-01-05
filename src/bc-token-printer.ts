import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import "./bc-datalog-editor.js";
import { initialize } from "./wasm.js";
import { execute, parse_token } from "@biscuit-auth/biscuit-wasm-support";
import {
  LibMarker,
  Result,
  AuthorizerResult,
  AuthorizerError,
  convertMarker,
  convertError,
} from "./lib/adapters";

/**
 * TODO DOCS
 */
@customElement("bc-token-printer")
export class BcTokenPrinter extends LitElement {
  @property()
  biscuit = "";

  @property()
  readonly = false;

  @property()
  showAuthorizer = false;

  @property()
  authorizer = "";

  @state()
  _started = false;

  constructor() {
    super();
    const authorizerChild = this.querySelector(".authorizer");
    if (authorizerChild !== null) {
      this.authorizer = authorizerChild.textContent?.trim() ?? "";
    }
  }

  firstUpdated() {
    initialize().then(() => (this._started = true));
  }

  _onUpdatedToken(e: InputEvent) {
    if (this.readonly) return;
    this.biscuit = (e.target as HTMLInputElement).value.trim();
  }

  _onUpdatedAuthorizer(e: { detail: { code: string } }) {
    if (!this.showAuthorizer) return;
    this.authorizer = e.detail.code;
  }

  renderTokenInput() {
    if (this.readonly) {
      return html`
        <div class="code">
          <p>Encoded token</p>
          <code>${this.biscuit}</code>
        </div>
      `;
    }
    return html`
      <div class="code">
        <p>Encoded token</p>
        <textarea @input=${this._onUpdatedToken}>${this.biscuit}</textarea>
      </div>
    `;
  }

  renderNotStarted() {
    return html`
      <div class="token">
        ${this.renderTokenInput()}
        <div class="content">loading biscuit token</div>
      </div>
    `;
  }

  renderEmptyToken() {
    return html`
      ${this.renderTokenInput()}
      <div class="content">Please enter a base64-encoded token</div>
    `;
  }

  renderResult(
    error: string,
    blocks: Array<{ code: string; revocation_id: string }>,
    blockMarkers: Array<LibMarker>
  ) {
    if (this.biscuit === "") {
      return html`
        ${this.renderTokenInput()}
        <div class="content">Please enter a base64-encoded token</div>
      `;
    }

    if (error) {
      return html`
        ${this.renderTokenInput()}
        <div class="content">${error}</div>
      `;
    }

    return html`
      ${this.renderTokenInput()}
      <div class="content">
        <p>Decoded token</p>
        ${blocks.map(
          (block, index) => html`
        <div>
        <p>${index === 0 ? "Authority block" : `Block ${index}`}:</p>
        <p class="revocation-id">Revocation id: <span class="id">${
          block.revocation_id
        }</span></p>
        <bc-datalog-editor
          datalog=${block.code}
          .markers=${blockMarkers[index] ?? []}
          readonly="true"
        </bc-datalog-editor>
        </div>
      `
        )}
      </div>
    `;
  }

  renderAuthorizer(result: Result<AuthorizerResult, AuthorizerError>) {
    if (!this.showAuthorizer) return;

    const markers = result.Ok?.authorizer_editor.markers ?? [];
    const errors = result.Err?.authorizer ?? [];

    return html`
      <div class="code">
        <p>Authorizer</p>
        <bc-authorizer-editor
          code="${this.authorizer}"
          .markers=${markers.map(convertMarker)}
          .parseErrors=${errors.map(convertError)}
          @bc-authorizer-editor:update=${this._onUpdatedAuthorizer}
        >
        </bc-authorizer-editor>
      </div>
      <div class="content">
        <p>Result</p>
        <bc-authorizer-result .content=${result}> </bc-authorizer-result>
      </div>
    `;
  }

  render() {
    if (!this._started) return this.renderNotStarted();

    const parseResult = parse_token({ data: this.biscuit });
    const blocks = parseResult.token_blocks.map((code: string, i: number) => ({
      code,
      revocation_id: parseResult.revocation_ids[i],
    }));
    const authorizerQuery = {
      token_blocks: blocks.map((b: { code: string }) => b.code),
      authorizer_code: this.authorizer,
      query: "",
    };
    const authorizerResult = execute(authorizerQuery);
    const blockMarkers =
      authorizerResult.Ok?.token_blocks.map(
        (b: { markers: Array<LibMarker> }) => b.markers.map(convertMarker)
      ) ?? [];

    return html`
      <div class="row">
        ${this.renderResult(
          parseResult.error,
          blocks,
          this.showAuthorizer ? blockMarkers : []
        )}
      </div>
      <div class="row">${this.renderAuthorizer(authorizerResult)}</div>
    `;
  }

  static styles = css`
    .row {
      display: flex;
      flex-direction: column;
      text-align: left;
    }

    @media (prefers-color-scheme: dark) {
      .row {
        color: #dee2e6;
        background: #131314;
      }
      textarea {
        color: #dee2e6;
        background: #131314;
      }
    }

    @media (prefers-color-scheme: light) {
      .row {
        color: #1d2d35;
        background: #fff;
      }
    }

    @media (min-width: 576px) {
      .row {
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
    }

    p {
      border-bottom: 1px rgba(128, 128, 128, 0.4) solid;
      margin-block-start: 0px;
      margin-block-end: 0px;
      padding: 0.2em;
      font-size: 0.8em;
    }

    .revocation-id {
      overflow: hidden;
      diplay: inline-block;
      text-overflow: ellipsis;
      max-width: 100;
    }

    .revocation-id > .id {
      user-select: all;
    }

    bc-datalog-editor {
      border-bottom: 1px rgba(128, 128, 128, 0.4) solid;
    }
  `;
}
