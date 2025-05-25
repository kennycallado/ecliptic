import { Task } from "@lit/task";
import { css, html } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";

import { catchErrorTyped } from "$lib/utils.ts";
import { auth } from "$lib/client/services/auth.ts";
import { WebslabElement } from "./_element.ts";

import type { CSSResultGroup, TemplateResult } from "lit";

const roles = ["admin", "thera", "user"] as const;
export type Needs = {
  auth: boolean;
  roles: typeof roles[number][];
};

@customElement("wl-security")
export class WlSecurity extends WebslabElement {
  static requiredProps = [];
  static styles: CSSResultGroup = css`
    :host {
      display: block;
      position: relative;

      --wl-security-border-pending: aquamarine;
      --wl-security-border-complete: green;
      --wl-security-border-error: red;

      border-radius: 2px;
      transition: border-color 0.6s;
    }

    .wrap {
      display: flex;

      position: absolute;
      top: 0;

      width: 100%;
      height: 100%;

      & .message {
        color: crimson;
        font-weight: bold;
      }

      justify-content: center;

      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);

      transition: opacity 1s;
    }

    .warning {
      position: absolute;
      top: 30svh;

      width: 100%;

      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  `;

  private wrapStyleObserver: MutationObserver | undefined;

  @property({ type: Object })
  accessor needs: Needs = { auth: true, roles: ["admin"] };

  @state()
  accessor auth = auth;

  @query("slot")
  accessor bodySlot!: HTMLSlotElement;

  @query(".wrap")
  accessor wrap!: HTMLDivElement;

  @query('slot[name="warning"]')
  accessor warningSlot!: HTMLSlotElement;

  firstUpdated() {
    this.lockWrapStyle();
  }

  protected render(): TemplateResult {
    // deno-fmt-ignore-start
    return html`
      <slot></slot>

      <div class="wrap">
        ${this.task.render({
          pending: () => { this.setBorderColor("pending"); },

          complete: () => {
            this.setBorderColor("complete");
            this.wrap.style.opacity = "0";
            this.unlockWrapStyle();

            setTimeout(() => {
              this.wrap.style.top = "-9999px";
              this.wrap.style.display = "none";
            }, Number(1) * 600);
          },

          error: (e) => {
            const error = e instanceof Error ? e : new Error("Unknown error");

            this.setBorderColor("error");
            this.warningSlot.style.display = "flex";

            return html`<p>Error: <span class="message">${error.message}</span></p>`
          },
        })}
      </div>

      <slot style="display: none;" class="warning" name="warning">
        <h4>Please login to access:</h4>
        <a href="login/" class="button button-primary">Login</a>
      </slot>
    `;
    // deno-fmt-ignore-end
  }

  private task = new Task(this, {
    task: async ([_auth]) => {
      { // scoped: check auth ready
        const { error } = await catchErrorTyped(_auth.isReady);
        if (error) {
          const message = error.message;
          this.emit("wl-task:error", { detail: { message } });

          throw new Error(message);
        }
      }

      { // scoped: check auth user
        const { error: error } = this.checkRoles();
        if (error) {
          this.emit("wl-task:error", {
            detail: { message: error.message },
          });

          throw error;
        }
      }

      // wait 1s
      // await new Promise((resolve) => setTimeout(resolve, 1000));

      this.emit("wl-task:complete", { detail: { user: _auth.getUser() } });
    },
    args: () => [this.auth],
  });

  private checkRoles(): { error?: Error; data: boolean } {
    // If no auth required and no roles required, allow
    if (
      !this.needs.auth &&
      (!this.needs.roles || this.needs.roles.length === 0)
    ) return { data: true };

    const user = this.auth.getUser();
    if (!user) return { error: new Error("No user"), data: false };

    const userRoles = user.role?.split(",").map((r) => r.trim()) ?? [];

    // If user is admin, always allow
    if (userRoles.includes("admin")) return { data: true };

    // If any required role is present, allow
    if (this.needs.roles.some((role) => userRoles.includes(role))) {
      return { data: true };
    }

    return { error: new Error("No role"), data: false };
  }

  private lockWrapStyle() {
    if (this.wrapStyleObserver || !this.wrap) return;

    this.wrapStyleObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "style"
        ) {
          this.wrap.style.display = "block";
          this.wrap.style.opacity = "1";
          this.wrap.style.top = "0";
          this.wrap.style.width = "100%";
          this.wrap.style.height = "100%";
          this.wrap.style.visibility = "initial";
        }
      }
    });

    this.wrapStyleObserver.observe(this.wrap, {
      attributes: true,
      attributeFilter: ["style"],
    });
  }

  private unlockWrapStyle() {
    this.wrapStyleObserver?.disconnect();
    this.wrapStyleObserver = undefined;
  }

  private setBorderColor(state: "pending" | "complete" | "error") {
    const varName = {
      pending: "--wl-security-border-pending",
      complete: "--wl-security-border-complete",
      error: "--wl-security-border-error",
    }[state];

    // Get the computed style for the variable
    const color = getComputedStyle(this).getPropertyValue(varName).trim();
    this.style.border = `2px solid ${color || "transparent"}`; // fallback
  }
}
