import { Task } from "@lit/task";
import { css, html, render } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";

import { auth } from "$lib/client/services/auth.ts";
import { catchErrorTyped } from "$lib/utils.ts";
import { WebslabElement } from "./_element.ts";

import type { CSSResultGroup, TemplateResult } from "lit";

@customElement("wl-database")
export class WlDatabase<T = unknown> extends WebslabElement {
  static requiredProps = ["query", "target", "template"];
  static styles: CSSResultGroup = css``;

  @property({ type: Boolean })
  accessor live: boolean = false;

  @property({ type: String })
  accessor query!: string;

  @property({ type: String })
  accessor target!: string;

  @property({ type: Object })
  accessor template!: (result: T[]) => TemplateResult;

  @state()
  accessor auth = auth;

  @query("slot")
  accessor bodySlot!: HTMLSlotElement;

  @query('slot[name="template"]')
  accessor templateSlot!: HTMLSlotElement;

  get targetEl(): HTMLElement | undefined {
    const assigned = this.bodySlot.assignedElements();
    return assigned.find((el) => el.matches(this.target)) as
      | HTMLElement
      | undefined;
  }

  private task = new Task(this, {
    task: async ([auth]) => {
      const { error: readyError } = await catchErrorTyped(auth.isReady);
      if (readyError) {
        const message = readyError.message;
        this.emit("wl-task:error", { detail: { message } });

        throw new Error(message);
      }

      const {
        error: queryError,
        data: queryData,
      } = await catchErrorTyped(auth.getDB().query<[T[]]>(this.query));
      if (queryError) {
        const message = queryError.message;
        this.emit("wl-task:error", { detail: { message } });

        throw new Error(message);
      }

      const result = queryData[0];

      // wait 1s
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if ("startViewTransition" in document) {
        document.startViewTransition(() => {
          this.targetEl!.innerHTML = "";
          render(this.template(result), this.targetEl!);
        });
      } else {
        this.targetEl!.innerHTML = "";
        render(this.template(result), this.targetEl!);
      }

      // TODO: check for live

      this.emit("wl-task:completed");
    },
    args: () => [this.auth],
  });

  render(): TemplateResult {
    // deno-fmt-ignore-start
    return html`
      <slot></slot>
      ${this.task.render({
        // pending: () => html`<div class="wrap"><p>Loading...</p></div>`,
        pending: () => html`<slot></slot>`,
        error: () => {
          const body = this.bodySlot.assignedElements().map((el) => el as HTMLElement)[0];

          body.style.border = "1px solid red";
          body.style.borderRadius = "2px";

          return html`<div class="error"><p>Error</p></div>`
        },
      })}
    `;
    // deno-fmt-ignore-end
  }
}

// TODO: ?? slow typing
declare global {
  interface HTMLElementTagNameMap {
    "wl-database": WlDatabase;
  }
}
