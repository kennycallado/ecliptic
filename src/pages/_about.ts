import { isServer } from "lit";
import { html, literal } from "lit/static-html.js";

import type { Member } from "$content/members.ts";

const imgTag = isServer ? literal`Image` : literal`img`;

// deno-fmt-ignore-start
export const templateGroupOne = (members: any[]) => {
  return html`
    ${members.map((member: Member) => html`
      <div class="co col-lg-4 text-center">
        <${imgTag}
          class="border border-2 rounded-circle"
          alt=${"Principal member " + member.name}
          src=${member.photo}
          width="160"
          height="160"
          format=${isServer ? "webp" : "auto"}
        />

        <h3 class="h4 text-primary">${member.name}</h3>
      </div>

      <div class="col ms-lg-3 d-flex">
        <div class="my-auto">
          <p class="h5"><u>${member.position}</u></p>

          <p class="text-secondary"
            style="white-space: nowrap; text-overflow:ellipsis; overflow: hidden;">
            ${member.department}
          </p>
        </div>
      </div>
    `)}
  `
};
// deno-fmt-ignore-end

// deno-fmt-ignore-start
export const templateGroupTwo = (members: any[]) => {
  return html`
    ${members.map((member: Member) => html`
      <div
        style="position: relative; margin-top: 100px;"
        class="card col-12 col-md-4">
        <${imgTag}
          style="position: absolute; top: -100px; left: 50%; transform: translateX(-50%);"
          class="border border-2 rounded-circle mt-2 mx-auto"
          alt=${"Member member " + member.name}
          src=${member.photo}
          width="140"
          height="140"
          format=${isServer ? "webp" : "auto"}
        />

        <div class="mt-5 card-body text-center">
          <h3 class="card-title h5 text-primary">${member.name}</h3>

          <p class="lead">${member.position}</p>
          <p class="card-text">${member.department}</p>
        </div>
      </div>
    `)}
  `
}
// deno-fmt-ignore-end

// deno-fmt-ignore-start
export const templateGroupThree = (members: any[]) => {
  return html`
    ${members.map((member: Member) => html`
      <div
        style="position: relative; margin-top: 100px;"
        class="card col-11 col-md-3">
        <${imgTag}
          style="position: absolute; top: -80px; left: 50%; transform: translateX(-50%);"
          class="border border-2 rounded-circle mx-auto"
          alt=${"Member member " + member.name}
          src=${member.photo}
          width="130"
          height="130"
          format=${isServer ? "webp" : "auto"}
        />

        <div class="mt-5 card-body text-center">
          <h3 class="card-title h5 text-primary">${member.name}</h3>

          <p class="lead">${member.position}</p>
          <p class="card-text">${member.department}</p>
        </div>
      </div>
    `)}
  `
}
// deno-fmt-ignore-end
