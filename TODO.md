# TODO

## LIST:

- [ ] astro: ?? config prefetch
- [x] auth: manage connection status
  - [x] wl-security: borders
  - [x] wl-database: borders
- [x] wl-security: add warning

- [x] kube: with argocd
  - [x] continue with the job
- [x] workflows: buid images
- [x] server: migrations on its own script
- [x] surreal: template and ?? deploy
  - [x] deploy: using templates
- [ ] surreal: prod real ip is wrong
- [ ] content: move prerender calls to db int content dir

- [?] wl-security
- [x] wl-database: live parameter
- [ ] ssr-lit: try from actions and defer

- [ ] libraries lenis (js), gasap (js)

- [x] is-land: integration
  - waiting for view-transition [issue](https://github.com/11ty/is-land/issues/37#issue-3037451524)
- [ ] surreal: devices user->user_devices->device
  - event from session... relate with user
  - [ ] notification object into device
- [x] package: deno: ?? rethink parallelism (seems difficult to manage cron jobs)
- [~] package: astro.config: prefetch no tested
- [x] feat/astro-actions: alternative to endpoints with validation
  - [x] new endpoint: _\_actions/_
  - more [details](https://docs.astro.build/en/guides/actions/)
    - take a look at the middleware section
- [?] server: services: database deprecate it
  - not so sure now
- [x] session: logout [revoke](https://www.better-auth.com/docs/concepts/session-management#revoke-session)
  - [?] and revoke on expiration or cronjobs via deno
- [?] session: client store it
  - don't think is needed
  - ?? but for feature flag
- [ ] auth: all about email verification [link](https://www.better-auth.com/docs/concepts/email)
- [x] auth: session [cache](https://www.better-auth.com/docs/concepts/session-management#session-caching)
- [x] auth: session_token: is it able to refresh client_token?
- [~] auth: session expiration and token expiration should match
- [x] cosnts: server: ?? needs to keep DB_CLIENT
- [x] auth: remove customSession
- [x] style: testdefer opacity in chrome
- [ ] style: migrate to tailwind
  - [ ] astro: [link](https://tailwindcss.com/docs/guides/astro)
- [ ] android: take a [look](https://developer.chrome.com/docs/android/trusted-web-activity/quick-start/)
  - I have try it however I don't like how it looks. I prefer to use capacitor.
- [?] package: install: [link](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/How_to/Trigger_install_prompt)
  - not sure if [apply](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/How_to/Trigger_install_prompt#responding_to_platform-specific_apps_being_installed)
- [ ] components: TestLogger: check `TRACES` & `LOGS` consts
- [ ] otel: ? active it from server (feature flag)
- [x] OTEL: there is something wrong
- [ ] look:
  - [uno](https://realfavicongenerator.net/)
  - [dos](https://www.webpagetest.org/)
  - maybe some [tools](https://github.com/pwa-builder/pwa-starter)
- [x] build:prev produces <base href>
- [ ] workflows: needs BASE_URL during build
- [ ] nginx cache:

  - example:

  ```sh
  # proxy_cache_path /var/www/cache levels=1:2 keys_zone=cache:8m max_size=1000m inactive=600m;
  proxy_cache_path /var/www/cache levels=1:2 keys_zone=my_cache:10m max_size=1g inactive=60m use_temp_path=off;
  proxy_temp_path  /var/www/cache/tmp;
  location ... {
    ...
    proxy_cache my_cache;
    ...
  }
  ```

- [x] OpenTelemetry instrumentation
  - [uno](https://opentelemetry.io/docs/languages/js/exporters/#otlp-dependencies)
  - [dos](https://opentelemetry.io/docs/languages/js/exporters/)
  - [tres](https://opentelemetry.io/docs/languages/js/getting-started/browser/)
  - [cuatro](https://www.npmjs.com/package/@opentelemetry/auto-instrumentations-web)

## NOTES:

### lit from importmap

```html
<!-- example with lit -->
<script type="importmap">
  {
    "imports": {
      "lit": "https://unpkg.com/lit@3.2.1/index.js"
    },
    "scopes": {
      "https://unpkg.com/": {
        "@lit/reactive-element": "https://unpkg.com/@lit/reactive-element@2.0.4/reactive-element.js",
        "lit-element/lit-element.js": "https://unpkg.com/lit-element@4.1.1/lit-element.js",
        "lit-html": "https://unpkg.com/lit-html@3.2.1/lit-html.js",
        "lit-html/is-server.js": "https://unpkg.com/lit-html@3.2.1/is-server.js"
      }
    }
  }
</script>

<script type="module">
  import { html, css, LitElement } from "lit";

  customElements.define(
    "lit-component",
    class extends LitElement {
      static properties = {
        name: { type: String },
      };

      static styles = css`
        p {
          color: blue;
          font-size: 40px;
        }
      `;

      // createRenderRoot() { return this; }

      render() {
        return html`
          <p class="text-primary">Hello, ${this.name || "Stranger"}!</p>
          <slot></slot>
        `;
      }
    },
  );
</script>
```
