import { html } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

// deno-fmt-ignore-start
export const template = (post: any) =>
  html`
    <em class="d-block text-center my-3 text-secondary">${post.description}</em>
    <section>${post.content.map((content:string) => unsafeHTML(content))}</section>
`;
// deno-fmt-ignore-end
