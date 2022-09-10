import { html, LitElement, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  generate_keypair,
  get_public_key
} from "@biscuit-auth/biscuit-wasm-support";
import { dispatchCustomEvent } from "./lib/events";
import doc = Mocha.reporters.doc;

@customElement("bc-3rd-party-details")
class ThirdPartyBlockDetails extends LitElement {
  @property() privateKey = ""
  @state() _privateKey = ""
  @state() _publicKey = ""

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

  attributeChangedCallback(name: string, _old: string | null, value: string | null) {
    if (name === "privatekey" && value !== null && value.length) {
      this._privateKey = value
      this._publicKey = get_public_key(this._privateKey)
    }
  }

  onClick() {
    navigator.clipboard.writeText(`ed25519/${this._publicKey}`).then(r => {
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

  protected render(): unknown {
    return html`
      <div class="container">
        <button @click="${this.onClick}">Copy Public Key</button>
        <div class="confirmation">Copied! </div>
      </div>
    `;
  }
}