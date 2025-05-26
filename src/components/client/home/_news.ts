import { html } from "lit";

// deno-fmt-ignore-start
export const template = (content: any[]) => html`
  <ul class="row justify-content-center gap-2 gap-md-2 gap-lg-3 list-unstyled">
    ${content.map((post) => html`
      <li class="card col-11 col-md-5 col-lg-4 col-xxl-3 p-0 mb-2 h-100">
        <a
          class="d-block text-center text-decoration-none"
          href="/content/post/${post.slug}/">

          <img
            src="${post.hero}"
            alt="${post.title}"
            class="card-img-top"
            style="height: 10rem; object-fit: cover;"
            loading="lazy" />

          <div class="card-body">
            <h3
              style="
                height: 1.8em;
              "
              class="text-center h6 text-truncate">${post.title}</h3>
            <p
              style="
                overflow: hidden;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
              "
              class="card-text text-center text-muted">
              ${post.description}
            </p>
          </div>

          <div class="card-footer d-flex justify-content-between">
            <small class="text-muted my-auto">${post.publish.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </small>

            <small>Leer más</small>
          </div>
        </a>
      </li>
    `)}
  </ul>
`;
// deno-fmt-ignore-end
