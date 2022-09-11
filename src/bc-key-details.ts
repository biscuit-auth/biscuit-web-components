import { html, LitElement, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  get_public_key
} from "@biscuit-auth/biscuit-wasm-support";
import { initialize } from "./wasm";
import { dispatchCustomEvent } from "./lib/events";

@customElement("bc-key-details")
class ThirdPartyBlockDetails extends LitElement {
  @property() privateKey = "";
  @property() allowsCustomKey = false;
  @property() withoutAlgorithm = false;
  @property() allowsRegenerate = false;
  @state() _privateKey = "";
  @state() _publicKey = "";
  @state() private started = false;

  static styles = css`
    .container {
      display: flex;
      gap: 10px;
    }
    .confirmation {
      display: none;
    }
  `

  constructor() {
    super();
  }

  firstUpdated() {
    initialize().then(() => {
      this._publicKey = get_public_key(this._privateKey)
    });
  }

  onKeyChange(e: InputEvent) {
    if (e.target !== null ) {
    const data = (e.target as HTMLInputElement).value;
    this._privateKey = data;
    this._publicKey = get_public_key(this._privateKey)
    dispatchCustomEvent(this, "update", {data})
    }
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null) {

    if (name === "privatekey" && value !== null && value.length) {
      this._privateKey = value;
    }

    if (name === "allowscustomkey") {
      this.allowsCustomKey = value === "true";
    }

    if (name === "withoutalgorithm") {
      this.withoutAlgorithm = value === "true"
    }

    if (name === "allowsregenerate") {
      this.allowsRegenerate = value === "true"
    }
  }

  onCopyButton() {
    const data = this.withoutAlgorithm ? `${this._publicKey}` : `ed25519/${this._publicKey}`;
    navigator.clipboard.writeText(data).then(r => {
      console.debug("copied")
      if (this.shadowRoot !== null) {
        const confirmationElement = this.shadowRoot.querySelector(".confirmation") as HTMLLIElement;
        if (confirmationElement !== null) {
          confirmationElement.style.display = "block"
          setTimeout(() => {
              confirmationElement.style.display = "none"
            }, 2000)
        }
      }
    })
  }

  onRegeneratePrivateKey() {
    dispatchCustomEvent(this, "regenerate")
  }

  protected render() {

    const customExternalKey = this.allowsCustomKey ? html`<input type="text" size="64" 
                                                                 @blur="${(e: InputEvent) => this.onKeyChange(e)}"
                                                                 value="${this._privateKey}"/>` : '';

    const regenerate = this.allowsRegenerate ? html`<button @click="${this.onRegeneratePrivateKey}">Regenerate Private Key</button>` : ``;

    return html`
      <div class="container">
        ${regenerate}
        <button @click="${this.onCopyButton}">Copy Public Key</button>
        <div class="confirmation">Copied! </div>
        ${customExternalKey}
      </div>
    `;
  }
}