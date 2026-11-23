/**
 * Downloads verified CC0 1.0 Public Domain 3D GLB models from Quaternius & Kenney mirrors,
 * embeds external colormap.png textures directly inside each GLB binary so every model is
 * 100% self-contained & offline-safe for iOS PWA Service Worker caching.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'assets_src', 'models_cc0');
const TMP_DIR = path.join(OUT_DIR, '_tmp');
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.mkdirSync(TMP_DIR, { recursive: true });

// Remove any earlier test_*.glb files
for (const f of fs.readdirSync(OUT_DIR)) {
  if (f.startsWith('test_') && f.endsWith('.glb')) {
    try { fs.unlinkSync(path.join(OUT_DIR, f)); } catch {}
  }
}

const QUAT_BASE = 'https://raw.githubusercontent.com/trebeljahr/quaternius-showcase/main/public/glb';
const KENNEY_BASE = 'https://raw.githubusercontent.com/shorepine/kenney/main/3d';

// Curated CC0 1.0 model manifest (compact, visually cohesive, high detail)
const MODELS = [
  // 1. Quaternius CC0 Wildlife Animals (for Wildlife Zoo!) — 100% self-contained vertex/PBR materials
  { key: 'zoo_stag',    url: `${QUAT_BASE}/animals_pack/Stag.glb` },
  { key: 'zoo_deer',    url: `${QUAT_BASE}/animals_pack/Deer.glb` },
  { key: 'zoo_alpaca',  url: `${QUAT_BASE}/animals_pack/Alpaca.glb` },
  { key: 'zoo_fox',     url: `${QUAT_BASE}/animals_pack/Fox.glb` },
  { key: 'zoo_horse',   url: `${QUAT_BASE}/animals_pack/Horse.glb` },

  // 2. Kenney CC0 Vehicles (embed car/Textures/colormap.png)
  { key: 'cc0_sedan',     url: `${KENNEY_BASE}/car/sedan.glb`,          texUrl: `${KENNEY_BASE}/car/Textures/colormap.png`, texKey: 'kenney_car' },
  { key: 'cc0_sports',    url: `${KENNEY_BASE}/car/sedan-sports.glb`,   texUrl: `${KENNEY_BASE}/car/Textures/colormap.png`, texKey: 'kenney_car' },
  { key: 'cc0_suv',       url: `${KENNEY_BASE}/car/suv-luxury.glb`,     texUrl: `${KENNEY_BASE}/car/Textures/colormap.png`, texKey: 'kenney_car' },
  { key: 'cc0_taxi',      url: `${KENNEY_BASE}/car/taxi.glb`,           texUrl: `${KENNEY_BASE}/car/Textures/colormap.png`, texKey: 'kenney_car' },
  { key: 'cc0_police',    url: `${KENNEY_BASE}/car/police.glb`,         texUrl: `${KENNEY_BASE}/car/Textures/colormap.png`, texKey: 'kenney_car' },
  { key: 'cc0_ambulance', url: `${KENNEY_BASE}/car/ambulance.glb`,      texUrl: `${KENNEY_BASE}/car/Textures/colormap.png`, texKey: 'kenney_car' },
  { key: 'cc0_firetruck', url: `${KENNEY_BASE}/car/firetruck.glb`,      texUrl: `${KENNEY_BASE}/car/Textures/colormap.png`, texKey: 'kenney_car' },
  { key: 'cc0_garbage',   url: `${KENNEY_BASE}/car/garbage-truck.glb`,  texUrl: `${KENNEY_BASE}/car/Textures/colormap.png`, texKey: 'kenney_car' },
  { key: 'cc0_truck',     url: `${KENNEY_BASE}/car/delivery.glb`,       texUrl: `${KENNEY_BASE}/car/Textures/colormap.png`, texKey: 'kenney_car' },

  // 3. Kenney CC0 Coastal Watercraft (embed watercraft/Textures/colormap.png)
  { key: 'cc0_sailboat',    url: `${KENNEY_BASE}/watercraft/boat-sail-a.glb`,        texUrl: `${KENNEY_BASE}/watercraft/Textures/colormap.png`, texKey: 'kenney_boat' },
  { key: 'cc0_fishingboat', url: `${KENNEY_BASE}/watercraft/boat-fishing-small.glb`, texUrl: `${KENNEY_BASE}/watercraft/Textures/colormap.png`, texKey: 'kenney_boat' },

  // 4. Kenney CC0 Suburban Villas (embed city-suburban/Textures/colormap.png)
  { key: 'cc0_villa_a', url: `${KENNEY_BASE}/city-suburban/building-type-a.glb`, texUrl: `${KENNEY_BASE}/city-suburban/Textures/colormap.png`, texKey: 'kenney_sub' },
  { key: 'cc0_villa_b', url: `${KENNEY_BASE}/city-suburban/building-type-b.glb`, texUrl: `${KENNEY_BASE}/city-suburban/Textures/colormap.png`, texKey: 'kenney_sub' },
  { key: 'cc0_villa_c', url: `${KENNEY_BASE}/city-suburban/building-type-d.glb`, texUrl: `${KENNEY_BASE}/city-suburban/Textures/colormap.png`, texKey: 'kenney_sub' },
  { key: 'cc0_villa_d', url: `${KENNEY_BASE}/city-suburban/building-type-f.glb`, texUrl: `${KENNEY_BASE}/city-suburban/Textures/colormap.png`, texKey: 'kenney_sub' }
];

// Download all required files in a single PowerShell batch (uses Windows system proxy cleanly!)
const downloads = [];
const seenTex = new Set();
for (const m of MODELS) {
  const dest = path.join(TMP_DIR, `${m.key}.glb`);
  if (!fs.existsSync(dest) || fs.statSync(dest).size < 1024) {
    downloads.push({ url: m.url, dest });
  }
  if (m.texUrl && !seenTex.has(m.texKey)) {
    seenTex.add(m.texKey);
    const tDest = path.join(TMP_DIR, `${m.texKey}.png`);
    if (!fs.existsSync(tDest) || fs.statSync(tDest).size < 256) {
      downloads.push({ url: m.texUrl, dest: tDest });
    }
  }
}

if (downloads.length > 0) {
  const dlSpecPath = path.join(TMP_DIR, '_dl.json');
  fs.writeFileSync(dlSpecPath, JSON.stringify(downloads), 'utf8');
  const psCode = `
$ErrorActionPreference = 'Stop'
$items = Get-Content -Raw -Path '${dlSpecPath.replace(/\\/g, '\\\\')}' | ConvertFrom-Json
foreach ($it in $items) {
  Write-Output ("Fetching " + [System.IO.Path]::GetFileName($it.dest))
  Invoke-WebRequest -Uri $it.url -OutFile $it.dest -TimeoutSec 30
}
`;
  const psPath = path.join(TMP_DIR, '_dl.ps1');
  fs.writeFileSync(psPath, psCode, 'utf8');
  execFileSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', psPath], { stdio: 'inherit' });
}

/**
 * Embeds a PNG buffer directly into a GLB binary's BIN chunk and replaces external image URIs
 * with a clean bufferView + mimeType: "image/png" (RFC glTF 2.0 compliant, 4-byte aligned!).
 */
