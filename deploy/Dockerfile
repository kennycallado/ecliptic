FROM nginx:alpine-otel

# nginx config
COPY deploy/nginx.conf /etc/nginx/nginx.conf
COPY deploy/nginx.default.conf /etc/nginx/conf.d/default.conf

# web app
COPY /dist /var/www/html
