import { html, css, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import "./bc-datalog-editor.js";
import "./bc-switch";
import "./bc-3rd-party-details";
import "./bc-export";
import { initialize } from "./wasm.js";
import { execute, generate_keypair, get_public_key } from "@biscuit-auth/biscuit-wasm-support";
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
@customElement("bc-datalog-playground-b64")
export class BCDatalogPlayground extends LitElement {
  @property() fromHash = null;
  @property() showBlocks = false;
  @property() displayFacts = false;
  @property() displayExport = false;
  @property() displayExternalKeys = false;
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
          console.log(newval)
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
  }

  addBlock() {
    const newBlocks = [...this.blocks];
    newBlocks.push({ code: "", externalKey: null });
    this.blocks = newBlocks;
  }

  onUpdatedBlock(blockId: number, e: { detail: { code: string } }) {
    const newBlocks = [...this.blocks];
    newBlocks[blockId] = {
      code: e.detail.code,
      externalKey: newBlocks[blockId].externalKey,
    };
    this.blocks = newBlocks;
  }

  onUpdatedCode(e: { detail: { code: string } }) {
    this.code = e.detail.code;
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


    const factContent = html`<p>Facts</p>
      <bc-authorizer-content
        .content=${authorizer_world}
      ></bc-authorizer-content>`;

    const facts = this.displayFacts ? factContent : html``;

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

  onBlockSwitch(blockId: number, state: boolean) {
    if (state) {
      // 3rd party
      console.debug("3rd party")
      if (this.blocks[blockId].externalKey === null) {
        // unitialized 3rd party block
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

  renderBlock(
    blockId: number,
    code: string,
    markers: Array<CMMarker>,
    errors: Array<CMError>
  ) {

    const switchContent = blockId !== 0 ? html`| 
    <bc-switch 
      @bc-switch:update="${(e: CustomEvent) => this.onBlockSwitch(blockId, e.detail.state)}" 
      leftLabel="Attenuation Block" 
      rightLabel="3rd Party Block" 
      checked="${this.blocks[blockId].externalKey !== null ? "true" : "false"}"></bc-switch>` : ``;
    const blockDetails = blockId !== 0 && this.blocks[blockId].externalKey !== null ? html`<bc-3rd-party-details privateKey="${this.blocks[blockId].externalKey}"></bc-3rd-party-details>` : ``;

    return html`
      <div class="block">
        <div class="blockHeader">
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
