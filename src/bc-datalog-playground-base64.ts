import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import "./bc-datalog-editor.js";
import "./bc-switch";
import "./bc-3rd-party-details";
import "./bc-export";
import { initialize } from "./wasm.js";
import { execute, generate_keypair } from "@biscuit-auth/biscuit-wasm-support";
import { CMError, CMMarker, convertError, convertMarker, LibError, LibMarker } from "./lib/adapters";

/**
 * A fully tunable datalog biscuit playground
 */
@customElement("bc-datalog-playground-b64")
export class BCDatalogPlayground extends LitElement {
  @property() fromHash = null;
  @property() showBlocks = false;
  @property() displayFacts = false;
  @property() displayExport = false;
  @property() displayExternalKeys = false;
  @property() allowCustomExternalKeys = false;
  @state() code = "";
  @state() blocks: Array<{ code: string; externalKey: string | null }> = [];
  @state() private started = false;

  static styles = css`
    
    .block {
      margin-bottom: 20px;
    }
    
    .blockHeader {
      display: flex;
      gap: 10px;
      margin-bottom: 10px;
    }
    
    .blockHeader .close {
      font-size: 1.5em;
      line-height: 10px;
      cursor: pointer;
      padding: 5px;
    }
  `;

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
  }

  firstUpdated() {
    initialize().then(() => (this.started = true));
  }

  // Triggered when attributes change
  attributeChangedCallback(name: string, oldval: string | null, newval: string | null) {
      if (name === "fromhash" && newval !== null) {

          const data = JSON.parse(atob(decodeURIComponent(newval)), function(k, v) {
              if (v && typeof v === 'object' && !Array.isArray(v)) {
                  return Object.assign(Object.create(null), v);
              }
              return v;
          });

          this.blocks = data.blocks;
          this.code = data.code;
      }

      if (name === "showblocks") {
          this.showBlocks = newval === "true";
      }

      if (name === "displayfacts") {
          this.displayFacts = newval === "true";
      }

      if (name === "displayexternalkeys") {
          this.displayExternalKeys = newval === "true";
      }

      if (name === "displayexport") {
        this.displayExport = newval === "true";
      }

      if (name === "allowcustomexternalkeys") {
        this.allowCustomExternalKeys = newval === "true"
      }
  }

  // A new block is added to the chain
  addBlock() {
    const newBlocks = [...this.blocks];
    newBlocks.push({ code: "", externalKey: null });
    this.blocks = newBlocks;
  }

  // A block is deleted from the chain
  deleteBlock(blockId: number) {
    console.debug("deleting block")
    this.blocks.splice(blockId, 1)
    this.requestUpdate("blocks")
  }

  // The content of the block has changed
  onUpdatedBlock(blockId: number, e: { detail: { code: string } }) {
    const newBlocks = [...this.blocks];
    newBlocks[blockId] = {
      code: e.detail.code,
      externalKey: newBlocks[blockId].externalKey,
    };
    this.blocks = newBlocks;
  }

  // The authorizer code has been modified
  onUpdatedCode(e: { detail: { code: string } }) {
    this.code = e.detail.code;
  }

  // React to the toggle between 1st and 3rd party block
  onBlockSwitch(blockId: number, state: boolean) {
    if (state) {
      // 3rd party
      console.debug("3rd party")
      if (this.blocks[blockId].externalKey === null) {
        // uninitialized 3rd party block
        const keypair = generate_keypair();
        this.blocks[blockId].externalKey = keypair.private_key
        this.requestUpdate("blocks")
      }
    } else {
      // attenuate
      console.debug("attenuate")
      this.blocks[blockId].externalKey = null
      this.requestUpdate("blocks")
    }
  }

  // A 3rd party block has been updated
  onBlockKeyUpdate(blockId : number, e: CustomEvent) {
    this.blocks[blockId].externalKey = e.detail.data;
    this.requestUpdate("blocks");
  }

  // Main rendering method
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
      // Filter empty blocks but keep the authority even if empty
      let validBlocks = this.blocks.slice(1).filter((x) => x.code !== "");
      validBlocks = [this.blocks[0], ...validBlocks]
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
      console.debug({ authorizerQuery, authorizerResult });
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
    // Display the authorizer world
    const factContent = html`<p>Facts</p>
      <bc-authorizer-content
        .content=${authorizer_world}
      ></bc-authorizer-content>`;

    const facts = this.displayFacts ? factContent : html``;

    // Display export module
    const exportContent = html `
      <bc-export code="${this.code}" .blocks="${this.blocks}"></bc-export>
    `;

    const exportComponent = this.displayExport ? exportContent : ``;

    return html`
      ${exportComponent}
      ${this.renderBlocks(markers.blocks, parseErrors.blocks)}
      ${this.renderAuthorizer(markers.authorizer, parseErrors.authorizer)}
      <p>Result</p>
      <bc-authorizer-result .content=${authorizer_result}>
      </bc-authorizer-result>
      ${facts}
    `;
  }

  // Render a single block
  renderBlock(
    blockId: number,
    code: string,
    markers: Array<CMMarker>,
    errors: Array<CMError>
  ) {

    // Display the toggle switch between 1st and 3rd party mode
    const switchContent = this.displayExternalKeys && blockId !== 0 ? html`| 
    <bc-switch 
      @bc-switch:update="${(e: CustomEvent) => this.onBlockSwitch(blockId, e.detail.state)}" 
      leftLabel="1st Party Block" 
      rightLabel="3rd Party Block" 
      checked="${this.blocks[blockId].externalKey !== null ? "true" : "false"}"></bc-switch>` : ``;

    // Display the public key copy button, the private key input
    const blockDetails = this.displayExternalKeys && blockId !== 0 &&
                         this.blocks[blockId].externalKey !== null ?
      html`<bc-3rd-party-details 
        @bc-3rd-party-details:update="${(e: CustomEvent) => this.onBlockKeyUpdate(blockId, e)}"
        .allowsCustomKey=${this.allowCustomExternalKeys} 
        privateKey="${this.blocks[blockId].externalKey}"></bc-3rd-party-details>` : ``;

    const close = blockId !== 0 ?
      html`<div @click="${() => this.deleteBlock(blockId)}" class="close">&times;</div>` : '';

    return html`
      <div class="block">
        <div class="blockHeader">
          ${close}
          <div>${blockId == 0 ? "Authority block" : "Block " + blockId}</div>
          ${switchContent}
          ${blockDetails}
        </div>

        <bc-datalog-editor
          datalog=${code}
          .markers=${markers ?? []}
          .parseErrors=${errors ?? []}
          @bc-datalog-editor:update=${(e: { detail: { code: string } }) =>
            this.onUpdatedBlock(blockId, e)}
          }
        />
      </div>`;
  }

  // Render all block if needed
  renderBlocks(markers: Array<Array<CMMarker>>, errors: Array<Array<CMError>>) {
    if (!this.showBlocks) return;

    return html`
      ${this.blocks.map(({ code }, id) => {
        return this.renderBlock(id, code, markers[id], errors[id]);
      })}
      <button @click=${this.addBlock}>Add block</button>
    `;
  }

  // Render the authorizer results and editor
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
