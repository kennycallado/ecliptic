# TODO:

- [x] OTEL: there is something wrong
- [ ] look:
  - [uno](https://realfavicongenerator.net/)
  - [dos](https://www.webpagetest.org/)
  - maybe some [tools](https://github.com/pwa-builder/pwa-starter)
- [x] build:prev produces <base href>
- [ ] workflows: needs BASE_URL during build
- [ ] nginx cache:

  - example:

  ```
  proxy_cache_path /var/www/cache levels=1:2 keys_zone=my_cache:10m max_size=1g inactive=60m use_temp_path=off;
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
