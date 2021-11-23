import { css, html, LitElement } from 'lit-element';
import { dispatchCustomEvent } from '../src/lib/events.js';

import {keymap, EditorView} from "@codemirror/view"
import {EditorState,StateField,StateEffect} from "@codemirror/state"
import {basicSetup} from "@codemirror/basic-setup"
import {history, historyKeymap} from "@codemirror/history"
import {defaultKeymap} from "@codemirror/commands"
import {StreamLanguage} from "@codemirror/stream-parser"
import {simpleMode} from "@codemirror/legacy-modes/mode/simple-mode"
import {lineNumbers, GutterMarker, gutter} from "@codemirror/gutter"
import {classHighlightStyle} from "@codemirror/highlight";
import {RangeSet} from "@codemirror/rangeset";

let biscuit_mode = simpleMode({
  // The start state contains the rules that are initially used
  start: [
    {
      regex: /(allow if|deny if|check if|or|and|<-)\b/,
      token: 'keyword',
    },
    { regex: /\/\/.*/, token: 'comment' },
    { regex: /\/\*/, token: 'comment', next: 'comment' },

    // predicate name
    { regex: /([A-Za-z_][\w]*)/, token: 'keyword', next: 'terms' },

    { regex: /,/, token: 'operator' },
    { regex: /"(?:[^\\]|\\.)*?(?:"|$)/, token: 'string' },
    { regex: /\$[A-Za-z_][\w]*/, token: 'variable' },
    { regex: /#[A-Za-z_][\w]*/, token: 'symbol' },
    { regex: /true|false/, token: 'atom' },
    // RFC 3339 date
    {
      regex: /(\d+)-(0[1-9]|1[012])-(0[1-9]|[12]\d|3[01])T([01]\d|2[0-3]):([0-5]\d):([0-5]\d|60)(\.\d+)?(([Zz])|([\+|\-]([01]\d|2[0-3]):([0-5]\d)))/,
      token: 'atom',
    },
    { regex: /[-+]?\d+/i, token: 'number' },

    // A next property will cause the mode to move to a different state
    { regex: /[-+*\/=<>!]+/, token: 'operator' },
    { regex: /&&|\|\|/, token: 'operator' },
    // indent and dedent properties guide autoindentation
    { regex: /[\{\[\(]/, indent: true },
    { regex: /[\}\]\)]/, dedent: true },
  ],
  // The multi-line comment state.
  comment: [
    { regex: /.*?\*\//, token: 'comment', next: 'start' },
    { regex: /.*/, token: 'comment' },
  ],
  terms: [
    { regex: /,/, token: 'operator' },
    // The regex matches the token, the token property contains the type
    { regex: /"(?:[^\\]|\\.)*?(?:"|$)/, token: 'string' },
    { regex: /\$[A-Za-z_][\w]*/, token: 'variable' },
    { regex: /#[A-Za-z_][\w]*/, token: 'symbol' },
    { regex: /true|false/, token: 'atom' },
    // RFC 3339 date
    {
      regex: /(\d+)-(0[1-9]|1[012])-(0[1-9]|[12]\d|3[01])T([01]\d|2[0-3]):([0-5]\d):([0-5]\d|60)(\.\d+)?(([Zz])|([\+|\-]([01]\d|2[0-3]):([0-5]\d)))/,
      token: 'atom',
    },
    { regex: /[-+]?\d+/i, token: 'number' },
    { regex: /\)/, next: 'start' },
  ],
  // The meta property contains global information about the mode. It
  // can contain properties like lineComment, which are supported by
  // all modes, and also directives like dontIndentStates, which are
  // specific to simple modes.
  meta: {
    dontIndentStates: ['comment'],
    lineComment: '//',
  },

});


//defineSimpleMode();

function resetParseError(view) {
  view.dispatch({
    effects: resetParseErrorEffect.of({})
  })
}

function setParseError(view, pos) {
  let parseErrors = view.state.field(parseErrorState)
  view.dispatch({
    effects: parseErrorEffect.of({pos})
  })
}

const resetParseErrorEffect = StateEffect.define({
  map: (val, mapping) => ({})
})
const parseErrorEffect = StateEffect.define({
  map: (val, mapping) => ({pos: mapping.mapPos(val.pos), on: true})
})

