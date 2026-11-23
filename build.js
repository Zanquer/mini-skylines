const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'src');
const WWW = path.join(ROOT, 'www');
const DIST = path.join(ROOT, 'dist');
const VENDOR = path.join(ROOT, 'vendor');

for (const dir of [WWW, path.join(WWW, 'vendor'), DIST, path.join(DIST, 'vendor')]) {
  fs.mkdirSync(dir, { recursive: true });
}

const threeClassic = fs.readFileSync(path.join(VENDOR, 'three_classic.js'), 'utf8');

const moduleOrder = [
  'assets_bundle.js',
  'asset_loader.js',
  'audio.js',
  'mapgen.js',
  'water_physics.js',
  'terrain_water_shader.js',
  'facade_textures.js',
  'architecture3d.js',
  'disasters.js',
  'simulation.js',
  'traffic.js',
  'renderer3d.js',
  'ui.js',
  'main.js'
];

// Extract small SMOKE_PNG_URI (~8KB) so slim PWA bundle still has zero-latency smoke sprite
const rawAssetsBundle = fs.readFileSync(path.join(SRC, 'assets_bundle.js'), 'utf8');
const smokeMatch = rawAssetsBundle.match(/export const SMOKE_PNG_URI\s*=\s*"[^"]+";/);
const slimAssetsStub = `// Slim PWA asset stub (heavy textures & models served as binary files under ./assets/)\n${smokeMatch ? smokeMatch[0] : 'export const SMOKE_PNG_URI = "";'}\nexport const GLB_ASSETS = {};\n`;
const slimFacadeStub = `// External PBR textures loaded natively from ./assets/textures/ by AssetManager\nexport const FACADE_TEXTURES = {};\n`;

function compileAppBundle({ externalAssets = true } = {}) {
  let appJS = `(function () {\n"use strict";\nconst __M = {};\n\n`;

  for (const file of moduleOrder) {
    let code;
    if (externalAssets && file === 'assets_bundle.js') {
      code = slimAssetsStub;
    } else if (externalAssets && file === 'facade_textures.js') {
      code = slimFacadeStub;
    } else {
      code = fs.readFileSync(path.join(SRC, file), 'utf8');
    }

    const exportedNames = [];

    code = code.replace(/import\s*\{([\s\S]*?)\}\s*from\s*['"][^'"]+['"]\s*;?/g, (_, specList) => {
      const bindings = specList
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => {
          const parts = s.split(/\s+as\s+/);
          return parts.length === 2 ? `${parts[0].trim()}: ${parts[1].trim()}` : parts[0].trim();
        });
      return `const { ${bindings.join(', ')} } = __M;`;
    });

    code = code.replace(/^\s*export\s+(const|let|var|function|class)\s+([A-Za-z0-9_$]+)/gm, (_, kw, name) => {
      exportedNames.push(name);
      return `${kw} ${name}`;
    });

    code = code.replace(/^\s*export\s*\{([^}]+)\}\s*;?/gm, (_, list) => {
      list.split(',').map((s) => s.trim()).filter(Boolean).forEach((s) => {
        const parts = s.split(/\s+as\s+/);
        exportedNames.push(parts.length === 2 ? `${parts[1].trim()}: ${parts[0].trim()}` : parts[0].trim());
      });
      return '';
    });

    // Safe lightweight compaction for slim PWA bundle: drop standalone // comment lines & collapse leading indentation
    const compactCode = externalAssets
      ? code
          .split('\n')
          .filter((line) => !/^\s*\/\//.test(line))
          .map((line) => line.replace(/^[ \t]+/, '').replace(/[ \t]+$/, ''))
          .filter((line) => line.length > 0)
          .join('\n')
      : code.trim();

    appJS += `// ====== MODULE: ${file} ======\n(function () {\n${compactCode}\n`;
    if (exportedNames.length > 0) {
      appJS += `\nObject.assign(__M, { ${exportedNames.join(', ')} });\n`;
    }
    appJS += `})();\n\n`;
  }

  appJS += `})();\n`;
  new vm.Script(appJS, { filename: externalAssets ? 'app.bundle.js' : 'app_inline.js' });
  return appJS;
}

const pwaAppJS = compileAppBundle({ externalAssets: true });
const inlineAppJS = compileAppBundle({ externalAssets: false });
console.log(`Syntax verified: slim PWA bundle (${(pwaAppJS.length / 1024).toFixed(1)} KB) & inline fallback (${(inlineAppJS.length / 1024 / 1024).toFixed(2)} MB).`);

// Read asset manifest (created by scripts/bake_pbr_assets.js) & fold app bundle hash into unified version
const assetManifestPath = path.join(WWW, 'assets', 'manifest.json');
let assetManifest = { version: 'v7.0-dev', files: [], textures: [], totalBytes: 0, fileCount: 0 };
if (fs.existsSync(assetManifestPath)) {
  assetManifest = JSON.parse(fs.readFileSync(assetManifestPath, 'utf8'));
}
const codeHash = crypto.createHash('sha256').update(pwaAppJS).digest('hex').slice(0, 8);
const baseVer = (assetManifest.version || 'v7.0').split('-').slice(0, 2).join('-');
const buildVersion = `${baseVer}-${codeHash}`;
assetManifest.version = buildVersion;
if (fs.existsSync(path.join(WWW, 'assets'))) {
  fs.writeFileSync(assetManifestPath, JSON.stringify(assetManifest, null, 2), 'utf8');
}

