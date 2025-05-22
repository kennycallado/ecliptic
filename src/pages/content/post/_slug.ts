import { html } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { type WlDatabase } from "$lib/client/webslab/database.ts";

// deno-fmt-ignore-start
export const template = (post: any) =>
  html`
    <em class="d-block text-center my-3 text-secondary">${post.description}</em>
    <section>${post.content.map((content:string) => unsafeHTML(content))}</section>
`;
// deno-fmt-ignore-end

export const hydrate = () => {
  const url = new URL(location.href);
  const slug = url.searchParams.get("slug") ||
    url.pathname.split("/").slice(-2)[0];

  const wlDatabase = document.querySelector("wl-database") as WlDatabase;
  wlDatabase.query = `SELECT * FROM ONLY post WHERE slug = '${slug}'`;
  wlDatabase.template = template;

  wlDatabase.addEventListener("wl-task:completed", () => {
    console.log("Database is ready");
  });
}
