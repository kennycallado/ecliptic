import { html } from "lit";

import { auth } from "$lib/client/services/auth.ts";

import type { WlDialog } from "$lib/client/webslab/dialog";

export function loginDialog(trigger: string) {
  const loginBtn = document.querySelector(trigger) as HTMLButtonElement;
  const dialog = document.querySelector("wl-dialog") as WlDialog;

  loginBtn.addEventListener("click", async () => {
    dialog.openDialog({
      header: "Login",

      // deno-fmt-ignore-start
      content: html`
        <form
          id="form-login"
          class="w-100"
          @submit=${submit}>
          <div class="mb-3">
            <label class="form-label" for="inputEmail">Email</label>

            <input
              id="inputEmail"
              class="form-control"
              name="email"
              type="email"
              autocomplete="on" />
          </div>

          <div class="mb-3">
            <label class="form-label" for="inputPassword">Password</label>

            <input
              id="inputPassword"
              class="form-control"
              name="password"
              type="password"
              autocomplete="on"
              required />
          </div>

          <div class="d-flex justify-content-between">
            <div class="mb-3 form-check">
              <input
                id="inputCheck"
                class="form-check-input"
                type="checkbox" />

              <label class="form-check-label" for="inputCheck">Remember me</label>
            </div>
          </div>
        </form>
      `,
      // deno-fmt-ignore-end

      footer: html`
        <button
          type="submit"
          form="form-login"
          class="btn btn-primary float-end ms-2">Send</button>

        <button
          class="btn btn-outline-secondary float-end"
          @click=${dialog.close}>Close</button>
      `,
    });
  });
}

const submit = async (event: Event) => {
  event.preventDefault();

  const values = Object.fromEntries(
    new FormData(event.target as HTMLFormElement).entries(),
  );

  const { email, password } = values;

  // validate form
  if (!email || !password) {
    alert("Error: Invalid credentials\n- Please fill in all fields");
    return;
  }

  await auth.isReady;

  const credentials = { email: String(email), password: String(password) };
  const { error } = await auth.signIn(credentials);

  if (error instanceof Error) return;

  if (error) {
    if (error.code === "INVALID_EMAIL") alert("Error: The email is invalid.");
    else if (error.code === "UNAUTHORIZED") {
      alert("Error: Unauthorized access.");
    } else if (error.code === "INVALID_EMAIL_OR_PASSWORD") {
      alert("Error: The email or password is incorrect. Maybe both?");
    }
  } else {
    if (location.pathname.endsWith("login/")) location.href = "/";
    else location.reload();
  }
};
