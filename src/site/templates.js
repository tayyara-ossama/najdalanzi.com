// HTML templates for all pages. Every function receives (t, ctx):
//   t   – translation object (src/i18n/ar.js or en.js)
//   ctx – { base, home, about, path, canonical, alt, altPath, isHome, siteUrl }
// Layout classes use Tailwind logical utilities (start/end, ms/me, rtl:/ltr:) so the
// same markup mirrors correctly for Arabic (rtl) and English (ltr).

const SITE = 'https://www.najdalanazi.com';
const PHONE1 = { tel: '+963955494643', text: '+963 955 494 643' };
const PHONE2 = { tel: '+963116135300', text: '+963 11 613 5300' };
const EMAIL = 'az.sy.investment@gmail.com';
const WA = 'https://wa.me/963955494643';
const MAPS = 'https://maps.google.com/?q=%D8%AF%D9%85%D8%B4%D9%82+%D8%A7%D9%84%D9%85%D8%B2%D8%A9+%D9%81%D9%8A%D9%84%D8%A7%D8%AA+%D8%BA%D8%B1%D8%A8%D9%8A%D8%A9';

const icon = (id, cls = 'h-6 w-6') => `<svg class="${cls}"><use href="#i-${id}"/></svg>`;
const delay = (i, step = 0.05) => (i ? ` style="transition-delay:${(i * step).toFixed(2)}s"` : '');

/* ---------- head ---------- */
function head(t, ctx, meta, extraLd = '') {
  const fonts = t.lang === 'en'
    ? 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap'
    : 'https://fonts.googleapis.com/css2?family=Cairo:wght@600;700;800;900&family=Tajawal:wght@400;500;700&display=swap';
  const og = `${SITE}/assets/img/og-image.jpg`;
  return `<!DOCTYPE html>
<html lang="${t.lang}" dir="${t.dir}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${meta.title}</title>
  <meta name="description" content="${meta.description}">
  <meta name="keywords" content="${meta.keywords}">
  <meta name="author" content="${t.brand.full}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <meta name="theme-color" content="#0B0B0D">
  <link rel="canonical" href="${ctx.canonical}">
  <link rel="alternate" hreflang="ar" href="${SITE}${ctx.arPath}">
  <link rel="alternate" hreflang="en" href="${SITE}${ctx.enPath}">
  <link rel="alternate" hreflang="x-default" href="${SITE}${ctx.arPath}">

  <meta property="og:type" content="website">
  <meta property="og:locale" content="${t.locale}">
  <meta property="og:locale:alternate" content="${t.lang === 'ar' ? 'en_US' : 'ar_SY'}">
  <meta property="og:site_name" content="${t.brand.full}">
  <meta property="og:title" content="${meta.title}">
  <meta property="og:description" content="${meta.ogDescription}">
  <meta property="og:url" content="${ctx.canonical}">
  <meta property="og:image" content="${og}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${t.brand.full}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${meta.title}">
  <meta name="twitter:description" content="${meta.ogDescription}">
  <meta name="twitter:image" content="${og}">

  <link rel="icon" type="image/png" sizes="512x512" href="/favicon.png">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="${fonts}">
  ${ctx.isHome ? '<link rel="preload" as="image" href="/assets/img/hero-architecture-night.webp" fetchpriority="high">' : ''}
  <link rel="stylesheet" href="/assets/css/style.css">

  <script type="application/ld+json">
  ${JSON.stringify(jsonLd(t, ctx, meta, extraLd), null, 2)}
  </script>
  <script>window.I18N = ${JSON.stringify({ lang: t.lang, openMenu: t.nav.openMenu, closeMenu: t.nav.closeMenu, ...t.contact.js })};</script>
</head>

<body class="overflow-x-hidden">
${sprite()}`;
}

function jsonLd(t, ctx, meta, extra) {
  const org = {
    '@type': 'Organization', '@id': `${SITE}/#organization`,
    name: t.brand.full, alternateName: ['Najd Alanzi Investment', 'شركة نجد العنزي للاستثمار', 'Najd Alanazi Investment Company'],
    url: `${SITE}/`, logo: `${SITE}/assets/img/logo-najd-alanzi-ar.webp`, image: `${SITE}/assets/img/og-image.jpg`,
    slogan: t.meta.slogan, description: t.meta.orgDescription, foundingDate: '2026', legalName: t.meta.legalName,
    email: EMAIL, telephone: PHONE1.tel,
    address: { '@type': 'PostalAddress', streetAddress: t.meta.street, addressLocality: t.meta.city, addressCountry: 'SY' },
    areaServed: ['SY', 'AE', 'QA', 'TR'],
    founder: { '@type': 'Person', name: t.meta.founderName, jobTitle: t.meta.founderTitle },
    contactPoint: [PHONE1, PHONE2].map(p => ({ '@type': 'ContactPoint', telephone: p.tel, contactType: 'customer service', availableLanguage: ['ar', 'en'] })),
  };
  const site = { '@type': 'WebSite', '@id': `${SITE}/#website`, url: `${SITE}/`, name: t.brand.full, inLanguage: t.lang, publisher: { '@id': `${SITE}/#organization` } };
  const page = { '@type': ctx.isHome ? 'WebPage' : 'AboutPage', '@id': `${ctx.canonical}#webpage`, url: ctx.canonical, name: meta.title, isPartOf: { '@id': `${SITE}/#website` }, about: { '@id': `${SITE}/#organization` }, inLanguage: t.lang, primaryImageOfPage: `${SITE}/assets/img/og-image.jpg` };
  const graph = [org, site, page];
  if (!ctx.isHome) graph.push({ '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: t.meta.breadcrumbHome, item: `${SITE}${ctx.home}` },
    { '@type': 'ListItem', position: 2, name: t.meta.breadcrumbAbout, item: ctx.canonical },
  ] });
  return { '@context': 'https://schema.org', '@graph': graph };
}

