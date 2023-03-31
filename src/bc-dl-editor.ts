import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

const QUERY = `
;; Literals
(number) @constant.numeric.integer
(boolean) @constant.builtin.boolean
(string) @string
(bytes) @string
(date) @constant.numeric.integer

;; Comments
(block_comment) @comment.block
(line_comment) @comment.line

;; Variables
(variable) @variable
(param) @variable.parameter

(predicate
  (nname) @function
)

(fact
  (nname) @function
)

;; Keywords
[
  "trusting"
  "check if"
  "check all"
  "allow if"
  "deny if"
] @keyword

[
  "authority"
  "previous"
] @constant.builtin

[
  "<-"
] @keyword.operator

;; Punctuation
[ "," ] @punctuation.delimiter

[ "("
  ")"
  "["
  "]"
] @punctuation.bracket

[
  "/"
  "*"
  "+"
  "-"
  "&"
  "|"
  "^"
  ">" "<" "<=" ">=" "==" "!="
  "&&"
  "||"
] @operator`;

@customElement("bc-dl-editor")
export class BcDlEditor extends LitElement {
  @property()
  code = "";
  @property()
  marks = [];
  @state()
  _tree = null;
  @state()
  _captures = [];

  _parser = null;
  _query = null;

  constructor() {
    super();

    const codeChild = this.querySelector("code");
    if (codeChild !== null) {
      this.code = trimLines(codeChild.textContent ?? "");
    }
  }

  firstUpdated() {
    super.firstUpdated();
    // trigger syntax highlighting for code provided as props
    this.handleInput({ target: this.shadowRoot.querySelector("#editing") });
  }

  ensureParser() {
    if (this._parser !== null) return true;
    if (window.Parser === undefined) return;
    const p = new window.Parser();
    p.setLanguage(window.BiscuitParser);
    this._query = window.BiscuitParser.query(QUERY);
    this._parser = p;
    return true;
  }

  handleInput(e) {
    if (this.ensureParser() !== true) return;
    const code = e.target.value;
    const tree = this._parser.parse(code);
    const captures = this._query.captures(tree.rootNode);
    this.code = code;
    this._tree = tree;
    this._captures = captures;
    window.RRR = this._tree;
    window.MMM = this._captures.map(
      ({ name, node: { startIndex, endIndex } }) => [name, startIndex, endIndex]
    );
    this.syncScroll();
    console.log("done");
  }

  syncScroll() {
    const textarea = this.shadowRoot.querySelector("#editing");
    const highlighting = this.shadowRoot.querySelector("#highlighting");
    highlighting.scrollTop = textarea.scrollTop;
    highlighting.scrollLeft = textarea.scrollLeft;
  }

  render() {
    let rendered = this.renderText2(this.code, this._captures, this.marks);
    return html` <div id="wrapper">
      <textarea
        id="editing"
        @input=${this.handleInput}
        spellcheck="false"
        @scroll=${this.syncScroll}
      >
${this.code}</textarea
      >
      <pre
        id="highlighting"
        aria-hidden="true"
      ><code id="highlighting-content">${unsafeHTML(rendered)}</code></pre>
    </div>`;
  }

