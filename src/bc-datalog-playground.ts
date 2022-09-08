import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import "./bc-datalog-editor.js";
import { initialize } from "./wasm.js";
import { execute } from "@biscuit-auth/biscuit-wasm-support";
import {
  convertMarker,
  convertError,
  LibMarker,
  CMError,
  CMMarker,
  LibError,
} from "./lib/adapters";

/**
 * TODO DOCS
 */
@customElement("bc-datalog-playground")
export class BCDatalogPlayground extends LitElement {
  @property() code = "";
  @property() showBlocks = false;
  @property() fromHash = false;
  @state() blocks: Array<{ code: string; externalKey: string | null }> = [];
  @state() private started = false;

  constructor() {
    super();

    const codeChild = this.querySelector(".authorizer");
    if (codeChild !== null) {
      this.code = codeChild.textContent ?? "";
    }
    const blockChildren = this.querySelectorAll(".block");
    this.blocks = Array.from(blockChildren)
      .map((b, i) => {
        const code = b.textContent ?? "";
        let externalKey = null;
        if (i > 0) {
          externalKey = b.getAttribute("privateKey");
        }
        return { code, externalKey };
      })
      .filter(({ code }, i) => i === 0 || code !== "");
    setTimeout(() => this.updateFromHash(), 0);
  }

  updateFromHash() {
    if (!this.fromHash) return;
    let hashContents;
    try {
      hashContents = JSON.parse(atob(window.location.hash.substr(1)));
    } catch (e) {
      console.error({ e });
    }
    const [code, blocks] = hashContents;
    this.code = code;
    this.blocks = blocks;
  }

  updateHash() {
    if (!this.fromHash) return;
    const ser = [this.code, this.blocks];
    window.location.hash = btoa(JSON.stringify(ser));
  }

  firstUpdated() {
    initialize().then(() => (this.started = true));
  }

  addBlock() {
    const newBlocks = [...this.blocks];
    newBlocks.push({ code: "", externalKey: null });
    this.blocks = newBlocks;
    this.updateHash();
  }

  onUpdatedBlock(blockId: number, e: { detail: { code: string } }) {
    const newBlocks = [...this.blocks];
    newBlocks[blockId] = {
      code: e.detail.code,
      externalKey: newBlocks[blockId].externalKey,
    };
    this.blocks = newBlocks;
    this.updateHash();
  }

  onUpdatedExternalKey(blockId: number, e: InputEvent) {
    const newBlocks = [...this.blocks];
    const newValue = (e.target as HTMLInputElement).value.trim();
    newBlocks[blockId] = {
      code: newBlocks[blockId].code,
      externalKey: newValue !== "" ? newValue : null,
    };
    this.blocks = newBlocks;
    this.updateHash();
  }

  onUpdatedCode(e: { detail: { code: string } }) {
    this.code = e.detail.code;
    this.updateHash();
  }

  render() {
    let authorizer_world = [];
    let authorizer_result = null;
    const parseErrors = {
      blocks: [],
      authorizer: [],
    };
    const markers = {
      blocks: [],
      authorizer: [],
    };
    if (this.started) {
      const validBlocks = this.blocks.filter((x) => x.code !== "");
      const authorizerQuery = {
        token_blocks:
          validBlocks.length > 0
            ? validBlocks.map(({ code }) => code)
            : ["check if true"],
        authorizer_code: this.code,
        query: "",
        external_private_keys: validBlocks.map(
          ({ externalKey }) => externalKey
        ),
      };
      const authorizerResult = execute(authorizerQuery);
      console.warn({ authorizerQuery, authorizerResult });
      authorizer_world = authorizerResult.Ok?.authorizer_world ?? [];
      authorizer_result = authorizerResult;
      markers.authorizer =
        authorizerResult.Ok?.authorizer_editor.markers.map(convertMarker) ?? [];
      parseErrors.authorizer =
        authorizerResult.Err?.authorizer.map(convertError) ?? [];

      markers.blocks =
        authorizerResult.Ok?.token_blocks.map(
          (b: { markers: Array<LibMarker> }) => b.markers.map(convertMarker)
        ) ?? [];
      parseErrors.blocks =
        authorizerResult.Err?.blocks.map((b: Array<LibError>) =>
          b.map(convertError)
        ) ?? [];
    }

    return html`
      ${this.renderBlocks(markers.blocks, parseErrors.blocks)}
      ${this.renderAuthorizer(markers.authorizer, parseErrors.authorizer)}
      <p>Result</p>
      <bc-authorizer-result .content=${authorizer_result}>
      </bc-authorizer-result>
      <p>Facts</p>
      <bc-authorizer-content
        .content=${authorizer_world}
      ></bc-authorizer-content>
    `;
  }

  renderExternalKeyInput(blockId: number) {
    if (blockId <= 0) return;

    return html`
      <input
        @input=${(e: InputEvent) => this.onUpdatedExternalKey(blockId, e)}
        value=${this.blocks[blockId].externalKey}
      />
    `;
  }

  renderBlock(
    blockId: number,
    code: string,
    markers: Array<CMMarker>,
    errors: Array<CMError>
  ) {
    return html`
        <p>${
          blockId == 0 ? "Authority block" : "Block " + blockId
        }: ${this.renderExternalKeyInput(blockId)}</p>
      <bc-datalog-editor
        datalog=${code}
        .markers=${markers ?? []}
        .parseErrors=${errors ?? []}
        @bc-datalog-editor:update=${(e: { detail: { code: string } }) =>
          this.onUpdatedBlock(blockId, e)}
        }
      >
      </bc-authorizer-editor>`;
  }

  renderBlocks(markers: Array<Array<CMMarker>>, errors: Array<Array<CMError>>) {
    if (!this.showBlocks) return;

    return html`
      ${this.blocks.map(({ code }, id) => {
        return this.renderBlock(id, code, markers[id], errors[id]);
      })}
      <button @click=${this.addBlock}>Add block</button>
    `;
  }

  renderAuthorizer(markers: Array<CMMarker>, parseErrors: Array<CMError>) {
    return html` <p>Authorizer</p>
      <bc-authorizer-editor
        code=${this.code}
        .markers=${markers ?? []}
        .parseErrors=${parseErrors ?? []}
        @bc-authorizer-editor:update=${this.onUpdatedCode}
        }
      >
      </bc-authorizer-editor>`;
  }
}
