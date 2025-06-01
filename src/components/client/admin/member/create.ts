import { html } from "lit";

// deno-fmt-ignore-start
export const template = (item?: any) => html`
    <div class="row">
      <div class="col-12 col-md-6">
        <div class="mb-3">
          <label for="name" class="form-label">Name</label>

          <input
            required
            type="text"
            class="form-control"
            id="name"
            name="name"
            placeholder="John Doe"
            .value=${item?.name || ""} />
        </div>

        <div class="mb-3">
          <label for="position" class="form-label">Position</label>

          <input
            required
            type="text"
            class="form-control"
            id="position"
            name="position"
            placeholder="Software Engineer"
            .value=${item?.position || ""} />
        </div>

        <div class="mb-3">
          <label for="department" class="form-label">Department</label>

          <input
            required
            type="text"
            class="form-control"
            id="department"
            name="department"
            placeholder="Engineering"
            .value=${item?.department || ""} />
        </div>
      </div>

      <div class="col-12 col-md-6">
        <div class="mb-3">
          <label for="group" class="form-label">Group</label>

          <input
            id="group"
            class="form-control"
            type="number"
            min="1"
            max="3"
            name="group"
            placeholder="3"
            .value=${item?.group || ""} />
        </div>

        <div class="mb-3 form-check form-switch">
          <input
            switch
            id="active"
            class="form-check-input"
            name="active"
            role="switch"
            type="checkbox"
            ?checked=${item?.active} />

          <label for="active" class="form-check-label">Active</label>
        </div>
      </div>
    </div>
`;
// deno-fmt-ignore-end
