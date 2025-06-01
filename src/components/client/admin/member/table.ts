import { html } from "lit";
import { StringRecordId } from "surrealdb";

import { template } from "./create.ts";
import { catchErrorTyped } from "$lib/utils";

import type { WlDialog } from "$lib/client/webslab/dialog.ts";

// deno-fmt-ignore-start
export const templateTable = (members: any[]) => html`
  ${members.map(member => html`
    <tr data-id="${member.id}">
      <td class="d-none d-lg-table-cell">${member.group}</td>
      <td style="white-space: nowrap; text-overflow:ellipsis; overflow: hidden; max-width:10rem;">${member.name}</td>
      <td>
        <button
          @click=${draftMember}
          class="btn btn-sm">${member.active ? "✅" : "❎"}</button>
      </td>

      <td class="d-none d-lg-table-cell text-center">
        <button
          @click=${updateMember}
          class="btn btn-sm btn-success">update</button>

        <button
          @click=${deleteMember}
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
              @click=${updateMember}
              class="btn btn-sm btn-success dropdown-item">Update</button>
          </li>

          <li>
            <button
              @click=${deleteMember}
              class="btn btn-sm btn-danger dropdown-item">Delete</button>
          </li>
        </ul>
      </td>
    </tr>
  `)}
`;
// deno-fmt-ignore-end

async function updateMember(event: Event) {
  const { auth } = await import("$lib/client/services/auth.ts");

  const id = getMemberId(event);

  await auth.isReady;
  const member = await auth.getDB().select(new StringRecordId(id));

  const dialog = document.querySelector("wl-dialog") as WlDialog;

  dialog.openDialog({
    header: "Update Member: " + member.name,

    // deno-fmt-ignore-start
    content: html`
      <form
        id="update-member-form"
        class="w-100"
        @submit=${(e: Event) => { submit(e); dialog.close(); }}>
        <input type="hidden" name="id" value="${member.id}">
        ${template(member)}
      </form>
    `,
    // deno-fmt-ignore-end

    footer: html`
      <button
        type="submit"
        form="update-member-form"
        class="btn btn-primary float-end ms-2">Update</button>
      <button
        class="btn btn-outline-primary float-end"
        @click=${dialog.close}>Close</button>
    `,
  });
}

async function draftMember(event: Event) {
  const { auth } = await import("$lib/client/services/auth.ts");

  const id = getMemberId(event);

  await auth.isReady;
  auth.getDB().query(
    `UPDATE type::record($memberId) SET active = !active;`,
    { memberId: id },
  );
}

async function deleteMember(event: Event) {
  const { auth } = await import("$lib/client/services/auth.ts");

  const id = getMemberId(event);

  if (window.confirm("Are you sure you want to delete this member?")) {
    await auth.isReady;
    auth
      .getDB()
      .query("DELETE type::record($memberId)", { memberId: id });
  }
}

const submit = async (event: Event) => {
  event.preventDefault();

  const { auth } = await import("$lib/client/services/auth.ts");

  const values = Object.fromEntries(
    new FormData(event.target as HTMLFormElement).entries(),
  );

  const promise = auth.getDB().merge(new StringRecordId(values.id.toString()), {
    ...values,
    id: undefined,
    group: values.group ? Number(values.group) : undefined,
    active: values.active === "on",
  });

  await auth.isReady;

  const { error } = await catchErrorTyped(promise);
  if (error) {
    console.error("Error creating member:", error);
    alert("Failed to create member: " + error.message);
  }
};

function getMemberId(event: Event): string {
  const target = event.target as HTMLButtonElement;
  return target.closest("tr")!.dataset.id!;
}
