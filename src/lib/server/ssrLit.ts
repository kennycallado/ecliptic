import { render as _render } from "@lit-labs/ssr";
import { collectResultSync } from "@lit-labs/ssr/lib/render-result.js";
import type { TemplateResult } from "lit";

export function render(template: TemplateResult) {
  return collectResultSync(_render(template));
}
