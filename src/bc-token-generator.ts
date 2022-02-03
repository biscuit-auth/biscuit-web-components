import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import "./bc-datalog-editor.js";
import { initialize } from "./wasm.js";
import {
  generate_token,
  generate_keypair,
} from "@biscuit-auth/biscuit-wasm-support";
import { LibError, Result, convertError, GeneratorError } from "./lib/adapters";

/**
 * TODO DOCS
 */
@customElement("bc-token-generator")
export class BcTokenGenerator extends LitElement {
  @state()
  _privateKey = "";
  @state()
  _publicKey = "";

  @state()
  _blocks = [""];

  @state()
  _started = false;

  firstUpdated() {
    initialize().then(() => (this._started = true));
  }

  _onUpdatedBlock(blockId: number, e: { detail: { code: string } }) {
    const newBlocks = [...this._blocks];
    newBlocks[blockId] = e.detail.code;
    this._blocks = newBlocks;
  }

  generateKey() {
    const { public_key, private_key } = generate_keypair();
    this._privateKey = private_key;
    this._publicKey = public_key;
  }

  addBlock() {
    const newBlocks = [...this._blocks];
    newBlocks.push("");
    this._blocks = newBlocks;
  }

  renderNotStarted() {
    return html`
      <div class="row">
        <div class="content">loading biscuit generator</div>
      </div>
    `;
  }

  renderKeyInput() {
    return html`
      <div class="row">
        <p>
          <label for="private-key">Private key</label>
          <input id="private-key" value="${this._privateKey}" /><br />
          <label for="public-key">Public key</label>
          <input
            id="public-key"
            value="${this._publicKey}"
            readonly
            disabled
          /><br />
          <button @click=${this.generateKey}>Generate key</button>
        </p>
      </div>
    `;
  }

  renderBlock(blockId: number, errors: Array<LibError> = []) {
    return html`
      <p>${blockId == 0 ? "Authority block" : "Block " + blockId}:</p>
      <bc-datalog-editor
        code="${this._blocks[blockId] ?? ""}"
        .parseErrors=${errors.map(convertError)}
        @bc-datalog-editor:update=${(e: { detail: { code: string } }) =>
          this._onUpdatedBlock(blockId, e)}
      >
      </bc-datalog-editor>
    `;
  }

  render() {
    if (!this._started) return this.renderNotStarted();

    let result: Result<string, GeneratorError>;

    try {
      result = {
        Ok: generate_token({
          token_blocks: this._blocks.filter((b) => b !== ""),
          private_key: this._privateKey,
        }),
      };
    } catch (error) {
      result = { Err: error as GeneratorError };
    }

    const blocksWithErrors: Array<number> = [];
    (result.Err?.Parse?.blocks ?? []).forEach(
      (errors: Array<LibError>, bId: number) => {
        if (errors.length > 0) {
          blocksWithErrors.push(bId);
        }
      }
    );

    let errorMessage = "Please correct the datalog input";

    if (result.Err?.Biscuit === "InternalError") {
      errorMessage = "Please provide an authority block";
    } else if (
      typeof result.Err?.Biscuit === "object" &&
      result.Err?.Biscuit?.Format?.InvalidKeySize !== undefined
    ) {
      errorMessage = "Please enter (or generate) a valid private key";
    } else if (blocksWithErrors.length > 0) {
      const blockList = blocksWithErrors
        .map((bId) => (bId === 0 ? "authority" : bId.toString()))
        .join(", ");
      errorMessage =
        "Please correct the datalog input on the following blocks: " +
        blockList;
    }

    const token = result.Ok ?? errorMessage;

    return html`
      <div class="row">
        <div class="code">
          ${this.renderKeyInput()}
          ${this._blocks.map((code, id) => {
            const blockErrors = result.Err?.Parse?.blocks[id] ?? [];
            return this.renderBlock(id, blockErrors);
          })}
          <button @click=${this.addBlock}>Add block</button>
        </div>
        <div class="content">
          <p>Generated token</p>
          <code>${token}</code>
        </div>
      </div>
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

    .content code {
      user-select: all;
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

    bc-datalog-editor {
      border-bottom: 1px rgba(128, 128, 128, 0.4) solid;
    }
  `;
}
