import { html } from "lit";
import type { WlDatabase } from "$lib/client/webslab/database";

// deno-fmt-ignore-start
export const template = (content: any[]) =>
  html`
    <ul
      class="d-flex flex-wrap justify-content-center gap-1 gap-lg-3 m-0 p-0 list-unstyled"
      id="posts-list">
      ${content.map((item, index) => html`
        <li>
          <a
            class="d-block text-center text-decoration-none"
            aria-label=${item.title}
            href=${`content/${item.table}/${item.slug}/`}>

            <div
              class="mx-auto position-relative"
              style="max-width: ${index === 0 ? '960px' : '480px'};">

              <img
                style="view-transition-name: item-${item.slug};"
                class="img-fluid rounded"
                src=${item.hero}
                alt=${item.title}
                width="${index === 0 ? 960: 480 }"
                height="${index === 0 ? 540 : 270}"
                size="(max-width: 720px) 540px, 960px"
                loading="${index === 0 ? 'eager' : 'lazy'}" />

              <small class="position-absolute bottom-0 end-0 mb-1 p-2 text-light bg-dark bg-opacity-75 rounded-start">
                <em>${item.publish.toLocaleDateString('es-ES', {year: 'numeric', month: 'short', day: 'numeric'})}</em>
              </small>

              <small class="position-absolute bottom-0 start-0 mb-1 p-2 text-white bg-dark bg-opacity-75 rounded-end">
                Visits - Likes
              </small>
            </div>

            <p class="m-0 l-1">
              <span class="${index === 0 ? 'display-6' : 'lead'}">${item.title}</span>
            </p>

            <p class="w-75 mx-auto text-secondary text-truncate"><em>${item.description}</em></p>
          </a>
        </li>
      `
      )}
    </ul>
  `;
// deno-fmt-ignore-end

export const hydrate = () => {
  const url = new URL(location.href);
  const content = url.pathname.split("/").slice(-2)[0];
  const table = content === "blog" ? "post" : "module";

  const wlDatabase = document.querySelector("wl-database") as WlDatabase;

  wlDatabase.template = template;
  wlDatabase.query = `SELECT id,meta::tb(id) as table,hero,title,description,slug,publish FROM ${table}
    WHERE !draft AND publish < time::now()
    ORDER BY publish DESC;
  `;

  wlDatabase.addEventListener("wl-task:completed", () => {
    console.log("Database is ready");
  });
}
