// language=CSS
import { css } from 'lit-element';

export const codemirrorStyles = css`
&.cm-editor.cm-focused {outline: 1px dotted #212121;}
&.cm-editor {position: relative !important; box-sizing: border-box; display: flex !important; flex-direction: column;}
.cm-scroller {display: flex !important; align-items: flex-start !important; font-family: monospace; line-height: 1.4; height: 100%; overflow-x: auto; position: relative; z-index: 0;}
.cm-content[contenteditable=true] {-webkit-user-modify: read-write-plaintext-only;}
.cm-content {margin: 0; flex-grow: 2; min-height: 100%; display: block; white-space: pre; word-wrap: normal; box-sizing: border-box; padding: 4px 0; outline: none;}
.cm-lineWrapping {white-space: pre-wrap; white-space: break-spaces; word-break: break-word; overflow-wrap: anywhere;}
&light .cm-content {caret-color: black;}
&dark .cm-content {caret-color: white;}
.cm-line {display: block; padding: 0 2px 0 4px;}
.cm-selectionLayer {z-index: -1; contain: size style;}
.cm-selectionBackground {position: absolute;}
&light .cm-selectionBackground {background: #d9d9d9;}
&dark .cm-selectionBackground {background: #222;}
&light.cm-focused .cm-selectionBackground {background: #d7d4f0;}
&dark.cm-focused .cm-selectionBackground {background: #233;}
.cm-cursorLayer {z-index: 100; contain: size style; pointer-events: none;}
&.cm-focused .cm-cursorLayer {animation: steps(1) cm-blink 1.2s infinite;}
@keyframes cm-blink {50% {visibility: hidden;}}
@keyframes cm-blink2 {50% {visibility: hidden;}}
.cm-cursor {position: absolute; border-left: 1.2px solid black; margin-left: -0.6px; pointer-events: none; display: none;}
&dark .cm-cursor {border-left-color: #444;}
&.cm-focused .cm-cursor {display: block;}
&light .cm-activeLine {background-color: #f3f9ff;}
&dark .cm-activeLine {background-color: #223039;}
&light .cm-specialChar {color: red;}
&dark .cm-specialChar {color: #f78;}
.cm-tab {display: inline-block; overflow: hidden; vertical-align: bottom;}
.cm-placeholder {color: #888; display: inline-block;}
.cm-button {vertical-align: middle; color: inherit; font-size: 70%; padding: .2em 1em; border-radius: 3px;}
&light .cm-button:active {background-image: linear-gradient(#b4b4b4, #d0d3d6);}
&light .cm-button {background-image: linear-gradient(#eff1f5, #d9d9df); border: 1px solid #888;}
&dark .cm-button:active {background-image: linear-gradient(#111, #333);}
&dark .cm-button {background-image: linear-gradient(#393939, #111); border: 1px solid #888;}
.cm-textfield {vertical-align: middle; color: inherit; font-size: 70%; border: 1px solid silver; padding: .2em .5em;}
&light .cm-textfield {background-color: white;}
&dark .cm-textfield {border: 1px solid #555; background-color: inherit;}
.cm-gutters {display: flex; height: 100%; box-sizing: border-box; left: 0; z-index: 200;}
&light .cm-gutters {background-color: #f5f5f5; color: #999; border-right: 1px solid #ddd;}
&dark .cm-gutters {background-color: #333338; color: #ccc;}
.cm-gutter {display: flex !important; flex-direction: column; flex-shrink: 0; box-sizing: border-box; min-height: 100%; overflow: hidden;}
.cm-gutterElement {box-sizing: border-box;}
.cm-lineNumbers .cm-gutterElement {padding: 0 3px 0 5px; min-width: 20px; text-align: right; white-space: nowrap;}
&light .cm-activeLineGutter {background-color: #e2f2ff;}
&dark .cm-activeLineGutter {background-color: #222227;}

.cm-content {
  background: white;
};

.cm-gutters {background-color: #f5f5f5; color: #999; border-right: 1px solid #ddd;}

.cmt-keyword {color: #708;}
.cmt-atom {color: #219;}
.cmt-number {color: #164;}
.cmt-def {color: #00f;}
.cmt-variable,
.cmt-punctuation,
.cmt-property,
.cmt-operator {}
.cmt-variable-2 {color: #05a;}
.cmt-variable-3, .cm-type {color: #085;}
.cmt-comment {color: #a50;}
.cmt-string {color: #a11;}
.cmt-string-2 {color: #f50;}
.cmt-meta {color: #555;}
.cmt-qualifier {color: #555;}
.cmt-builtin {color: #30a;}
.cmt-bracket {color: #997;}
.cmt-tag {color: #170;}
.cmt-attribute {color: #00c;}
.cmt-hr {color: #999;}
.cmt-link {color: #00c;}
.cmt-gutters { background: blue };
`;