/* ---------- SVG sprite ---------- */
function sprite() {
  const s = (id, body, extra = 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"') => `<symbol id="i-${id}" viewBox="0 0 24 24" ${extra}>${body}</symbol>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" class="hidden" aria-hidden="true">
  ${s('arrow', '<path d="M19 12H5M12 19l-7-7 7-7"/>', 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"')}
  ${s('building', '<path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-3M9 9h1M9 13h1M9 17h1"/>')}
  ${s('chart', '<path d="M3 3v18h18M7 15l4-4 4 4 5-6"/>')}
  ${s('globe', '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/>')}
  ${s('shield', '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>')}
  ${s('leaf', '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/>')}
  ${s('phone', '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>')}
  ${s('mail', '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 6L2 7"/>')}
  ${s('pin', '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>')}
  ${s('check', '<path d="M20 6L9 17l-5-5"/>', 'fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"')}
  ${s('bolt', '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>')}
  ${s('recycle', '<path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>')}
  ${s('signal', '<path d="M2 8.5a9 9 0 0 1 20 0M5 11.5a5 5 0 0 1 14 0"/><circle cx="12" cy="14" r="2"/><path d="M12 16v6"/>')}
  ${s('truck', '<path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>')}
  ${s('factory', '<path d="M2 22V10l5 4v-4l5 4v-4l5 4V6h5v16H2z"/><path d="M6 18h2M11 18h2M16 18h2"/>')}
  ${s('home', '<path d="M3 12l9-9 9 9M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>')}
  ${s('layers', '<path d="M12 2l10 5-10 5L2 7l10-5zM2 12l10 5 10-5M2 17l10 5 10-5"/>')}
  ${s('quote', '<path d="M9.5 5C6 5 3 8 3 12v7h7v-7H6.5c0-2 1.5-3.5 3-3.5V5zm11 0c-3.5 0-6.5 3-6.5 7v7h7v-7h-3.5c0-2 1.5-3.5 3-3.5V5z"/>', 'fill="currentColor"')}
  ${s('menu', '<path d="M3 6h18M3 12h18M3 18h18"/>', 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"')}
  ${s('close', '<path d="M18 6L6 18M6 6l12 12"/>', 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"')}
  ${s('award', '<circle cx="12" cy="8" r="6"/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/>')}
  ${s('users', '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>')}
  ${s('wrench', '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>')}
  ${s('target', '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>', 'fill="none" stroke="currentColor" stroke-width="1.8"')}
  ${s('eye', '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>')}
  ${s('globe2', '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2c3 3 3 17 0 20M12 2c-3 3-3 17 0 20"/>')}
  ${s('whatsapp', '<path d="M20.5 3.5A11.9 11.9 0 0 0 12 0C5.4 0 .1 5.3.1 11.9c0 2.1.5 4.1 1.6 5.9L0 24l6.4-1.7a11.9 11.9 0 0 0 5.6 1.4c6.6 0 11.9-5.3 11.9-11.9 0-3.2-1.2-6.2-3.4-8.3zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.8 1 1-3.7-.2-.4a9.8 9.8 0 0 1-1.5-5.2C2.1 6.5 6.5 2 12 2c2.6 0 5.1 1 7 2.9a9.8 9.8 0 0 1 2.9 7c0 5.4-4.5 9.9-9.9 9.9zm5.4-7.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5.3-.5c.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4z"/>', 'fill="currentColor"')}
</svg>`;
}

/* ---------- header ---------- */
function header(t, ctx) {
  const n = t.nav, h = ctx.home;
  const links = [
    [h, n.home, ctx.isHome], [ctx.about, n.about, !ctx.isHome], [`${h}#sectors`, n.sectors], [`${h}#partners`, n.partners],
    [`${h}#projects`, n.projects], [`${h}#contact`, n.contact],
  ];
  const logo = t.lang === 'en' ? 'logo-najd-alanzi-en' : 'logo-najd-alanzi-ar';
  const desktop = links.map(([href, label, active]) => `<li><a class="nav-link whitespace-nowrap${active ? ' text-gold-300' : ''}" href="${href}"${active ? ' aria-current="page"' : ''}>${label}</a></li>`).join('\n        ');
  const mobile = links.map(([href, label]) => `<li><a class="block py-3 hover:text-gold-300" href="${href}">${label}</a></li>`).join('\n        ');
  const switcher = `<a href="${ctx.altPath}" hreflang="${t.lang === 'ar' ? 'en' : 'ar'}" lang="${t.lang === 'ar' ? 'en' : 'ar'}" class="inline-flex h-10 items-center gap-1.5 rounded-full border border-gold-500/40 px-3 text-xs font-bold text-gold-300 transition hover:bg-gold-500/10" aria-label="${n.switchAria}">${icon('globe2', 'h-4 w-4')}${t.switchShort}</a>`;
  return `
<header id="site-header" class="fixed inset-x-0 top-0 z-50 transition-all duration-500">
  <div class="container-x">
    <nav class="mt-3 flex items-center justify-between rounded-2xl border border-white/5 bg-ink-900/70 px-4 py-2.5 shadow-card backdrop-blur-xl md:px-6" aria-label="${n.mainNav}">
      <a href="${h}" class="flex items-center gap-3" aria-label="${n.homeAria}">
        <img src="/assets/img/${logo}.webp" alt="${t.brand.logoAlt}" width="48" height="48" class="h-12 w-12 rounded-xl object-cover ring-1 ring-gold-500/30">
        <span class="hidden flex-col leading-tight sm:flex">
          <span class="font-display text-base font-extrabold text-sand-50">${t.brand.name}</span>
          <span class="text-[11px] font-semibold tracking-[.25em] text-gold-400">${t.brand.sub}</span>
        </span>
      </a>

      <ul class="hidden items-center gap-6 lg:flex">
        ${desktop}
      </ul>

      <div class="flex items-center gap-3">
        ${switcher}
        <a href="tel:${PHONE1.tel}" class="hidden items-center gap-2 whitespace-nowrap text-sm font-semibold text-sand-100/80 hover:text-gold-300 2xl:flex" dir="ltr">
          ${icon('phone', 'h-4 w-4 text-gold-400')}${PHONE1.text}
        </a>
        <a href="${h}#contact" class="btn-gold hidden whitespace-nowrap !px-5 !py-2.5 !text-sm md:inline-flex">${n.cta}</a>
        <button id="nav-toggle" class="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 text-sand-50 lg:hidden" aria-label="${n.openMenu}" aria-expanded="false" aria-controls="mobile-menu">
          ${icon('menu')}
        </button>
      </div>
    </nav>
  </div>

  <div id="mobile-menu" class="container-x lg:!hidden" hidden>
    <div class="mt-2 rounded-2xl border border-white/5 bg-ink-900/95 p-4 shadow-card backdrop-blur-xl">
      <ul class="divide-y divide-white/5 text-base font-semibold">
        ${mobile}
      </ul>
      <a href="${h}#contact" class="btn-gold mt-4 w-full">${n.cta}</a>
    </div>
  </div>
</header>
`;
}

/* ---------- footer + lightbox + WhatsApp ---------- */
function footer(t, ctx) {
  const n = t.nav, h = ctx.home;
  const links = [[ctx.about, n.about], [`${h}#sectors`, n.sectors], [`${h}#capabilities`, n.capabilities], [`${h}#partners`, n.partners], [`${h}#projects`, n.projects], [`${h}#quality`, n.quality], [`${ctx.about}#leadership`, n.leadership], [`${h}#contact`, n.contact]];
  return `
<footer class="border-t border-white/5 bg-ink-950">
  <div class="container-x grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
    <div>
      <img src="/assets/img/${t.lang === 'en' ? 'logo-najd-alanzi-en' : 'logo-najd-alanzi-ar'}.webp" alt="${t.brand.logoAlt}" width="80" height="80" loading="lazy" class="h-20 w-20 rounded-xl ring-1 ring-gold-500/30">
      <p class="mt-5 max-w-md text-sm leading-relaxed text-sand-400">${t.footer.about}</p>
      <a href="${ctx.altPath}" hreflang="${t.lang === 'ar' ? 'en' : 'ar'}" class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold-300 hover:text-gold-200">${icon('globe2', 'h-4 w-4')}${t.switchLabel}</a>
    </div>
    <nav aria-label="${n.quickLinks}">
      <h3 class="font-bold text-gold-300">${n.quickLinks}</h3>
      <ul class="mt-4 grid grid-cols-2 gap-2 text-sm text-sand-300">
        ${links.map(([href, label]) => `<li><a class="hover:text-gold-300" href="${href}">${label}</a></li>`).join('\n        ')}
      </ul>
    </nav>
    <div>
      <h3 class="font-bold text-gold-300">${t.footer.contact}</h3>
      <ul class="mt-4 space-y-2 text-sm text-sand-300">
        <li><a href="tel:${PHONE1.tel}" class="hover:text-gold-300" dir="ltr">${PHONE1.text}</a></li>
        <li><a href="tel:${PHONE2.tel}" class="hover:text-gold-300" dir="ltr">${PHONE2.text}</a></li>
        <li><a href="mailto:${EMAIL}" class="hover:text-gold-300" dir="ltr">${EMAIL}</a></li>
        <li><a href="${SITE}" class="hover:text-gold-300" dir="ltr">www.najdalanazi.com</a></li>
      </ul>
    </div>
  </div>
  <div class="border-t border-white/5">
    <div class="container-x flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-sand-400">
      <p>© <span id="year">2026</span> ${t.footer.rights}</p>
      <p>${t.footer.city}</p>
    </div>
  </div>
</footer>

<dialog id="lightbox" class="m-auto w-[min(96vw,1100px)] rounded-2xl border border-gold-500/30 bg-ink-950 p-0 text-sand-50 backdrop:bg-ink-950/90 backdrop:backdrop-blur-sm">
  <button id="lightbox-close" class="absolute end-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-ink-900/80 text-sand-50 hover:text-gold-300" aria-label="${t.footer.close}">${icon('close', 'h-5 w-5')}</button>
  <img id="lightbox-img" src="" alt="" class="max-h-[85vh] w-full object-contain">
  <p id="lightbox-caption" class="p-4 text-center text-sm text-sand-300"></p>
</dialog>

<a href="${WA}" target="_blank" rel="noopener" class="fixed bottom-5 end-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gold-gradient text-ink-900 shadow-gold transition hover:scale-105" aria-label="${t.contact.whatsappAria}">
  ${icon('whatsapp', 'h-7 w-7')}
</a>

<script src="/assets/js/main.js" defer></script>
</body>
</html>
`;
}

/* ---------- sections ---------- */
const sectionHead = (eyebrow, h2, id, center = false, lead = '') => `
    <div class="reveal ${center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}">
      <p class="eyebrow${center ? ' justify-center' : ''}">${eyebrow}</p>
      <h2 id="${id}" class="h2">${h2}</h2>
      ${lead ? `<p class="lead${center ? ' mx-auto' : ''}">${lead}</p>` : ''}
    </div>`;

function hero(t, ctx) {
  const h = t.hero;
  return `
<section class="relative isolate flex min-h-[100svh] items-center overflow-hidden grain" aria-labelledby="hero-title">
  <img src="/assets/img/hero-architecture-night.webp" alt="" width="1920" height="1080" fetchpriority="high"
       class="absolute inset-0 -z-20 h-full w-full object-cover object-center rtl:-scale-x-100">
  <div class="absolute inset-0 -z-10 from-ink-900 via-ink-900/85 to-ink-900/20 rtl:bg-gradient-to-l ltr:bg-gradient-to-r"></div>
  <div class="absolute inset-0 -z-10 bg-gradient-to-t from-ink-900 via-transparent to-ink-900/60"></div>
  <svg class="pointer-events-none absolute -end-40 top-1/2 -z-10 h-[900px] w-[900px] -translate-y-1/2 opacity-[.07]" viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <circle cx="50" cy="50" r="48" stroke="#C9A24A" stroke-width=".4"/><circle cx="50" cy="50" r="36" stroke="#C9A24A" stroke-width=".3"/><circle cx="50" cy="50" r="22" stroke="#C9A24A" stroke-width=".2"/>
  </svg>

  <div class="container-x relative pb-24 pt-36 md:pt-44">
    <div class="max-w-3xl">
      <p class="eyebrow animate-rise" style="animation-delay:.1s">${h.eyebrow}</p>
      <h1 id="hero-title" class="mt-6 text-balance font-display text-4xl font-black !leading-[1.3] text-sand-50 animate-rise sm:text-5xl md:text-6xl lg:text-7xl" style="animation-delay:.25s">
        ${h.h1a}
        <span class="gold-text animate-shimmer">${h.h1b}</span>
        ${h.h1c}
      </h1>
      <p class="mt-7 max-w-2xl text-lg leading-relaxed text-sand-300 animate-rise md:text-xl" style="animation-delay:.4s">${h.lead}</p>
      <div class="mt-10 flex flex-wrap items-center gap-4 animate-rise" style="animation-delay:.55s">
        <a href="#contact" class="btn-gold">${h.cta1} ${icon('arrow', 'h-5 w-5 ltr:rotate-180')}</a>
        <a href="#sectors" class="btn-ghost">${h.cta2}</a>
      </div>
    </div>

    <dl class="mt-20 grid grid-cols-2 gap-4 animate-rise md:grid-cols-4" style="animation-delay:.7s">
      ${h.stats.map(s => `<div class="rounded-2xl border border-white/5 bg-ink-800/60 p-5">
        <dt class="text-sm text-sand-400">${s.label}</dt>
        <dd class="stat-num mt-1"><span data-count="${s.n}">0</span></dd>
      </div>`).join('\n      ')}
    </dl>
  </div>

  <a href="#about-teaser" class="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs text-sand-400 md:flex" aria-label="${h.scrollAria}">
    <span>${h.scroll}</span>
    <span class="h-10 w-px animate-drift bg-gold-line"></span>
  </a>
</section>`;
}

function aboutTeaser(t, ctx) {
  const a = t.aboutTeaser;
  return `
<section id="about-teaser" class="section relative" aria-labelledby="about-teaser-title">
  <div class="container-x grid items-center gap-14 lg:grid-cols-2">
    <div class="reveal">
      <p class="eyebrow">${a.eyebrow}</p>
      <h2 id="about-teaser-title" class="h2">${a.h2}</h2>
      <p class="lead">${a.lead}</p>
      <dl class="mt-8 grid grid-cols-3 gap-4">
        ${a.facts.map(f => `<div class="rounded-xl border border-white/5 bg-ink-800/60 p-4"><dt class="text-xs text-sand-400">${f.k}</dt><dd class="mt-1 font-display text-xl font-extrabold text-gold-300">${f.v}</dd></div>`).join('\n        ')}
      </dl>
      <a href="${ctx.about}" class="btn-gold mt-8">${a.cta} ${icon('arrow', 'h-5 w-5 ltr:rotate-180')}</a>
    </div>
    <div class="reveal">
      <div class="frame-gold">
        <img src="/assets/img/visual-urban-development.webp" alt="${a.imgAlt}" width="1400" height="787" loading="lazy" class="aspect-[4/3] w-full rounded-2xl object-cover shadow-card">
      </div>
    </div>
  </div>
</section>`;
}

function about(t) {
  const a = t.about;
  return `
<section id="about" class="section relative scroll-mt-24" aria-labelledby="about-title">
  <div class="container-x grid items-center gap-14 lg:grid-cols-2">
    <div class="reveal">
      <p class="eyebrow">${a.eyebrow}</p>
      <h2 id="about-title" class="h2">${a.h2}</h2>
      <p class="lead">${a.lead}</p>
      <dl class="mt-10 grid grid-cols-2 gap-5">
        ${a.facts.map(f => `<div class="rounded-xl border border-white/5 bg-ink-800/60 p-5"><dt class="text-xs text-sand-400">${f.k}</dt><dd class="mt-1 font-display ${f.gold ? 'text-2xl text-gold-300' : 'text-xl text-sand-50'} font-extrabold">${f.v}</dd></div>`).join('\n        ')}
      </dl>
      <p class="mt-5 flex items-start gap-2 text-sm text-sand-400">${icon('pin', 'mt-0.5 h-4 w-4 shrink-0 text-gold-400')}<span>${a.address}</span></p>
    </div>
    <div class="reveal relative">
      <div class="frame-gold">
        <img src="/assets/img/visual-urban-development.webp" alt="${a.imgAlt}" width="1400" height="787" loading="lazy" class="aspect-[4/3] w-full rounded-2xl object-cover shadow-card">
      </div>
      <figure class="absolute -bottom-8 end-6 max-w-xs rounded-2xl border border-gold-500/30 bg-ink-900/95 p-5 shadow-gold md:-end-6">
        <blockquote class="text-sm leading-relaxed text-sand-100">${a.quote}</blockquote>
        <figcaption class="mt-3 text-xs text-gold-400">${a.quoteBy}</figcaption>
      </figure>
    </div>
  </div>
</section>`;
}

function chairman(t) {
  const c = t.chairman;
  return `
<section id="chairman" class="section bg-ink-950 grain scroll-mt-24" aria-labelledby="chair-title">
  <div class="container-x grid items-center gap-12 lg:grid-cols-[1fr_1.4fr]">
    <div class="reveal mx-auto w-full max-w-sm">
      <div class="frame-gold">
        <img src="/assets/img/logo-najd-alanzi-ar.webp" alt="${c.logoAlt}" width="600" height="600" loading="lazy" class="w-full rounded-2xl">
      </div>
    </div>
    <div class="reveal">
      <p class="eyebrow">${c.eyebrow}</p>
      <h2 id="chair-title" class="h2">${c.h2}</h2>
      <div class="relative mt-8 rounded-2xl border border-white/5 bg-ink-800/60 p-8">
        ${icon('quote', 'absolute -top-5 end-6 h-10 w-10 text-gold-500/60')}
        <p class="text-lg leading-loose text-sand-100">${c.text}</p>
        <p class="mt-6 font-display text-base font-bold text-gold-300">${c.name} <span class="ms-2 font-body text-sm font-normal text-sand-400">${c.title}</span></p>
      </div>
    </div>
  </div>
</section>`;
}

function vmv(t) {
  const v = t.vmv;
  const card = (ic, h, body, i) => `<article class="card card-glow reveal"${delay(i, 0.1)}><div class="icon-ring">${icon(ic)}</div><h3 class="mt-6 text-xl font-bold">${h}</h3>${body}</article>`;
  return `
<section class="section" aria-labelledby="vmv-title">
  <div class="container-x">
    ${sectionHead(v.eyebrow, v.h2, 'vmv-title', true)}
    <div class="mt-14 grid gap-6 md:grid-cols-3">
      ${card('eye', v.vision.h, `<p class="mt-3 leading-relaxed text-sand-400">${v.vision.p}</p>`, 0)}
      ${card('target', v.mission.h, `<p class="mt-3 leading-relaxed text-sand-400">${v.mission.p}</p>`, 1)}
      ${card('award', v.values.h, `<ul class="mt-3 flex flex-wrap gap-2 text-sm">${v.values.items.map(x => `<li class="rounded-full border border-gold-500/30 px-3 py-1 text-gold-200">${x}</li>`).join('')}</ul>`, 2)}
    </div>
  </div>
</section>
<div class="divider-gold"></div>`;
}

function sectors(t) {
  const s = t.sectors, it = s.items;
  const imgs = ['visual-planning-bim', 'visual-urban-development', 'pentagram-uae-skyscraper', 'visual-construction-site', 'visual-telecommunications', 'visual-water-bottling-facility', 'visual-zero-waste', 'visual-industrial-steel'];
  const dims = [[1400, 787], [1400, 787], [1000, 662], [1400, 787], [1400, 787], [1400, 787], [1400, 787], [1400, 787]];
  const tile = (i, cls, big = false, wide = false) => {
    const x = it[i];
    const img = `<img src="/assets/img/${imgs[i]}.webp" alt="${x.alt}" width="${dims[i][0]}" height="${dims[i][1]}" loading="lazy" class="h-full w-full object-cover transition duration-700 group-hover:scale-105">`;
    if (big) return `<article class="group reveal relative ${cls} overflow-hidden rounded-2xl">${img}<div class="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent"></div><div class="absolute inset-x-0 bottom-0 p-6"><div class="icon-ring mb-4 h-11 w-11">${icon('chart', 'h-5 w-5')}</div><h3 class="text-2xl font-bold">${x.h}</h3><p class="mt-1 max-w-md text-sm text-sand-300">${x.p}</p></div></article>`;
    if (wide) return `<article class="group reveal relative ${cls} overflow-hidden rounded-2xl">${img}<div class="absolute inset-0 from-ink-950 via-ink-950/40 to-transparent rtl:bg-gradient-to-l ltr:bg-gradient-to-r"></div><div class="absolute inset-y-0 start-0 flex max-w-xs flex-col justify-end p-6"><h3 class="text-xl font-bold">${x.h}</h3><p class="mt-1 text-sm text-sand-300">${x.p}</p></div></article>`;
    return `<article class="group reveal relative ${cls} overflow-hidden rounded-2xl">${img}<div class="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-transparent"></div><h3 class="absolute inset-x-4 bottom-4 text-lg font-bold leading-snug">${x.h}</h3></article>`;
  };
  return `
<section id="sectors" class="section scroll-mt-24" aria-labelledby="sectors-title">
  <div class="container-x">
    <div class="reveal flex flex-wrap items-end justify-between gap-6">
      <div class="max-w-2xl"><p class="eyebrow">${s.eyebrow}</p><h2 id="sectors-title" class="h2">${s.h2}</h2></div>
      <p class="max-w-md text-sand-400">${s.lead}</p>
    </div>
    <div class="mt-14 grid auto-rows-[220px] grid-cols-2 gap-4 md:auto-rows-[240px] md:grid-cols-4">
      ${tile(0, 'col-span-2 row-span-2', true)}
      ${tile(1, '')}
      ${tile(2, '')}
      ${tile(3, 'col-span-2', false, true)}
      ${tile(4, '')}
      ${tile(5, '')}
      ${tile(6, 'col-span-2', false, true)}
      ${tile(7, 'col-span-2 md:col-span-4', false, true)}
    </div>
  </div>
</section>`;
}

function capabilities(t) {
  const c = t.capabilities;
  const icons = ['layers', 'building', 'bolt', 'factory', 'wrench', 'truck'];
  return `
<section id="capabilities" class="section bg-ink-950 grain scroll-mt-24" aria-labelledby="cap-title">
  <div class="container-x">
    ${sectionHead(c.eyebrow, c.h2, 'cap-title', true, c.lead)}
    <div class="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      ${c.items.map((x, i) => `<article class="card card-glow reveal"${delay(i)}><div class="icon-ring">${icon(icons[i])}</div><h3 class="mt-5 text-lg font-bold">${x.h}</h3><p class="mt-2 text-sand-400">${x.p}</p></article>`).join('\n      ')}
    </div>
    <div class="reveal mt-24">
      <div class="mx-auto max-w-2xl text-center">
        <p class="eyebrow justify-center">${c.modelEyebrow}</p>
        <h3 class="mt-4 text-2xl font-bold leading-snug md:text-4xl md:leading-[1.3]">${c.modelH}</h3>
      </div>
      <ol class="relative mt-14 grid gap-8 md:grid-cols-5">
        <div class="absolute inset-x-0 top-7 hidden h-px bg-gold-line md:block" aria-hidden="true"></div>
        ${c.model.map((m, i) => `<li class="relative text-center"><span class="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold-500/50 bg-ink-900 font-display text-lg font-extrabold text-gold-300">0${i + 1}</span><h4 class="mt-4 font-bold">${m.h}</h4><p class="mt-1 text-sm text-sand-400">${m.p}</p></li>`).join('\n        ')}
      </ol>
    </div>
  </div>
</section>`;
}

function partners(t) {
  const p = t.partners, s = p.syndicate;
  return `
<section id="partners" class="section scroll-mt-24" aria-labelledby="partners-title">
  <div class="container-x">
    ${sectionHead(p.eyebrow, p.h2, 'partners-title', false, p.lead)}
    <div class="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      ${p.items.map((x, i) => `<article class="card reveal${x.primary ? ' border-gold-500/40 bg-gradient-to-b from-gold-500/10 to-transparent' : ''}"${delay(i)}>
        <span class="text-xs font-semibold tracking-widest text-gold-400">${x.country}</span>
        <h3 class="mt-3 text-xl font-bold">${x.name}</h3>
        <p class="mt-2 text-sm text-sand-400">${x.role}</p>
        <p class="mt-4 text-xs text-sand-400">${x.note}</p>
        ${x.pdf ? `<a href="${x.pdf}" target="_blank" rel="noopener" class="mt-5 inline-flex items-center gap-2 text-sm font-bold text-gold-300 hover:text-gold-200">${p.profileLink} ${icon('arrow', 'h-4 w-4 ltr:rotate-180')}</a>` : ''}
      </article>`).join('\n      ')}
    </div>
    <div class="reveal mt-16 overflow-hidden rounded-3xl border border-gold-500/30 bg-ink-950">
      <div class="grid items-center lg:grid-cols-2">
        <img src="/assets/img/partnership-engineers-syndicate-logos.webp" alt="${s.imgAlt}" width="1200" height="800" loading="lazy" class="h-full w-full object-cover">
        <div class="p-8 md:p-12">
          <p class="eyebrow">${s.eyebrow}</p>
          <h3 class="mt-4 text-2xl font-bold leading-snug md:text-3xl md:leading-snug">${s.h3}</h3>
          <p class="mt-4 text-sand-400">${s.p}</p>
          <ul class="mt-6 space-y-3">
            ${s.items.map(x => `<li class="flex gap-3">${icon('check', 'mt-1 h-5 w-5 shrink-0 text-gold-400')}<span><strong class="text-sand-50">${x.b}</strong> <span class="text-sand-400">${x.p}</span></span></li>`).join('\n            ')}
          </ul>
        </div>
      </div>
    </div>
  </div>
</section>`;
}

function projects(t) {
  const p = t.projects, q = p.qatar;
  return `
<section id="projects" class="section bg-ink-950 grain scroll-mt-24" aria-labelledby="projects-title">
  <div class="container-x">
    <div class="reveal flex flex-wrap items-end justify-between gap-6">
      <div class="max-w-2xl"><p class="eyebrow">${p.eyebrow}</p><h2 id="projects-title" class="h2">${p.h2}</h2></div>
      <p class="max-w-md text-sand-400">${p.lead}</p>
    </div>
    <div class="mt-14 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>figure]:mb-4 [&>figure]:break-inside-avoid">
      ${p.items.map(x => `<figure class="group reveal relative overflow-hidden rounded-2xl"><a href="/assets/img/${x.img}.webp" data-lightbox data-caption="${x.cap} – ${x.tag}"><img src="/assets/img/${x.img}.webp" alt="${x.alt}" width="${x.w}" height="${x.h}" loading="lazy" class="w-full transition duration-700 group-hover:scale-105"></a><figcaption class="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950 to-transparent p-4 text-sm"><span class="text-gold-300">${x.tag}</span><br>${x.cap}</figcaption></figure>`).join('\n      ')}
    </div>
    <div class="reveal mt-16 grid gap-6 rounded-3xl border border-white/5 bg-ink-800/60 p-8 md:grid-cols-4 md:p-10">
      <div class="md:col-span-4"><p class="eyebrow">${q.eyebrow}</p><h3 class="mt-3 text-2xl font-bold leading-snug">${q.h3}</h3></div>
      ${q.items.map(x => `<div><h4 class="font-bold text-gold-300">${x.h}</h4><p class="mt-1 text-sm text-sand-400">${x.p}</p></div>`).join('\n      ')}
    </div>
  </div>
</section>`;
}

function quality(t, ctx) {
  const q = t.quality;
  const icons = ['award', 'shield', 'leaf'];
  return `
<section id="quality" class="section scroll-mt-24" aria-labelledby="quality-title">
  <div class="container-x">
    <div class="reveal grid items-end gap-6 lg:grid-cols-2">
      <div><p class="eyebrow">${q.eyebrow}</p><h2 id="quality-title" class="h2">${q.h2}</h2></div>
      <p class="text-sand-400">${q.lead}</p>
    </div>
    <div class="mt-12 grid gap-5 md:grid-cols-3">
      ${q.items.map((x, i) => `<article class="card reveal"${delay(i)}><div class="icon-ring">${icon(icons[i])}</div><h3 class="mt-5 text-lg font-bold">${x.h}</h3><p class="mt-2 text-sm text-sand-400">${x.p}</p></article>`).join('\n      ')}
    </div>
    <div class="reveal mt-10 text-center"><a href="${ctx.about}#certificates" class="btn-ghost">${q.moreLink} ${icon('arrow', 'h-4 w-4 ltr:rotate-180')}</a></div>
  </div>
</section>`;
}

function certificates(t) {
  const c = t.certificates;
  return `
<section id="certificates" class="section bg-ink-950 grain scroll-mt-24" aria-labelledby="cert-title">
  <div class="container-x">
    ${sectionHead(c.eyebrow, c.h2, 'cert-title', true, c.sub)}
    <div class="mt-10 grid grid-cols-2 gap-4 md:grid-cols-5">
      ${c.items.map((x, i) => `<a href="/assets/img/${x.img}.webp" data-lightbox data-caption="${x.cap}" class="reveal group overflow-hidden rounded-xl border border-white/5 bg-white/5 p-2 transition hover:border-gold-500/50"${delay(i)}><img src="/assets/img/${x.img}.webp" alt="${x.alt}" width="900" height="1273" loading="lazy" class="aspect-[3/4] w-full rounded-lg object-cover object-top"><span class="mt-2 block text-center text-xs font-semibold text-gold-300">${x.label}</span></a>`).join('\n      ')}
    </div>
    <h3 class="reveal mt-16 text-center text-xl font-bold text-sand-100">${c.legalH3}</h3>
    <div class="reveal mt-8 grid gap-5 md:grid-cols-3">
      ${c.legal.map(x => `<div class="rounded-2xl border ${x.primary ? 'border-gold-500/30 bg-gradient-to-b from-gold-500/10 to-transparent' : 'border-white/5 bg-ink-800/60'} p-6"><span class="text-xs tracking-widest text-gold-400">${x.country}</span><h4 class="mt-2 text-lg font-bold">${x.name}</h4><p class="mt-1 text-sm text-sand-400">${x.p}</p></div>`).join('\n      ')}
    </div>
  </div>
</section>`;
}

function leadership(t) {
  const l = t.leadership;
  return `
<section id="leadership" class="section scroll-mt-24" aria-labelledby="lead-title">
  <div class="container-x">
    ${sectionHead(l.eyebrow, l.h2, 'lead-title', true)}
    <div class="mt-14 grid gap-6 md:grid-cols-3">
      ${l.items.map((x, i) => `<article class="card reveal text-center"${delay(i, 0.08)}><span class="mx-auto flex h-20 w-20 items-center justify-center rounded-full ${x.primary ? 'bg-gold-gradient text-ink-900' : 'border border-gold-500/40 bg-gold-500/10 text-gold-300'} font-display text-2xl font-black">${x.initial}</span><h3 class="mt-5 text-xl font-bold">${x.name}</h3><p class="mt-1 text-sm text-gold-300">${x.title}</p></article>`).join('\n      ')}
    </div>
  </div>
</section>
<div class="divider-gold"></div>`;
}

function why(t) {
  const w = t.why;
  const icons = ['chart', 'globe', 'users', 'layers', 'leaf', 'shield'];
  const ficons = ['home', 'recycle', 'signal'];
  return `
<section id="why" class="section relative overflow-hidden bg-ink-950 grain scroll-mt-24" aria-labelledby="why-title">
  <img src="/assets/img/visual-logistics.webp" alt="" width="1400" height="787" loading="lazy" class="absolute inset-0 -z-10 h-full w-full object-cover opacity-20">
  <div class="absolute inset-0 -z-10 bg-gradient-to-b from-ink-950 via-ink-950/90 to-ink-950"></div>
  <div class="container-x grid gap-16 lg:grid-cols-2">
    <div class="reveal">
      <p class="eyebrow">${w.eyebrow}</p>
      <h2 id="why-title" class="h2">${w.h2}</h2>
      <ul class="mt-10 grid gap-4 sm:grid-cols-2">
        ${w.items.map((x, i) => `<li class="flex items-center gap-3 rounded-xl border border-white/5 bg-ink-800/60 p-4">${icon(icons[i], 'h-5 w-5 shrink-0 text-gold-400')}<span class="font-semibold">${x}</span></li>`).join('\n        ')}
      </ul>
    </div>
    <div class="reveal">
      <p class="eyebrow">${w.futureEyebrow}</p>
      <h2 class="h2">${w.futureH2}</h2>
      <div class="mt-10 space-y-4">
        ${w.future.map((x, i) => `<article class="flex gap-5 rounded-2xl border border-white/5 bg-ink-800/60 p-6"><div class="icon-ring shrink-0">${icon(ficons[i])}</div><div><h3 class="text-lg font-bold">${x.h}</h3><p class="mt-1 text-sm text-sand-400">${x.p}</p></div></article>`).join('\n        ')}
      </div>
    </div>
  </div>
</section>`;
}

function contact(t) {
  const c = t.contact;
  const input = (name, label, type, extra, ph) => `<label class="block"><span class="text-sm text-sand-300">${label}</span><input name="${name}" type="${type}" ${extra} class="mt-2 w-full rounded-xl border border-white/10 bg-ink-900 px-4 py-3 text-sand-50 outline-none ring-gold-500/50 transition focus:border-gold-500 focus:ring-2 rtl:text-right" placeholder="${ph}"></label>`;
  return `
<section id="contact" class="section scroll-mt-24" aria-labelledby="contact-title">
  <div class="container-x grid gap-12 lg:grid-cols-[1fr_1.1fr]">
    <div class="reveal">
      <p class="eyebrow">${c.eyebrow}</p>
      <h2 id="contact-title" class="h2">${c.h2a} <span class="gold-text">${c.h2b}</span></h2>
      <p class="lead">${c.lead}</p>
      <address class="mt-10 space-y-5 not-italic">
        <a href="${MAPS}" target="_blank" rel="noopener" class="flex items-start gap-4 rounded-2xl border border-white/5 bg-ink-800/60 p-5 transition hover:border-gold-500/40">
          <span class="icon-ring shrink-0">${icon('pin')}</span>
          <span><span class="block text-xs text-sand-400">${c.addressLabel}</span><span class="mt-1 block font-semibold">${c.address}</span></span>
        </a>
        <div class="flex items-start gap-4 rounded-2xl border border-white/5 bg-ink-800/60 p-5">
          <span class="icon-ring shrink-0">${icon('phone')}</span>
          <span><span class="block text-xs text-sand-400">${c.phoneLabel}</span>
            <a href="tel:${PHONE1.tel}" class="mt-1 block font-semibold hover:text-gold-300" dir="ltr">${PHONE1.text}</a>
            <a href="tel:${PHONE2.tel}" class="block font-semibold hover:text-gold-300" dir="ltr">${PHONE2.text}</a></span>
        </div>
        <div class="flex items-start gap-4 rounded-2xl border border-white/5 bg-ink-800/60 p-5">
          <span class="icon-ring shrink-0">${icon('mail')}</span>
          <span><span class="block text-xs text-sand-400">${c.emailLabel}</span>
            <a href="mailto:${EMAIL}" class="mt-1 block font-semibold hover:text-gold-300" dir="ltr">${EMAIL}</a></span>
        </div>
      </address>
      <a href="${WA}" target="_blank" rel="noopener" class="btn-gold mt-8">${icon('whatsapp', 'h-5 w-5')}${c.whatsapp}</a>
    </div>

    <form id="contact-form" class="reveal rounded-3xl border border-gold-500/30 bg-ink-800 p-8 shadow-card md:p-10" novalidate>
      <h3 class="text-2xl font-bold">${c.formH3}</h3>
      <p class="mt-2 text-sm text-sand-400">${c.formNote}</p>
      <div class="mt-8 grid gap-5 sm:grid-cols-2">
        ${input('name', c.name, 'text', 'required autocomplete="name"', c.namePh)}
        ${input('company', c.company, 'text', 'autocomplete="organization"', c.companyPh)}
        ${input('email', c.email, 'email', 'required autocomplete="email" dir="ltr"', 'name@example.com')}
        ${input('phone', c.phone, 'tel', 'autocomplete="tel" dir="ltr"', '+963 ...')}
        <label class="block sm:col-span-2"><span class="text-sm text-sand-300">${c.topic}</span>
          <select name="topic" class="mt-2 w-full rounded-xl border border-white/10 bg-ink-900 px-4 py-3 text-sand-50 outline-none ring-gold-500/50 transition focus:border-gold-500 focus:ring-2">
            ${c.topics.map(x => `<option>${x}</option>`).join('')}
          </select></label>
        <label class="block sm:col-span-2"><span class="text-sm text-sand-300">${c.message}</span><textarea name="message" rows="4" required class="mt-2 w-full rounded-xl border border-white/10 bg-ink-900 px-4 py-3 text-sand-50 outline-none ring-gold-500/50 transition focus:border-gold-500 focus:ring-2" placeholder="${c.messagePh}"></textarea></label>
      </div>
      <p id="form-note" class="mt-4 hidden text-sm text-gold-300" role="status"></p>
      <button type="submit" class="btn-gold mt-6 w-full sm:w-auto">${c.send} ${icon('arrow', 'h-5 w-5 ltr:rotate-180')}</button>
    </form>
  </div>
</section>`;
}

function aboutHero(t, ctx) {
  const a = t.aboutPage;
  return `
<section class="relative isolate overflow-hidden grain" aria-labelledby="about-page-title">
  <img src="/assets/img/visual-construction-site.webp" alt="" width="1400" height="787" fetchpriority="high" class="absolute inset-0 -z-20 h-full w-full object-cover object-center">
  <div class="absolute inset-0 -z-10 bg-gradient-to-b from-ink-900/80 via-ink-900/90 to-ink-900"></div>
  <div class="container-x pb-16 pt-40 md:pb-20 md:pt-48">
    <nav class="text-xs text-sand-400" aria-label="breadcrumb"><ol class="flex items-center gap-2"><li><a href="${ctx.home}" class="hover:text-gold-300">${t.meta.breadcrumbHome}</a></li><li aria-hidden="true">/</li><li class="text-gold-300" aria-current="page">${t.meta.breadcrumbAbout}</li></ol></nav>
    <p class="eyebrow mt-6">${a.eyebrow}</p>
    <h1 id="about-page-title" class="mt-5 max-w-3xl font-display text-4xl font-black !leading-[1.3] text-sand-50 md:text-6xl">${a.h1}</h1>
    <p class="lead">${a.lead}</p>
    <ul class="mt-8 flex flex-wrap gap-2">
      ${a.jump.map(j => `<li><a href="${j.href}" class="inline-flex rounded-full border border-gold-500/30 px-4 py-2 text-sm font-semibold text-gold-200 transition hover:bg-gold-500/10">${j.label}</a></li>`).join('\n      ')}
    </ul>
  </div>
</section>`;
}

function aboutCta(t, ctx) {
  const a = t.aboutPage;
  return `
<section class="section" aria-labelledby="about-cta-title">
  <div class="container-x">
    <div class="reveal rounded-3xl border border-gold-500/30 bg-gradient-to-b from-gold-500/10 to-transparent p-10 text-center md:p-16">
      <h2 id="about-cta-title" class="font-display text-3xl font-bold leading-snug md:text-4xl md:leading-[1.3]">${a.ctaTitle}</h2>
      <p class="lead mx-auto">${a.ctaLead}</p>
      <div class="mt-8 flex flex-wrap justify-center gap-4">
        <a href="${ctx.home}#contact" class="btn-gold">${a.ctaBtn} ${icon('arrow', 'h-5 w-5 ltr:rotate-180')}</a>
        <a href="${ctx.home}" class="btn-ghost">${a.ctaBack}</a>
      </div>
    </div>
  </div>
</section>`;
}

/* ---------- pages ---------- */
function homePage(t, ctx) {
  return head(t, ctx, t.meta.home) + header(t, ctx) + `<main id="top">` +
    hero(t, ctx) + aboutTeaser(t, ctx) + vmv(t) + sectors(t) + capabilities(t) + partners(t) + projects(t) + quality(t, ctx) + contact(t) +
    `</main>` + footer(t, ctx);
}

function aboutPage(t, ctx) {
  return head(t, ctx, t.meta.about) + header(t, ctx) + `<main id="top">` +
    aboutHero(t, ctx) + about(t) + chairman(t) + leadership(t) + certificates(t) + why(t) + aboutCta(t, ctx) +
    `</main>` + footer(t, ctx);
}

module.exports = { homePage, aboutPage, SITE };
