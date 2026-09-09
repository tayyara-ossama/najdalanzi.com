// Generates the static pages for both languages:
//   /index.html          /about/index.html          (Arabic, rtl)
//   /en/index.html       /en/about/index.html       (English, ltr)
// Run: node build-pages.js   (npm run build does this before Tailwind)
const fs = require('fs');
const path = require('path');
const { homePage, aboutPage, SITE } = require('./src/site/templates');

const langs = { ar: require('./src/i18n/ar'), en: require('./src/i18n/en') };
const paths = { ar: { home: '/', about: '/about/' }, en: { home: '/en/', about: '/en/about/' } };

const pages = [];
for (const [lang, t] of Object.entries(langs)) {
  const other = lang === 'ar' ? 'en' : 'ar';
  for (const page of ['home', 'about']) {
    const p = paths[lang][page];
    const ctx = {
      base: lang === 'ar' ? '' : '/en',
      home: paths[lang].home, about: paths[lang].about,
      path: p, canonical: SITE + p, isHome: page === 'home',
      altPath: paths[other][page], arPath: paths.ar[page], enPath: paths.en[page],
    };
    const html = page === 'home' ? homePage(t, ctx) : aboutPage(t, ctx);
    const out = path.join(__dirname, p.replace(/\/$/, ''), 'index.html');
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, html.trim() + '\n', 'utf8');
    pages.push({ lang, page, path: p, out: path.relative(__dirname, out) });
  }
}

// sitemap with hreflang alternates
const today = new Date().toISOString().slice(0, 10);
const url = (p, alt, priority) => `  <url>
    <loc>${SITE}${p}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="ar" href="${SITE}${alt.ar}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${SITE}${alt.en}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${alt.ar}"/>
  </url>`;
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${url('/', { ar: '/', en: '/en/' }, '1.0')}
${url('/en/', { ar: '/', en: '/en/' }, '0.9')}
${url('/about/', { ar: '/about/', en: '/en/about/' }, '0.8')}
${url('/en/about/', { ar: '/about/', en: '/en/about/' }, '0.7')}
</urlset>
`;
fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemap, 'utf8');

console.log(pages.map(p => `${p.lang}/${p.page} -> ${p.out}`).join('\n'));
