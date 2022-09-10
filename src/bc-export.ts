import { html, LitElement, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { dispatchCustomEvent } from "./lib/events";

@customElement("bc-export")
class BcExport extends LitElement {
  @property() blocks : Array<{ code: string; externalKey: string | null }> = [];
  @property() code = ""

  static styles = css`
    .container {
      margin-bottom: 10px;
      display: flex;
      gap: 10px;
    }
    .confirmation {
      display: none;
    }
  `;

  constructor() {
    super();
  }

  onClick() {
    const data = {code:this.code, blocks:this.blocks}
    const hash = encodeURIComponent(btoa(JSON.stringify(data)))
    dispatchCustomEvent(this, "export", {hash}, {bubble: true})
    navigator.clipboard.writeText(hash).then(() => {
      if (this.shadowRoot !== null) {
        const confirmationElement = this.shadowRoot.querySelector(".confirmation") as HTMLLIElement;
        confirmationElement.style.display = "block";
        setTimeout(() => {
          confirmationElement.style.display = "none";
        }, 2000)
      }
    })
  }

  protected render(): unknown {
    return html`
      <div class="container">
        <button @click="${this.onClick}">Export</button>
        <div class="confirmation">Hash copied to clipboard and URL updated!</div>
      </div>
    `
  }
}