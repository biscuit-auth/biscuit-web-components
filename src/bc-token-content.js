import { css, html, LitElement } from 'lit';

/**
 * TODO DOCS
 */
export class BcTokenContent extends LitElement {

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

window.customElements.define('bc-token-content', BcTokenContent);
