import { css, html, LitElement } from "lit";

/**
 * TODO DOCS
 */
export class BcAuthorizerContent extends LitElement {
  static get properties() {
    return {
      content: { type: Array },
    };
  }

  constructor() {
    super();
    this.content = [];
  }

  render() {
    var facts_map = {};
    var facts = "";
    var current_name;
    for (let fact of this.content) {
      if (facts_map[fact.name] == undefined) {
        facts_map[fact.name] = [];
      }
      facts_map[fact.name].push(fact.terms);


      if(current_name == undefined) {
        current_name = fact.name;
      }

      if (fact.name != current_name) {
        facts += "\n";
        current_name = fact.name;
      }

      facts += fact.name + "("+fact.terms+");\n";
    }


    console.log(facts);

    return html`
      <div>
        <textarea>${facts}</textarea>
      </div>`;
    /*
    return html`
      <div>
        <table>
        ${Object.keys(facts_map)
          .sort()
          .map(function (key, index) {
            return html`
                ${facts_map[key].map((terms) => {
                  return html`<tr>
                    <th>${key}</th>
                    ${terms.map((term) => html`<td>${term}</td>`)}
                  </tr>`;
                })}
            `;
          })}
        </table> -->
      </div>
    `;
    */
  }

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
          display: block;
        }

        textarea {
          width: 100%;
          min-height: 100px;
        }

        table,
        td {
          border: 1px solid #fff;
          color: #000;
          margin-bottom: 10px;
        }

        thead,
        tfoot {
          background-color: #333;
          color: #fff;
        }

        tbody tr:nth-child(odd) {
          background-color: #dfe4ed;
        }

        tbody tr:nth-child(even) {
          background-color: #fff;
        }

        td,
        th {
          padding-left: 10px;
          padding-right: 10px;
          padding-top: 5px;
          padding-bottom: 3px;
        }
      `,
    ];
  }
}

window.customElements.define("bc-authorizer-content", BcAuthorizerContent);
