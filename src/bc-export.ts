import { html, LitElement, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { dispatchCustomEvent } from "./lib/events";

@customElement("bc-export")
class BcExport extends LitElement {
  @property() blocks : Array<{ code: string; externalKey: string | null }> = [];
  @property() code = ""

  static styles = css`
    .container {
      margin-top: 10px;
      margin-bottom: 10px;
      display: flex;
      gap: 10px;
    }
    .container .confirmation {
      display: none;
    }

    .container .export {
      padding: 5px;
      align-self: center;
      font-weight: bold;
      font-size: 1.05em;
    }
  `;

  constructor() {
    super();
  }

  performExport() {
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
        <button class="export" @click="${this.performExport}" type="button">Export Playground as hash</button>
        <div class="confirmation">Hash copied to clipboard and URL updated!</div>
      </div>
    `
  }
}