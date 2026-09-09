# ---- Stage 1: build Tailwind CSS ----
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts
COPY tailwind.config.js ./
COPY src ./src
COPY index.html ./
COPY build-pages.js ./
COPY assets/js ./assets/js
RUN node build-pages.js && npx tailwindcss -i ./src/input.css -o ./assets/css/style.css --minify

# ---- Stage 2: serve with nginx ----
FROM nginx:1.27-alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/security-headers.conf /etc/nginx/snippets/security-headers.conf
WORKDIR /usr/share/nginx/html
RUN rm -f ./*
COPY --from=build /app/index.html ./
COPY --from=build /app/about ./about
COPY --from=build /app/en ./en
COPY --from=build /app/assets/css ./assets/css
COPY assets/js ./assets/js
COPY assets/img ./assets/img
COPY assets/pdf ./assets/pdf
COPY robots.txt sitemap.xml site.webmanifest favicon.png apple-touch-icon.png ./
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
