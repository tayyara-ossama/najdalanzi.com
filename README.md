# موقع شركة نجد العنزي للاستثمار – Landing page

Static, SEO-ready Arabic (RTL) landing page. HTML + Tailwind CSS, no framework.

## Structure
- `index.html` – the page (single H1, semantic sections, JSON-LD, Open Graph)
- `src/input.css` → compiled to `assets/css/style.css` by Tailwind
- `assets/js/main.js` – nav, reveal, counters, lightbox, contact form (mailto)
- `assets/img/` – optimised WebP images used by the site
- `assets/images/` – original source images extracted from the company profile (not deployed)
- `company-info.txt` – all company text extracted from the profile
- `robots.txt`, `sitemap.xml`, `site.webmanifest`

## Develop
```bash
npm install
npm run watch     # rebuild CSS on change
npm run serve     # http://localhost:5173
```

## Build
```bash
npm run build     # minified CSS
npm run images    # regenerate assets/img from assets/images
```

## Docker
```bash
docker compose up -d --build   # http://localhost:8080
```
