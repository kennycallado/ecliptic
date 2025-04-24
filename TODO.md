# TODO:

- [ ] server: services: database deprecate it
- [ ] auth: session_token: is it able to refresh client_token?
- [ ] auth: session expiration and token expiration should match
- [ ] cosnts: server: ?? needs to keep DB_CLIENT

- [ ] android: take a [look](https://developer.chrome.com/docs/android/trusted-web-activity/quick-start/)
  - I have try it however I don't like how it works. I prefer to use capacitor.
- [x] install: [link](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/How_to/Trigger_install_prompt)
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
