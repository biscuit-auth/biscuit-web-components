import { html, LitElement, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { dispatchCustomEvent } from "./lib/events";


@customElement("bc-switch")
class BcSwitch extends LitElement {
  @property() leftLabel = "left"
  @property() rightLabel = "right"
  @property() checked = false;
  @state() state = false;

  static styles = css`
    :host {
      --width : 30px;
      --height: 17px;
      --radius: 13px;
      --padding: 2px;
      --label-margin: 10px;
      --color-right: #66B032;
      --color-left: #9BD770;
    }

    .container {
      position: relative;
      display: flex;
      flex-direction: row;
    }

    .left {
      margin-right: var(--label-margin);
    }

    .right {
      margin-left: var(--label-margin);
    }

    .switch {
      position: relative;
      display: inline-block;
      width: var(--width);
      height: var(--height);
    }

    .switch input {display:none;}

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      -webkit-transition: .4s;
      transition: .4s;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: var(--radius);
      width: var(--radius);
      left: var(--padding);
      bottom: var(--padding);
      background-color: white;
      -webkit-transition: .4s;
      transition: .4s;
    }


    input:checked + .slider:before {
      -webkit-transform: translateX(var(--radius));
      -ms-transform: translateX(var(--radius));
      transform: translateX(var(--radius));
    }

    /* Rounded sliders */
    .slider.round {
      border-radius: var(--height);
    }

    .slider.round:before {
      border-radius: 50%;}

    .slider-green {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: var(--color-left);
      -webkit-transition: .4s;
      transition: .4s;
    }

    .slider-green:before {
      position: absolute;
      content: "";
      height: var(--radius);
      width: var(--radius);
      left: var(--padding);
      bottom: var(--padding);
      background-color: white;
      -webkit-transition: .4s;
      transition: .4s;
    }

    input:checked + .slider-green {
      background-color: var(--color-right);
    }

    input:focus + .slider-green {
      box-shadow: 0 0 1px var(--color-right);
    }

    input:checked + .slider-green:before {
      -webkit-transform: translateX(var(--radius));
      -ms-transform: translateX(var(--radius));
      transform: translateX(var(--radius));
    }

    /* Rounded sliders */
    .slider-green.round {
      border-radius: var(--height);
    }

    .slider-green.round:before {
      border-radius: 50%;
    }
  `

  constructor() {
    super();
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null) {
    if (name === "checked") {
      this.state = value === "true";
    }

    if (name === "rightlabel" && value !== null) {
      this.rightLabel = value
    }

    if (name === "leftlabel" && value !== null) {
      this.leftLabel = value
    }
  }

  onSwitch(_e: Event) {
    this.state = !this.state;
    dispatchCustomEvent(this, "update", {state: this.state})
  }

  protected render() {

    return html`
      <div class="container">
        <div class="left">${this.leftLabel}</div>
        <label class="switch">
          <input @change="${this.onSwitch}" type="checkbox" .checked=${this.state}>
          <span class="slider-green round"></span>
        </label>
        <div class="right">${this.rightLabel}</div>
      </div>
    `
  }
}