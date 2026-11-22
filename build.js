const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');
const VENDOR = path.join(ROOT, 'vendor');

if (!fs.existsSync(DIST)) {
  fs.mkdirSync(DIST, { recursive: true });
}

const threeClassic = fs.readFileSync(path.join(VENDOR, 'three_classic.js'), 'utf8');

const moduleOrder = [
  'assets_bundle.js',
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

let appJS = `(function () {\n"use strict";\nconst __M = {};\n\n`;

for (const file of moduleOrder) {
  let code = fs.readFileSync(path.join(SRC, file), 'utf8');
  const exportedNames = [];

  // Replace ES module imports: import { a, b as c } from './xyz.js';
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

  // Collect & strip `export const/let/var/function/class Name`
  code = code.replace(/^\s*export\s+(const|let|var|function|class)\s+([A-Za-z0-9_$]+)/gm, (_, kw, name) => {
    exportedNames.push(name);
    return `${kw} ${name}`;
  });

  // Collect & strip `export { a, b };` if any
  code = code.replace(/^\s*export\s*\{([^}]+)\}\s*;?/gm, (_, list) => {
    list.split(',').map((s) => s.trim()).filter(Boolean).forEach((s) => {
      const parts = s.split(/\s+as\s+/);
      exportedNames.push(parts.length === 2 ? `${parts[1].trim()}: ${parts[0].trim()}` : parts[0].trim());
    });
    return '';
  });

  appJS += `// ====== MODULE: ${file} ======\n(function () {\n${code.trim()}\n`;
  if (exportedNames.length > 0) {
    appJS += `\nObject.assign(__M, { ${exportedNames.join(', ')} });\n`;
  }
  appJS += `})();\n\n`;
}

appJS += `})();\n`;

// Syntax check appJS cleanly with Node VM
new vm.Script(appJS, { filename: 'app_bundle_v4.js' });
console.log('Scoped multi-agent app bundle syntax verified cleanly.');

const combinedJS = threeClassic + '\n' + appJS;
const css = fs.readFileSync(path.join(SRC, 'styles.css'), 'utf8');
const template = fs.readFileSync(path.join(SRC, 'template.html'), 'utf8');

const singleFileHtml = template
  .replace('<!--PWA_HEAD-->', '')
  .replace('/*INLINE_CSS*/', () => css)
  .replace('/*INLINE_JS*/', () => combinedJS)
  .replace('<!--PWA_SW-->', '');

const singleOutPath = path.join(DIST, 'mini-skylines-offline.html');
fs.writeFileSync(singleOutPath, singleFileHtml, 'utf8');

const pwaHtml = template
  .replace('<!--PWA_HEAD-->', '<link rel="manifest" href="./manifest.json" />')
  .replace('/*INLINE_CSS*/', () => css)
  .replace('/*INLINE_JS*/', () => combinedJS)
  .replace(
    '<!--PWA_SW-->',
    `<script>
      if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
        window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
      }
    </script>`
  );

fs.writeFileSync(path.join(DIST, 'index.html'), pwaHtml, 'utf8');

const sizeMB = (fs.statSync(singleOutPath).size / 1024 / 1024).toFixed(2);
console.log(`Built Flagship v4.0 ${singleOutPath} (${sizeMB} MB)`);
