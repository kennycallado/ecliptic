import { Task } from "@lit/task";
import { css, html, render } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";

import { auth } from "$lib/client/services/auth.ts";
import { catchErrorTyped } from "$lib/utils.ts";
import { WebslabElement } from "./_element.ts";

import type { CSSResultGroup, TemplateResult } from "lit";
import type { Surreal, Uuid } from "surrealdb";

@customElement("wl-database")
export class WlDatabase<T = unknown> extends WebslabElement {
  static requiredProps = ["query", "target", "template"];
  static styles: CSSResultGroup = css``;

  // TODO: seems not working
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

  @state()
  accessor wsDb: Surreal | undefined;

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

  disconnectedCallback() {
    super.disconnectedCallback();

    if (this.wsDb) this.wsDb.close();
  }

  render(): TemplateResult {
    // deno-fmt-ignore-start
    return html`
      <slot></slot>
      ${this.task.render({
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

  private task = new Task(this, {
    task: async ([auth]) => {
      { // scoped: check auth
        const { error } = await catchErrorTyped(auth.isReady);
        if (error) {
          const message = error.message;
          this.emit("wl-task:error", { detail: { message, error } });

          console.error(message);
          throw new Error(message);
        }
      }

      // scoped: query
      const result = await (async () => {
        const {
          error,
          data,
        } = await catchErrorTyped(auth.getDB().query<[T[]]>(this.query));
        if (error) {
          const message = error.message;
          this.emit("wl-task:error", { detail: { message, error } });

          console.error(message);
          throw new Error(message);
        }

        return data[0];
      })();

      // wait 1s
      // await new Promise((resolve) => setTimeout(resolve, 1000));

      this.viewTransition(() => {
        this.targetEl!.innerHTML = "";

        try {
          render(this.template(result), this.targetEl!);
        } catch (error) {
          console.error("Error rendering template", error);
        }
      });

      if (this.live) {
        const query = this.query
          .split("ORDER")[0]
          .split("LIMIT")[0]
          .split("GROUP")[0]; // TODO: Proper SQL parser or strip with regex

        // const query = this.query.replace(/(ORDER|LIMIT|GROUP)\s+BY\s+.+$/gi, "");

        { // scoped: get ws db
          const { error, data } = await catchErrorTyped(auth.getWsDb());

          if (error) {
            const message = error.message;
            this.emit("wl-task:error", { detail: { message, error } });

            console.error(message);
            throw new Error(message);
          }

          this.wsDb = data;
        }

        // live query
        const { error: errorLive, data: uuid } = await catchErrorTyped(
          this.wsDb.query<Uuid[]>(`LIVE ${query}`),
        );

        if (errorLive) {
          const message = errorLive.message;
          this.emit("wl-task:error", { detail: { message, error: errorLive } });

          console.error(message);
          throw new Error(message);
        }

        this.listenDb(uuid[0], this.wsDb);
        this.emit("wl-task:live", { detail: { uuid } });
      }

      this.emit("wl-task:completed", { detail: { result } });
    },
    args: () => [this.auth],
  });

  private viewTransition(cb: () => void) {
    if ("startViewTransition" in document) {
      document.startViewTransition(() => cb());
    } else cb();
  }

  private createItem(item: Record<string, unknown>) {
    this.viewTransition(() => {
      if (!this.targetEl) return;

      render(
        this.template([item as T]),
        this.targetEl,
        {
          renderBefore: this.targetEl.firstChild,
          // renderBefore: null,  // renderBefore=null appends
        },
      );
    });
  }

  private updateItem(item: Record<string, unknown>) {
    if (!item.id) return;
    if (!this.targetEl) return;

    const existing = this.targetEl.querySelectorAll(`[data-id="${item.id}"]`);
    if (existing.length !== 1) return;

    const targetItem = existing[0] as HTMLElement;

    this.viewTransition(() => {
      if (!this.targetEl || !targetItem) return;

      render(
        this.template([item as T]),
        this.targetEl,
        { renderBefore: targetItem },
      );

      targetItem?.remove();
    });
  }

  private deleteItem(item: Record<string, unknown>) {
    if (!item.id || !this.targetEl) return;

    const el = this.targetEl.querySelector(`[data-id="${item.id}"]`);
    if (!el) return;

    this.viewTransition(() => el.remove());
  }

  private async listenDb(uuid: Uuid, db: Surreal) {
    await db.subscribeLive(uuid, (action, item) => {
      switch (action) {
        case "CLOSE":
          this.wsDb?.close();
          return;

        case "CREATE":
          this.createItem(item);
          break;

        case "UPDATE":
          this.updateItem(item);
          break;

        case "DELETE":
          this.deleteItem(item);
          break;

        default:
          console.log("Unknown action", action);
      }

      this.emit(`wl-action:${action.toLowerCase()}`, { detail: { item } });
    });
  }
}

// TODO: ?? slow typing
declare global {
  interface HTMLElementTagNameMap {
    "wl-database": WlDatabase;
  }
}
