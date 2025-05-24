import { html, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";

@customElement("test-lit")
export class TestLit extends LitElement {
  createRenderRoot() {
    return this;
  }

  @property({ type: String })
  accessor foo: string = "bar";

  @state()
  accessor show: boolean = false;

  @query("#res-lit")
  accessor res!: HTMLSpanElement;

  render() {
    // deno-fmt-ignore-start
    return html`
      <div>
        <button
          class="btn btn-primary"
          @click="${() => this.show = !this.show}">
          test lit: <span class="fw-bold">${this.foo}</span>
        </button>

        <span>${this.show ? "✅" : "🟨"}</span>
      </div>
    `;
    // deno-fmt-ignore-end
  }
}
