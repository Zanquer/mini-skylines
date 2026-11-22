const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'raw_assets');

async function downloadZip(name, url) {
  const dest = path.join(OUT_DIR, `${name}.zip`);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 50000) return true;
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!res.ok) return false;
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 30000) return false;
  fs.writeFileSync(dest, buf);
  console.log(`[OK] ${name}.zip (${(buf.length / 1024 / 1024).toFixed(2)} MB)`);
  return true;
}

(async () => {
  // Download official Kenney Racing Starter Kit (3D cars, wheels, barriers, trees!)
  await downloadZip(
    'starter-kit-racing',
    'https://codeload.github.com/KenneyNL/Starter-Kit-Racing/zip/refs/heads/main'
  ).catch((e) => console.warn(e.message));

  // Check where Kenney's download anchor points on city-kit-commercial
  const res = await fetch('https://kenney.nl/assets/city-kit-commercial', { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const html = await res.text();
  const dlMatches = html.match(/<a[^>]+>[\s\S]*?Download[\s\S]*?<\/a>/gi) || [];
  console.log('Kenney Download anchors:', dlMatches.slice(0, 3));
})();
