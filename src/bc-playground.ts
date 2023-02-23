import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import "./bc-datalog-editor.js";
import "./bc-switch";
import "./bc-key-details";
import "./bc-export";
import { initialize } from "./wasm.js";
import { execute, generate_keypair } from "@biscuit-auth/biscuit-wasm-support";
import { CMError, CMMarker, convertError, convertMarker, LibError, LibMarker } from "./lib/adapters";
import { token_from_query } from "./lib/token";
import {Configuration, ConfigurationEntry} from "./playground-configuration";

/**
 * A fully tunable datalog biscuit playground
 */
@customElement("bc-playground")
export class BCDatalogPlayground extends LitElement {
  @property() fromHash = null;
  @property({
    converter: {
      toAttribute(value: Configuration): string {
        return value.toString()
      },
      fromAttribute(value: string): Configuration {
        return Configuration.fromString(value)
      }
    }
  }) configuration : Configuration;
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

    code {
      border: 1px rgba(128, 128, 128, 0.4) solid;
      display: flex;
      flex-direction: column;
      text-wrap: none;
      overflow-wrap: anywhere;
      max-width: fit-content;
    }

    .content code {
      user-select: all;
      max-width: 100%;
      padding: 10px;
      box-sizing: border-box;
      font-size: 1.2em;
    }

    .button {
      padding: 5px;
      box-sizing: border-box;
      margin-top: -5px;
    }
    
    .add_block {
      font-size: 1.05em;
      font-weight: bold;
      width: 100%;
    }
    
    .key_details {
      margin-top: -4px;
    }
  `;

  constructor() {
    super();

    this.configuration = new Configuration();

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
    initialize().then(() => {
      if (this.blocks[0].externalKey === null) {
        const keypair = generate_keypair();
        this.blocks[0].externalKey = keypair.private_key;
      }
      this.started = true;
    });
  }

  // Triggered when attributes change
  attributeChangedCallback(name: string, oldval: string | null, newval: string | null) {

    super.attributeChangedCallback(name, oldval, newval)

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

    // Can be called from the outside of the component
    askForExport(){
        if (this.shadowRoot !== null) {
            const exporter  = this.shadowRoot.querySelector("#export_button")
            if (exporter) {
                // @ts-ignore
                exporter.performExport(true)
            }
        }
    }

  //Export button pressed
  public onExport(e: CustomEvent) {
      const event = new CustomEvent("export", {
        detail: e.detail,
        bubbles: true,
        composed: true
      })
      this.dispatchEvent(event)

  }

  // Regenerate the private key
  onRegeneratePrivateKey() {
    const keypair = generate_keypair();
    this.blocks[0].externalKey = keypair.private_key;
    this.requestUpdate("blocks")
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

    const facts = this.configuration.get(ConfigurationEntry.facts) ? factContent : html``;

    // Display export module
    const exportContent = html `
      <bc-export id="export_button" @bc-export:export="${(e: CustomEvent) => this.onExport(e)}" code="${this.code}" .blocks="${this.blocks}"></bc-export>
    `;

    const token = this.configuration.get(ConfigurationEntry.token) ? this.renderToken() : ``;

    const result = this.configuration.get(ConfigurationEntry.result) ? html`      <p>Result</p>
    <bc-authorizer-result .content=${authorizer_result}>
    </bc-authorizer-result>` : ``;

    const authorizer = this.configuration.get(ConfigurationEntry.authorizer) ? html`${this.renderAuthorizer(markers.authorizer, parseErrors.authorizer)}` : ``;

    return html`
      <style>
        #export_button {
          display: ${ this.configuration.get(ConfigurationEntry.export) ? "block" : "none"};
          margin-bottom: 30px;
        }
      </style>
      ${exportContent}
      ${this.renderBlocks(markers.blocks, parseErrors.blocks)}
      ${authorizer}
      ${result}
      ${facts}
      ${token}
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
    const switchContent = this.configuration.get(ConfigurationEntry.third_party) && blockId !== 0 ? html`| 
    <bc-switch 
      @bc-switch:update="${(e: CustomEvent) => this.onBlockSwitch(blockId, e.detail.state)}" 
      leftLabel="1st Party Block" 
      rightLabel="3rd Party Block" 
      ratio="1"
      checked="${this.blocks[blockId].externalKey !== null ? "true" : "false"}"></bc-switch>
    ` : ``;

    // Display the public key copy button, the private key input
    let blockDetails;

    // Blocks
    if (this.configuration.get(ConfigurationEntry.third_party) && blockId !== 0 &&
      this.blocks[blockId].externalKey !== null) {
      blockDetails = html`<bc-key-details
        class="key_details"
        @bc-key-details:update="${(e: CustomEvent) => this.onBlockKeyUpdate(blockId, e)}"
        .allowsCustomKey=${this.configuration.get(ConfigurationEntry.custom_external)} 
        .displayPublicKey=${true}
        privateKey="${this.blocks[blockId].externalKey}"></bc-key-details>`;
    }

    // Authority
    if ( blockId === 0 && this.blocks[0].externalKey !== null) {
      blockDetails = html`<bc-key-details
        class="key_details"
        @bc-key-details:update="${(e: CustomEvent) => this.onBlockKeyUpdate(0, e)}"
        @bc-key-details:regenerate="${this.onRegeneratePrivateKey}"
        allowsCustomKey="${this.configuration.get(ConfigurationEntry.custom_external)}"
        allowsRegenerate="${this.configuration.get(ConfigurationEntry.regenerate)}"
        displayPublicKey="${this.configuration.get(ConfigurationEntry.public_key)}"
        withoutAlgorithm="true"
        privateKey="${this.blocks[0].externalKey}"></bc-key-details>`;
    }

    const close = blockId !== 0 && this.configuration.get(ConfigurationEntry.add_block) ?
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

    if (!this.configuration.get(ConfigurationEntry.blocks)) return;

    const addBlock = this.configuration.get(ConfigurationEntry.add_block) ? html`<button class="button add_block" @click=${this.addBlock}>+ Add block</button>` : ``;

    return html`
      ${this.blocks.map(({ code }, id) => {
        return this.renderBlock(id, code, markers[id], errors[id]);
      })}
      ${addBlock}
    `;
  }

  // Render the authorizer results and editor
  renderAuthorizer(markers: Array<CMMarker>, parseErrors: Array<CMError>) {

    const authorizer_title = this.configuration.get(ConfigurationEntry.blocks) ? html`<p>Authorizer</p>` : ``;

    return html`${authorizer_title}
      <bc-authorizer-editor
        code=${this.code}
        .markers=${markers ?? []}
        .parseErrors=${parseErrors ?? []}
        @bc-authorizer-editor:update=${this.onUpdatedCode}
        }
      >
      </bc-authorizer-editor>`;
  }

  renderToken() : TemplateResult {

    if (this.blocks.length === 0) {
        return html``
    }

    let nonEmptyBlocks = this.blocks.slice(1).filter(({ code }) => code !== "");
    nonEmptyBlocks = [this.blocks[0], ...nonEmptyBlocks];

    const query = {
      token_blocks: nonEmptyBlocks.map(({ code }) => code),
      private_key: this.blocks[0].externalKey,
      external_private_keys: nonEmptyBlocks.map(
        ({ externalKey }) => externalKey
      ),
    };

    let {token} = token_from_query(query);

    return html`<p>Token</p>
    <div class="content">
    <code>${token}</code>
    </div>`
  }
}