const parseErrorState = StateField.define({
  create() { return RangeSet.empty },
  update(set, transaction) {
    set = set.map(transaction.changes)
    for (let e of transaction.effects) {
      if (e.is(parseErrorEffect)) {
        set = set.update({add: [parseErrorMarker.range(e.value.pos)]})
      }
      if (e.is(resetParseErrorEffect)) {
        set = RangeSet.empty
      }
    }
    return set
  }
})

const parseErrorMarker = new class extends GutterMarker {
  toDOM() {
    return document.createTextNode("❌")
  }
}

/**
 * TODO DOCS
 */
export class BcDatalogEditor extends LitElement {

  static get properties () {
    return {
      datalog: { type: String },
      parseErrors: { type: Array },
      markers: { type: Array },
    };
  }

  constructor () {
    super();
    this.parseErrors = [];
    this.markers = [];
  }

  _onText (code) {
    dispatchCustomEvent(this, 'update', {code: code});
  }

  firstUpdated () {
    const textarea = this.shadowRoot.querySelector('textarea');
    this._displayedMarks = [];

    let updateListenerExtension = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        console.log("updated");
        console.log(update);
        console.log("content");
        console.log(htmlEntities(this._cm.state.doc.toString()));
        this._onText(htmlEntities(this._cm.state.doc.toString()));
      }
    });

    const parseErrorGutter = [
      parseErrorState,
      gutter({
        class: "cm-parse-error-gutter",
        markers: v => v.state.field(parseErrorState),
        initialSpacer: () => parseErrorMarker,
      }),
      EditorView.baseTheme({
        ".cm-parse-error-gutter .cm-gutterElement": {
          color: "red",
          paddingLeft: "5px",
          cursor: "default"
        }
      })
    ]

    this._cm = new EditorView({
      root: this.renderRoot,
      state: EditorState.create({
        doc: textarea.value,
        extensions: [
          basicSetup,
          lineNumbers(),
          history(),
          keymap.of([...defaultKeymap, ...historyKeymap]),
          updateListenerExtension,
          StreamLanguage.define(biscuit_mode),
          parseErrorGutter,
        ]
      }),
    });

    textarea.parentNode.insertBefore(this._cm.dom, textarea)
    textarea.style.display = "none"
    if (textarea.form) textarea.form.addEventListener("submit", () => {
      textarea.value = view.state.doc.toString()
    })
    /*
    new CodeMirror.fromTextArea(textarea, {
      mode: 'biscuit',
      autoCloseTags: true,
      lineNumbers: true,
      gutters: ['CodeMirror-lint-markers'],
      lintOnChange: false,
      lint: {
         getAnnotations: () => {
           this.parseErrors
         },
      },
    });
    */

    //this._cm.on('change', () => this._onText(this._cm.getValue()));
  }

  updated (changedProperties) {
    console.log("updated");
    console.log(changedProperties);
    super.updated(changedProperties);
    if (changedProperties.has('datalog')) {
      if(this.datalog != this._cm.state.doc.toString()) {
        this._cm.dispatch({
          changes: {from: 0, to: this._cm.state.doc.length, insert: this.datalog}
        })
      }
    }

    if(changedProperties.has('parseErrors')) {
      resetParseError(this._cm);

      for (let error of this.parseErrors) {
        setParseError(this._cm, error.from);
      }
    }

    /*
    if(changedProperties.has('parseErrors')) {
      var state = this._cm.state.lint;
      if(state.hasGutter) this._cm.clearGutter("CodeMirror-lint-markers"); 
      for (var i = 0; i < state.marked.length; ++i) {
        state.marked[i].clear();
      }
      state.marked.length = 0;

      this._cm.setOption("lint", false);
      this._cm.setOption("lint", {
         getAnnotations: () => {
           return this.parseErrors;
         },
      });
    }

    if(changedProperties.has('markers')) {
      for(let mark of this._displayedMarks) {
        mark.clear();
      }
      this._displayedMarks = [];

      for(let marker of this.markers) {
        var mark = this._cm.markText(marker.from, marker.to, marker.options);
        this._displayedMarks.push(mark);
      }

    }*/
  }

  render () {
    return html`
    <div>
      <textarea></textarea>
    </div>
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

function htmlEntities(str) {
  return String(str).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
}

window.customElements.define('bc-datalog-editor', BcDatalogEditor);
