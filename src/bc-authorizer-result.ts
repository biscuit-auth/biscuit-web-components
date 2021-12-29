import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import {
  Result,
  AuthorizerResult,
  AuthorizerError,
  LogicError,
} from "./lib/adapters";

/**
 * TODO DOCS
 */
@customElement("bc-authorizer-result")
export class BcAuthorizerResult extends LitElement {
  @property({ type: Object })
  content?: Result<AuthorizerResult, AuthorizerError>;

  renderLogicError(e: LogicError) {
    const failedChecksCount = e.FailedChecks?.length ?? 0;

    if (e === "NoMatchingPolicy") {
      return html` <div><pre>No policy matched</pre></div> `;
    } else if (e.Deny !== undefined) {
      return html` <div><pre>A deny policy matched</pre></div> `;
    } else {
      return html` <div><pre>${failedChecksCount} failed checks</pre></div> `;
    }
  }

  renderResult() {
    const logicError = this.content?.Ok?.authorizer_result?.Err?.FailedLogic;
    const success = this.content?.Ok?.authorizer_result?.Ok !== undefined;
    if (success) {
      return html`<div><pre>Success</pre></div>`;
    } else if (logicError) {
      return this.renderLogicError(logicError);
    } else if (this.content?.Err) {
      return html`<div><pre>Datalog execution error</pre></div>`;
    } else {
      return html`<div><pre>Unknown error</pre></div>`;
    }
  }

  render() {
    if (this.content === null) {
      return html` <div><pre>no result yet</pre></div> `;
    } else {
      return this.renderResult();
    }
  }

  static get styles() {
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