  renderText2(text, captures, marks) {
    // captures come from tree-sitter and are assumed to be properly nested
    // (if nested at all, they are mostly contiguous).
    // marks however are user provided and completely separate from TS. so even
    // if the user is not doing bad things, they still don't have access to the
    // TS tree and can't be asked to provide marks that don't nest correctly
    // with TS captures.

    // captures and marks are grouped by starting index. We know that an
    // opening tag will always be there at this position.
    const ranges = new Map();
    marks.concat(captures).forEach((c) => {
      if (c.node.startIndex >= c.node.endIndex) return;
      ranges.set(
        c.node.startIndex,
        (ranges.get(c.node.startIndex) ?? []).concat(c)
      );
    });

    let output = "";
    // active ranges, indexed by their end index
    let activeRanges = new Map();
    [...text].forEach((c, i) => {
      // every range is encoded as a span element, so there is no need
      // to care about the order, we only need to close the correct amount
      // of spans
      (activeRanges.get(i) ?? []).forEach(() => {
        output += "</span>";
      });
      activeRanges.delete(i);
      const openingNow = ranges.get(i) ?? [];

      // position of the next range end. ranges created now can't go further
      const lastValidIndex = [...activeRanges.keys()].sort()[0] ?? text.length;

      // list of the ranges created by splitting opening ranges at the next
      // enclosing range end
      let createdRanges = [];

      // for each of the new ranges, make sure they are properly included in
      // the active ranges (ie they end before the next closing tag).
      // If they are not, we will need to close them at the closest boundary,
      // and open them again. if the newly created range still intersects with
      // an already defined one, it will be handled at its starting index, so
      // we don't need to do further work here.
      let openingAdapted = openingNow.map((r) => {
        // since we're operating on shallow copies, mutating `r` directly
        // would mutate it everywhere else (including across) renders
        let adapted = r;
        if (r.node.endIndex > lastValidIndex) {
          // clamp the opening range at the end of the enclosing one,
          // and put the leftover in a new one
          adapted = {
            ...r,
            node: {
              startIndex: adapted.node.startIndex,
              endIndex: lastValidIndex,
            },
          };
          createdRanges.push({
            name: r.name,
            node: {
              startIndex: lastValidIndex,
              endIndex: r.node.endIndex,
            },
          });
        }

        // opening ranges are now part of the active set
        activeRanges.set(
          adapted.node.endIndex,
          (activeRanges.get(adapted.node.endIndex) ?? []).concat(adapted)
        );
        return adapted;
      });

      // insert the newly created ranges in the range map so future iterations
      // can pick them up
      ranges.set(
        lastValidIndex,
        (ranges.get(lastValidIndex) ?? []).concat(createdRanges)
      );

      // now that we have the final list of ranges starting at the current
      // position, we can sort them so that the widest ranges are opened first,
      // to let them contain smaller ranges
      openingAdapted
        .sort((a, b) => {
          return b.node.endIndex - a.node.endIndex;
        })
        .forEach((r) => {
          output += `<span class="${r.name.split(".").join(" ")}">`;
        });

      if (c === `\n`) {
        output += "<br>";
      } else if (c === `<`) {
        output += "&lt;";
      } else if (c === `>`) {
        output += "&gt;";
      } else if (c === ` `) {
        output += " "; // pre collapes / ignores leading spaces. an non-breaking
        // space will always take the correct amount of space
      } else {
        output += c;
      }
    });

    // handle ranges closing after the last char
    (activeRanges.get(text.length) ?? []).forEach(() => {
      output += "</span>";
    });

    // pre hides empty final lines (or containing just a space or a tab):
    // this nbsp forces pre to display an empty line. this makes sure a new
    // line is displayed when typing enter at the end of the last line.
    // The final <br> tag might be inside one or several spans tags, so we
    // need to keep looking right until we find the last `</span>` tag, and
    // then inspect what's just before
    let offset = 0;
    while (output.substr(offset - 7, 7) == "</span>") {
      offset -= 7;
    }
    if (output.substr(offset - 4, 4) === "<br>") {
      output += " ";
    }
    return output;
  }

  static styles = css`
    #wrapper {
      position: relative;
    }

    #editing,
    #highlighting {
      margin: 10px;
      padding: 10px;
      border: 0;
      width: calc(100% - 32px);
      overflow: auto;
      white-space: nowrap;
    }

    #editing,
    #highlighting,
    #highlighting * {
      font-size: 15pt;
      font-family: monospace;
      line-height: 20pt;
    }

    #highlighting {
      border: 1px solid black;
    }

    #editing {
      position: relative;
      resize: vertical;
      z-index: 1;

      color: transparent;
      background: transparent;
      caret-color: black; /* Or choose your favorite color */
    }

    #highlighting {
      position: absolute;
      top: 0;
      bottom: 3px;
      left: 0;
      z-index: 0;
      background-color: var(--background);
    }

    :host {
      --background: #fafafa;
      --foreground: #5c6166;
      --black: #e7eaed;
      --white: #fcfcfc;
      --blue: #399ee6;
      --light_blue: #55b4d4;
      --cyan: #478acc;
      --dark_gray: #d8d8d7;
      --gray: #828c9a;
      --green: #86b300;
      --green-bg: rgba(134, 170, 0, 0.3);
      --magenta: #a37acc;
      --orange: #fa8d3e;
      --red: #f07171;
      --red-bg: rgba(240, 113, 113, 0.3);
      --yellow: #ffaa33;
    }

    .constant {
      color: var(--magenta);
    }
    .string {
      color: var(--green);
    }
    .comment {
      color: var(--gray);
      font-style: italic;
    }
    .variable {
      color: var(--foreground);
    }
    .punctuation {
      color: var(--foreground);
    }
    .keyword {
      color: var(--orange);
    }
    .operator {
      color: var(--orange);
    }
    .function {
      color: var(--yellow);
    }
    .warning {
      color: var(--yellow);
    }
    .mark.failure {
      background-color: var(--red-bg);
    }
    .mark.error {
      text-decoration: underline wavy var(--red);
    }
    .mark.success {
      background-color: var(--green-bg);
    }
    .hint {
      color: var(--blue);
      font-weight: bold;
    }
  `;
}

function trimLines(str: string) {
  return str
    .trim()
    .split("\n")
    .map((line: string) => line.trim())
    .join("\n");
}