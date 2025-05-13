import { css, html, LitElement } from "lit";
import { Task } from "@lit/task";
import { customElement } from "lit/decorators.js";

@customElement("test-lit-task")
export class TestLit extends LitElement {
  static styles = css`
    .loader {
      display: inline-block;
      width: 30px;
      aspect-ratio: 2;
      --_g: no-repeat radial-gradient(circle closest-side,#000 90%,#0000);
      background: 
        var(--_g) 0%   50%,
        var(--_g) 50%  50%,
        var(--_g) 100% 50%;
      background-size: calc(100%/3) 50%;
      animation: l3 1s infinite linear;
    }

    @keyframes l3 {
        20%{background-position:0%   0%, 50%  50%,100%  50%}
        40%{background-position:0% 100%, 50%   0%,100%  50%}
        60%{background-position:0%  50%, 50% 100%,100%   0%}
        80%{background-position:0%  50%, 50%  50%,100% 100%}
    }
  `;

  private _task = new Task(this, {
    task: async ([], { signal }) => {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve("done");
        }, 1000);
      });

      return;
    },
    args: () => [],
  });

  render() {
    // deno-fmt-ignore-start
    return this._task.render({
      pending: () => html`<div class="loader"></div><span style="z-index: 0;">🟨</span>`,
      complete: (_r) =>  html`<span>✅</span>`,
      error: () => html`<span>🟥</span>`,
    })
    // deno-fmt-ignore-end
  }
}
