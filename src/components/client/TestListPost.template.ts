import { html } from "lit";

// deno-fmt-ignore-start
export const template = (posts: any[]) =>
  html`
    ${posts.map((post) =>
      html`
        <li
          data-id="${post.id}"
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

export const testData = [
  {
    author: "user:jAwBMzmQnMIl7U0pYsRf86kzRzVKuO40",
    content: [ '<p>Welcome to the first post on this blog!</p>' ],
    description: 'This is a description of the post',
    draft: false,
    hero: 'https://picsum.photos/960/540?t=W1SvzqFC',
    id: "post:rwvt8gw746haqlxqizx8",
    publish: '2024-12-07T07:26:37Z',
    title: 'EKn5V XI48Wl8Ahx'
  }
]
