import { Jodit } from "jodit/es2021/jodit.min.js";

import defaultOptions from "$lib/client/services/_editor/options.ts";
import { MediaObserver } from "$lib/client/services/_editor/plugins.ts";

class Editor {
  private options: { [key: string]: unknown } = defaultOptions;
  private editor: Jodit | undefined;

  isReady = false;

  constructor() {
    this.options.theme = this.getTheme();
  }

  makeEditor(selector: HTMLElement): Jodit | undefined {
    if (this.isReady) this.isReady = false;
    if (this.editor) this.editor.destruct();

    Jodit.plugins.add("mediaObserver", new MediaObserver());

    try {
      this.editor = Jodit.make(selector, this.options);
    } catch (error) {
      console.error("Error: " + error);
      this.editor = undefined;
    }

    this.isReady = true;
    return this.editor;
  }

  getEditor(): Jodit | undefined {
    return this.editor;
  }

  setOptions(options?: { [key: string]: unknown }): object {
    this.options = { ...this.options, ...options };

    return this.options;
  }

  getOptions(): object {
    return this.options;
  }

  private getTheme(): string {
    const storedTheme = localStorage.getItem("theme") || "auto";
    const theme = globalThis.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

    return storedTheme === "auto" ? theme : storedTheme || "light";
  }
}

export const editor = new Editor();
