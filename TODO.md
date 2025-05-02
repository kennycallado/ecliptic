# TODO:

- [ ] surreal: devices user->has->device
  - event from session... relate with user
  - [ ] notification object into device
- [ ] package: deno: ?? rethink parallelism (seems difficult to manage cron jobs)
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
- [ ] auth: all about email verification [link](https://www.better-auth.com/docs/concepts/email)
- [x] auth: session [cache](https://www.better-auth.com/docs/concepts/session-management#session-caching)
- [x] auth: session_token: is it able to refresh client_token?
- [x] auth: session expiration and token expiration should match
- [x] cosnts: server: ?? needs to keep DB_CLIENT
- [x] auth: remove customSession
- [x] style: testdefer opacity in chrome
- [ ] style: migrate to tailwind
  - [x] astro: [link](https://tailwindcss.com/docs/guides/astro)
  - [ ] deno: [link](https://tailwindcss.com/docs/guides/deno)
- [ ] android: take a [look](https://developer.chrome.com/docs/android/trusted-web-activity/quick-start/)
  - I have try it however I don't like how it works. I prefer to use capacitor.
- [?] package: install: [link](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/How_to/Trigger_install_prompt)
  - not sure if [apply](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/How_to/Trigger_install_prompt#responding_to_platform-specific_apps_being_installed)
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
