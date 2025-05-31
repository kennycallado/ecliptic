import { html } from "lit";

// deno-fmt-ignore-start
export const template = (content: any[]) =>
  html`${content.map(item => html`
    <tr data-id="${item.id}">
      <td style="white-space: nowrap; text-overflow:ellipsis; overflow: hidden; max-width:10rem;">${item.title}</td>
      <td class="d-none d-lg-table-cell">${item.author}</td>
      <td class="d-none d-md-table-cell">
        ${item.publish.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
        })}
      </td>

      <td>
        <button
          @click=${draftItem}
          class="btn btn-sm">${item.published ? "✅" : "❎"}</button>
      </td>

      <td class="d-none d-md-table-cell">${item.likes || 0}</td>

      <td class="d-none d-lg-table-cell text-center">
        <button
          @click=${statsItem}
          class="btn btn-sm btn-info">stats</button>

        <a href="auth/admin/content/edit/?id=${item.id}" class="btn btn-sm btn-success">update</a>

        <button
          @click=${deleteItem}
          class="btn btn-sm btn-danger">delete</button>
      </td>

      <td class="d-lg-none dropdown">
        <button
          class="btn float-end pt-0 border border-primary"
          type="button"
          data-bs-toggle="dropdown"
          aria-label="Options menu"
          aria-expanded="false">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
          </svg>
        </button>

        <ul class="dropdown-menu">
          <li>
            <button
              @click=${statsItem}
              class="btn btn-sm btn-info dropdown-item">Stats</button>
          </li>

          <li>
            <a
              href="auth/admin/content/edit/?id=${item.id}"
              class="btn btn-sm btn-success dropdown-item">update</a>
          </li>

          <li>
            <button
              @click=${deleteItem}
              class="btn btn-sm btn-danger dropdown-item">Delete</button>
          </li>
        </ul>
      </td>
    </tr>
  `)}
`;
// deno-fmt-ignore-end

const statsItem = (e: Event) => {
  const target = e.target as HTMLButtonElement;

  const id = target.closest("tr")!.dataset.id
  console.log("stats", id);
};

const draftItem = async (e: Event) => {
  const { auth } = await import("$lib/client/services/auth.ts");

  const target = e.target as HTMLButtonElement;
  const id = target.closest("tr")!.dataset.id;

  auth
    .getDB()
    .query(`UPDATE type::record($postId) SET draft = !draft;`, { postId: id });
};

const deleteItem = async (e: Event) => {
  const { auth } = await import("$lib/client/services/auth.ts");

  const target = e.target as HTMLButtonElement;
  const id = target.closest("tr")!.dataset.id;

  if (window.confirm("Are you sure you want to delete this post?")) {
    auth
      .getDB()
      .query("DELETE type::record($postId)", { postId: id });
  }
};