function embedTextureInGlb(glbBuf, pngBuf) {
  if (glbBuf.readUInt32LE(0) !== 0x46546c67) throw new Error('Invalid GLB magic');
  const jsonLen = glbBuf.readUInt32LE(12);
  const jsonType = glbBuf.readUInt32LE(16);
  if (jsonType !== 0x4e4f534a) throw new Error('Invalid JSON chunk');
  const gltf = JSON.parse(glbBuf.slice(20, 20 + jsonLen).toString('utf8'));

  const binChunkOffset = 20 + jsonLen;
  let binData = Buffer.alloc(0);
  if (binChunkOffset + 8 <= glbBuf.length) {
    const binLen = glbBuf.readUInt32LE(binChunkOffset);
    binData = glbBuf.slice(binChunkOffset + 8, binChunkOffset + 8 + binLen);
  }

  // Pad existing BIN data to 4-byte boundary before appending PNG
  const pad0 = (4 - (binData.length % 4)) % 4;
  const imgByteOffset = binData.length + pad0;
  const newBinRaw = Buffer.concat([binData, Buffer.alloc(pad0), pngBuf]);
  const binPad = (4 - (newBinRaw.length % 4)) % 4;
  const newBin = Buffer.concat([newBinRaw, Buffer.alloc(binPad)]);

  if (!gltf.buffers || gltf.buffers.length === 0) gltf.buffers = [{}];
  gltf.buffers[0].byteLength = newBin.length;
  delete gltf.buffers[0].uri;

  if (!gltf.bufferViews) gltf.bufferViews = [];
  const imgBvIdx = gltf.bufferViews.length;
  gltf.bufferViews.push({
    buffer: 0,
    byteOffset: imgByteOffset,
    byteLength: pngBuf.length
  });

  if (Array.isArray(gltf.images)) {
    for (const img of gltf.images) {
      if (img.uri) {
        delete img.uri;
        img.bufferView = imgBvIdx;
        img.mimeType = 'image/png';
      }
    }
  }

  let jsonStr = JSON.stringify(gltf);
  let jsonBuf = Buffer.from(jsonStr, 'utf8');
  const jsonPad = (4 - (jsonBuf.length % 4)) % 4;
  if (jsonPad > 0) jsonBuf = Buffer.concat([jsonBuf, Buffer.alloc(jsonPad, 0x20)]);

  const totalLen = 12 + 8 + jsonBuf.length + 8 + newBin.length;
  const out = Buffer.alloc(totalLen);
  out.writeUInt32LE(0x46546c67, 0); // 'glTF'
  out.writeUInt32LE(2, 4);          // version 2
  out.writeUInt32LE(totalLen, 8);
  out.writeUInt32LE(jsonBuf.length, 12);
  out.writeUInt32LE(0x4e4f534a, 16); // 'JSON'
  jsonBuf.copy(out, 20);
  const bOff = 20 + jsonBuf.length;
  out.writeUInt32LE(newBin.length, bOff);
  out.writeUInt32LE(0x004e4942, bOff + 4); // 'BIN\0'
  newBin.copy(out, bOff + 8);
  return out;
}

