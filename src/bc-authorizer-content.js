import { css, html, LitElement } from 'lit-element';

/**
 * TODO DOCS
 */
export class BcAuthorizerContent extends LitElement {

  static get properties () {
    return {
      content: { type: Array },
    };
  }

  constructor () {
    super();
    this.content = [];
  }

  render () {
    var facts_map = {};
    for(let fact of this.content) {
      if(facts_map[fact.name] == undefined) {
        facts_map[fact.name] = [];
      }
      facts_map[fact.name].push(fact.terms);
    }

    return html`
      <div>${
        Object.keys(facts_map).sort().map(function(key, index) {

          return html`<table><thead><tr><th>${key}</th></tr></thead><tbody>
            ${facts_map[key].map((terms) => {

              return html`<tr>
                ${terms.map((term) => html`<td>${term}</td>`)}
              </tr>`
            })}
          </tbody></table>`
        })
      }</div>
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          display: block;
        }

        table, td {
    border: 1px solid #fff;
    color: #000;
    margin-bottom: 10px;
}

thead, tfoot {
    background-color: #333;
    color: #fff;
}

tbody tr:nth-child(odd){
  background-color: #dfe4ed;
}

tbody tr:nth-child(even){
  background-color: #fff;
}

td, th {
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 5px;
  padding-bottom: 3px;
}
      `,
    ];
  }
}

window.customElements.define('bc-authorizer-content', BcAuthorizerContent);
