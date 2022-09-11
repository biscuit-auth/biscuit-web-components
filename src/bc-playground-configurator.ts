import { html, LitElement, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import "../src/bc-playground";

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
    @state() allowsRegenerate = "false";


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

            const params = new Proxy(new URLSearchParams(value), {
                get: (searchParams, prop: string) => searchParams.get(prop),
            }) as URLSearchParams & Record<string, string>;

            this.hash =  params.hash ? params.hash : EMPTY_PLAYGROUND;
            this.displayExport = params.export === '1';
            this.displayExternalKeys = params.third_party === '1';
            this.displayToken = params.token === '1';
            this.displayFacts = params.facts === '1';
            this.allowCustomExternalKeys = params.custom_external === '1';
            this.allowsRegenerate = params.regenerate === '1' ? "true" : "false";
            this.showBlocks = params.blocks === '1';
        }
    }

    onSwitch(tag: string, state: boolean) {
        switch (tag) {
            case "blocks":
                this.showBlocks = state;
                break;
            case "export":
                this.displayExport = state;
                break;
            case "facts":
                this.displayFacts = state;
                break
            case "third_party":
                this.displayExternalKeys = state;
                break
            case "custom_keys":
                this.allowCustomExternalKeys = state;
                break
            case "token":
                this.displayToken = state;
                break
            case "regenerate":
                this.allowsRegenerate = state ? "true" : "false";
                break
        }
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
        if (this.displayExport) {
            urlParams.set("export", "1")
        }
        if (this.showBlocks) {
            urlParams.set("blocks", "1")
        }
        if (this.displayExternalKeys) {
            urlParams.set("third_party", "1")
        }

        if (this.displayFacts) {
            urlParams.set("facts", "1")
        }

        if (this.allowCustomExternalKeys) {
            urlParams.set("custom_external", "1")
        }

        if (this.allowsRegenerate) {
            urlParams.set("regenerate", "1")
        }

        if (this.displayToken) {
            urlParams.set("token", "1")
        }

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

        return html`
        <div class="container">
          <div id="playground">
            <div class="title">Playground</div>
            <bc-playground id="playground-component"
              @export="${(e: CustomEvent) => this.onExport(e)}"
              displayExport="${this.displayExport}"
              displayFacts="${this.displayFacts}"
              displayExternalKeys="${this.displayExternalKeys}"
              displayToken="${this.displayToken}"
              allowCustomExternalKeys="${this.allowCustomExternalKeys}"
              allowsRegenerate="${this.allowsRegenerate}"
              showBlocks="${this.showBlocks}"
              fromHash="${this.hash}"></bc-playground>
          </div>
          <div id="controls">
            <div class="title">Controls</div>
            <bc-switch checked="${this.showBlocks}" @bc-switch:update="${(e: CustomEvent) => this.onSwitch("blocks", e.detail.state)}" ratio="2" leftLabel="" rightLabel="Display blocks editor"></bc-switch>
            <bc-switch checked="${this.displayFacts}" @bc-switch:update="${(e: CustomEvent) => this.onSwitch("facts", e.detail.state)}" ratio="2" leftLabel="" rightLabel="Display authorizer world"></bc-switch>
            <bc-switch checked="${this.displayExport}" @bc-switch:update="${(e: CustomEvent) => this.onSwitch("export", e.detail.state)}" ratio="2" leftLabel="" rightLabel="Display export button"></bc-switch>
            <bc-switch checked="${this.displayToken}" @bc-switch:update="${(e: CustomEvent) => this.onSwitch("token", e.detail.state)}" ratio="2" leftLabel="" rightLabel="Display serialized token"></bc-switch>
            <bc-switch checked="${this.displayExternalKeys}" @bc-switch:update="${(e: CustomEvent) => this.onSwitch("third_party", e.detail.state)}" ratio="2" leftLabel="" rightLabel="Allow 3rd party blocks"></bc-switch>
            <bc-switch checked="${this.allowCustomExternalKeys}" @bc-switch:update="${(e: CustomEvent) => this.onSwitch("custom_keys", e.detail.state)}" ratio="2" leftLabel="" rightLabel="Allow to customize private keys"></bc-switch>
            <bc-switch checked="${this.allowsRegenerate === "true"}" @bc-switch:update="${(e: CustomEvent) => this.onSwitch("regenerate", e.detail.state)}" ratio="2" leftLabel="" rightLabel="Allow regenerate Biscuit private key"></bc-switch>
            <button @click="${this.askPlaygroundHash}" class="export" type="button">Export</button>
          </div>
        </div>
        `
    }
}