let totalBytes = 0;
for (const m of MODELS) {
  const srcBuf = fs.readFileSync(path.join(TMP_DIR, `${m.key}.glb`));
  let finalBuf = srcBuf;
  if (m.texKey) {
    const pngBuf = fs.readFileSync(path.join(TMP_DIR, `${m.texKey}.png`));
    finalBuf = embedTextureInGlb(srcBuf, pngBuf);
  }
  const outPath = path.join(OUT_DIR, `${m.key}.glb`);
  fs.writeFileSync(outPath, finalBuf);
  totalBytes += finalBuf.length;

  // Verify self-contained glTF 2.0 header
  const jl = finalBuf.readUInt32LE(12);
  const g = JSON.parse(finalBuf.slice(20, 20 + jl).toString('utf8'));
  const extUris = (g.images || []).filter((i) => i.uri).length;
  if (extUris > 0) throw new Error(`${m.key}.glb still has ${extUris} external URIs!`);
  console.log(`Packed ${m.key}.glb (${(finalBuf.length / 1024).toFixed(1)} KB, meshes=${(g.meshes || []).length}, extUris=0)`);
}

// Clean up tmp download folder
try { fs.rmSync(TMP_DIR, { recursive: true, force: true }); } catch {}
console.log(`\nSuccessfully packed ${MODELS.length} self-contained CC0 GLB models (${(totalBytes / 1024 / 1024).toFixed(2)} MB total) into assets_src/models_cc0/`);
