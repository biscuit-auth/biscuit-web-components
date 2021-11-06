import { css, html, LitElement } from 'lit-element';

/**
 * TODO DOCS
 */
export class BcVerifierResult extends LitElement {

  static get properties () {
    return {
      content: { type: Object },
    };
  }

  constructor () {
    super();
  }

  render () {
    const content = (this.content == null) ? 'no content yet' : this.content;
    return html`
      <div><pre>${content}</pre></div>
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          display: block;
        }
      `,
    ];
  }
}

window.customElements.define('bc-verifier-result', BcVerifierResult);
