/* Najd Alanzi Investment – landing page interactions (no dependencies) */
(() => {
  'use strict';

  /* ---------- Header: solid on scroll ---------- */
  const header = document.getElementById('site-header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile nav ---------- */
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('mobile-menu');
  const iconUse = toggle.querySelector('use');
  const setMenu = (open) => {
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة');
    iconUse.setAttribute('href', open ? '#i-close' : '#i-menu');
  };
  setMenu(false);
  toggle.addEventListener('click', () => setMenu(menu.hidden));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const runCounter = (el) => {
    const target = Number(el.dataset.count);
    const dur = 1200; const start = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { runCounter(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach((c) => cio.observe(c));
  } else {
    counters.forEach((c) => (c.textContent = c.dataset.count));
  }

  /* ---------- Card glow follows cursor ---------- */
  document.querySelectorAll('.card-glow').forEach((card) => {
    card.addEventListener('pointermove', (ev) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${ev.clientX - r.left}px`);
      card.style.setProperty('--my', `${ev.clientY - r.top}px`);
    });
  });

  /* ---------- Lightbox ---------- */
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbCap = document.getElementById('lightbox-caption');
  document.querySelectorAll('[data-lightbox]').forEach((a) => {
    a.addEventListener('click', (ev) => {
      ev.preventDefault();
      lbImg.src = a.getAttribute('href');
      lbImg.alt = a.querySelector('img')?.alt || '';
      lbCap.textContent = a.dataset.caption || '';
      if (typeof lb.showModal === 'function') lb.showModal(); else window.open(a.href, '_blank');
    });
  });
  document.getElementById('lightbox-close').addEventListener('click', () => lb.close());
  lb.addEventListener('click', (ev) => { if (ev.target === lb) lb.close(); });
  lb.addEventListener('close', () => { lbImg.src = ''; });

  /* ---------- Contact form -> mailto ---------- */
  const form = document.getElementById('contact-form');
  const note = document.getElementById('form-note');
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const d = Object.fromEntries(new FormData(form).entries());
    const subject = `طلب تواصل – ${d.topic} – ${d.name}`;
    const body = [
      `الاسم: ${d.name}`,
      `الجهة: ${d.company || '-'}`,
      `البريد: ${d.email}`,
      `الهاتف: ${d.phone || '-'}`,
      `الموضوع: ${d.topic}`,
      '', d.message,
    ].join('\n');
    window.location.href = `mailto:az.sy.investment@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    note.textContent = 'تم تجهيز الرسالة في تطبيق البريد لديك. إن لم يُفتح تلقائياً، راسلنا على az.sy.investment@gmail.com';
    note.hidden = false;
  });

  /* ---------- Footer year ---------- */
  const y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());
})();
