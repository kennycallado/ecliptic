import { html, nothing } from "lit";
import { customElement, query, state } from "lit/decorators.js";

import { WebslabElement } from "./_element.ts";

import type { TemplateResult } from "lit";

export type DialogContent = {
  content: TemplateResult | typeof nothing;
  footer?: TemplateResult;
  header?: string;
};

@customElement("wl-dialog")
export class WlDialog extends WebslabElement {
  @state()
  accessor dialogContent: DialogContent = {
    content: nothing,
  };

  @query("dialog")
  accessor dialogEl!: HTMLDialogElement;

  createRenderRoot() {
    return this;
  }

  openDialog(content: DialogContent) {
    this.dialogContent = content;

    this.updateComplete.then(() => {
      this.viewTransition(() => this.dialogEl?.showModal());
    });
  }

  close() {
    this.viewTransition(() => this.dialogEl.close());
  }

  private onDialogClose() {
    this.dialogContent = {
      content: nothing,
      footer: undefined,
      header: undefined,
    };
  }

  render(): TemplateResult {
    // deno-fmt-ignore-start
    return html`
      <style>
        dialog {
          width: 50svw;
          max-width: 90%;
          min-width: 300px;

          padding: 1rem;

          border: none;
          border-radius: 8px;

          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);

          .content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1em;
          }
        }

        dialog::backdrop {
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(3px);
          -webkit-backdrop-filter: blur(3px);
        }
      </style>

      <dialog @close=${this.onDialogClose}>
        <header class="d-flex justify-content-between align-items-center">
          <h4 class="m-0 ms-1 h5">${this.dialogContent.header || nothing}</h4>

          <button type="button" class="btn-close" @click=${this.close}></button>
        </header>
        <hr class="mt-1" />

        <div class="content mx-1">
          ${this.dialogContent.content}
        </div>

        <footer>
          <hr ?hidden=${!this.dialogContent.footer} class="mb-1" />
          ${this.dialogContent.footer || nothing}
        </footer>
      </dialog>
    `;
    // deno-fmt-ignore-end
  }
}
