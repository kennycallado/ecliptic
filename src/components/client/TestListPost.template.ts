import { html } from "lit";

// deno-fmt-ignore-start
export const template = (posts: any[]) =>
  html`
    ${posts.map((post) =>
      html`
        <li
          class="list-group-item"
          style="view-transition-name: item-${post.id};">
          <img
            style="width: 100%; height: auto; border-radius: 5px; max-width: 10rem;"
            src="${post.hero}" alt="${post.title}" />
          <h2>${post.title}</h2>
          <p>${post.description}</p>
        </li>`
    )}`;
// deno-fmt-ignore-
