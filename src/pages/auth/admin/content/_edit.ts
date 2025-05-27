import { html } from "lit";
import { createRef, ref } from "lit/directives/ref.js";
import { StringRecordId } from "surrealdb";

import { auth } from "$lib/client/services/auth.ts";

let page = 0;
let content: string[] = [];
const form = createRef<HTMLFormElement>();

// deno-fmt-ignore-start
export const template = ([item]: any[]) => {
  page = 0;
  content = item.content;

  return html`
  <form
    ${ref(form)}
    @change=${saveContent}>

    <input
      id="id"
      name="id"
      type="hidden"
      .value=${item.id} />

    <div class="row">
      <div class="col-md-8 h-100">
        <div class="mb-3">
          <label for="title" class="form-label">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            class="form-control"
            .value=${item.title} />
        </div>

        <div class="mb-3">
          <label for="description" class="form-label">Description</label>
          <input
            id="description"
            name="description"
            type="text"
            class="form-control"
            .value=${item.description} />
        </div>

        <div
          @focusout=${saveContent}
          class="mb-3 h-100">
          <label for="content" class="form-label">Content</label>
          <textarea
            id="content"
            class="w-100 h-100"
            style="min-height: 400px"
            .id=${item.selector}
            .value="${content[page]}"
            @change=${(e: any) => { e.stopPropagation(); content[page] = e.target.value }}></textarea>
        </div>
      </div>

      <div class="col-md-4">
        <div class="mb-3">
          <label for="author" class="form-label">Author</label>
          <input
            disabled
            id="author"
            name="author"
            type="text"
            class="form-control"
            .value=${item.author} />
        </div>

        <div class="mb-3">
          <label for="publish" class="form-label">Publish date</label>
          <input
            id="publish"
            name="publish"
            type="date"
            class="form-control"
            .value=${item.publish_fmt} />
        </div>

        <!-- <div class="mb-3" id="heroPicker" data-current="{{ item.hero }}"></div> -->
        <div class="mb-3">
          <label for="hero" class="form-label">Hero image</label>

          <button
            class="btn btn-outline-secondary w-100 p-1"
            type="button">

            <input
              id="hero"
              name="hero"
              type="hidden"
              accept="image/*"
              .value=${item.hero}>

            <img
              id="hero-img"
              type="image"
              class="img-fluid rounded"
              .src=${item.hero} />
          </button>
        </div>

        <div
          ?hidden=${(item.table === "post")}
          class="mb-3">
          <p class="mb-0">Pages</p>
        </div>

      </div>
    </div>
  </form>
  `};
// deno-fmt-ignore-end

export function saveContent() {
  const formData = new FormData(form.value);
  const values = Object.fromEntries(formData);

  // const author = new StringRecordId(auth.getUser()!.id!.toString());
  const contentId = new StringRecordId(values.id.toString());

  const prepare = {
    hero: values.hero,
    title: values.title,
    description: values.description,
    // author,
    content,
  };

  auth
    .getDB()
    .merge(contentId, prepare)
    .then(console.log);
}
