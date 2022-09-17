import {html, LitElement, css, TemplateResult} from "lit";
import { customElement, property, state } from "lit/decorators.js";
import "../src/bc-playground";
import {Configuration, ConfigurationEntry} from "./playground-configuration";

const EMPTY_PLAYGROUND = "eyJjb2RlIjoiIiwiYmxvY2tzIjpbeyJjb2RlIjoiIiwiZXh0ZXJuYWxLZXkiOm51bGx9XX0%3D";

@customElement("bc-playground-controls")
class BcPlaygroundConfigurator extends LitElement {

    @property() query  = "";

    @state() hash: string | null = EMPTY_PLAYGROUND;
    @state() showBlocks = false;
    @state() displayFacts = false;
    @state() displayExport = false;
    @state() displayToken = false;
    @state() displayExternalKeys = false;
    @state() allowCustomExternalKeys = false;
    @state() allowsRegenerate = false;
    @state() displayPublicKey = false;
    @state() displayResult = false;
    @state() displayAddBlock = false;
    @state() displayAuthorizer = false;
    @state() configuration : Configuration;
    @state() hasBlock : boolean;

    constructor() {
      super();
      this.configuration = new Configuration();
      this.hasBlock = false;
    }


    static styles = css`
        .container {
          display: flex;
          flex-direction: row;
          gap: 40px;
          height: 100vh;
          padding: 0;
          margin: 0;
        }
      
      #playground {
        width: 75vw;
        height: 100%;

        box-sizing: border-box;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      
      #controls {
        width: 25vw;
        height: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 10px;
      }
      
      .title {
        font-size: 1.5em;
      }
      
      #controls .export {
        margin-top: 20px;
        padding: 10px;
        width: 50%;
        align-self: center;
        font-size: 1.05em;
        font-weight: bold;
      }
    `
    
    attributeChangedCallback(name: string, _old: string | null, value: string | null) {

        if (name === "query" && value !== null && value !== "") {

            const params = new URLSearchParams(value);

            this.hash =  params.has('hash') ? params.get('hash') : EMPTY_PLAYGROUND;
            this.configuration.fromUrl(params)

        }
    }

    onSwitch(tag: string, state: boolean) {
        this.configuration.set(tag, state)
        this.requestUpdate("configuration")
    }

    askPlaygroundHash() {
        if (this.shadowRoot !== null) {
            let playground = this.shadowRoot.querySelector("#playground-component")
            // @ts-ignore
            playground.askForExport()
        }
    }

    onExport(e: CustomEvent) {
        e.stopPropagation()

        let data = e.detail.hash;
        let urlParams = new URLSearchParams();

        this.configuration.exportUrl(urlParams)

        urlParams.set("hash", data)
        const event = new CustomEvent("export", {
            detail: {
                url: urlParams.toString()
            },
            bubbles: true,
            composed: true
        })
        this.dispatchEvent(event)
    }

    protected render(): unknown {

      let blockMap = new Map<string, Array<TemplateResult>>()

      this.configuration.configuration.forEach(({value, label, parent}, key) => {

        if (!blockMap.has(parent)) {
          blockMap.set(parent, [])
        }
        let blockList = blockMap.get(parent);

        let configuration_template = html`<bc-switch checked="${value}" @bc-switch:update="${(e: CustomEvent) => this.onSwitch(key, e.detail.state)}" ratio="2" leftLabel="" rightLabel="${label}"></bc-switch>
        `
        // @ts-ignore
        blockList.push(configuration_template)

      });

      let blockTemplates = html``;

      blockMap.forEach((templates, parent) => {
        if (parent === ConfigurationEntry.root) {
          blockTemplates = html`${blockTemplates}${templates}`
        } else {
          let conditional_block_configuration = this.configuration.get(parent) ? templates : ``
          blockTemplates = html`${blockTemplates}${conditional_block_configuration}`
        }
      });

        return html`
        <div class="container">
          <div id="playground">
            <div class="title">Playground</div>
            <bc-playground id="playground-component"
              @export="${(e: CustomEvent) => this.onExport(e)}"
              configuration=${this.configuration}
              fromHash="${this.hash}"></bc-playground>
          </div>
          <div id="controls">
            <div class="title">Controls</div>
            ${blockTemplates}
            <button @click="${this.askPlaygroundHash}" class="export" type="button">Export</button>
          </div>
        </div>
        `
    }
}