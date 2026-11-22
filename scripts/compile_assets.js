const fs = require('fs');
const path = require('path');

const UNZIP = path.join(__dirname, '..', 'raw_assets', 'unzipped');
const OUT_JS = path.join(__dirname, '..', 'src', 'assets_bundle.js');

const cityTexB64 = fs.readFileSync(
  path.join(UNZIP, 'Starter-Kit-City-Builder-main/models/Textures/colormap.png')
).toString('base64');

const raceTexB64 = fs.readFileSync(
  path.join(UNZIP, 'Starter-Kit-Racing-main/models/Textures/colormap.png')
).toString('base64');

const smokeB64 = fs.readFileSync(
  path.join(UNZIP, 'Starter-Kit-Racing-main/sprites/smoke.png')
).toString('base64');

function inlineGlbTexture(glbPath, texBase64) {
  const buf = fs.readFileSync(glbPath);
  const magic = buf.readUInt32LE(0);
  const version = buf.readUInt32LE(4);
  const jsonLen = buf.readUInt32LE(12);
  const jsonType = buf.readUInt32LE(16);
  const jsonObj = JSON.parse(buf.slice(20, 20 + jsonLen).toString('utf8'));

  // Print bounds from accessors of POSITION
  let min = [Infinity, Infinity, Infinity];
  let max = [-Infinity, -Infinity, -Infinity];
  for (const m of jsonObj.meshes || []) {
    for (const prim of m.primitives || []) {
      if (prim.attributes && prim.attributes.POSITION !== undefined) {
        const acc = jsonObj.accessors[prim.attributes.POSITION];
        if (acc.min && acc.max) {
          for (let k = 0; k < 3; k++) {
            min[k] = Math.min(min[k], acc.min[k]);
            max[k] = Math.max(max[k], acc.max[k]);
          }
        }
      }
    }
  }
  console.log(
    path.basename(glbPath),
    'min:', min.map((v) => Number(v.toFixed(2))),
    'max:', max.map((v) => Number(v.toFixed(2))),
    'nodes:', (jsonObj.nodes || []).map((n) => n.name)
  );

  if (jsonObj.images) {
    for (const img of jsonObj.images) {
      if (img.uri && !img.uri.startsWith('data:')) {
        img.uri = `data:image/png;base64,${texBase64}`;
      }
    }
  }

  let newJsonBytes = Buffer.from(JSON.stringify(jsonObj), 'utf8');
  const pad = (4 - (newJsonBytes.length % 4)) % 4;
  if (pad > 0) {
    newJsonBytes = Buffer.concat([newJsonBytes, Buffer.alloc(pad, 0x20)]);
  }

  const binChunk = buf.slice(20 + jsonLen);
  const totalLen = 12 + 8 + newJsonBytes.length + binChunk.length;
  const out = Buffer.alloc(12 + 8);
  out.writeUInt32LE(magic, 0);
  out.writeUInt32LE(version, 4);
  out.writeUInt32LE(totalLen, 8);
  out.writeUInt32LE(newJsonBytes.length, 12);
  out.writeUInt32LE(jsonType, 16);

  return Buffer.concat([out, newJsonBytes, binChunk]).toString('base64');
}

const MODELS = {
  bldg_a: inlineGlbTexture(path.join(UNZIP, 'Starter-Kit-City-Builder-main/models/building-small-a.glb'), cityTexB64),
  bldg_b: inlineGlbTexture(path.join(UNZIP, 'Starter-Kit-City-Builder-main/models/building-small-b.glb'), cityTexB64),
  bldg_c: inlineGlbTexture(path.join(UNZIP, 'Starter-Kit-City-Builder-main/models/building-small-c.glb'), cityTexB64),
  bldg_d: inlineGlbTexture(path.join(UNZIP, 'Starter-Kit-City-Builder-main/models/building-small-d.glb'), cityTexB64),
  bldg_garage: inlineGlbTexture(path.join(UNZIP, 'Starter-Kit-City-Builder-main/models/building-garage.glb'), cityTexB64),
  park_fountain: inlineGlbTexture(path.join(UNZIP, 'Starter-Kit-City-Builder-main/models/pavement-fountain.glb'), cityTexB64),
  trees_a: inlineGlbTexture(path.join(UNZIP, 'Starter-Kit-City-Builder-main/models/grass-trees.glb'), cityTexB64),
  trees_tall: inlineGlbTexture(path.join(UNZIP, 'Starter-Kit-City-Builder-main/models/grass-trees-tall.glb'), cityTexB64),
  car_red: inlineGlbTexture(path.join(UNZIP, 'Starter-Kit-Racing-main/models/vehicle-truck-red.glb'), raceTexB64),
  car_yellow: inlineGlbTexture(path.join(UNZIP, 'Starter-Kit-Racing-main/models/vehicle-truck-yellow.glb'), raceTexB64),
  car_green: inlineGlbTexture(path.join(UNZIP, 'Starter-Kit-Racing-main/models/vehicle-truck-green.glb'), raceTexB64),
  car_purple: inlineGlbTexture(path.join(UNZIP, 'Starter-Kit-Racing-main/models/vehicle-truck-purple.glb'), raceTexB64)
};

let jsOut = `// Auto-generated 100% offline embedded CC0 Kenney 3D GLB assets\n`;
jsOut += `export const SMOKE_PNG_URI = "data:image/png;base64,${smokeB64}";\n`;
jsOut += `export const GLB_ASSETS = ${JSON.stringify(MODELS, null, 2)};\n`;

fs.writeFileSync(OUT_JS, jsOut, 'utf8');
console.log(`Generated src/assets_bundle.js (${(fs.statSync(OUT_JS).size / 1024).toFixed(1)} KB)`);
