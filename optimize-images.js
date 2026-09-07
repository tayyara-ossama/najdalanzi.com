// Converts source images in assets/images/ to optimized WebP in assets/img/
const sharp = require('sharp'), fs = require('fs'), path = require('path');
const SRC = 'assets/images', OUT = 'assets/img';
fs.mkdirSync(OUT, { recursive: true });
const sizes = { hero: 1920, visual: 1400, partnership: 1200, pentagram: 1000, roya: 1000, unlimited: 1000, mep: 1000, cert: 900, completion: 900, logo: 600 };
(async () => {
  for (const f of fs.readdirSync(SRC)) {
    if (!/\.(png|jpe?g)$/i.test(f)) continue;
    const key = Object.keys(sizes).find(k => f.startsWith(k)) || 'visual';
    const out = path.join(OUT, f.replace(/\.(png|jpe?g)$/i, '.webp'));
    const meta = await sharp(path.join(SRC, f), { failOn: 'none' }).metadata();
    await sharp(path.join(SRC, f), { failOn: 'none' }).resize({ width: Math.min(sizes[key], meta.width), withoutEnlargement: true }).webp({ quality: 80 }).toFile(out);
    console.log(f, '->', path.basename(out), Math.round(fs.statSync(out).size / 1024) + 'KB');
  }
  // favicon + OG image from the Arabic logo
  await sharp(path.join(SRC, 'logo-najd-alanzi-ar.jpeg')).resize(512, 512).png().toFile('favicon.png');
  await sharp(path.join(SRC, 'logo-najd-alanzi-ar.jpeg')).resize(180, 180).png().toFile('apple-touch-icon.png');
  await sharp(path.join(SRC, 'hero-architecture-night.png')).resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 82 }).toFile(path.join(OUT, 'og-image.jpg'));
})();