const css = fs.readFileSync(path.join(SRC, 'styles.css'), 'utf8');
const template = fs.readFileSync(path.join(SRC, 'template.html'), 'utf8');

// 1. Write Decoupled iOS Full-Screen Offline PWA into www/
const pwaHead = [
  '<link rel="manifest" href="./manifest.json" />',
  '<link rel="apple-touch-icon" sizes="180x180" href="./icons/apple-touch-icon-180.png" />',
  '<link rel="icon" type="image/png" sizes="192x192" href="./icons/icon-192.png" />'
].join('\n  ');

const pwaScripts = [
  '<script src="./vendor/three_classic.js"></script>',
  '<script src="./app.bundle.js"></script>'
].join('\n  ');

const pwaSwScript = `<script>
    if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
      window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
    }
  </script>`;

const pwaIndexHtml = template
  .replace('<!--PWA_HEAD-->', pwaHead)
  .replace('/*INLINE_CSS*/', () => css)
  .replace('<!--APP_SCRIPTS-->', pwaScripts)
  .replace('<!--PWA_SW-->', pwaSwScript);

fs.writeFileSync(path.join(WWW, 'index.html'), pwaIndexHtml, 'utf8');
fs.writeFileSync(path.join(WWW, 'app.bundle.js'), pwaAppJS, 'utf8');
fs.writeFileSync(path.join(WWW, 'vendor', 'three_classic.js'), threeClassic, 'utf8');

const webManifest = {
  name: '山河天际线 Pro 3D',
  short_name: '山河天际线',
  description: '旗舰 PBR 3D 离线城市模拟建造（大坝水力发电 · 立体高架立交 · 复兴号高铁 · 全离线 iPhone PWA）',
  start_url: './index.html',
  scope: './',
  display: 'standalone',
  orientation: 'any',
  background_color: '#070e1c',
  theme_color: '#0b1324',
  icons: [
    { src: './icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: './icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
  ]
};
fs.writeFileSync(path.join(WWW, 'manifest.json'), JSON.stringify(webManifest, null, 2), 'utf8');

// Auto-versioned Network-First (HTML/JS) + Cache-First (Binary Assets) Service Worker
const swCode = `// Auto-generated Service Worker for 山河天际线 Pro 3D (${buildVersion})
const CACHE_NAME = 'mini-skylines-${buildVersion}';
const CORE_SHELL = [
  './',
  './index.html',
  './app.bundle.js',
  './vendor/three_classic.js',
  './manifest.json',
  './assets/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k.startsWith('mini-skylines-') && k !== CACHE_NAME).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  const isBinaryAsset = url.pathname.includes('/assets/') || url.pathname.includes('/icons/');
  const isManifestJson = url.pathname.endsWith('manifest.json');

  if (isBinaryAsset && !isManifestJson) {
    // Cache-First for immutable binary PBR textures, models & icons
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(event.request, { ignoreSearch: true }).then((cached) => {
          if (cached) return cached;
          return fetch(event.request).then((resp) => {
            if (resp && resp.ok) cache.put(event.request, resp.clone());
            return resp;
          });
        })
      )
    );
    return;
  }

  // Network-First with offline cache fallback for HTML, JS & manifest.json (instant updates on iPhone!)
  event.respondWith(
    fetch(event.request)
      .then((resp) => {
        if (resp && resp.ok) {
          const copy = resp.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return resp;
      })
      .catch(() => caches.match(event.request, { ignoreSearch: true }).then((c) => c || caches.match('./index.html')))
  );
});
`;
fs.writeFileSync(path.join(WWW, 'sw.js'), swCode, 'utf8');
fs.writeFileSync(path.join(WWW, '.nojekyll'), '', 'utf8');

// 2. Mirror www/ -> dist/ so GitHub Pages (gh-pages) serves the full decoupled PWA directly!
function copyDirRecursive(srcDir, dstDir) {
  fs.mkdirSync(dstDir, { recursive: true });
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const s = path.join(srcDir, entry.name);
    const d = path.join(dstDir, entry.name);
    if (entry.isDirectory()) copyDirRecursive(s, d);
    else fs.copyFileSync(s, d);
  }
}
copyDirRecursive(WWW, DIST);

// 3. Also keep single-file desktop fallback dist/mini-skylines-offline.html
const singleFileHtml = template
  .replace('<!--PWA_HEAD-->', '')
  .replace('/*INLINE_CSS*/', () => css)
  .replace('<!--APP_SCRIPTS-->', () => `<script>\n${threeClassic}\n${inlineAppJS}\n</script>`)
  .replace('<!--PWA_SW-->', '');

const singleOutPath = path.join(DIST, 'mini-skylines-offline.html');
fs.writeFileSync(singleOutPath, singleFileHtml, 'utf8');

console.log(`Built Decoupled iOS PWA in www/ & dist/ (${buildVersion})`);
console.log(`  - index.html: ${(fs.statSync(path.join(WWW, 'index.html')).size / 1024).toFixed(1)} KB`);
console.log(`  - app.bundle.js: ${(fs.statSync(path.join(WWW, 'app.bundle.js')).size / 1024).toFixed(1)} KB`);
console.log(`  - vendor/three_classic.js: ${(fs.statSync(path.join(WWW, 'vendor', 'three_classic.js')).size / 1024).toFixed(1)} KB`);
console.log(`  - mini-skylines-offline.html: ${(fs.statSync(singleOutPath).size / 1024 / 1024).toFixed(2)} MB`);
