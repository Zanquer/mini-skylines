const fs = require('fs');
const path = require('path');
const vm = require('vm');

const VENDOR = path.join(__dirname, '..', 'vendor');

let threeCode = fs.readFileSync(path.join(VENDOR, 'three.module.min.js'), 'utf8');
// Replace final export { a as B, c, ... } with const THREE = { B: a, c: c, ... };
threeCode = threeCode.replace(/export\s*\{([^}]+)\}\s*;?\s*$/, (_, list) => {
  const entries = list.split(',').map((item) => {
    const parts = item.trim().split(/\s+as\s+/);
    if (parts.length === 2) return `${parts[1].trim()}: ${parts[0].trim()}`;
    return `${parts[0].trim()}: ${parts[0].trim()}`;
  });
  return `const THREE = { ${entries.join(', ')} }; globalThis.THREE = THREE;`;
});

let bguCode = fs.readFileSync(path.join(VENDOR, 'BufferGeometryUtils.js'), 'utf8');
bguCode = bguCode.replace(/import\s*\{([\s\S]*?)\}\s*from\s*['"]three['"];?/, 'const {$1} = globalThis.THREE;');
bguCode = bguCode.replace(/export\s*\{[\s\S]*?\};?/g, '');
bguCode = bguCode.replace(/export\s+(function|const|let|class)\s+/g, '$1 ');
bguCode += `\nglobalThis.BufferGeometryUtils = { toTrianglesDrawMode, mergeGeometries };\n`;

let gltfCode = fs.readFileSync(path.join(VENDOR, 'GLTFLoader.js'), 'utf8');
gltfCode = gltfCode.replace(/import\s*\{([\s\S]*?)\}\s*from\s*['"]three['"];?/, 'const {$1} = globalThis.THREE;');
gltfCode = gltfCode.replace(/import\s*\{([\s\S]*?)\}\s*from\s*['"][^'"]*BufferGeometryUtils\.js['"];?/, 'const {$1} = globalThis.BufferGeometryUtils;');
gltfCode = gltfCode.replace(/new\s+ImageBitmapLoader\s*\(\s*this\.options\.manager\s*\)/g, 'new TextureLoader( this.options.manager )');
gltfCode = gltfCode.replace(/export\s*\{\s*GLTFLoader\s*\};?/, 'globalThis.THREE.GLTFLoader = GLTFLoader;');
gltfCode = gltfCode.replace(/export\s+(class|function|const)\s+/g, '$1 ');

const combined = `(function(){\n${threeCode}\n})();\n(function(){\n${bguCode}\n})();\n(function(){\n${gltfCode}\n})();\n`;

const outPath = path.join(VENDOR, 'three_classic.js');
fs.writeFileSync(outPath, combined, 'utf8');

// Verify in Node VM!
const ctx = {
  console, Math, Date, Array, Object, Number, String, Boolean, Set, Map, WeakMap, Symbol, Promise,
  Float32Array, Float64Array, Uint8Array, Uint8ClampedArray, Uint16Array, Uint32Array, Int8Array, Int16Array, Int32Array, DataView, ArrayBuffer,
  TextDecoder, TextEncoder, URL, performance, setTimeout, clearTimeout,
  self: {}, window: {}, document: { createElementNS: () => ({ style: {} }), createElement: () => ({ style: {} }) }
};
ctx.globalThis = ctx;
ctx.self = ctx;
ctx.window = ctx;

vm.runInNewContext(combined, ctx);
const s = new ctx.THREE.Scene();
const loader = new ctx.THREE.GLTFLoader();
console.log('Verified classic Three.js r170 + GLTFLoader! Scene:', s.type, 'Loader:', typeof loader.parse, 'Size KB:', (combined.length / 1024).toFixed(1));
