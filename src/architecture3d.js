// Flagship v7.5 PBR 3D Architectural Asset Library, Micro-Detail Kits, EV Bus Shelters, True-Proportion Vehicles, CR400 Trains, Hydro Dam, Aircraft, Ships & Sky Dome
// Supports full Albedo + Normal + Roughness PBR channels (via globalThis.__ASSET_MGR / applyLoadedPBRTextures) with offline DataURI fallback.

import { FACADE_TEXTURES } from './facade_textures.js';

function hash2(x, y, seed = 1337) {
  let n = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(seed | 0, 1442695041);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}

function mergeParts(THREE, parts) {
  const positions = [];
  const normals = [];
  const uvs = [];
  const m4 = new THREE.Matrix4();
  const n3 = new THREE.Matrix3();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const posV = new THREE.Vector3();
  const sclV = new THREE.Vector3();
  const v = new THREE.Vector3();

  for (const p of parts) {
    const src = p.geo;
    const g = src.index ? src.toNonIndexed() : src;
    e.set(p.rx || 0, p.ry || 0, p.rz || 0, 'XYZ');
    q.setFromEuler(e);
    posV.set(p.px || 0, p.py || 0, p.pz || 0);
    sclV.set(p.sx ?? 1, p.sy ?? 1, p.sz ?? 1);
    m4.compose(posV, q, sclV);
    n3.getNormalMatrix(m4);

    const posAttr = g.getAttribute('position');
    const normAttr = g.getAttribute('normal');
    const uvAttr = g.getAttribute('uv');
    const count = posAttr.count;

    for (let i = 0; i < count; i++) {
      v.fromBufferAttribute(posAttr, i).applyMatrix4(m4);
      positions.push(v.x, v.y, v.z);

      if (normAttr) {
        v.fromBufferAttribute(normAttr, i).applyMatrix3(n3).normalize();
        normals.push(v.x, v.y, v.z);
      } else {
        normals.push(0, 1, 0);
      }

      if (uvAttr) {
        uvs.push(uvAttr.getX(i), uvAttr.getY(i));
      } else {
        uvs.push(0, 0);
      }
    }
    if (src.index) g.dispose();
  }

  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  out.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  out.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  return out;
}

// Helper: Extrude a 2D automotive side profile (x = +Z forward, y = +Y up) centered on X width
function buildSideProfileGeo(THREE, pts, totalWidth, bevel = 0.008) {
  const sh = new THREE.Shape();
  sh.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) {
    const pt = pts[i];
    if (pt.length === 4) {
      sh.quadraticCurveTo(pt[0], pt[1], pt[2], pt[3]);
    } else {
      sh.lineTo(pt[0], pt[1]);
    }
  }
  sh.closePath();
  const depth = Math.max(0.01, totalWidth - bevel * 2);
  const g = new THREE.ExtrudeGeometry(sh, {
    depth,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel * 0.85,
    bevelSegments: 2
  });
  g.translate(0, 0, -depth * 0.5);
  g.rotateY(-Math.PI * 0.5);
  return g;
}

// Lofted Streamlined Parabolic Nose Geometry for CR400 "Fuxing" Bullet Train (facing +Z, rail-head at y=0)
function buildCR400NoseGeometry(THREE) {
  const stations = [
    { z: 0.040, rx: 0.104, yBot: 0.022, yTop: 0.240 },
    { z: 0.105, rx: 0.101, yBot: 0.023, yTop: 0.228 },
    { z: 0.170, rx: 0.092, yBot: 0.025, yTop: 0.198 },
    { z: 0.235, rx: 0.076, yBot: 0.028, yTop: 0.158 },
    { z: 0.290, rx: 0.055, yBot: 0.033, yTop: 0.118 },
    { z: 0.332, rx: 0.032, yBot: 0.042, yTop: 0.088 },
    { z: 0.355, rx: 0.012, yBot: 0.052, yTop: 0.068 }
  ];

  const N = 14;
  const ringPts = stations.map((st) => {
    const cy = (st.yBot + st.yTop) * 0.5;
    const ry = (st.yTop - st.yBot) * 0.5;
    const pts = [];
    for (let k = 0; k < N; k++) {
      const a = (k * Math.PI * 2) / N;
      const sx = -Math.sin(a);
      const ca = Math.cos(a);
      const yShape = ca < 0 ? Math.pow(-ca, 0.78) * -1 : Math.pow(ca, 0.88);
      const xShape = Math.sign(sx) * Math.pow(Math.abs(sx), 0.88);
      pts.push([xShape * st.rx, cy + yShape * ry, st.z]);
    }
    return pts;
  });

  const positions = [];
  const uvs = [];
  const pushTri = (a, b, c) => {
    positions.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]);
    uvs.push(0, 0, 1, 0, 0.5, 1);
  };

  for (let s = 0; s < stations.length - 1; s++) {
    const r0 = ringPts[s];
    const r1 = ringPts[s + 1];
    for (let k = 0; k < N; k++) {
      const kn = (k + 1) % N;
      pushTri(r0[k], r1[k], r1[kn]);
      pushTri(r0[k], r1[kn], r0[kn]);
    }
  }

  const lastRing = ringPts[stations.length - 1];
  const tip = [0, 0.060, 0.362];
  for (let k = 0; k < N; k++) {
    const kn = (k + 1) % N;
    pushTri(lastRing[k], tip, lastRing[kn]);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.computeVertexNormals();
  return geo;
}

// ==================== World-Space Full PBR (Albedo + Normal + Roughness), Vertical AO, Glass Sky Fresnel & Multi-Tone Night Shader Patch ====================

function applyWorldFacadePatch(mat, opts) {
  const {
    cacheKey,
    tileW = 0.64,
    tileH = 0.60,
    roofTex = null,
    roofNormTex = null,
    roofRoughTex = null,
    roofScale = 0.72,
    nightMode = 0,
    cellsX = 4.0,
    cellsY = 4.0,
    planarOnly = false,
    nightUniform = null
  } = opts;

  const fTileW = Number(tileW).toFixed(4);
  const fTileH = Number(tileH).toFixed(4);
  const fRoofS = Number(roofScale).toFixed(4);
  const iNightMode = nightMode | 0;
  const iPlanar = planarOnly ? 1 : 0;

  // Shared mutable uniform holders so applyLoadedPBRTextures() & setNightFactor() hot-update without rebuilding meshes!
  const pbrUniforms = {
    uArchRoofMap: { value: roofTex || mat.map },
    uArchRoofNormMap: { value: roofNormTex },
    uArchRoofRoughMap: { value: roofRoughTex },
    uArchNight: nightUniform || { value: 0.0 },
    uArchCellsX: { value: Number(cellsX) },
    uArchCellsY: { value: Number(cellsY) }
  };

  const patchFn = (shader) => {
    shader.uniforms.uArchRoofMap = pbrUniforms.uArchRoofMap;
    shader.uniforms.uArchRoofNormMap = pbrUniforms.uArchRoofNormMap;
    shader.uniforms.uArchRoofRoughMap = pbrUniforms.uArchRoofRoughMap;
    shader.uniforms.uArchNight = pbrUniforms.uArchNight;
    shader.uniforms.uArchCellsX = pbrUniforms.uArchCellsX;
    shader.uniforms.uArchCellsY = pbrUniforms.uArchCellsY;

    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
varying vec3 vArchWorldPos;
varying vec3 vArchWorldNorm;
varying vec3 vArchBasePos;
varying float vArchLocalY;
varying float vArchMeshH;`
      )
      .replace(
        '#include <project_vertex>',
        `#include <project_vertex>
vArchWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
vec3 archCol0 = modelMatrix[0].xyz;
vec3 archCol1 = modelMatrix[1].xyz;
vec3 archCol2 = modelMatrix[2].xyz;
vArchWorldNorm = normalize(
  archCol0 * (objectNormal.x / max(1e-6, dot(archCol0, archCol0))) +
  archCol1 * (objectNormal.y / max(1e-6, dot(archCol1, archCol1))) +
  archCol2 * (objectNormal.z / max(1e-6, dot(archCol2, archCol2)))
);
vArchBasePos = (modelMatrix * vec4(0.0, -0.5, 0.0, 1.0)).xyz;
float archTopWorldY = (modelMatrix * vec4(0.0, 0.5, 0.0, 1.0)).y;
vArchLocalY = vArchWorldPos.y - vArchBasePos.y;
vArchMeshH = max(0.05, archTopWorldY - vArchBasePos.y);`
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
uniform sampler2D uArchRoofMap;
uniform sampler2D uArchRoofNormMap;
uniform sampler2D uArchRoofRoughMap;
uniform float uArchNight;
uniform float uArchCellsX;
uniform float uArchCellsY;
varying vec3 vArchWorldPos;
varying vec3 vArchWorldNorm;
varying vec3 vArchBasePos;
varying float vArchLocalY;
varying float vArchMeshH;`
      )
      .replace(
        '#include <map_fragment>',
        `vec3 archN = normalize(vArchWorldNorm);
bool archIsRoof = (${iPlanar} == 1) || (abs(archN.y) >= 0.5);
float archLocalYClamped = max(0.0, vArchLocalY);
vec2 archWallUV = vec2(
  ((abs(archN.x) > abs(archN.z) ? (vArchWorldPos.z - vArchBasePos.z) : (vArchWorldPos.x - vArchBasePos.x)) / ${fTileW}) + 0.5,
  archLocalYClamped / ${fTileH}
);
vec2 archRoofUV = vArchWorldPos.xz / ${fRoofS};
vec2 archActiveUV = archIsRoof ? archRoofUV : archWallUV;
vec4 archTexel = vec4(1.0);
#ifdef USE_MAP
  vec4 archWallSample = texture2D(map, archWallUV);
  vec4 archRoofSample = texture2D(uArchRoofMap, archRoofUV);
  archTexel = archIsRoof ? archRoofSample : archWallSample;
  diffuseColor *= archTexel;
#endif`
      )
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>
float archHeightRatio = clamp(archLocalYClamped / max(0.24, vArchMeshH), 0.0, 1.0);
if (!archIsRoof) {
  float archGroundAO = mix(0.79, 1.0, smoothstep(0.0, 0.42, archLocalYClamped));
  float archUpperSun = mix(1.0, 1.06, smoothstep(0.45, 1.0, archHeightRatio) * smoothstep(0.35, 1.20, vArchMeshH));
  float archCorniceLift = mix(1.0, 1.05, smoothstep(0.86, 1.0, archHeightRatio));
  diffuseColor.rgb *= archGroundAO * archUpperSun * archCorniceLift;
} else {
  float archRoofLift = mix(1.0, 1.045, smoothstep(0.12, 0.45, vArchMeshH));
  diffuseColor.rgb *= archRoofLift;
}`
      )
      .replace(
        '#include <roughnessmap_fragment>',
        `float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
  vec4 archRoughWall = texture2D(roughnessMap, archWallUV);
  vec4 archRoughRoof = texture2D(uArchRoofRoughMap, archRoofUV);
  vec4 texelRoughness = archIsRoof ? archRoughRoof : archRoughWall;
  roughnessFactor *= texelRoughness.g;
#endif`
      )
      .replace(
        '#include <normal_fragment_maps>',
        `#ifdef USE_NORMALMAP_OBJECTSPACE
  normal = texture2D(normalMap, archActiveUV).xyz * 2.0 - 1.0;
  #ifdef FLIP_SIDED
    normal = -normal;
  #endif
  #ifdef DOUBLE_SIDED
    normal = normal * faceDirection;
  #endif
  normal = normalize(normalMatrix * normal);
#elif defined(USE_NORMALMAP_TANGENTSPACE)
  vec3 archNormWall = texture2D(normalMap, archWallUV).xyz * 2.0 - 1.0;
  vec3 archNormRoof = texture2D(uArchRoofNormMap, archRoofUV).xyz * 2.0 - 1.0;
  vec3 mapN = archIsRoof ? archNormRoof : archNormWall;
  mapN.xy *= normalScale;
  mat3 archTbn = getTangentFrame(-vViewPosition, nonPerturbedNormal, archActiveUV);
  #if defined(DOUBLE_SIDED) && !defined(FLAT_SHADED)
    archTbn[0] *= faceDirection;
    archTbn[1] *= faceDirection;
  #endif
  normal = normalize(archTbn * mapN);
#elif defined(USE_BUMPMAP)
  normal = perturbNormalArb(-vViewPosition, normal, dHdxy_fwd(), faceDirection);
#endif`
      )
      .replace(
        '#include <emissivemap_fragment>',
        `float archNight = totalEmissiveRadiance.r;
totalEmissiveRadiance = vec3(0.0);
vec3 archFresnelSkySpec = vec3(0.0);
#if ${iNightMode} > 0
  if (!archIsRoof) {
    vec2 archCellScaled = archActiveUV * vec2(uArchCellsX, uArchCellsY);
    vec2 winCell = floor(archCellScaled);
    vec2 archCellFrac = fract(archCellScaled);

    float bldgSeed = floor(vArchBasePos.x * 3.17 + 0.5) * 19.3 + floor(vArchBasePos.z * 3.17 + 0.5) * 47.9;
    float faceSeed = abs(archN.x) > abs(archN.z) ? (archN.x > 0.0 ? 11.0 : 23.0) : (archN.z > 0.0 ? 37.0 : 53.0);
    float winHash = fract(sin(dot(winCell + vec2(bldgSeed, faceSeed), vec2(127.1, 311.7))) * 43758.5453);
    float winHash2 = fract(winHash * 17.37 + 0.23);
    float winHash3 = fract(winHash * 43.19 + 0.71);

    // Per-window glossy glass sky Fresnel glint & subtle interior depth variation
    if (roughnessFactor < 0.36) {
      float archGlassAmt = smoothstep(0.36, 0.14, roughnessFactor);
      vec3 archPaneTint = winHash2 < 0.34
        ? vec3(0.94, 0.99, 1.06)
        : (winHash2 > 0.68 ? vec3(1.06, 1.01, 0.94) : vec3(0.96, 0.98, 1.01));
      float archInteriorDepth = mix(0.94, 1.06, winHash3);
      float archBlindShade = mix(0.95, 1.04, smoothstep(0.28, 0.76, archCellFrac.y));
      diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * archPaneTint * archInteriorDepth * archBlindShade, archGlassAmt);

      float fres = pow(max(0.0001, 1.0 - clamp(abs(dot(normalize(normal), normalize(vViewPosition))), 0.0, 1.0)), 2.8);
      vec3 archSkyCol = vec3(0.55, 0.78, 1.0) * (1.0 - uArchNight * 0.72);
      diffuseColor.rgb = mix(diffuseColor.rgb, archSkyCol, fres * archGlassAmt * 0.20);
      archFresnelSkySpec = archSkyCol * fres * archGlassAmt * 0.38;
    }

    // Multi-tone realistic nighttime interior lighting + mechanical refuge bands + warm ground storefronts
    #ifdef USE_MAP
      if (archNight > 0.005) {
        vec3 srgbTex = sqrt(max(vec3(0.0), archTexel.rgb));
        float sLum = dot(srgbTex, vec3(0.299, 0.587, 0.114));
        float glassMask = 0.0;

        #if ${iNightMode} == 1
          float inResPane = step(0.09, archCellFrac.x) * step(archCellFrac.x, 0.91) * step(0.28, archCellFrac.y) * step(archCellFrac.y, 0.90);
          float darkPane = smoothstep(0.73, 0.52, sLum) * smoothstep(0.18, 0.28, sLum);
          float coolPane = smoothstep(-0.01, 0.03, srgbTex.b - srgbTex.r) * smoothstep(0.80, 0.56, sLum);
          glassMask = inResPane * max(darkPane, coolPane);
        #elif ${iNightMode} == 2
          float inVision = step(0.05, archCellFrac.x) * step(archCellFrac.x, 0.95) * step(0.20, archCellFrac.y) * step(archCellFrac.y, 0.84);
          glassMask = inVision * smoothstep(0.01, 0.06, srgbTex.b - srgbTex.r * 0.94) * smoothstep(0.74, 0.55, sLum) * smoothstep(0.16, 0.26, sLum);
        #elif ${iNightMode} == 3
          float inStoneWin = step(0.15, archCellFrac.x) * step(archCellFrac.x, 0.85) * step(0.10, archCellFrac.y) * step(archCellFrac.y, 0.88);
          glassMask = inStoneWin * smoothstep(0.58, 0.40, sLum) * smoothstep(0.14, 0.23, sLum);
        #elif ${iNightMode} == 4
          float inShop = step(0.06, archCellFrac.x) * step(archCellFrac.x, 0.94) * step(0.03, archCellFrac.y) * step(archCellFrac.y, 0.62);
          glassMask = inShop * smoothstep(0.20, 0.30, sLum) * smoothstep(0.86, 0.64, sLum);
        #elif ${iNightMode} == 5
          float inVilla = step(0.16, archCellFrac.x) * step(archCellFrac.x, 0.84) * step(0.16, archCellFrac.y) * step(archCellFrac.y, 0.82);
          glassMask = inVilla * smoothstep(0.52, 0.34, sLum);
        #elif ${iNightMode} == 6
          float vBand = fract(archWallUV.y);
          float inClere = step(0.75, vBand) * step(vBand, 0.89);
          glassMask = inClere * smoothstep(0.68, 0.48, sLum) * smoothstep(0.22, 0.32, sLum);
        #endif

        float isRefugeBand = 0.0;
        #if ${iNightMode} == 1 || ${iNightMode} == 2 || ${iNightMode} == 3
          if (vArchMeshH > 1.05 && archLocalYClamped > 0.62) {
            isRefugeBand = step(abs(mod(floor(archLocalYClamped / 0.14), 7.0) - 5.0), 0.25);
          }
        #endif

        float isGroundLobby = (${iNightMode} == 6) ? 0.0 : (1.0 - smoothstep(0.15, 0.19, archLocalYClamped));
        float baseProb = (${iNightMode} == 4) ? 0.78 : ((${iNightMode} == 2 || ${iNightMode} == 3) ? 0.50 : 0.46);
        float litProb = mix(baseProb, 0.90, isGroundLobby);
        float isLit = step(1.0 - litProb, winHash) * (1.0 - isRefugeBand);

        vec3 col2700K = vec3(1.0, 0.76, 0.42);
        vec3 col3400K = vec3(1.0, 0.84, 0.55);
        vec3 col4800K = vec3(0.86, 0.93, 1.0);
        vec3 colCyan = vec3(0.45, 0.85, 1.0);

        vec3 toneCol = col2700K;
        #if ${iNightMode} == 2 || ${iNightMode} == 3
          if (winHash2 < 0.18) toneCol = col2700K;
          else if (winHash2 < 0.40) toneCol = col3400K;
          else if (winHash2 < 0.91) toneCol = col4800K;
          else toneCol = colCyan;
        #elif ${iNightMode} == 4
          if (winHash2 < 0.24) toneCol = col2700K;
          else if (winHash2 < 0.78) toneCol = col3400K;
          else if (winHash2 < 0.94) toneCol = col4800K;
          else toneCol = colCyan;
        #elif ${iNightMode} == 6
          if (winHash2 < 0.15) toneCol = col2700K;
          else if (winHash2 < 0.40) toneCol = col3400K;
          else if (winHash2 < 0.92) toneCol = col4800K;
          else toneCol = colCyan;
        #else
          if (winHash2 < 0.58) toneCol = col2700K;
          else if (winHash2 < 0.84) toneCol = col3400K;
          else if (winHash2 < 0.96) toneCol = col4800K;
          else toneCol = colCyan;
        #endif

        vec3 lobbyTone = mix(col2700K, col3400K, winHash3);
        toneCol = mix(toneCol, lobbyTone, isGroundLobby * 0.85);
        float lobbyBoost = mix(1.0, (${iNightMode} == 4) ? 1.30 : 1.18, isGroundLobby);
        float paneGrad = mix(0.86, 1.14, smoothstep(0.15, 0.88, archCellFrac.y));
        vec3 winRadiance = toneCol * (0.76 + 0.44 * winHash3) * lobbyBoost * paneGrad;

        totalEmissiveRadiance = winRadiance * glassMask * isLit * archNight;
      }
    #endif
  }
#endif`
      )
      .replace(
        '#include <lights_fragment_end>',
        `#include <lights_fragment_end>
reflectedLight.indirectSpecular += archFresnelSkySpec;`
      );
  };

  const cacheKeyFn = function () {
    return cacheKey + '_v75' + (this.normalMap ? '_N' : '') + (this.roughnessMap ? '_R' : '');
  };
  const protoClone = Object.getPrototypeOf(mat).clone;
  const cloneFn = function () {
    const cloned = protoClone.call(this);
    cloned.onBeforeCompile = patchFn;
    cloned.customProgramCacheKey = cacheKeyFn;
    cloned._pbrUniforms = pbrUniforms;
    cloned.clone = cloneFn;
    return cloned;
  };

  mat.userData = mat.userData || {};
  mat.userData.facadePatch = true;
  mat.userData.facadePatchOpts = {
    cacheKey, tileW, tileH, roofScale, nightMode: iNightMode, cellsX, cellsY, planarOnly: Boolean(planarOnly)
  };
  mat._pbrUniforms = pbrUniforms;
  mat.onBeforeCompile = patchFn;
  mat.customProgramCacheKey = cacheKeyFn;
  mat.clone = cloneFn;
  return mat;
}

// ==================== Special Procedural Decal & AO Canvas Textures ====================

function createSolidLinearTexture(THREE, cssColor) {
  const c = document.createElement('canvas');
  c.width = 4;
  c.height = 4;
  const g = c.getContext('2d');
  g.fillStyle = cssColor;
  g.fillRect(0, 0, 4, 4);
  const tex = new THREE.CanvasTexture(c);
  if ('NoColorSpace' in THREE) tex.colorSpace = THREE.NoColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

function createContactAOTexture(THREE) {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 128;
  const g = c.getContext('2d');

  const grad = g.createRadialGradient(64, 64, 14, 64, 64, 63);
  grad.addColorStop(0.0, 'rgba(9, 13, 20, 0.58)');
  grad.addColorStop(0.58, 'rgba(9, 13, 20, 0.34)');
  grad.addColorStop(0.84, 'rgba(9, 13, 20, 0.12)');
  grad.addColorStop(1.0, 'rgba(9, 13, 20, 0.0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createHelipadTexture(THREE) {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const g = c.getContext('2d');

  g.fillStyle = '#525b66';
  g.fillRect(0, 0, 256, 256);

  g.strokeStyle = 'rgba(203, 213, 225, 0.42)';
  g.lineWidth = 6;
  g.strokeRect(14, 14, 228, 228);

  g.strokeStyle = 'rgba(241, 245, 249, 0.78)';
  g.lineWidth = 8;
  g.beginPath();
  g.arc(128, 128, 82, 0, Math.PI * 2);
  g.stroke();

  g.fillStyle = 'rgba(248, 250, 252, 0.86)';
  g.fillRect(90, 78, 16, 100);
  g.fillRect(150, 78, 16, 100);
  g.fillRect(90, 120, 76, 16);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function createSoccerPitchTexture(THREE) {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const g = c.getContext('2d');

  const stripes = 10;
  const sw = 256 / stripes;
  for (let i = 0; i < stripes; i++) {
    g.fillStyle = i % 2 === 0 ? '#229944' : '#2cb452';
    g.fillRect(i * sw, 0, sw + 1, 256);
  }

  g.strokeStyle = '#b85038';
  g.lineWidth = 22;
  g.strokeRect(6, 6, 244, 244);

  g.strokeStyle = '#f8fafc';
  g.lineWidth = 4;
  g.strokeRect(26, 38, 204, 180);

  g.beginPath();
  g.moveTo(128, 38);
  g.lineTo(128, 218);
  g.stroke();

  g.beginPath();
  g.arc(128, 128, 28, 0, Math.PI * 2);
  g.stroke();

  g.strokeRect(26, 82, 34, 92);
  g.strokeRect(196, 82, 34, 92);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function createSolarMirrorTexture(THREE) {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 128;
  const g = c.getContext('2d');

  const grad = g.createLinearGradient(0, 0, 128, 128);
  grad.addColorStop(0, '#174ea6');
  grad.addColorStop(0.5, '#2563eb');
  grad.addColorStop(1, '#1e3a8a');
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);

  g.strokeStyle = 'rgba(226, 238, 255, 0.68)';
  g.lineWidth = 2;
  for (let i = 0; i <= 128; i += 32) {
    g.beginPath();
    g.moveTo(i, 0); g.lineTo(i, 128);
    g.moveTo(0, i); g.lineTo(128, i);
    g.stroke();
  }
  g.strokeStyle = '#e2e8f0';
  g.lineWidth = 5;
  g.strokeRect(2, 2, 124, 124);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

function createContainerRibsTexture(THREE) {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 64;
  const g = c.getContext('2d');

  g.fillStyle = '#e5e7eb';
  g.fillRect(0, 0, 128, 64);

  for (let x = 6; x < 122; x += 8) {
    g.fillStyle = '#b4bcc8';
    g.fillRect(x, 5, 4, 54);
    g.fillStyle = '#ffffff';
    g.fillRect(x + 4, 5, 2, 54);
  }
  g.fillStyle = '#9ca3af';
  g.fillRect(0, 0, 128, 5);
  g.fillRect(0, 59, 128, 5);
  g.fillStyle = '#f8fafc';
  g.fillRect(92, 14, 22, 8);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

function createRunwayTexture(THREE) {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 1024;
  const g = c.getContext('2d');

  // Rich weathered airport asphalt base
  g.fillStyle = '#242932';
  g.fillRect(0, 0, 256, 1024);

  // Subtle darker rubber-textured runway center crown & touchdown skid marks
  g.fillStyle = '#1b1f27';
  g.fillRect(44, 72, 168, 880);
  const skidGradTop = g.createLinearGradient(0, 145, 0, 320);
  skidGradTop.addColorStop(0, 'rgba(10,12,16,0.0)');
  skidGradTop.addColorStop(0.35, 'rgba(10,12,16,0.52)');
  skidGradTop.addColorStop(1, 'rgba(10,12,16,0.0)');
  g.fillStyle = skidGradTop;
  g.fillRect(72, 145, 112, 175);
  const skidGradBot = g.createLinearGradient(0, 704, 0, 879);
  skidGradBot.addColorStop(0, 'rgba(10,12,16,0.0)');
  skidGradBot.addColorStop(0.65, 'rgba(10,12,16,0.52)');
  skidGradBot.addColorStop(1, 'rgba(10,12,16,0.0)');
  g.fillStyle = skidGradBot;
  g.fillRect(72, 704, 112, 175);

  // Crisp white runway edge lines
  g.fillStyle = '#f1f5f9';
  g.fillRect(14, 0, 8, 1024);
  g.fillRect(234, 0, 8, 1024);

  // Threshold piano-key bars at both ends
  for (let x = 32; x <= 212; x += 22) {
    if (Math.abs(x - 122) < 16) continue;
    g.fillRect(x, 22, 12, 72);
    g.fillRect(x, 930, 12, 72);
  }

  // Runway designation numbers ("09" / "27")
  g.save();
  g.fillStyle = '#f8fafc';
  g.font = 'bold 42px sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText('09', 128, 134);
  g.translate(128, 890);
  g.rotate(Math.PI);
  g.fillText('27', 0, 0);
  g.restore();

  // Fixed-distance aiming point blocks + touchdown zone bars
  g.fillStyle = '#f1f5f9';
  g.fillRect(46, 188, 28, 84);
  g.fillRect(182, 188, 28, 84);
  g.fillRect(46, 752, 28, 84);
  g.fillRect(182, 752, 28, 84);

  g.fillRect(62, 304, 16, 46);
  g.fillRect(178, 304, 16, 46);
  g.fillRect(62, 674, 16, 46);
  g.fillRect(178, 674, 16, 46);

  // High-visibility centerline dashes
  for (let y = 176; y < 840; y += 64) {
    g.fillRect(122, y, 12, 36);
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function createPoolTexture(THREE) {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 128;
  const g = c.getContext('2d');

  const grad = g.createRadialGradient(64, 64, 8, 64, 64, 82);
  grad.addColorStop(0, '#38e8ff');
  grad.addColorStop(0.7, '#0ea5e9');
  grad.addColorStop(1, '#0284c7');
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);

  g.strokeStyle = 'rgba(255, 255, 255, 0.42)';
  g.lineWidth = 2.5;
  for (let i = 18; i < 110; i += 22) {
    g.beginPath();
    g.arc(i, 42 + (i % 3) * 18, 14, 0, Math.PI * 1.4);
    g.stroke();
  }
  g.strokeStyle = '#f8fafc';
  g.lineWidth = 8;
  g.strokeRect(3, 3, 122, 122);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createBusStopDisplayTexture(THREE) {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 192;
  const g = c.getContext('2d');
  if (g) {
    g.fillStyle = '#071527';
    g.fillRect(0, 0, 128, 192);

    // Top bright cyan EV transit header bar
    g.fillStyle = '#0ea5e9';
    g.fillRect(6, 6, 116, 26);
    g.fillStyle = '#e0f2fe';
    g.fillRect(14, 14, 62, 10);
    g.fillStyle = '#38bdf8';
    g.fillRect(86, 14, 28, 10);

    // Live route rows (E1, B8, M2) with glowing ETA pills
    const rows = [
      { y: 44, badge: '#06b6d4', eta: '#4ade80' },
      { y: 82, badge: '#0ea5e9', eta: '#fbbf24' },
      { y: 120, badge: '#38bdf8', eta: '#4ade80' }
    ];
    for (const r of rows) {
      g.fillStyle = '#0f2540';
      g.fillRect(8, r.y, 112, 28);
      g.fillStyle = r.badge;
      g.fillRect(12, r.y + 5, 24, 18);
      g.fillStyle = '#cbd5e1';
      g.fillRect(42, r.y + 8, 42, 5);
      g.fillStyle = '#64748b';
      g.fillRect(42, r.y + 17, 32, 4);
      g.fillStyle = r.eta;
      g.fillRect(92, r.y + 7, 22, 14);
    }

    // Bottom horizontal transit route diagram line + stop nodes
    g.fillStyle = '#0284c7';
    g.fillRect(14, 166, 100, 4);
    for (let x = 18; x <= 110; x += 23) {
      g.fillStyle = x === 41 ? '#fde047' : '#7dd3fc';
      g.fillRect(x - 4, 163, 8, 10);
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createBusSignTexture(THREE) {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 64;
  const g = c.getContext('2d');
  if (g) {
    g.fillStyle = '#0284c7';
    g.fillRect(0, 0, 64, 64);
    g.strokeStyle = '#e0f2fe';
    g.lineWidth = 4;
    g.strokeRect(4, 4, 56, 56);
    // Bold white EV transit bus icon silhouette
    g.fillStyle = '#f8fafc';
    g.fillRect(14, 14, 36, 28);
    g.fillStyle = '#0369a1';
    g.fillRect(18, 18, 28, 12);
    g.fillStyle = '#38bdf8';
    g.fillRect(18, 34, 8, 5);
    g.fillRect(38, 34, 8, 5);
    g.fillStyle = '#f8fafc';
    g.fillRect(18, 42, 6, 5);
    g.fillRect(40, 42, 6, 5);
    // Bright cyan EV strip along bottom
    g.fillStyle = '#38bdf8';
    g.fillRect(12, 51, 40, 4);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// ==================== Main ArchitectureLibrary Class ====================

export class ArchitectureLibrary {
  constructor(THREE, glbProtos = {}, mats = {}) {
    this.THREE = THREE || globalThis.THREE;
    this.glbProtos = glbProtos;
    this.baseMats = mats;
    this.emissiveMaterials = [];
    this._pbrBindings = [];
    this._glbAbandonedCache = new WeakMap();
    this._sharedArchUniforms = {
      uArchNight: { value: 0.0 }
    };

    this._initTexturesAndMaterials();
    this._initSculptedGeometries();

    // Seamlessly bind external PBR textures if AssetManager already preloaded them!
    if (globalThis.__ASSET_MGR) {
      this.applyLoadedPBRTextures(globalThis.__ASSET_MGR);
    }
  }

  _configureTexture(tex, isColor = true) {
    if (!tex) return null;
    const THREE = this.THREE;
    tex.colorSpace = isColor ? THREE.SRGBColorSpace : (THREE.NoColorSpace ?? '');
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.anisotropy = 8;
    tex.generateMipmaps = true;
    if (THREE.LinearMipmapLinearFilter) tex.minFilter = THREE.LinearMipmapLinearFilter;
    if (THREE.LinearFilter) tex.magFilter = THREE.LinearFilter;
    return tex;
  }

  _loadPhotoTexture(loader, uri) {
    const THREE = this.THREE;
    let tex;
    if (loader && uri) {
      tex = loader.load(uri);
    } else if (THREE.CanvasTexture) {
      const c = document.createElement('canvas');
      c.width = c.height = 4;
      tex = new THREE.CanvasTexture(c);
    } else {
      tex = {};
    }
    return this._configureTexture(tex, true);
  }

  _resolveAssetEntry(source, key) {
    if (!source || !key) return null;
    if (typeof source.getTexture === 'function') {
      const t = source.getTexture(key);
      if (t) return t;
    }
    if (typeof source.get === 'function') {
      const t = source.get(key);
      if (t) return t;
    }
    if (source.textures) {
      if (typeof source.textures.get === 'function') {
        const t = source.textures.get(key);
        if (t) return t;
      }
      if (source.textures[key]) return source.textures[key];
    }
    return source[key] || null;
  }

  _hasExplicitNullKey(source, key) {
    if (!source || !key) return false;
    if (key in source && source[key] === null) return true;
    if (source.textures && typeof source.textures === 'object' && !(source.textures instanceof Map)) {
      if (key in source.textures && source.textures[key] === null) return true;
    }
    return false;
  }

  // Hot-binds external Albedo + Normal + Roughness PBR textures onto all shared materials with ZERO scene rebuild!
  applyLoadedPBRTextures(texMap) {
    const src = texMap || globalThis.__ASSET_MGR;
    if (!src) return 0;

    const THREE = this.THREE;
    const pbrKeys = [
      'res_beige', 'res_grey', 'office_glass', 'office_stone',
      'retail_podium', 'villa_plaster', 'industrial_panel',
      'roof_concrete', 'paving_plaza', 'roof_solar_green', 'dam_concrete'
    ];

    for (const k of pbrKeys) {
      const entry = this._resolveAssetEntry(src, k);
      const albedo = (entry && entry.isTexture) ? entry : (entry && (entry.map || entry.albedo)) || null;
      const norm = this._resolveAssetEntry(src, `${k}_norm`)
        || this._resolveAssetEntry(src, `${k}_normal`)
        || (entry && !entry.isTexture && (entry.normalMap || entry.norm || entry.normal))
        || null;
      const rough = this._resolveAssetEntry(src, `${k}_rough`)
        || this._resolveAssetEntry(src, `${k}_roughness`)
        || (entry && !entry.isTexture && (entry.roughnessMap || entry.rough || entry.roughness))
        || null;

      if (albedo) this.photoTex[k] = this._configureTexture(albedo, true);
      if (norm) {
        this.normTex[k] = this._configureTexture(norm, false);
      } else if (entry || this._hasExplicitNullKey(src, `${k}_norm`) || this._hasExplicitNullKey(src, `${k}_normal`)) {
        this.normTex[k] = null;
      }
      if (rough) {
        this.roughTex[k] = this._configureTexture(rough, false);
      } else if (entry || this._hasExplicitNullKey(src, `${k}_rough`) || this._hasExplicitNullKey(src, `${k}_roughness`)) {
        this.roughTex[k] = null;
      }
    }

    let updatedCount = 0;
    for (const b of this._pbrBindings) {
      const { mat, wallKey, roofKey, fallbackRough, normalStrength } = b;
      const wMap = this.photoTex[wallKey];
      const wNorm = this.normTex[wallKey] || null;
      const wRough = this.roughTex[wallKey] || null;
      const rMap = this.photoTex[roofKey] || wMap;
      const rNorm = this.normTex[roofKey] || this._flatNormalTex;
      const rRough = this.roughTex[roofKey] || this._neutralRoughTex;

      let changed = false;
      if (wMap && mat.map !== wMap) {
        mat.map = wMap;
        changed = true;
      }
      if (wNorm) {
        if (mat.normalMap !== wNorm) {
          mat.normalMap = wNorm;
          changed = true;
        }
        if (!mat.normalScale || mat.normalScale.x !== normalStrength || mat.normalScale.y !== normalStrength) {
          mat.normalScale = new THREE.Vector2(normalStrength, normalStrength);
        }
      } else if (mat.normalMap) {
        mat.normalMap = null;
        changed = true;
      }
      if (wRough && mat.roughnessMap !== wRough) {
        mat.roughnessMap = wRough;
        mat.roughness = 1.0;
        changed = true;
      } else if (!wRough) {
        if (mat.roughnessMap) {
          mat.roughnessMap = null;
          changed = true;
        }
        mat.roughness = fallbackRough;
      }

      const u = mat._pbrUniforms || (mat.userData && mat.userData.pbrUniforms);
      if (u) {
        if (rMap && u.uArchRoofMap.value !== rMap) { u.uArchRoofMap.value = rMap; changed = true; }
        if (u.uArchRoofNormMap.value !== rNorm) { u.uArchRoofNormMap.value = rNorm; changed = true; }
        if (u.uArchRoofRoughMap.value !== rRough) { u.uArchRoofRoughMap.value = rRough; changed = true; }
      }

      if (changed) {
        mat.needsUpdate = true;
        updatedCount++;
      }
    }
    return updatedCount;
  }

  _initTexturesAndMaterials() {
    const THREE = this.THREE;
    const texSrc = (typeof FACADE_TEXTURES !== 'undefined' && FACADE_TEXTURES) ? FACADE_TEXTURES : {};
    const loader = THREE.TextureLoader ? new THREE.TextureLoader() : null;

    // Neutral linear fallbacks for roof normal/roughness uniforms prior to external PBR load
    this._flatNormalTex = createSolidLinearTexture(THREE, '#8080ff');
    this._neutralRoughTex = createSolidLinearTexture(THREE, '#c8c8c8');

    this.photoTex = {
      res_beige: this._loadPhotoTexture(loader, texSrc.res_beige),
      res_grey: this._loadPhotoTexture(loader, texSrc.res_grey),
      office_glass: this._loadPhotoTexture(loader, texSrc.office_glass),
      office_stone: this._loadPhotoTexture(loader, texSrc.office_stone),
      retail_podium: this._loadPhotoTexture(loader, texSrc.retail_podium),
      villa_plaster: this._loadPhotoTexture(loader, texSrc.villa_plaster),
      industrial_panel: this._loadPhotoTexture(loader, texSrc.industrial_panel),
      roof_concrete: this._loadPhotoTexture(loader, texSrc.roof_concrete),
      paving_plaza: this._loadPhotoTexture(loader, texSrc.paving_plaza),
      roof_solar_green: this._loadPhotoTexture(loader, texSrc.roof_solar_green),
      dam_concrete: this._loadPhotoTexture(loader, texSrc.dam_concrete || texSrc.roof_concrete)
    };
    this.normTex = {};
    this.roughTex = {};

    this.texContactAO = createContactAOTexture(THREE);
    this.texHelipad = createHelipadTexture(THREE);
    this.texPitch = createSoccerPitchTexture(THREE);
    this.texSolar = createSolarMirrorTexture(THREE);
    this.texContainer = createContainerRibsTexture(THREE);
    this.texRunway = createRunwayTexture(THREE);
    this.texPool = createPoolTexture(THREE);
    this.texBusDisplay = createBusStopDisplayTexture(THREE);
    this.texBusSign = createBusSignTexture(THREE);

    const makeWorldFacadeMat = (key, wallKey, roofKey, colorHex, rough, metal, patchCfg, normalStrength = 0.95) => {
      const isLit = (patchCfg.nightMode || 0) > 0;
      const tex = this.photoTex[wallKey];
      const rTex = this.photoTex[roofKey] || tex;
      const m = new THREE.MeshStandardMaterial({
        color: colorHex,
        map: tex,
        emissive: isLit ? 0xffffff : 0x000000,
        emissiveIntensity: 0.0,
        roughness: rough,
        metalness: metal
      });
      applyWorldFacadePatch(m, {
        cacheKey: key,
        roofTex: rTex,
        roofNormTex: this._flatNormalTex,
        roofRoughTex: this._neutralRoughTex,
        nightUniform: this._sharedArchUniforms.uArchNight,
        ...patchCfg
      });
      this._pbrBindings.push({ mat: m, wallKey, roofKey, fallbackRough: rough, normalStrength });
      if (isLit) this.emissiveMaterials.push(m);
      return m;
    };

    const makePlanarMat = (key, texKey, colorHex, rough, metal, scaleXZ, normalStrength = 0.95) => {
      const tex = this.photoTex[texKey];
      const m = new THREE.MeshStandardMaterial({
        color: colorHex,
        map: tex,
        roughness: rough,
        metalness: metal
      });
      applyWorldFacadePatch(m, {
        cacheKey: key,
        tileW: scaleXZ,
        tileH: scaleXZ,
        roofTex: tex,
        roofNormTex: this._flatNormalTex,
        roofRoughTex: this._neutralRoughTex,
        roofScale: scaleXZ,
        nightMode: 0,
        planarOnly: true,
        nightUniform: this._sharedArchUniforms.uArchNight
      });
      this._pbrBindings.push({ mat: m, wallKey: texKey, roofKey: texKey, fallbackRough: rough, normalStrength });
      return m;
    };

    const makeContMat = (hex) => new THREE.MeshStandardMaterial({
      color: hex,
      map: this.texContainer,
      roughness: 0.52,
      metalness: 0.28
    });

    const contactAO = new THREE.MeshBasicMaterial({
      map: this.texContactAO,
      transparent: true,
      opacity: 0.80,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2
    });
    contactAO.userData = { skipGhost: true };

    this.m = {
      contactAO,

      // Top-down world-space granite plaza paving, concrete roof membrane, green roof & gravity dam concrete
      pavingPlaza: makePlanarMat('arch_planar_plaza_v2', 'paving_plaza', 0xffffff, 0.78, 0.05, 0.46, 0.95),
      pavingPlazaDusty: makePlanarMat('arch_planar_plaza_dusty_v2', 'paving_plaza', 0x8e9298, 0.90, 0.03, 0.46, 0.95),
      roofConcrete: makePlanarMat('arch_planar_roof_conc_v2', 'roof_concrete', 0xf1f5f9, 0.84, 0.04, 0.72, 0.95),
      roofGreen: makePlanarMat('arch_planar_roof_green_v2', 'roof_solar_green', 0xffffff, 0.82, 0.04, 0.78, 0.95),
      damConcrete: makeWorldFacadeMat('arch_fac_dam_conc_v2', 'dam_concrete', 'roof_concrete', 0xd8dee6, 0.80, 0.06, {
        tileW: 0.85, tileH: 0.85, roofScale: 0.75, nightMode: 0, cellsX: 2, cellsY: 2
      }, 1.10),

      // Contemporary Grade-A Office & Commercial Curtain-Wall Facades (CH & O) — crisp 1.10 mullion relief
      cbdIceBlue: makeWorldFacadeMat('arch_fac_off_glass_ice_v2', 'office_glass', 'roof_concrete', 0xdceeff, 0.18, 0.38, {
        tileW: 0.64, tileH: 0.68, roofScale: 0.72, nightMode: 2, cellsX: 4, cellsY: 4
      }, 1.10),
      cbdSlateSilver: makeWorldFacadeMat('arch_fac_off_glass_sil_v2', 'office_glass', 'roof_concrete', 0xf1f5f9, 0.17, 0.42, {
        tileW: 0.64, tileH: 0.68, roofScale: 0.72, nightMode: 2, cellsX: 4, cellsY: 4
      }, 1.10),
      cbdDeepAzure: makeWorldFacadeMat('arch_fac_off_glass_az_v2', 'office_glass', 'roof_concrete', 0xbcd8f4, 0.19, 0.38, {
        tileW: 0.64, tileH: 0.68, roofScale: 0.72, nightMode: 2, cellsX: 4, cellsY: 4
      }, 1.10),
      cbdTealGlass: makeWorldFacadeMat('arch_fac_off_glass_tl_v2', 'office_glass', 'roof_concrete', 0xc4edea, 0.18, 0.36, {
        tileW: 0.64, tileH: 0.68, roofScale: 0.72, nightMode: 2, cellsX: 4, cellsY: 4
      }, 1.10),
      finStoneChampagne: makeWorldFacadeMat('arch_fac_off_stone_ch_v2', 'office_stone', 'roof_concrete', 0xfbf6ee, 0.52, 0.12, {
        tileW: 0.64, tileH: 0.68, roofScale: 0.72, nightMode: 3, cellsX: 4, cellsY: 4
      }, 0.95),
      finStoneSilver: makeWorldFacadeMat('arch_fac_off_stone_sl_v2', 'office_stone', 'roof_concrete', 0xe8eef5, 0.48, 0.16, {
        tileW: 0.64, tileH: 0.68, roofScale: 0.72, nightMode: 3, cellsX: 4, cellsY: 4
      }, 0.95),

      // Ground-Floor Luxury Retail Shopfront Podium (CL, RH, CH, O podiums)
      retailPodium: makeWorldFacadeMat('arch_fac_retail_pod_v2', 'retail_podium', 'roof_solar_green', 0xffffff, 0.38, 0.18, {
        tileW: 0.72, tileH: 0.36, roofScale: 0.78, nightMode: 4, cellsX: 4, cellsY: 1
      }, 0.95),
      retailPodiumConc: makeWorldFacadeMat('arch_fac_retail_podc_v2', 'retail_podium', 'roof_concrete', 0xf8fafc, 0.38, 0.18, {
        tileW: 0.72, tileH: 0.36, roofScale: 0.72, nightMode: 4, cellsX: 4, cellsY: 1
      }, 0.95),

      // Contemporary Chinese High-Rise Residential Facades (RH: res_beige & res_grey)
      condoWarmWhite: makeWorldFacadeMat('arch_fac_res_beige_w_v2', 'res_beige', 'roof_concrete', 0xffffff, 0.62, 0.06, {
        tileW: 0.64, tileH: 0.60, roofScale: 0.72, nightMode: 1, cellsX: 4, cellsY: 4
      }, 0.95),
      condoChampagne: makeWorldFacadeMat('arch_fac_res_beige_c_v2', 'res_beige', 'roof_concrete', 0xf5eadc, 0.64, 0.06, {
        tileW: 0.64, tileH: 0.60, roofScale: 0.72, nightMode: 1, cellsX: 4, cellsY: 4
      }, 0.95),
      condoWarmGrey: makeWorldFacadeMat('arch_fac_res_grey_g_v2', 'res_grey', 'roof_concrete', 0xf8fafc, 0.58, 0.08, {
        tileW: 0.64, tileH: 0.60, roofScale: 0.72, nightMode: 1, cellsX: 4, cellsY: 4
      }, 0.95),
      condoSandStone: makeWorldFacadeMat('arch_fac_res_grey_s_v2', 'res_grey', 'roof_concrete', 0xeee8df, 0.60, 0.08, {
        tileW: 0.64, tileH: 0.60, roofScale: 0.72, nightMode: 1, cellsX: 4, cellsY: 4
      }, 0.95),

      // Low-Density Villa / Townhouse Cream Plaster Facades (RL)
      villaCream: makeWorldFacadeMat('arch_fac_villa_cr_v2', 'villa_plaster', 'roof_concrete', 0xffffff, 0.72, 0.04, {
        tileW: 0.44, tileH: 0.34, roofScale: 0.64, nightMode: 5, cellsX: 2, cellsY: 2
      }, 0.95),
      villaSand: makeWorldFacadeMat('arch_fac_villa_sd_v2', 'villa_plaster', 'roof_concrete', 0xf3e7d8, 0.74, 0.04, {
        tileW: 0.44, tileH: 0.34, roofScale: 0.64, nightMode: 5, cellsX: 2, cellsY: 2
      }, 0.95),
      villaCool: makeWorldFacadeMat('arch_fac_villa_cl_v2', 'villa_plaster', 'roof_concrete', 0xeaeff5, 0.70, 0.05, {
        tileW: 0.44, tileH: 0.34, roofScale: 0.64, nightMode: 5, cellsX: 2, cellsY: 2
      }, 0.95),

      // Industrial Cladding + Clerestory Strip Facades (I) — crisp 1.10 corrugated rib relief
      indPanelBlue: makeWorldFacadeMat('arch_fac_ind_bl_v2', 'industrial_panel', 'roof_concrete', 0xdce8f5, 0.52, 0.32, {
        tileW: 0.60, tileH: 0.42, roofScale: 0.72, nightMode: 6, cellsX: 3, cellsY: 1
      }, 1.10),
      indPanelSilver: makeWorldFacadeMat('arch_fac_ind_sl_v2', 'industrial_panel', 'roof_concrete', 0xf4f7fb, 0.44, 0.38, {
        tileW: 0.60, tileH: 0.42, roofScale: 0.72, nightMode: 6, cellsX: 3, cellsY: 1
      }, 1.10),
      indPanelWarm: makeWorldFacadeMat('arch_fac_ind_wm_v2', 'industrial_panel', 'roof_concrete', 0xd8cec4, 0.60, 0.26, {
        tileW: 0.60, tileH: 0.42, roofScale: 0.72, nightMode: 6, cellsX: 3, cellsY: 1
      }, 1.10),

      // Dusty Desaturated Abandoned Versions of the Same PBR Textures (nightMode: 0)
      dustyCBD: makeWorldFacadeMat('arch_fac_dusty_cbd_v2', 'office_glass', 'roof_concrete', 0x8b929a, 0.88, 0.08, {
        tileW: 0.64, tileH: 0.68, roofScale: 0.72, nightMode: 0, cellsX: 4, cellsY: 4
      }, 1.10),
      dustyStoneFin: makeWorldFacadeMat('arch_fac_dusty_st_v2', 'office_stone', 'roof_concrete', 0x908d88, 0.90, 0.05, {
        tileW: 0.64, tileH: 0.68, roofScale: 0.72, nightMode: 0, cellsX: 4, cellsY: 4
      }, 0.95),
      dustyRetail: makeWorldFacadeMat('arch_fac_dusty_ret_v2', 'retail_podium', 'roof_concrete', 0x8a8e94, 0.90, 0.05, {
        tileW: 0.72, tileH: 0.36, roofScale: 0.72, nightMode: 0, cellsX: 4, cellsY: 1
      }, 0.95),
      dustyCondo: makeWorldFacadeMat('arch_fac_dusty_res_v2', 'res_beige', 'roof_concrete', 0x92908b, 0.90, 0.04, {
        tileW: 0.64, tileH: 0.60, roofScale: 0.72, nightMode: 0, cellsX: 4, cellsY: 4
      }, 0.95),
      dustyCondoGrey: makeWorldFacadeMat('arch_fac_dusty_resg_v2', 'res_grey', 'roof_concrete', 0x8d9196, 0.90, 0.04, {
        tileW: 0.64, tileH: 0.60, roofScale: 0.72, nightMode: 0, cellsX: 4, cellsY: 4
      }, 0.95),
      dustyVilla: makeWorldFacadeMat('arch_fac_dusty_vil_v2', 'villa_plaster', 'roof_concrete', 0x938f88, 0.92, 0.03, {
        tileW: 0.44, tileH: 0.34, roofScale: 0.64, nightMode: 0, cellsX: 2, cellsY: 2
      }, 0.95),
      dustyInd: makeWorldFacadeMat('arch_fac_dusty_ind_v2', 'industrial_panel', 'roof_concrete', 0x888e95, 0.90, 0.08, {
        tileW: 0.60, tileH: 0.42, roofScale: 0.72, nightMode: 0, cellsX: 3, cellsY: 1
      }, 1.10),

      // Architectural trims, concrete, metals & glass
      plazaStone: new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.74, metalness: 0.05 }),
      parapetStone: new THREE.MeshStandardMaterial({ color: 0xdad5cc, roughness: 0.64, metalness: 0.08 }),
      darkGranite: new THREE.MeshStandardMaterial({ color: 0x3b4452, roughness: 0.46, metalness: 0.22 }),
      charcoalFrame: new THREE.MeshStandardMaterial({ color: 0x2c343f, roughness: 0.44, metalness: 0.32 }),
      refugeLouvers: new THREE.MeshStandardMaterial({ color: 0x26303c, roughness: 0.50, metalness: 0.40 }),
      asphalt: new THREE.MeshStandardMaterial({ color: 0x323842, roughness: 0.86, metalness: 0.04 }),
      brushedSilver: new THREE.MeshStandardMaterial({ color: 0xdce4ec, roughness: 0.26, metalness: 0.58 }),
      whiteComposite: new THREE.MeshStandardMaterial({ color: 0xf4f7fa, roughness: 0.30, metalness: 0.18 }),
      steelDark: new THREE.MeshStandardMaterial({ color: 0x4b5664, roughness: 0.44, metalness: 0.52 }),
      atriumGlass: new THREE.MeshStandardMaterial({
        color: 0x8ec5e8,
        emissive: 0x3898d8,
        emissiveIntensity: 0.22,
        roughness: 0.14,
        metalness: 0.38,
        transparent: true,
        opacity: 0.86
      }),
      balconyGlass: new THREE.MeshStandardMaterial({
        color: 0x2b4e6e,
        emissive: 0x10283d,
        emissiveIntensity: 0.08,
        roughness: 0.11,
        metalness: 0.50,
        transparent: true,
        opacity: 0.74
      }),
      retailWarmGlow: new THREE.MeshStandardMaterial({
        color: 0xffe6bd,
        emissive: 0xffb347,
        emissiveIntensity: 0.20,
        roughness: 0.28,
        metalness: 0.12
      }),
      busStopScreen: new THREE.MeshStandardMaterial({
        color: 0xffffff,
        map: this.texBusDisplay,
        emissive: 0x38bdf8,
        emissiveMap: this.texBusDisplay,
        emissiveIntensity: 0.42,
        roughness: 0.16,
        metalness: 0.18
      }),
      busSign: new THREE.MeshStandardMaterial({
        color: 0xffffff,
        map: this.texBusSign,
        emissive: 0x0ea5e9,
        emissiveIntensity: 0.22,
        roughness: 0.26,
        metalness: 0.20
      }),
      cockpitGlass: new THREE.MeshStandardMaterial({ color: 0x111a2b, roughness: 0.09, metalness: 0.72 }),

      // Realistic Automotive Metallic Paints, Tires & Night Headlight/Taillight Lenses
      carPearlWhite: new THREE.MeshStandardMaterial({ color: 0xf4f7fb, roughness: 0.20, metalness: 0.34 }),
      carGraphite: new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.22, metalness: 0.56 }),
      carMidnightBlue: new THREE.MeshStandardMaterial({ color: 0x1e3a6e, roughness: 0.22, metalness: 0.48 }),
      carSilver: new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.19, metalness: 0.60 }),
      carCrimson: new THREE.MeshStandardMaterial({ color: 0xa61b34, roughness: 0.22, metalness: 0.44 }),
      carEmeraldEV: new THREE.MeshStandardMaterial({ color: 0x0f766e, roughness: 0.22, metalness: 0.44 }),
      taxiYellow: new THREE.MeshStandardMaterial({ color: 0xf5be0b, roughness: 0.24, metalness: 0.28 }),
      taxiSignGlow: new THREE.MeshStandardMaterial({ color: 0xfffbeb, emissive: 0xfde68a, emissiveIntensity: 0.75, roughness: 0.25 }),
      busTurquoise: new THREE.MeshStandardMaterial({ color: 0x0d9488, roughness: 0.26, metalness: 0.32 }),
      garbageGreen: new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.34, metalness: 0.22 }),
      tireRubber: new THREE.MeshStandardMaterial({ color: 0x1e2229, roughness: 0.84, metalness: 0.12 }),
      vehHeadlight: new THREE.MeshStandardMaterial({
        color: 0xfff9eb,
        emissive: 0xffe8b0,
        emissiveIntensity: 0.16,
        roughness: 0.14,
        metalness: 0.10
      }),
      vehTaillight: new THREE.MeshStandardMaterial({
        color: 0xef4444,
        emissive: 0xff1e2d,
        emissiveIntensity: 0.20,
        roughness: 0.18,
        metalness: 0.10
      }),

      // CR400 "Fuxing" Bullet Train Livery Materials
      fuxingBody: new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.18, metalness: 0.22 }),
      fuxingRedStripe: new THREE.MeshStandardMaterial({ color: 0xc81e2b, roughness: 0.24, metalness: 0.34 }),
      fuxingRoofSilver: new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.30, metalness: 0.48 }),
      fuxingBogie: new THREE.MeshStandardMaterial({ color: 0x262c36, roughness: 0.62, metalness: 0.35 }),
      fuxingHeadlight: new THREE.MeshBasicMaterial({ color: 0xfff8dc }),

      // Landscaping, wood, roofs & special decals
      lawn: new THREE.MeshStandardMaterial({ color: 0x3b9c4a, roughness: 0.86 }),
      hedge: new THREE.MeshStandardMaterial({ color: 0x2b753b, roughness: 0.88 }),
      teakDeck: new THREE.MeshStandardMaterial({ color: 0xb77946, roughness: 0.68 }),
      terracottaRoof: new THREE.MeshStandardMaterial({ color: 0xb45640, roughness: 0.68 }),
      slateRoof: new THREE.MeshStandardMaterial({ color: 0x455060, roughness: 0.62, metalness: 0.16 }),
      poolWater: new THREE.MeshStandardMaterial({
        map: this.texPool,
        emissive: 0x0ea5e9,
        emissiveIntensity: 0.26,
        roughness: 0.12,
        metalness: 0.22
      }),
      helipad: new THREE.MeshStandardMaterial({ map: this.texHelipad, roughness: 0.76, metalness: 0.06 }),
      soccerPitch: new THREE.MeshStandardMaterial({ map: this.texPitch, roughness: 0.82 }),
      solarPanel: new THREE.MeshStandardMaterial({
        map: this.texSolar,
        roughness: 0.18,
        metalness: 0.56,
        emissive: 0x0f2d6b,
        emissiveIntensity: 0.14
      }),
      runway: new THREE.MeshStandardMaterial({ map: this.texRunway, roughness: 0.80 }),

      // Industrial accents, cranes, ships & containers
      craneRed: new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.38, metalness: 0.40 }),
      craneYellow: new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.40, metalness: 0.36 }),
      factoryFasciaBlue: new THREE.MeshStandardMaterial({ color: 0x1d65b8, roughness: 0.36, metalness: 0.28 }),
      factoryFasciaTeal: new THREE.MeshStandardMaterial({ color: 0x0f766e, roughness: 0.36, metalness: 0.28 }),
      factoryBrick: new THREE.MeshStandardMaterial({ color: 0x9e6450, roughness: 0.76, metalness: 0.10 }),
      hullNavy: new THREE.MeshStandardMaterial({ color: 0x172554, roughness: 0.46, metalness: 0.32 }),
      hullCrimson: new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.52, metalness: 0.24 }),
      airlineBlue: new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.24, metalness: 0.40 }),
      contRed: makeContMat(0xdc2626),
      contBlue: makeContMat(0x2563eb),
      contAmber: makeContMat(0xd97706),
      contTeal: makeContMat(0x0d9488),
      contGreen: makeContMat(0x16a34a),

      // Subtle architectural LED linear strips, storefront neon, warm molten-salt solar crown & aviation beacons
      ledLinearCyan: new THREE.MeshBasicMaterial({ color: 0x7dd3fc }),
      ledLinearWhite: new THREE.MeshBasicMaterial({ color: 0xe2f1ff }),
      neonCyan: new THREE.MeshBasicMaterial({ color: 0x22d3ee }),
      neonGold: new THREE.MeshBasicMaterial({ color: 0xfbbf24 }),
      neonRose: new THREE.MeshBasicMaterial({ color: 0xfb7185 }),
      neonEmerald: new THREE.MeshBasicMaterial({ color: 0x34d399 }),
      neonViolet: new THREE.MeshBasicMaterial({ color: 0xc084fc }),
      floodlightWhite: new THREE.MeshBasicMaterial({ color: 0xfffef5 }),
      solarReceiverCrown: new THREE.MeshStandardMaterial({
        color: 0xffb74d,
        emissive: 0xff9800,
        emissiveIntensity: 0.92,
        roughness: 0.28,
        metalness: 0.24
      }),
      beaconRed: new THREE.MeshBasicMaterial({ color: 0xff2438 }),
      strobeGreen: new THREE.MeshBasicMaterial({ color: 0x22c55e }),

      abandoned: new THREE.MeshStandardMaterial({ color: 0x8b9098, roughness: 0.90, metalness: 0.05 }),
      abandonedRust: new THREE.MeshStandardMaterial({ color: 0x7c7874, roughness: 0.92, metalness: 0.06 })
    };

    // Canonical PBR material aliases for external inspection & theming
    this.m.officeGlass = this.m.cbdIceBlue;
    this.m.resBeige = this.m.condoWarmWhite;

    this.carBodyPalette = [
      this.m.carPearlWhite,
      this.m.carGraphite,
      this.m.carMidnightBlue,
      this.m.carSilver,
      this.m.carCrimson,
      this.m.carEmeraldEV
    ];
    this.containerMats = [this.m.contRed, this.m.contBlue, this.m.contAmber, this.m.contTeal, this.m.contGreen];
    this.neonMats = [this.m.neonCyan, this.m.neonRose, this.m.neonGold, this.m.neonEmerald, this.m.neonViolet];
  }

  _getDustyGLBMat(origMat) {
    if (!origMat) return this.m.abandoned;
    let cached = this._glbAbandonedCache.get(origMat);
    if (!cached) {
      cached = origMat.clone();
      if (cached.color) cached.color.setHex(0x828890);
      cached.roughness = 0.90;
      cached.metalness = 0.05;
      if (cached.emissive) cached.emissive.setHex(0x000000);
      cached.emissiveIntensity = 0.0;
      this._glbAbandonedCache.set(origMat, cached);
    }
    return cached;
  }

  _initSculptedGeometries() {
    const THREE = this.THREE;
    const box = new THREE.BoxGeometry(1, 1, 1);
    const aoQuad = new THREE.PlaneGeometry(1, 1);
    aoQuad.rotateX(-Math.PI * 0.5);

    const cyl16 = new THREE.CylinderGeometry(0.5, 0.5, 1, 16);
    const cyl24 = new THREE.CylinderGeometry(0.5, 0.5, 1, 24);
    const oct = new THREE.CylinderGeometry(0.5, 0.5, 1, 8);
    const taperOct = new THREE.CylinderGeometry(0.32, 0.50, 1, 8);
    const taperPyr = new THREE.CylinderGeometry(0.24, 0.52, 1, 4);
    const cone8 = new THREE.ConeGeometry(0.5, 1, 8);
    const sphere16 = new THREE.SphereGeometry(0.5, 18, 14);
    const hemiDome = new THREE.SphereGeometry(0.5, 22, 12, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const capsule = new THREE.CapsuleGeometry(0.25, 0.5, 8, 14);
    const treeCrown = new THREE.DodecahedronGeometry(0.11, 1);

    // 1. Flat-shaded Axis-Aligned Tapered Square Shaft & Tapered Gravity Dam Monolith
    const rawTaperSq = new THREE.CylinderGeometry(0.52, 0.7071, 1, 4);
    rawTaperSq.rotateY(Math.PI * 0.25);
    const taperSquare = rawTaperSq.toNonIndexed();
    taperSquare.computeVertexNormals();
    rawTaperSq.dispose();

    const rawDamSq = new THREE.CylinderGeometry(0.68, 0.835, 1, 4);
    rawDamSq.rotateY(Math.PI * 0.25);
    const damGravityBody = rawDamSq.toNonIndexed();
    damGravityBody.computeVertexNormals();
    rawDamSq.dispose();

    // 4-Corner Buttress Piers for Hydroelectric Gravity Dam
    const damButtresses = mergeParts(THREE, [
      { geo: box, px: -0.38, py: 0, pz: 0, sx: 0.16, sy: 1.0, sz: 1.04 },
      { geo: box, px: 0.38, py: 0, pz: 0, sx: 0.16, sy: 1.0, sz: 1.04 },
      { geo: box, px: 0, py: 0, pz: -0.38, sx: 1.04, sy: 1.0, sz: 0.16 },
      { geo: box, px: 0, py: 0, pz: 0.38, sx: 1.04, sy: 1.0, sz: 0.16 }
    ]);

    // 2. Pre-merged 4-Wall Rectangular Roof Parapet Frame (女儿墙)
    const parapetFrame = mergeParts(THREE, [
      { geo: box, px: 0, py: 0, pz: 0.47, sx: 1.0, sy: 1.0, sz: 0.06 },
      { geo: box, px: 0, py: 0, pz: -0.47, sx: 1.0, sy: 1.0, sz: 0.06 },
      { geo: box, px: 0.47, py: 0, pz: 0, sx: 0.06, sy: 1.0, sz: 0.88 },
      { geo: box, px: -0.47, py: 0, pz: 0, sx: 0.06, sy: 1.0, sz: 0.88 }
    ]);

    // 3. Pre-merged 8-Fin Vertical Curtain-Wall Corner & Mullion Columns
    const rectCornerFins = mergeParts(THREE, [
      { geo: box, px: -0.495, py: 0, pz: -0.495, sx: 0.04, sy: 1.0, sz: 0.04 },
      { geo: box, px: 0.495, py: 0, pz: -0.495, sx: 0.04, sy: 1.0, sz: 0.04 },
      { geo: box, px: -0.495, py: 0, pz: 0.495, sx: 0.04, sy: 1.0, sz: 0.04 },
      { geo: box, px: 0.495, py: 0, pz: 0.495, sx: 0.04, sy: 1.0, sz: 0.04 },
      { geo: box, px: 0, py: 0, pz: 0.50, sx: 0.028, sy: 1.0, sz: 0.028 },
      { geo: box, px: 0, py: 0, pz: -0.50, sx: 0.028, sy: 1.0, sz: 0.028 },
      { geo: box, px: 0.50, py: 0, pz: 0, sx: 0.028, sy: 1.0, sz: 0.028 },
      { geo: box, px: -0.50, py: 0, pz: 0, sx: 0.028, sy: 1.0, sz: 0.028 }
    ]);

    // 4. Pre-merged Street Tree Planters & Canopies for Plot Edges
    const buildPlanterSet = (coords) => {
      const curbParts = [];
      const trunkParts = [];
      const leafParts = [];
      for (const [cx, cz] of coords) {
        curbParts.push({ geo: box, px: cx, py: 0.032, pz: cz, sx: 0.11, sy: 0.036, sz: 0.11 });
        trunkParts.push({ geo: cyl16, px: cx, py: 0.075, pz: cz, sx: 0.022, sy: 0.08, sz: 0.022 });
        leafParts.push({ geo: treeCrown, px: cx, py: 0.145, pz: cz, sx: 0.68, sy: 0.68, sz: 0.68 });
      }
      return {
        curbs: mergeParts(THREE, curbParts),
        trunks: mergeParts(THREE, trunkParts),
        leaves: mergeParts(THREE, leafParts)
      };
    };
    const planters4 = buildPlanterSet([[-0.39, -0.39], [0.39, -0.39], [-0.39, 0.39], [0.39, 0.39]]);
    const planters2 = buildPlanterSet([[-0.38, 0.39], [0.38, 0.39]]);

    // 5. Sawtooth Industrial Roof & Gas Sphere Support Legs
    const triRidge = new THREE.CylinderGeometry(0.5, 0.5, 1, 3);
    const sawParts = [];
    for (let i = -1; i <= 1; i++) {
      sawParts.push({ geo: triRidge, px: 0, py: 0, pz: i * 0.22, rz: Math.PI * 0.5, rx: 0.22, sx: 0.22, sy: 0.68, sz: 0.24 });
    }
    const sawtoothRoof = mergeParts(THREE, sawParts);
    triRidge.dispose();

    const legParts = [];
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2 + Math.PI / 4;
      legParts.push({ geo: cyl16, px: Math.cos(a) * 0.13, py: 0.18, pz: Math.sin(a) * 0.13, sx: 0.028, sy: 0.36, sz: 0.028 });
    }
    const eqTorus = new THREE.TorusGeometry(0.175, 0.014, 8, 20);
    legParts.push({ geo: eqTorus, px: 0, py: 0.28, pz: 0, rx: Math.PI * 0.5 });
    const gasSphereSupport = mergeParts(THREE, legParts);
    eqTorus.dispose();

    // 6. Cooling Tower, Stadium, Ferris Wheel, Heliostats & Gantry Crane
    const coolingTower = new THREE.LatheGeometry([
      new THREE.Vector2(0.24, 0.0),
      new THREE.Vector2(0.20, 0.22),
      new THREE.Vector2(0.165, 0.52),
      new THREE.Vector2(0.148, 0.78),
      new THREE.Vector2(0.172, 1.05),
      new THREE.Vector2(0.158, 1.05),
      new THREE.Vector2(0.138, 0.78)
    ], 24);

    const stadiumBowl = new THREE.LatheGeometry([
      new THREE.Vector2(0.45, 0.00),
      new THREE.Vector2(0.54, 0.22),
      new THREE.Vector2(0.51, 0.38),
      new THREE.Vector2(0.46, 0.38),
      new THREE.Vector2(0.30, 0.03)
    ], 32);

    const stadiumRoof = new THREE.LatheGeometry([
      new THREE.Vector2(0.34, 0.390),
      new THREE.Vector2(0.51, 0.365),
      new THREE.Vector2(0.525, 0.385),
      new THREE.Vector2(0.44, 0.425),
      new THREE.Vector2(0.335, 0.405)
    ], 32);

    const rimOuter = new THREE.TorusGeometry(0.68, 0.022, 10, 32);
    const rimInner = new THREE.TorusGeometry(0.50, 0.012, 8, 28);
    const fwParts = [
      { geo: rimOuter, px: 0, py: 0, pz: -0.06 },
      { geo: rimOuter, px: 0, py: 0, pz: 0.06 },
      { geo: rimInner, px: 0, py: 0, pz: -0.06 },
      { geo: rimInner, px: 0, py: 0, pz: 0.06 },
      { geo: cyl16, px: 0, py: 0, pz: 0, rx: Math.PI * 0.5, sx: 0.14, sy: 0.20, sz: 0.14 }
    ];
    for (let i = 0; i < 12; i++) {
      const a = (i * Math.PI * 2) / 12;
      const cx = Math.cos(a) * 0.34;
      const cy = Math.sin(a) * 0.34;
      fwParts.push({ geo: cyl16, px: cx, py: cy, pz: -0.06, rz: a - Math.PI * 0.5, sx: 0.014, sy: 0.68, sz: 0.014 });
      fwParts.push({ geo: cyl16, px: cx, py: cy, pz: 0.06, rz: a - Math.PI * 0.5, sx: 0.014, sy: 0.68, sz: 0.014 });
      fwParts.push({ geo: cyl16, px: Math.cos(a) * 0.68, py: Math.sin(a) * 0.68, pz: 0, rx: Math.PI * 0.5, sx: 0.016, sy: 0.14, sz: 0.016 });
    }
    const ferrisWheelFrame = mergeParts(THREE, fwParts);
    rimOuter.dispose();
    rimInner.dispose();

    const helioMirParts = [];
    const helioPedParts = [];
    for (const rd of [{ count: 6, r: 0.26, tilt: 0.42 }, { count: 10, r: 0.43, tilt: 0.58 }]) {
      for (let i = 0; i < rd.count; i++) {
        const a = (i * Math.PI * 2) / rd.count + (rd.count === 10 ? 0.16 : 0);
        const px = Math.cos(a) * rd.r;
        const pz = Math.sin(a) * rd.r;
        helioPedParts.push({ geo: cyl16, px, py: 0.055, pz, sx: 0.022, sy: 0.11, sz: 0.022 });
        helioMirParts.push({ geo: box, px, py: 0.115, pz, ry: -a, rz: rd.tilt, sx: 0.105, sy: 0.012, sz: 0.115 });
      }
    }
    const heliostatMirrors = mergeParts(THREE, helioMirParts);
    const heliostatPedestals = mergeParts(THREE, helioPedParts);

    const gantryCraneRed = mergeParts(THREE, [
      { geo: box, px: -0.11, py: 0.48, pz: -0.14, sx: 0.032, sy: 0.96, sz: 0.032 },
      { geo: box, px: 0.11, py: 0.48, pz: -0.14, sx: 0.032, sy: 0.96, sz: 0.032 },
      { geo: box, px: -0.11, py: 0.48, pz: 0.16, sx: 0.032, sy: 0.96, sz: 0.032 },
      { geo: box, px: 0.11, py: 0.48, pz: 0.16, sx: 0.032, sy: 0.96, sz: 0.032 },
      { geo: box, px: 0, py: 0.42, pz: -0.14, sx: 0.24, sy: 0.028, sz: 0.028 },
      { geo: box, px: 0, py: 0.42, pz: 0.16, sx: 0.24, sy: 0.028, sz: 0.028 },
      { geo: box, px: -0.07, py: 0.96, pz: 0.26, sx: 0.028, sy: 0.036, sz: 1.24 },
      { geo: box, px: 0.07, py: 0.96, pz: 0.26, sx: 0.028, sy: 0.036, sz: 1.24 },
      { geo: box, px: 0, py: 0.96, pz: 0.84, sx: 0.17, sy: 0.032, sz: 0.04 },
      { geo: box, px: -0.06, py: 1.18, pz: 0.02, sx: 0.026, sy: 0.44, sz: 0.026 },
      { geo: box, px: 0.06, py: 1.18, pz: 0.02, sx: 0.026, sy: 0.44, sz: 0.026 },
      { geo: box, px: 0, py: 1.39, pz: 0.02, sx: 0.15, sy: 0.028, sz: 0.03 },
      { geo: box, px: 0, py: 1.17, pz: 0.38, rx: 0.50, sx: 0.016, sy: 0.016, sz: 0.82 },
      { geo: box, px: 0, py: 1.17, pz: -0.18, rx: -0.78, sx: 0.016, sy: 0.016, sz: 0.56 }
    ]);

    const gullShape = new THREE.Shape();
    gullShape.moveTo(-0.56, 0.0);
    gullShape.quadraticCurveTo(-0.28, 0.19, 0.0, 0.05);
    gullShape.quadraticCurveTo(0.28, 0.19, 0.56, 0.0);
    gullShape.lineTo(0.54, -0.035);
    gullShape.quadraticCurveTo(0.28, 0.14, 0.0, 0.01);
    gullShape.quadraticCurveTo(-0.28, 0.14, -0.54, -0.035);
    gullShape.closePath();
    const gullWingRoof = new THREE.ExtrudeGeometry(gullShape, { depth: 0.52, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 2 });
    gullWingRoof.translate(0, 0, -0.26);

    const wedgeShape = new THREE.Shape();
    wedgeShape.moveTo(-0.38, 0.0);
    wedgeShape.lineTo(0.38, 0.0);
    wedgeShape.lineTo(0.38, 1.18);
    wedgeShape.quadraticCurveTo(0.02, 0.78, -0.38, 0.34);
    wedgeShape.closePath();
    const copenhillWedge = new THREE.ExtrudeGeometry(wedgeShape, { depth: 0.58, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 2 });
    copenhillWedge.translate(0, 0, -0.29);

    // 7. Widebody Airliner & Ocean Container Ship Hulls
    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, -0.24);
    wingShape.lineTo(0.68, 0.15);
    wingShape.lineTo(0.68, 0.25);
    wingShape.lineTo(0.11, 0.11);
    wingShape.lineTo(-0.11, 0.11);
    wingShape.lineTo(-0.68, 0.25);
    wingShape.lineTo(-0.68, 0.15);
    wingShape.closePath();
    const airlinerWing = new THREE.ExtrudeGeometry(wingShape, { depth: 0.018, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.008, bevelSegments: 2 });
    airlinerWing.rotateX(-Math.PI * 0.5);

    const hTailShape = new THREE.Shape();
    hTailShape.moveTo(0, -0.08);
    hTailShape.lineTo(0.26, 0.09);
    hTailShape.lineTo(0.26, 0.15);
    hTailShape.lineTo(0, 0.07);
    hTailShape.lineTo(-0.26, 0.15);
    hTailShape.lineTo(-0.26, 0.09);
    hTailShape.closePath();
    const airlinerHTail = new THREE.ExtrudeGeometry(hTailShape, { depth: 0.012, bevelEnabled: false });
    airlinerHTail.rotateX(-Math.PI * 0.5);

    const vTailShape = new THREE.Shape();
    vTailShape.moveTo(0.14, 0.0);
    vTailShape.lineTo(-0.08, 0.29);
    vTailShape.lineTo(-0.19, 0.29);
    vTailShape.lineTo(-0.10, 0.0);
    vTailShape.closePath();
    const airlinerVTail = new THREE.ExtrudeGeometry(vTailShape, { depth: 0.016, bevelEnabled: true, bevelThickness: 0.004, bevelSize: 0.005, bevelSegments: 1 });
    airlinerVTail.translate(0, 0, -0.008);
    airlinerVTail.rotateY(-Math.PI * 0.5);

    const makeShipHullGeo = (halfBeam, sternY, bowY, depth) => {
      const sh = new THREE.Shape();
      sh.moveTo(-halfBeam * 0.88, sternY);
      sh.lineTo(-halfBeam, sternY * 0.65);
      sh.lineTo(-halfBeam, -0.35);
      sh.quadraticCurveTo(-halfBeam * 0.92, bowY * 0.72, 0, bowY);
      sh.quadraticCurveTo(halfBeam * 0.92, bowY * 0.72, halfBeam, -0.35);
      sh.lineTo(halfBeam, sternY * 0.65);
      sh.lineTo(halfBeam * 0.88, sternY);
      sh.closePath();
      const g = new THREE.ExtrudeGeometry(sh, { depth, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 2 });
      g.rotateX(-Math.PI * 0.5);
      return g;
    };

    const fuselage = new THREE.CapsuleGeometry(0.095, 1.08, 10, 18);
    fuselage.rotateX(Math.PI * 0.5);

    const windNacelle = new THREE.CapsuleGeometry(0.058, 0.15, 8, 12);
    windNacelle.rotateX(Math.PI * 0.5);

    // 8. CR400 "Fuxing" High-Speed Train Shared Geometries
    const crShape = new THREE.Shape();
    crShape.moveTo(-0.086, 0.022);
    crShape.lineTo(0.086, 0.022);
    crShape.lineTo(0.104, 0.072);
    crShape.lineTo(0.098, 0.194);
    crShape.quadraticCurveTo(0, 0.246, -0.098, 0.194);
    crShape.lineTo(-0.104, 0.072);
    crShape.closePath();

    const fuxingMidBody = new THREE.ExtrudeGeometry(crShape, { depth: 0.65, bevelEnabled: false });
    fuxingMidBody.translate(0, 0, -0.325);

    const fuxingHeadAft = new THREE.ExtrudeGeometry(crShape, { depth: 0.38, bevelEnabled: false });
    fuxingHeadAft.translate(0, 0, -0.340);
    const fuxingNose = buildCR400NoseGeometry(THREE);
    const fuxingHeadBody = mergeParts(THREE, [{ geo: fuxingHeadAft }, { geo: fuxingNose }]);
    fuxingHeadAft.dispose();
    fuxingNose.dispose();

    const fuxingMidDark = mergeParts(THREE, [
      { geo: box, px: 0, py: 0.017, pz: -0.20, sx: 0.165, sy: 0.026, sz: 0.11 },
      { geo: box, px: 0, py: 0.017, pz: 0.20, sx: 0.165, sy: 0.026, sz: 0.11 },
      { geo: box, px: 0, py: 0.125, pz: -0.333, sx: 0.176, sy: 0.185, sz: 0.016 },
      { geo: box, px: 0, py: 0.125, pz: 0.333, sx: 0.176, sy: 0.185, sz: 0.016 },
      { geo: box, px: 0, py: 0.150, pz: 0, sx: 0.206, sy: 0.042, sz: 0.58 }
    ]);

    const fuxingHeadDark = mergeParts(THREE, [
      { geo: box, px: 0, py: 0.017, pz: -0.21, sx: 0.165, sy: 0.026, sz: 0.11 },
      { geo: box, px: 0, py: 0.017, pz: 0.15, sx: 0.155, sy: 0.026, sz: 0.10 },
      { geo: box, px: 0, py: 0.036, pz: 0.28, rx: 0.28, sx: 0.11, sy: 0.024, sz: 0.10 },
      { geo: box, px: 0, py: 0.125, pz: -0.344, sx: 0.176, sy: 0.185, sz: 0.014 },
      { geo: box, px: 0, py: 0.150, pz: -0.14, sx: 0.206, sy: 0.042, sz: 0.35 },
      { geo: sphere16, px: 0, py: 0.168, pz: 0.165, rx: -0.34, sx: 0.148, sy: 0.062, sz: 0.145 }
    ]);

    const fuxingMidStripe = mergeParts(THREE, [
      { geo: box, px: 0, py: 0.106, pz: 0, sx: 0.211, sy: 0.018, sz: 0.648 },
      { geo: box, px: 0, py: 0.202, pz: 0, sx: 0.199, sy: 0.010, sz: 0.648 }
    ]);

    const fuxingHeadStripe = mergeParts(THREE, [
      { geo: box, px: 0, py: 0.106, pz: -0.14, sx: 0.211, sy: 0.018, sz: 0.39 },
      { geo: box, px: 0.082, py: 0.088, pz: 0.165, rx: 0.13, ry: -0.14, sx: 0.018, sy: 0.016, sz: 0.25 },
      { geo: box, px: -0.082, py: 0.088, pz: 0.165, rx: 0.13, ry: 0.14, sx: 0.018, sy: 0.016, sz: 0.25 }
    ]);

    const fuxingHeadlights = mergeParts(THREE, [
      { geo: sphere16, px: -0.045, py: 0.076, pz: 0.308, sx: 0.026, sy: 0.018, sz: 0.032 },
      { geo: sphere16, px: 0.045, py: 0.076, pz: 0.308, sx: 0.026, sy: 0.018, sz: 0.032 }
    ]);

    // 9. True-Proportion Realistic Modern 3D Road Vehicles (facing +Z, tire bottoms at exact y = 0.000!)
    const makeWheelsAndChassis = (zf, zr, halfTrack, r, w, chassisL, chassisW) => {
      const wParts = [
        { geo: cyl16, px: -halfTrack, py: r, pz: zf, rz: Math.PI * 0.5, sx: r * 2, sy: w, sz: r * 2 },
        { geo: cyl16, px: halfTrack, py: r, pz: zf, rz: Math.PI * 0.5, sx: r * 2, sy: w, sz: r * 2 },
        { geo: cyl16, px: -halfTrack, py: r, pz: zr, rz: Math.PI * 0.5, sx: r * 2, sy: w, sz: r * 2 },
        { geo: cyl16, px: halfTrack, py: r, pz: zr, rz: Math.PI * 0.5, sx: r * 2, sy: w, sz: r * 2 },
        { geo: box, px: 0, py: r * 0.95, pz: (zf + zr) * 0.5, sx: chassisW, sy: r * 0.7, sz: chassisL }
      ];
      return mergeParts(THREE, wParts);
    };

    const makeLampPair = (halfX, py, pz, sx, sy, sz) => mergeParts(THREE, [
      { geo: box, px: -halfX, py, pz, sx, sy, sz },
      { geo: box, px: halfX, py, pz, sx, sy, sz }
    ]);

    // Sedan / Taxi (L ≈ 0.30, W ≈ 0.145, H ≈ 0.114)
    const vehSedanBody = buildSideProfileGeo(THREE, [
      [-0.144, 0.024],
      [0.145, 0.022],
      [0.148, 0.045],
      [0.135, 0.056, 0.072, 0.066],
      [-0.138, 0.070],
      [-0.146, 0.052]
    ], 0.144, 0.008);

    const vehSedanCabin = buildSideProfileGeo(THREE, [
      [-0.108, 0.064],
      [0.068, 0.062],
      [0.020, 0.111],
      [-0.068, 0.112]
    ], 0.122, 0.006);

    const vehSedanWheels = makeWheelsAndChassis(0.092, -0.092, 0.064, 0.022, 0.022, 0.23, 0.115);
    const vehSedanHL = makeLampPair(0.048, 0.046, 0.147, 0.028, 0.012, 0.010);
    const vehSedanTL = makeLampPair(0.046, 0.058, -0.145, 0.034, 0.011, 0.010);

    // Compact Urban SUV (L ≈ 0.31, W ≈ 0.150, H ≈ 0.126)
    const vehSuvBody = buildSideProfileGeo(THREE, [
      [-0.148, 0.026],
      [0.148, 0.026],
      [0.152, 0.054],
      [0.140, 0.068, 0.076, 0.075],
      [-0.146, 0.078],
      [-0.150, 0.055]
    ], 0.148, 0.008);

    const vehSuvCabin = buildSideProfileGeo(THREE, [
      [-0.136, 0.073],
      [0.068, 0.071],
      [0.022, 0.124],
      [-0.118, 0.125]
    ], 0.128, 0.006);

    const vehSuvWheels = makeWheelsAndChassis(0.096, -0.096, 0.067, 0.024, 0.024, 0.24, 0.120);
    const vehSuvHL = makeLampPair(0.050, 0.054, 0.151, 0.030, 0.013, 0.010);
    const vehSuvTL = makeLampPair(0.050, 0.066, -0.149, 0.032, 0.013, 0.010);

    // Low-Floor EV City Transit Bus (L ≈ 0.50, W ≈ 0.162, H ≈ 0.186)
    const vehBusBody = buildSideProfileGeo(THREE, [
      [-0.244, 0.024],
      [0.244, 0.024],
      [0.250, 0.085],
      [0.248, 0.168, 0.228, 0.174],
      [-0.238, 0.174],
      [-0.246, 0.160]
    ], 0.160, 0.007);

    const vehBusDark = mergeParts(THREE, [
      // Panoramic dark side & front/rear transit windows
      { geo: box, px: 0, py: 0.122, pz: 0.005, sx: 0.163, sy: 0.058, sz: 0.45 },
      { geo: box, px: 0, py: 0.118, pz: 0.246, sx: 0.144, sy: 0.068, sz: 0.014 },
      { geo: box, px: 0, py: 0.124, pz: -0.243, sx: 0.140, sy: 0.048, sz: 0.012 }
    ]);
    const vehBusStripe = mergeParts(THREE, [
      { geo: box, px: 0, py: 0.058, pz: 0, sx: 0.163, sy: 0.036, sz: 0.486 },
      { geo: box, px: 0, py: 0.180, pz: -0.02, sx: 0.115, sy: 0.014, sz: 0.28 }
    ]);
    const vehBusWheels = makeWheelsAndChassis(0.145, -0.145, 0.070, 0.027, 0.026, 0.40, 0.13);
    const vehBusHL = makeLampPair(0.056, 0.048, 0.249, 0.026, 0.014, 0.010);
    const vehBusTL = makeLampPair(0.058, 0.062, -0.245, 0.022, 0.026, 0.010);

    // Cab-Over Cargo / Container Truck & Municipal Trucks (L ≈ 0.44, W ≈ 0.160, H ≈ 0.190)
    const vehTruckCab = buildSideProfileGeo(THREE, [
      [0.088, 0.028],
      [0.214, 0.028],
      [0.218, 0.092],
      [0.204, 0.164],
      [0.155, 0.182],
      [0.088, 0.182]
    ], 0.154, 0.006);

    const vehTruckGlass = mergeParts(THREE, [
      { geo: box, px: 0, py: 0.128, pz: 0.211, rx: 0.12, sx: 0.138, sy: 0.048, sz: 0.014 },
      { geo: box, px: 0, py: 0.128, pz: 0.155, sx: 0.156, sy: 0.044, sz: 0.075 }
    ]);
    const vehTruckWheels = makeWheelsAndChassis(0.148, -0.132, 0.068, 0.027, 0.026, 0.39, 0.125);
    const vehTruckHL = makeLampPair(0.054, 0.048, 0.217, 0.026, 0.014, 0.010);
    const vehTruckTL = makeLampPair(0.056, 0.046, -0.218, 0.026, 0.014, 0.010);

    // Firetruck Crew-Cab + Equipment Body + Silver Aerial Ladder Rack
    const vehFireBody = mergeParts(THREE, [
      { geo: vehTruckCab },
      { geo: box, px: 0, py: 0.104, pz: -0.075, sx: 0.158, sy: 0.132, sz: 0.305 }
    ]);
    const vehFireSilver = mergeParts(THREE, [
      // White/silver rescue stripe + roll-up equipment shutters + aerial extension ladder on roof!
      { geo: box, px: 0, py: 0.098, pz: -0.075, sx: 0.161, sy: 0.076, sz: 0.24 },
      { geo: box, px: 0, py: 0.072, pz: 0.152, sx: 0.157, sy: 0.018, sz: 0.125 },
      { geo: box, px: -0.036, py: 0.180, pz: -0.03, sx: 0.016, sy: 0.016, sz: 0.36 },
      { geo: box, px: 0.036, py: 0.180, pz: -0.03, sx: 0.016, sy: 0.016, sz: 0.36 },
      { geo: box, px: 0, py: 0.180, pz: -0.16, sx: 0.082, sy: 0.012, sz: 0.018 },
      { geo: box, px: 0, py: 0.180, pz: -0.03, sx: 0.082, sy: 0.012, sz: 0.018 },
      { geo: box, px: 0, py: 0.180, pz: 0.10, sx: 0.082, sy: 0.012, sz: 0.018 }
    ]);

    // Garbage Compactor Angled Hopper Body (z ∈ [-0.215, +0.080])
    const vehGarbageHopper = buildSideProfileGeo(THREE, [
      [-0.185, 0.048],
      [0.080, 0.048],
      [0.080, 0.178],
      [-0.135, 0.182],
      [-0.216, 0.125],
      [-0.212, 0.068]
    ], 0.156, 0.006);

    // 10. v7.5 Architectural Micro-Detail Shared Pre-Merged Geometries (Balconies, Cornice Belts, Retail Canopies, Rooftop Kits & EV Bus Stop Shelter)
    // 10a. 3-Floor Modular Protruding Residential Balcony Strip (unit X/Z, fixed architectural height 3 × 0.15)
    const balcConcParts = [];
    const balcGlassParts = [];
    for (const ty of [-0.15, 0.0, 0.15]) {
      for (const side of [-1, 1]) {
        for (const bx of [-0.27, 0.27]) {
          // Cantilevered concrete floor slab embedded slightly into facade (z ∈ [0.47, 0.61])
          balcConcParts.push({ geo: box, px: bx, py: ty, pz: side * 0.542, sx: 0.32, sy: 0.018, sz: 0.140 });
          // Outer architectural privacy partition fin
          balcConcParts.push({ geo: box, px: bx + Math.sign(bx) * 0.152, py: ty + 0.036, pz: side * 0.540, sx: 0.018, sy: 0.064, sz: 0.132 });
          // Top slim metallic coping rail over glass balustrade
          balcConcParts.push({ geo: box, px: bx, py: ty + 0.061, pz: side * 0.602, sx: 0.312, sy: 0.008, sz: 0.018 });
          // Tinted glass front balustrade & inner side return glass
          balcGlassParts.push({ geo: box, px: bx, py: ty + 0.034, pz: side * 0.602, sx: 0.304, sy: 0.050, sz: 0.014 });
          balcGlassParts.push({ geo: box, px: bx - Math.sign(bx) * 0.152, py: ty + 0.034, pz: side * 0.545, sx: 0.014, sy: 0.050, sz: 0.118 });
        }
      }
    }
    const balconyStrip = mergeParts(THREE, balcConcParts);
    const balconyGlass = mergeParts(THREE, balcGlassParts);

    // 10b. Sculpted 2-Stepped 4-Sided Horizontal Stone/Metal Cornice Belt Trim (unit X/Z, fixed height 0.036)
    const corniceBelt = mergeParts(THREE, [
      // Lower recessed drip soffit ring
      { geo: box, px: 0, py: -0.010, pz: 0.494, sx: 1.028, sy: 0.015, sz: 0.044 },
      { geo: box, px: 0, py: -0.010, pz: -0.494, sx: 1.028, sy: 0.015, sz: 0.044 },
      { geo: box, px: 0.494, py: -0.010, pz: 0, sx: 0.044, sy: 0.015, sz: 0.944 },
      { geo: box, px: -0.494, py: -0.010, pz: 0, sx: 0.044, sy: 0.015, sz: 0.944 },
      // Upper projecting cornice coping cap
      { geo: box, px: 0, py: 0.008, pz: 0.502, sx: 1.058, sy: 0.020, sz: 0.056 },
      { geo: box, px: 0, py: 0.008, pz: -0.502, sx: 1.058, sy: 0.020, sz: 0.056 },
      { geo: box, px: 0.502, py: 0.008, pz: 0, sx: 0.056, sy: 0.020, sz: 0.950 },
      { geo: box, px: -0.502, py: 0.008, pz: 0, sx: 0.056, sy: 0.020, sz: 0.950 }
    ]);

    // 10c. Recessed Ground-Floor Commercial Shopfront Canopy (anchored at z=0, facing +Z, jambs seated at y=-0.215)
    const retailCanopy = mergeParts(THREE, [
      { geo: box, px: 0, py: 0.0, pz: 0.006, sx: 0.44, sy: 0.022, sz: 0.016 },
      { geo: box, px: 0, py: -0.006, pz: 0.098, sx: 0.44, sy: 0.018, sz: 0.014 },
      { geo: box, px: -0.21, py: -0.003, pz: 0.052, rx: 0.06, sx: 0.014, sy: 0.015, sz: 0.096 },
      { geo: box, px: -0.07, py: -0.003, pz: 0.052, rx: 0.06, sx: 0.012, sy: 0.014, sz: 0.096 },
      { geo: box, px: 0.07, py: -0.003, pz: 0.052, rx: 0.06, sx: 0.012, sy: 0.014, sz: 0.096 },
      { geo: box, px: 0.21, py: -0.003, pz: 0.052, rx: 0.06, sx: 0.014, sy: 0.015, sz: 0.096 },
      // Twin diagonal structural tension tie-rods back into podium wall
      { geo: box, px: -0.15, py: 0.036, pz: 0.044, rx: 0.72, sx: 0.008, sy: 0.008, sz: 0.114 },
      { geo: box, px: 0.15, py: 0.036, pz: 0.044, rx: 0.72, sx: 0.008, sy: 0.008, sz: 0.114 },
      // Recessed storefront portal jamb pilasters
      { geo: box, px: -0.206, py: -0.1075, pz: 0.008, sx: 0.020, sy: 0.215, sz: 0.024 },
      { geo: box, px: 0.206, py: -0.1075, pz: 0.008, sx: 0.020, sy: 0.215, sz: 0.024 }
    ]);
    const retailCanopyGlass = mergeParts(THREE, [
      { geo: box, px: 0, py: 0.004, pz: 0.052, rx: 0.06, sx: 0.408, sy: 0.007, sz: 0.088 }
    ]);
    const retailLintel = mergeParts(THREE, [
      { geo: box, px: 0, py: -0.017, pz: 0.022, sx: 0.39, sy: 0.014, sz: 0.030 }
    ]);

    // 10d. Shared Pre-Merged Rooftop Mechanical & Sky-Garden Kits (all resting cleanly on local y = 0.000)
    const rooftopHvacKit = mergeParts(THREE, [
      // Mounting steel skids
      { geo: box, px: 0, py: 0.006, pz: -0.042, sx: 0.185, sy: 0.012, sz: 0.014 },
      { geo: box, px: 0, py: 0.006, pz: 0.042, sx: 0.185, sy: 0.012, sz: 0.014 },
      // Primary chiller cabinet & stepped compressor module
      { geo: box, px: -0.006, py: 0.044, pz: 0, sx: 0.162, sy: 0.068, sz: 0.104 },
      { geo: box, px: 0.092, py: 0.031, pz: 0, sx: 0.040, sy: 0.044, sz: 0.072 },
      // Twin cylindrical exhaust fan cowling shrouds
      { geo: cyl16, px: -0.048, py: 0.087, pz: 0, sx: 0.062, sy: 0.022, sz: 0.062 },
      { geo: cyl16, px: 0.036, py: 0.087, pz: 0, sx: 0.062, sy: 0.022, sz: 0.062 },
      // Insulated refrigerant riser & elbow bridge
      { geo: box, px: 0.086, py: 0.060, pz: 0.016, sx: 0.042, sy: 0.014, sz: 0.018 },
      { geo: cyl16, px: 0.092, py: 0.054, pz: -0.016, sx: 0.016, sy: 0.028, sz: 0.016 }
    ]);
    const rooftopHvacDark = mergeParts(THREE, [
      { geo: cyl16, px: -0.048, py: 0.096, pz: 0, sx: 0.048, sy: 0.008, sz: 0.048 },
      { geo: cyl16, px: 0.036, py: 0.096, pz: 0, sx: 0.048, sy: 0.008, sz: 0.048 },
      { geo: box, px: -0.006, py: 0.044, pz: 0.054, sx: 0.132, sy: 0.042, sz: 0.006 },
      { geo: box, px: -0.006, py: 0.044, pz: -0.054, sx: 0.132, sy: 0.042, sz: 0.006 }
    ]);

    const rooftopPenthouse = mergeParts(THREE, [
      { geo: box, px: -0.012, py: 0.068, pz: 0, sx: 0.185, sy: 0.136, sz: 0.148 },
      { geo: box, px: -0.012, py: 0.142, pz: 0, sx: 0.204, sy: 0.014, sz: 0.166 },
      { geo: box, px: 0.088, py: 0.052, pz: -0.01, sx: 0.056, sy: 0.104, sz: 0.092 },
      { geo: box, px: 0.088, py: 0.108, pz: -0.01, sx: 0.066, sy: 0.010, sz: 0.102 }
    ]);
    const rooftopPenthouseLouvers = mergeParts(THREE, [
      { geo: box, px: -0.012, py: 0.090, pz: 0.076, sx: 0.136, sy: 0.042, sz: 0.008 },
      { geo: box, px: -0.012, py: 0.090, pz: -0.076, sx: 0.136, sy: 0.042, sz: 0.008 },
      { geo: box, px: -0.106, py: 0.090, pz: 0, sx: 0.008, sy: 0.042, sz: 0.100 },
      { geo: box, px: 0.088, py: 0.042, pz: 0.038, sx: 0.034, sy: 0.076, sz: 0.008 }
    ]);

    const rooftopGlassRail = mergeParts(THREE, [
      { geo: box, px: 0, py: 0.028, pz: 0.455, sx: 0.90, sy: 0.048, sz: 0.012 },
      { geo: box, px: 0, py: 0.028, pz: -0.455, sx: 0.90, sy: 0.048, sz: 0.012 },
      { geo: box, px: 0.455, py: 0.028, pz: 0, sx: 0.012, sy: 0.048, sz: 0.89 },
      { geo: box, px: -0.455, py: 0.028, pz: 0, sx: 0.012, sy: 0.048, sz: 0.89 }
    ]);
    const rooftopGlassRailPosts = mergeParts(THREE, [
      { geo: box, px: 0, py: 0.054, pz: 0.455, sx: 0.92, sy: 0.008, sz: 0.018 },
      { geo: box, px: 0, py: 0.054, pz: -0.455, sx: 0.92, sy: 0.008, sz: 0.018 },
      { geo: box, px: 0.455, py: 0.054, pz: 0, sx: 0.018, sy: 0.008, sz: 0.91 },
      { geo: box, px: -0.455, py: 0.054, pz: 0, sx: 0.018, sy: 0.008, sz: 0.91 },
      { geo: box, px: -0.455, py: 0.028, pz: -0.455, sx: 0.018, sy: 0.056, sz: 0.018 },
      { geo: box, px: 0.455, py: 0.028, pz: -0.455, sx: 0.018, sy: 0.056, sz: 0.018 },
      { geo: box, px: -0.455, py: 0.028, pz: 0.455, sx: 0.018, sy: 0.056, sz: 0.018 },
      { geo: box, px: 0.455, py: 0.028, pz: 0.455, sx: 0.018, sy: 0.056, sz: 0.018 }
    ]);

    const pergolaParts = [
      { geo: box, px: -0.095, py: 0.050, pz: -0.062, sx: 0.014, sy: 0.100, sz: 0.014 },
      { geo: box, px: 0.095, py: 0.050, pz: -0.062, sx: 0.014, sy: 0.100, sz: 0.014 },
      { geo: box, px: -0.095, py: 0.050, pz: 0.062, sx: 0.014, sy: 0.100, sz: 0.014 },
      { geo: box, px: 0.095, py: 0.050, pz: 0.062, sx: 0.014, sy: 0.100, sz: 0.014 },
      { geo: box, px: -0.095, py: 0.100, pz: 0, sx: 0.016, sy: 0.014, sz: 0.144 },
      { geo: box, px: 0.095, py: 0.100, pz: 0, sx: 0.016, sy: 0.014, sz: 0.144 },
      // Raised planter box curbs flanking pergola
      { geo: box, px: -0.128, py: 0.016, pz: 0, sx: 0.042, sy: 0.032, sz: 0.142 },
      { geo: box, px: 0.128, py: 0.016, pz: 0, sx: 0.042, sy: 0.032, sz: 0.142 }
    ];
    for (const lz of [-0.058, -0.029, 0.0, 0.029, 0.058]) {
      pergolaParts.push({ geo: box, px: 0, py: 0.107, pz: lz, sx: 0.214, sy: 0.008, sz: 0.012 });
    }
    const rooftopPergola = mergeParts(THREE, pergolaParts);
    const rooftopPlanterGreens = mergeParts(THREE, [
      { geo: box, px: -0.128, py: 0.040, pz: 0, sx: 0.034, sy: 0.028, sz: 0.132 },
      { geo: box, px: 0.128, py: 0.040, pz: 0, sx: 0.034, sy: 0.028, sz: 0.132 },
      { geo: treeCrown, px: -0.128, py: 0.060, pz: 0.042, sx: 0.24, sy: 0.24, sz: 0.24 },
      { geo: treeCrown, px: 0.128, py: 0.060, pz: -0.042, sx: 0.24, sy: 0.24, sz: 0.24 }
    ]);

    // 10e. Modern Roadside EV Bus Stop Shelter (local y=0 base, facing +Z, W≈0.41, D≈0.16, H≈0.24)
    const busCanopyShape = new THREE.Shape();
    busCanopyShape.moveTo(-0.074, 0.190);
    busCanopyShape.quadraticCurveTo(0.0, 0.218, 0.078, 0.200);
    busCanopyShape.lineTo(0.078, 0.193);
    busCanopyShape.quadraticCurveTo(0.0, 0.210, -0.074, 0.183);
    busCanopyShape.closePath();
    const busCanopyArc = new THREE.ExtrudeGeometry(busCanopyShape, { depth: 0.324, bevelEnabled: false });
    busCanopyArc.translate(0, 0, -0.162);
    busCanopyArc.rotateY(-Math.PI * 0.5);

    const busStopGlass = mergeParts(THREE, [
      { geo: busCanopyArc, px: -0.018, py: 0, pz: 0 },
      { geo: box, px: -0.018, py: 0.114, pz: -0.056, sx: 0.282, sy: 0.132, sz: 0.008 }
    ]);
    busCanopyArc.dispose();

    const busStopMetal = mergeParts(THREE, [
      // Base mounting curb bar seated flush at y=0.000
      { geo: box, px: -0.018, py: 0.004, pz: -0.048, sx: 0.312, sy: 0.008, sz: 0.038 },
      // Twin brushed-silver cantilevered rear columns
      { geo: box, px: -0.155, py: 0.098, pz: -0.056, sx: 0.018, sy: 0.196, sz: 0.018 },
      { geo: box, px: 0.118, py: 0.098, pz: -0.056, sx: 0.018, sy: 0.196, sz: 0.018 },
      // Cantilevered arched-roof steel support arms
      { geo: box, px: -0.155, py: 0.196, pz: 0.002, rx: -0.08, sx: 0.016, sy: 0.012, sz: 0.144 },
      { geo: box, px: 0.118, py: 0.196, pz: 0.002, rx: -0.08, sx: 0.016, sy: 0.012, sz: 0.144 },
      // Rear glass windscreen mullions + front canopy drip fascia
      { geo: box, px: -0.018, py: 0.182, pz: -0.056, sx: 0.290, sy: 0.010, sz: 0.014 },
      { geo: box, px: -0.018, py: 0.044, pz: -0.056, sx: 0.290, sy: 0.010, sz: 0.014 },
      { geo: box, px: -0.018, py: 0.196, pz: 0.077, sx: 0.326, sy: 0.010, sz: 0.008 },
      // Left electronic route display cabinet frame & pedestal
      { geo: box, px: -0.125, py: 0.106, pz: -0.036, sx: 0.068, sy: 0.152, sz: 0.022 },
      { geo: box, px: -0.125, py: 0.018, pz: -0.036, sx: 0.046, sy: 0.036, sz: 0.018 },
      // Metal bench legs seated at y=0.000
      { geo: box, px: -0.045, py: 0.025, pz: -0.022, sx: 0.012, sy: 0.050, sz: 0.042 },
      { geo: box, px: 0.088, py: 0.025, pz: -0.022, sx: 0.012, sy: 0.050, sz: 0.042 },
      // Roadside vertical transit stop sign mast pole & base collar
      { geo: box, px: 0.188, py: 0.118, pz: 0.018, sx: 0.014, sy: 0.236, sz: 0.014 },
      { geo: cyl16, px: 0.188, py: 0.006, pz: 0.018, sx: 0.036, sy: 0.012, sz: 0.036 }
    ]);

    const busStopBench = mergeParts(THREE, [
      { geo: box, px: 0.022, py: 0.052, pz: -0.018, sx: 0.176, sy: 0.012, sz: 0.046 },
      { geo: box, px: 0.022, py: 0.084, pz: -0.040, rx: -0.14, sx: 0.176, sy: 0.036, sz: 0.010 }
    ]);

    const busStopDisplay = mergeParts(THREE, [
      { geo: box, px: -0.125, py: 0.112, pz: -0.023, sx: 0.056, sy: 0.116, sz: 0.006 }
    ]);

    const busStopHeaderLed = mergeParts(THREE, [
      { geo: box, px: -0.018, py: 0.203, pz: 0.079, sx: 0.304, sy: 0.006, sz: 0.006 },
      { geo: box, px: -0.125, py: 0.176, pz: -0.024, sx: 0.058, sy: 0.008, sz: 0.008 }
    ]);

    const busStopSign = mergeParts(THREE, [
      { geo: box, px: 0.188, py: 0.214, pz: 0.018, sx: 0.056, sy: 0.058, sz: 0.014 }
    ]);

    this.geos = {
      box,
      aoQuad,
      cyl16,
      cyl24,
      oct,
      taperOct,
      taperPyr,
      taperSquare,
      damGravityBody,
      damButtresses,
      parapetFrame,
      rectCornerFins,
      planters4,
      planters2,
      balconyStrip,
      balconyGlass,
      corniceBelt,
      retailCanopy,
      retailCanopyGlass,
      retailLintel,
      rooftopHvacKit,
      rooftopHvacDark,
      rooftopPenthouse,
      rooftopPenthouseLouvers,
      rooftopGlassRail,
      rooftopGlassRailPosts,
      rooftopPergola,
      rooftopPlanterGreens,
      busStopMetal,
      busStopGlass,
      busStopBench,
      busStopDisplay,
      busStopHeaderLed,
      busStopSign,
      cone8,
      sphere16,
      hemiDome,
      capsule,
      sawtoothRoof,
      gasSphereSupport,
      coolingTower,
      stadiumBowl,
      stadiumRoof,
      ferrisWheelFrame,
      heliostatMirrors,
      heliostatPedestals,
      gantryCraneRed,
      gullWingRoof,
      copenhillWedge,
      fuselage,
      airlinerWing,
      airlinerHTail,
      airlinerVTail,
      shipHullBoot: makeShipHullGeo(0.24, 0.96, -1.04, 0.09),
      shipHullMain: makeShipHullGeo(0.26, 0.98, -1.10, 0.14),
      fuxingMidBody,
      fuxingHeadBody,
      fuxingMidDark,
      fuxingHeadDark,
      fuxingMidStripe,
      fuxingHeadStripe,
      fuxingHeadlights,
      vehSedanBody,
      vehSedanCabin,
      vehSedanWheels,
      vehSedanHL,
      vehSedanTL,
      vehSuvBody,
      vehSuvCabin,
      vehSuvWheels,
      vehSuvHL,
      vehSuvTL,
      vehBusBody,
      vehBusDark,
      vehBusStripe,
      vehBusWheels,
      vehBusHL,
      vehBusTL,
      vehTruckCab,
      vehTruckGlass,
      vehTruckWheels,
      vehTruckHL,
      vehTruckTL,
      vehFireBody,
      vehFireSilver,
      vehGarbageHopper,
      windMast: new THREE.CylinderGeometry(0.030, 0.068, 1.58, 14),
      windNacelle,
      windBlade: new THREE.ConeGeometry(0.036, 0.44, 7),
      spireNeedle: new THREE.ConeGeometry(0.026, 0.88, 4),
      umbrellaCanopy: new THREE.ConeGeometry(0.11, 0.06, 8),
      treeCrown
    };
  }

  setNightFactor(night) {
    const n = Math.max(0, Math.min(1, night));
    if (this._sharedArchUniforms && this._sharedArchUniforms.uArchNight) {
      this._sharedArchUniforms.uArchNight.value = n;
    }

    const emi = n * 1.28;
    for (let i = 0; i < this.emissiveMaterials.length; i++) {
      this.emissiveMaterials[i].emissiveIntensity = emi;
    }

    // Subtle warm commercial storefront lintel & illuminated EV transit route board ramp at dusk/night
    if (this.m.retailWarmGlow) {
      this.m.retailWarmGlow.emissiveIntensity = 0.20 + n * 1.05;
    }
    if (this.m.busStopScreen) {
      this.m.busStopScreen.emissiveIntensity = 0.42 + n * 1.08;
    }
    if (this.m.busSign) {
      this.m.busSign.emissiveIntensity = 0.22 + n * 0.60;
    }

    // Scale vehicle headlights & ruby taillights brightly whenever night > 0.18
    if (this.m.vehHeadlight && this.m.vehTaillight) {
      if (n > 0.18) {
        const ramp = Math.min(1, (n - 0.18) / 0.52);
        this.m.vehHeadlight.emissiveIntensity = 0.45 + ramp * 2.45;
        this.m.vehTaillight.emissiveIntensity = 0.42 + ramp * 2.18;
      } else {
        this.m.vehHeadlight.emissiveIntensity = 0.16;
        this.m.vehTaillight.emissiveIntensity = 0.20;
      }
    }
  }

  // ==================== Helpers for Building Assembly ====================

  _addMesh(grp, geo, mat, px, py, pz, sx = 1, sy = 1, sz = 1, shadow = true, ry = 0) {
    const m = new this.THREE.Mesh(geo, mat);
    m.position.set(px, py, pz);
    m.scale.set(sx, sy, sz);
    if (ry !== 0) m.rotation.y = ry;
    m.castShadow = shadow;
    m.receiveShadow = true;
    grp.add(m);
    return m;
  }

  // Grounded soft Contact AO shadow skirt under buildings (marked skipGhost = true; seated cleanly below pad to avoid Z-fighting!)
  _addContactAO(grp, sx = 1.06, sz = 1.06, py = 0.002) {
    const ao = new this.THREE.Mesh(this.geos.aoQuad, this.m.contactAO);
    ao.position.set(0, py, 0);
    ao.scale.set(sx, 1, sz);
    ao.castShadow = false;
    ao.receiveShadow = false;
    ao.userData.skipGhost = true;
    grp.add(ao);
    return ao;
  }

  _addZonedPlotPad(grp, ab = false, fourCorners = true) {
    this._addMesh(grp, this.geos.box, ab ? this.m.pavingPlazaDusty : this.m.pavingPlaza, 0, 0.014, 0, 0.92, 0.020, 0.92, false);
    const pSet = fourCorners ? this.geos.planters4 : this.geos.planters2;
    this._addMesh(grp, pSet.curbs, ab ? this.m.abandoned : this.m.parapetStone, 0, 0, 0, 1, 1, 1, false);
    this._addMesh(grp, pSet.trunks, this.m.teakDeck, 0, 0, 0, 1, 1, 1, false);
    this._addMesh(grp, pSet.leaves, ab ? this.m.abandonedRust : this.m.lawn, 0, 0, 0, 1, 1, 1, true);
  }

  _localToWorld(lx, ly, lz, x, y0, z, rotRad) {
    const c = Math.cos(rotRad);
    const s = Math.sin(rotRad);
    return new this.THREE.Vector3(
      x + lx * c + lz * s,
      y0 + ly,
      z - lx * s + lz * c
    );
  }

  _pushSmoke(hooks, lx, ly, lz, x, y0, z, rotRad, isSteam = false) {
    if (!hooks || !hooks.smokeSources) return;
    const wp = this._localToWorld(lx, ly, lz, x, y0, z, rotRad);
    wp.isSteam = isSteam;
    hooks.smokeSources.push(wp);
  }

  _addBeacon(grp, hooks, lx, ly, lz, x, y0, z, rotRad, ab = false) {
    if (ab) return null;
    const bm = this._addMesh(grp, this.geos.sphere16, this.m.beaconRed, lx, ly, lz, 0.065, 0.065, 0.065, false);
    bm.userData.worldPos = this._localToWorld(lx, ly, lz, x, y0, z, rotRad);
    if (hooks && hooks.beacons) hooks.beacons.push(bm);
    return bm;
  }

  _addTinyTree(grp, lx, ly, lz, sc = 0.7) {
    this._addMesh(grp, this.geos.cyl16, this.m.teakDeck, lx, ly + 0.05 * sc, lz, 0.03 * sc, 0.10 * sc, 0.03 * sc, false);
    this._addMesh(grp, this.geos.treeCrown, this.m.lawn, lx, ly + 0.14 * sc, lz, sc, sc, sc, true);
  }

  _addHelipad(grp, lx, ly, lz, width = 0.30, ab = false) {
    this._addMesh(grp, this.geos.box, ab ? this.m.abandoned : this.m.roofConcrete, lx, ly + 0.014, lz, width + 0.04, 0.026, width + 0.04, true);
    const pad = this._addMesh(grp, this.geos.box, ab ? this.m.abandoned : this.m.helipad, lx, ly + 0.029, lz, width, 0.006, width, false);
    return pad;
  }

  _addRooftopHVAC(grp, lx, ly, lz, ab = false, sc = 1.0, ry = 0) {
    const mat = ab ? this.m.abandoned : this.m.brushedSilver;
    const fanMat = ab ? this.m.abandonedRust : this.m.steelDark;
    this._addMesh(grp, this.geos.rooftopHvacKit, mat, lx, ly, lz, sc, sc, sc, true, ry);
    this._addMesh(grp, this.geos.rooftopHvacDark, fanMat, lx, ly, lz, sc, sc, sc, false, ry);
  }

  // Shared Pre-Merged 3D Cantilevered Retail Entrance Canopy & Warm Glowing Storefront Lintel
  _addShopfrontCanopy(grp, cx, baseY, faceZ, sx = 1.0, ab = false, useMetal = false) {
    const frameMat = ab ? this.m.abandoned : (useMetal ? this.m.brushedSilver : this.m.charcoalFrame);
    const glassMat = ab ? this.m.abandonedRust : this.m.balconyGlass;
    const canopyY = baseY + 0.215;
    this._addMesh(grp, this.geos.retailCanopy, frameMat, cx, canopyY, faceZ, sx, 1.0, 1.0, true);
    this._addMesh(grp, this.geos.retailCanopyGlass, glassMat, cx, canopyY, faceZ, sx, 1.0, 1.0, false);
    if (!ab) {
      this._addMesh(grp, this.geos.retailLintel, this.m.retailWarmGlow, cx, canopyY, faceZ, sx, 1.0, 1.0, false);
    }
  }

  // Shared Pre-Merged 3D Protruding Concrete & Tinted-Glass Balcony Clusters for RH Towers (Lv.2-5)
  _addBalconyBands(grp, cx, cz, w, d, tBase, shaftH, lv, ab = false) {
    if (lv < 2 || shaftH < 1.15) return;
    const slabMat = ab ? this.m.abandoned : this.m.parapetStone;
    const glassMat = ab ? this.m.abandonedRust : this.m.balconyGlass;
    const bandCount = lv === 2 ? 2 : (lv === 3 ? 3 : 4);
    const minY = tBase + 0.42;
    const maxY = tBase + shaftH - 0.34;
    if (maxY <= minY) return;
    for (let i = 0; i < bandCount; i++) {
      const t = bandCount === 1 ? 0.5 : i / (bandCount - 1);
      const by = minY + t * (maxY - minY);
      this._addMesh(grp, this.geos.balconyStrip, slabMat, cx, by, cz, w, 1.0, d, true);
      this._addMesh(grp, this.geos.balconyGlass, glassMat, cx, by, cz, w, 1.0, d, false);
    }
  }

  // Curated Rooftop Mechanical & Sky-Garden Kit (HVAC chiller bank, elevator penthouse + louvers, glass parapet rail & pergola planters)
  _addRooftopKit(grp, w, d, topY, level = 2, seed = 0, style = 'office', ab = false, cx = 0, cz = 0, keepCenterClear = false) {
    const rw = Math.max(0.24, w);
    const rd = Math.max(0.24, d);
    const minSpan = Math.min(rw, rd);
    const silverMat = ab ? this.m.abandoned : this.m.brushedSilver;
    const stoneMat = ab ? this.m.abandoned : this.m.parapetStone;
    const louverMat = ab ? this.m.abandonedRust : this.m.refugeLouvers;
    const glassMat = ab ? this.m.abandonedRust : this.m.balconyGlass;
    const pergolaMat = ab ? this.m.abandoned : (style === 'residential' || style === 'civic' ? this.m.teakDeck : this.m.charcoalFrame);
    const greenMat = ab ? this.m.abandonedRust : this.m.lawn;
    const rot90 = rd > rw * 1.15 ? Math.PI * 0.5 : 0;

    // 1. Sleek Glass Perimeter Rooftop Parapet Railing on Lv.2-5 residential, commercial, office & civic roofs
    if (level >= 2 && style !== 'industrial' && rw >= 0.30 && rd >= 0.28) {
      this._addMesh(grp, this.geos.rooftopGlassRail, glassMat, cx, topY + 0.004, cz, rw, 1.0, rd, false);
      this._addMesh(grp, this.geos.rooftopGlassRailPosts, silverMat, cx, topY + 0.004, cz, rw, 1.0, rd, false);
    }

    if (keepCenterClear) {
      // Leave central helipad zone completely unobstructed; tuck compact twin-shroud HVAC unit in rear corner
      const hvacSc = Math.max(0.48, Math.min(0.80, (minSpan * 0.34) / 0.12));
      this._addRooftopHVAC(grp, cx - rw * 0.26, topY + 0.004, cz - rd * 0.24, ab, hvacSc, rot90);
      return;
    }

    if (style === 'industrial') {
      const hvacSc = Math.max(0.62, Math.min(1.05, (minSpan * 0.46) / 0.12));
      this._addRooftopHVAC(grp, cx - rw * 0.22, topY + 0.004, cz - rd * 0.12, ab, hvacSc, rot90);
      if (level >= 2 && rw >= 0.42) {
        const phSc = Math.max(0.55, Math.min(0.95, (minSpan * 0.52) / 0.16));
        this._addMesh(grp, this.geos.rooftopPenthouse, silverMat, cx + rw * 0.20, topY + 0.004, cz - rd * 0.08, phSc, phSc * 0.85, phSc, true, rot90);
        this._addMesh(grp, this.geos.rooftopPenthouseLouvers, louverMat, cx + rw * 0.20, topY + 0.004, cz - rd * 0.08, phSc, phSc * 0.85, phSc, false, rot90);
      }
      return;
    }

    // Check if roof has ample span for side-by-side elevator penthouse + sky-garden pergola
    const wantSkyGarden = !ab && level >= 2 && rw >= 0.38 && rd >= 0.28 && (style === 'residential' || style === 'commercial' || style === 'civic' || (style === 'office' && (seed % 2 === 0)));

    if (wantSkyGarden) {
      const phSc = Math.max(0.50, Math.min(0.88, Math.min(rw * 0.36 / 0.22, rd * 0.64 / 0.16)));
      const pgSc = Math.max(0.48, Math.min(0.88, Math.min(rw * 0.40 / 0.26, rd * 0.64 / 0.15)));
      const hvacSc = Math.max(0.48, Math.min(0.76, (minSpan * 0.34) / 0.11));

      // Elevator machine-room penthouse + louvers on left half
      this._addMesh(grp, this.geos.rooftopPenthouse, stoneMat, cx - rw * 0.20, topY + 0.004, cz - rd * 0.04, phSc, phSc, phSc, true);
      this._addMesh(grp, this.geos.rooftopPenthouseLouvers, louverMat, cx - rw * 0.20, topY + 0.004, cz - rd * 0.04, phSc, phSc, phSc, false);
      // Sky-garden timber/steel pergola & lush raised planters on sunlit right half
      this._addMesh(grp, this.geos.rooftopPergola, pergolaMat, cx + rw * 0.18, topY + 0.004, cz + rd * 0.04, pgSc, pgSc, pgSc, true);
      this._addMesh(grp, this.geos.rooftopPlanterGreens, greenMat, cx + rw * 0.18, topY + 0.004, cz + rd * 0.04, pgSc, pgSc, pgSc, true);
      // Compact twin-fan HVAC chiller tucked cleanly beside penthouse if roof depth permits
      if (rd >= 0.40) {
        this._addRooftopHVAC(grp, cx - rw * 0.18, topY + 0.004, cz + rd * 0.24, ab, hvacSc);
      }
    } else {
      const phSc = Math.max(0.52, Math.min(0.95, (minSpan * 0.54) / 0.16));
      const hvacSc = Math.max(0.52, Math.min(0.92, (minSpan * 0.40) / 0.11));
      if (level >= 2 || style === 'civic') {
        const phX = rw >= 0.44 ? cx - rw * 0.14 : cx;
        this._addMesh(grp, this.geos.rooftopPenthouse, stoneMat, phX, topY + 0.004, cz - rd * 0.06, phSc, phSc, phSc, true);
        this._addMesh(grp, this.geos.rooftopPenthouseLouvers, louverMat, phX, topY + 0.004, cz - rd * 0.06, phSc, phSc, phSc, false);
        if (rw >= 0.44) {
          this._addRooftopHVAC(grp, cx + rw * 0.22, topY + 0.004, cz + rd * 0.06, ab, hvacSc, rot90);
        }
      } else {
        this._addRooftopHVAC(grp, cx - rw * 0.12, topY + 0.004, cz - rd * 0.06, ab, hvacSc, rot90);
      }
    }
  }

  _placeGLB(grp, key, px, py, pz, sx, sy, sz, ab = false, ry = 0) {
    const proto = this.glbProtos && this.glbProtos[key];
    if (!proto) return false;
    const inst = proto.clone();
    if (ab) {
      inst.traverse((ch) => {
        if (ch.isMesh && ch.material) {
          if (Array.isArray(ch.material)) {
            ch.material = ch.material.map((mt) => this._getDustyGLBMat(mt));
          } else {
            ch.material = this._getDustyGLBMat(ch.material);
          }
        }
      });
    }
    inst.position.set(px, py, pz);
    inst.scale.set(sx, sy, sz);
    if (ry !== 0) inst.rotation.y = ry;
    grp.add(inst);
    return true;
  }

  // Fits a normalized CC0 GLB prototype (minY=0, centered XZ) uniformly inside (targetW, targetH, targetD)
  _placeFittedGLB(grp, key, px, py, pz, targetW, targetH, targetD, ab = false, ry = 0) {
    const proto = this.glbProtos && this.glbProtos[key];
    if (!proto) return null;
    const os = (proto.userData && proto.userData.origSize) || { x: 1, y: 1, z: 1 };
    const sx = targetW / Math.max(0.01, os.x);
    const sy = targetH / Math.max(0.01, os.y);
    const sz = targetD / Math.max(0.01, os.z);
    const u = Math.min(sx, sy, sz);
    const inst = proto.clone();
    if (ab) {
      inst.traverse((ch) => {
        if (ch.isMesh && ch.material) {
          ch.material = Array.isArray(ch.material)
            ? ch.material.map((mt) => this._getDustyGLBMat(mt))
            : this._getDustyGLBMat(ch.material);
        }
      });
    }
    inst.position.set(px, py, pz);
    inst.scale.set(u, u, u);
    if (ry !== 0) inst.rotation.y = ry;
    grp.add(inst);
    return inst;
  }

  _getBusLineMat(colorHex) {
    if (!colorHex) return this.m.busTurquoise;
    if (!this._busLineMats) this._busLineMats = new Map();
    let mat = this._busLineMats.get(colorHex);
    if (!mat) {
      mat = new this.THREE.MeshStandardMaterial({
        color: colorHex,
        roughness: 0.28,
        metalness: 0.25,
        emissive: colorHex,
        emissiveIntensity: 0.16
      });
      this._busLineMats.set(colorHex, mat);
    }
    return mat;
  }

  // ==================== Master Building Factory ====================

  buildBuilding(b, x, z, y0, rotRad = 0, hooks = {}) {
    const THREE = this.THREE;
    const grp = new THREE.Group();
    grp.position.set(x, y0, z);
    grp.rotation.y = rotRad;

    const lv = Math.max(1, b.level || 1);
    const v = Math.abs(b.variant || 0);
    const ab = Boolean(b.abandoned);
    const type = b.type || 'RL';

    // Grounded Contact AO Shadow Skirt under every building
    if (type === 'stadium') {
      this._addContactAO(grp, 1.34, 1.14, 0.002);
    } else if (
      type === 'landmark' || type === 'amusement_park' || type === 'nuclear_plant' ||
      type === 'solar_plant' || type === 'seaport' || type === 'zoo' ||
      type === 'botanical_garden' || type === 'museum' || type === 'tv_tower'
    ) {
      this._addContactAO(grp, 1.18, 1.18, 0.002);
    } else if (type === 'airport') {
      this._addContactAO(grp, 1.72, 1.12, 0.002);
    } else if (type === 'power_wind') {
      this._addContactAO(grp, 0.48, 0.48, 0.002);
    } else {
      this._addContactAO(grp, 1.06, 1.06, 0.002);
    }

    switch (type) {
      case 'RL':
        this._buildVillaRL(grp, lv, v, ab);
        break;
      case 'CL':
        this._buildShopCL(grp, lv, v, ab);
        break;
      case 'RH':
        this._buildCondoRH(grp, lv, v, ab);
        break;
      case 'CH':
      case 'O':
        this._buildSkyscraperCHO(grp, type, lv, v, ab, x, y0, z, rotRad, hooks);
        break;
      case 'I':
        this._buildIndustrialI(grp, lv, v, ab, x, y0, z, rotRad, hooks);
        break;
      case 'landmark':
        this._buildLandmarkObelisk(grp, ab, x, y0, z, rotRad, hooks);
        break;
      case 'zoo':
        this._buildZoo(grp, ab, hooks);
        break;
      case 'botanical_garden':
        this._buildBotanicalGarden(grp, ab);
        break;
      case 'museum':
        this._buildMuseum(grp, ab);
        break;
      case 'tv_tower':
        this._buildTvTower(grp, ab, x, y0, z, rotRad, hooks);
        break;
      case 'stadium':
        this._buildOlympicStadium(grp, ab);
        break;
      case 'amusement_park':
        this._buildAmusementPark(grp, ab, hooks);
        break;
      case 'airport':
        this._buildAirport(grp, ab, x, y0, z, rotRad, hooks);
        break;
      case 'seaport':
        this._buildSeaport(grp, ab, x, y0, z, rotRad, hooks);
        break;
      case 'nuclear_plant':
        this._buildNuclearPlant(grp, ab, x, y0, z, rotRad, hooks);
        break;
      case 'solar_plant':
        this._buildSolarPlant(grp, ab, x, y0, z, rotRad, hooks);
        break;
      case 'waste_plant':
        this._buildWastePlant(grp, ab, x, y0, z, rotRad, hooks);
        break;
      case 'power_wind':
        this._buildWindTurbine(grp, ab, x, y0, z, rotRad, hooks);
        break;
      case 'power_plant':
        this._buildThermalPowerPlant(grp, ab, x, y0, z, rotRad, hooks);
        break;
      case 'water_pump':
      case 'sewage_out':
      case 'water_treat':
        this._buildWaterFacility(grp, type, ab);
        break;
      case 'fire_station':
        this._buildFireStation(grp, ab, x, y0, z, rotRad, hooks);
        break;
      case 'police_station':
        this._buildPoliceStation(grp, ab);
        break;
      case 'hospital':
        this._buildHospital(grp, ab);
        break;
      case 'school':
        this._buildSchool(grp, ab);
        break;
      case 'park':
        this._buildPark(grp);
        break;
      case 'metro_station':
        this._buildMetroStation(grp, ab);
        break;
      case 'hsr_station':
        this._buildHSRStation(grp, ab);
        break;
      default:
        this._addZonedPlotPad(grp, ab, true);
        this._addMesh(grp, this.geos.box, ab ? this.m.dustyCBD : this.m.cbdIceBlue, 0, 0.024 + 0.34, 0, 0.64, 0.68, 0.64, true);
        break;
    }

    return grp;
  }

  // ==================== 1. Photorealistic PBR Zoned Buildings ====================

  _buildVillaRL(grp, lv, v, ab) {
    this._addZonedPlotPad(grp, ab, false);

    const lawnMat = ab ? this.m.abandonedRust : this.m.lawn;
    const hedgeMat = ab ? this.m.abandoned : this.m.hedge;
    const villaMats = [this.m.villaCream, this.m.villaSand, this.m.villaCool];
    const wallMat = ab ? this.m.dustyVilla : villaMats[v % villaMats.length];
    const trimMat = ab ? this.m.abandoned : this.m.parapetStone;

    this._addMesh(grp, this.geos.box, lawnMat, 0, 0.022, -0.14, 0.80, 0.012, 0.54, false);
    this._addMesh(grp, this.geos.box, hedgeMat, 0, 0.052, -0.42, 0.84, 0.06, 0.04, true);
    this._addMesh(grp, this.geos.box, hedgeMat, -0.42, 0.052, -0.05, 0.04, 0.06, 0.72, true);
    this._addMesh(grp, this.geos.box, hedgeMat, 0.42, 0.052, -0.05, 0.04, 0.06, 0.72, true);

    // Showcase Kenney CC0 Suburban Villas on Lv.1-2 non-abandoned plots when external GLB pack is loaded!
    if (lv <= 2 && !ab && (v % 2 === 0)) {
      const cc0Keys = ['cc0_villa_a', 'cc0_villa_b', 'cc0_villa_c', 'cc0_villa_d'];
      const key = cc0Keys[(v >> 1) % cc0Keys.length];
      if (this._placeFittedGLB(grp, key, 0, 0.024, 0.03, 0.68, lv === 2 ? 0.56 : 0.46, 0.62, false, 0)) {
        this._addTinyTree(grp, -0.30, 0.024, -0.30, 0.62);
        this._addTinyTree(grp, 0.30, 0.024, -0.28, 0.56);
        return;
      }
    }

    const baseY = 0.024;
    const mainH = lv >= 3 ? 0.51 : 0.34;
    const wingH = 0.34;
    const houseZ = lv >= 3 ? 0.11 : 0.04;
    const houseX = (v & 1) === 0 ? -0.08 : 0.08;
    const wingX = (v & 1) === 0 ? 0.19 : -0.19;

    this._addMesh(grp, this.geos.box, wallMat, houseX, baseY + mainH * 0.5, houseZ, 0.46, mainH, 0.42, true);
    this._addMesh(grp, this.geos.box, wallMat, wingX, baseY + wingH * 0.5, houseZ + 0.04, 0.26, wingH * 0.65, 0.34, true);
    this._addMesh(grp, this.geos.box, this.m.charcoalFrame, houseX, baseY + 0.15, houseZ + 0.24, 0.20, 0.020, 0.09, true);

    const isFlatModern = (v % 2) === 1;
    let roofTopY = baseY + mainH;

    if (isFlatModern) {
      this._addMesh(grp, this.geos.parapetFrame, trimMat, houseX, baseY + mainH + 0.024, houseZ, 0.47, 0.048, 0.43, true);
      this._addMesh(grp, this.geos.parapetFrame, trimMat, wingX, baseY + wingH * 0.65 + 0.02, houseZ + 0.04, 0.27, 0.04, 0.35, true);
      roofTopY = baseY + mainH + 0.03;
    } else {
      const pitchMat = ab ? this.m.abandonedRust : ((v % 4 === 0) ? this.m.terracottaRoof : this.m.slateRoof);
      this._addMesh(grp, this.geos.taperPyr, pitchMat, houseX, baseY + mainH + 0.085, houseZ, 0.54, 0.17, 0.50, true, Math.PI * 0.25);
      this._addMesh(grp, this.geos.box, trimMat, wingX, baseY + wingH * 0.65 + 0.015, houseZ + 0.04, 0.28, 0.03, 0.36, true);
      roofTopY = baseY + mainH + 0.11;
    }

    if (lv >= 2 && !ab) {
      const sol = this._addMesh(grp, this.geos.box, this.m.solarPanel, wingX, baseY + wingH * 0.65 + 0.04, houseZ + 0.04, 0.20, 0.014, 0.18, false);
      sol.rotation.x = 0.22;
    }

    if (lv >= 3) {
      this._addMesh(grp, this.geos.box, ab ? this.m.abandonedRust : this.m.teakDeck, -0.19, 0.032, -0.24, 0.32, 0.020, 0.22, false);
      this._addMesh(grp, this.geos.box, trimMat, 0.15, 0.032, -0.24, 0.36, 0.024, 0.23, false);
      if (!ab) {
        this._addMesh(grp, this.geos.box, this.m.poolWater, 0.15, 0.040, -0.24, 0.31, 0.014, 0.18, false);
        this._addMesh(grp, this.geos.cyl16, this.m.whiteComposite, -0.22, 0.095, -0.25, 0.015, 0.13, 0.015, false);
        this._addMesh(grp, this.geos.umbrellaCanopy, this.neonMats[v % this.neonMats.length], -0.22, 0.165, -0.25, 1, 1, 1, true);
      }
    } else if (!ab && roofTopY > 0) {
      this._addTinyTree(grp, 0.24, 0.024, -0.24, 0.62);
    }
  }

  _buildShopCL(grp, lv, v, ab) {
    this._addZonedPlotPad(grp, ab, false);

    const podMat = ab ? this.m.dustyRetail : this.m.retailPodiumConc;
    const upperMats = [this.m.finStoneChampagne, this.m.cbdIceBlue, this.m.condoWarmGrey, this.m.finStoneSilver];
    const upperMat = ab ? (v % 2 === 0 ? this.m.dustyStoneFin : this.m.dustyCBD) : upperMats[v % upperMats.length];
    const trimMat = ab ? this.m.abandoned : this.m.parapetStone;

    const baseY = 0.024;
    const podH = 0.36;
    const upperFloors = Math.min(3, lv);
    const upperH = upperFloors * 0.17;

    this._addMesh(grp, this.geos.box, podMat, 0, baseY + podH * 0.5, -0.05, 0.76, podH, 0.62, true);
    // 3D cantilevered steel-and-glass retail entrance awning + warm glowing storefront lintel + podium cornice belt
    this._addShopfrontCanopy(grp, 0, baseY, 0.26, 1.18, ab, (v & 1) === 1);
    this._addMesh(grp, this.geos.corniceBelt, trimMat, 0, baseY + podH - 0.008, -0.05, 0.76, 1.0, 0.62, true);

    const uBase = baseY + podH;
    let roofW = 0.72, roofD = 0.56, roofCX = 0;
    if ((v & 1) === 0) {
      this._addMesh(grp, this.geos.box, upperMat, 0, uBase + upperH * 0.5, -0.07, 0.72, upperH, 0.56, true);
      this._addMesh(grp, this.geos.parapetFrame, trimMat, 0, uBase + upperH + 0.025, -0.07, 0.73, 0.05, 0.57, true);
    } else {
      roofW = 0.56; roofCX = -0.08;
      this._addMesh(grp, this.geos.box, upperMat, -0.08, uBase + upperH * 0.5, -0.07, 0.56, upperH, 0.56, true);
      this._addMesh(grp, this.geos.box, upperMat, 0.18, uBase + (upperH * 0.66) * 0.5, -0.02, 0.34, upperH * 0.66, 0.48, true);
      this._addMesh(grp, this.geos.parapetFrame, trimMat, -0.08, uBase + upperH + 0.025, -0.07, 0.57, 0.05, 0.57, true);
    }

    const neonMat = ab ? this.m.abandonedRust : this.neonMats[(v + lv) % this.neonMats.length];
    this._addMesh(grp, this.geos.box, neonMat, 0, baseY + 0.295, 0.265, 0.54, 0.030, 0.018, false);
    this._addMesh(grp, this.geos.box, neonMat, 0.35, uBase + 0.16, 0.18, 0.020, 0.20, 0.065, false);

    if (!ab) {
      for (const cx of [-0.22, 0.20]) {
        this._addMesh(grp, this.geos.cyl16, this.m.whiteComposite, cx, 0.052, 0.34, 0.055, 0.045, 0.055, false);
        this._addMesh(grp, this.geos.cyl16, this.m.brushedSilver, cx, 0.10, 0.34, 0.012, 0.10, 0.012, false);
        this._addMesh(grp, this.geos.umbrellaCanopy, this.neonMats[(v + (cx > 0 ? 1 : 3)) % this.neonMats.length], cx, 0.16, 0.34, 0.80, 0.80, 0.80, true);
      }
    }

    this._addRooftopKit(grp, roofW, roofD, uBase + upperH, lv, v, 'commercial', ab, roofCX, -0.07, false);
  }

  _buildCondoRH(grp, lv, v, ab) {
    this._addZonedPlotPad(grp, ab, true);

    const facadeMats = [this.m.condoWarmWhite, this.m.condoWarmGrey, this.m.condoChampagne, this.m.condoSandStone];
    const wallMat = ab ? ((v & 1) ? this.m.dustyCondoGrey : this.m.dustyCondo) : facadeMats[v % facadeMats.length];
    const podMat = ab ? this.m.dustyRetail : this.m.retailPodium;
    const pilasterMat = ab ? this.m.abandoned : this.m.parapetStone;

    const baseY = 0.024;
    const podH = 0.36;
    this._addMesh(grp, this.geos.box, podMat, 0, baseY + podH * 0.5, 0.02, 0.80, podH, 0.72, true);
    this._addShopfrontCanopy(grp, 0, baseY, 0.38, 0.96, ab, false);
    this._addMesh(grp, this.geos.corniceBelt, pilasterMat, 0, baseY + podH - 0.008, 0.02, 0.80, 1.0, 0.72, true);

    const floorsByLv = [0, 8, 13, 19, 25, 31];
    const nFloors = floorsByLv[Math.min(5, lv)];
    const shaftH = nFloors * 0.15;
    const tBase = baseY + podH;
    const plan = v % 4;

    if (plan === 0) {
      const sideH = (nFloors - 1) * 0.15;
      this._addMesh(grp, this.geos.box, wallMat, 0, tBase + shaftH * 0.5, -0.02, 0.72, shaftH, 0.32, true);
      this._addMesh(grp, this.geos.box, wallMat, -0.20, tBase + sideH * 0.5, -0.02, 0.24, sideH, 0.40, true);
      this._addMesh(grp, this.geos.box, wallMat, 0.20, tBase + sideH * 0.5, -0.02, 0.24, sideH, 0.40, true);
      // 3D protruding glass balconies spanning both flanking residential wings on Lv.2-5
      this._addBalconyBands(grp, 0, -0.02, 0.68, 0.40, tBase, sideH, lv, ab);

      const topY = tBase + shaftH;
      this._addMesh(grp, this.geos.parapetFrame, pilasterMat, 0, topY + 0.038, -0.02, 0.73, 0.075, 0.33, true);
      this._addRooftopKit(grp, 0.72, 0.32, topY, lv, v, 'residential', ab, 0, -0.02, false);
    } else if (plan === 1) {
      const northH = (nFloors - 2) * 0.15;
      this._addMesh(grp, this.geos.box, wallMat, 0, tBase + shaftH * 0.5, 0.06, 0.68, shaftH, 0.32, true);
      this._addMesh(grp, this.geos.box, wallMat, 0, tBase + northH * 0.5, -0.15, 0.32, northH, 0.42, true);
      this._addBalconyBands(grp, 0, 0.06, 0.68, 0.32, tBase, shaftH, lv, ab);

      const topY = tBase + shaftH;
      this._addMesh(grp, this.geos.parapetFrame, pilasterMat, 0, topY + 0.038, 0.06, 0.69, 0.075, 0.33, true);
      this._addMesh(grp, this.geos.parapetFrame, pilasterMat, 0, tBase + northH + 0.032, -0.15, 0.33, 0.065, 0.43, true);
      this._addRooftopKit(grp, 0.68, 0.32, topY, lv, v, 'residential', ab, 0, 0.06, false);
    } else if (plan === 2) {
      const wingH = (nFloors - 3) * 0.15;
      this._addMesh(grp, this.geos.box, wallMat, 0.02, tBase + shaftH * 0.5, -0.12, 0.68, shaftH, 0.32, true);
      this._addMesh(grp, this.geos.box, wallMat, -0.16, tBase + wingH * 0.5, 0.08, 0.32, wingH, 0.50, true);
      this._addBalconyBands(grp, 0.02, -0.12, 0.68, 0.32, tBase, shaftH, lv, ab);

      const topY = tBase + shaftH;
      this._addMesh(grp, this.geos.parapetFrame, pilasterMat, 0.02, topY + 0.038, -0.12, 0.69, 0.075, 0.33, true);
      this._addMesh(grp, this.geos.parapetFrame, pilasterMat, -0.16, tBase + wingH + 0.032, 0.08, 0.33, 0.065, 0.51, true);
      this._addRooftopKit(grp, 0.68, 0.32, topY, lv, v, 'residential', ab, 0.02, -0.12, false);
    } else {
      const hB = Math.max(0.90, (nFloors - 4) * 0.15);
      this._addMesh(grp, this.geos.box, wallMat, -0.15, tBase + shaftH * 0.5, -0.06, 0.38, shaftH, 0.36, true);
      this._addMesh(grp, this.geos.box, wallMat, 0.16, tBase + hB * 0.5, 0.06, 0.36, hB, 0.36, true);
      this._addBalconyBands(grp, -0.15, -0.06, 0.38, 0.36, tBase, shaftH, lv, ab);
      this._addBalconyBands(grp, 0.16, 0.06, 0.36, 0.36, tBase, hB, lv, ab);

      const topA = tBase + shaftH;
      const topB = tBase + hB;
      this._addMesh(grp, this.geos.parapetFrame, pilasterMat, -0.15, topA + 0.035, -0.06, 0.39, 0.07, 0.37, true);
      this._addMesh(grp, this.geos.parapetFrame, pilasterMat, 0.16, topB + 0.035, 0.06, 0.37, 0.07, 0.37, true);
      this._addRooftopKit(grp, 0.38, 0.36, topA, lv, v, 'residential', ab, -0.15, -0.06, false);
      this._addRooftopKit(grp, 0.36, 0.36, topB, Math.max(1, lv - 1), v + 1, 'residential', ab, 0.16, 0.06, false);
    }
  }

  _buildSkyscraperCHO(grp, type, lv, v, ab, x, y0, z, rotRad, hooks) {
    this._addZonedPlotPad(grp, ab, true);

    const isOffice = type === 'O';
    const metalMat = ab ? this.m.abandoned : this.m.brushedSilver;
    const stoneTrimMat = ab ? this.m.abandoned : this.m.parapetStone;
    const darkBandMat = ab ? this.m.abandonedRust : this.m.refugeLouvers;
    const ledMat = ab ? this.m.abandoned : (isOffice ? this.m.ledLinearCyan : this.m.ledLinearWhite);
    const podMat = ab ? this.m.dustyRetail : this.m.retailPodium;
    const roofStyle = isOffice ? 'office' : 'commercial';

    const baseY = 0.024;
    const podH = 0.36;
    this._addMesh(grp, this.geos.box, podMat, 0, baseY + podH * 0.5, 0, 0.80, podH, 0.76, true);
    // 3D cantilevered commercial/office lobby canopy + warm storefront lintel + podium cornice belt
    this._addShopfrontCanopy(grp, 0, baseY, 0.38, 1.24, ab, true);
    this._addMesh(grp, this.geos.corniceBelt, isOffice ? metalMat : stoneTrimMat, 0, baseY + podH - 0.008, 0, 0.80, 1.0, 0.76, true);

    const floorsByLv = [0, 8, 14, 21, 28, 35];
    const nFloors = floorsByLv[Math.min(5, lv)];
    const shaftH = nFloors * 0.17;
    const tBase = baseY + podH;
    const sil = (v + (isOffice ? 2 : 0)) % 4;
    let helipadY = tBase + shaftH;
    let helipadX = 0, helipadZ = -0.02;

    if (sil === 0) {
      const mat = ab ? this.m.dustyCBD : (isOffice ? this.m.cbdSlateSilver : this.m.cbdIceBlue);
      const w = 0.60, d = 0.56;
      const midBandY = tBase + Math.floor(nFloors * 0.5) * 0.17;
      this._addMesh(grp, this.geos.box, mat, 0, tBase + shaftH * 0.5, -0.02, w, shaftH, d, true);
      this._addMesh(grp, this.geos.rectCornerFins, metalMat, 0, tBase + shaftH * 0.5, -0.02, w, shaftH, d, true);
      this._addMesh(grp, this.geos.box, darkBandMat, 0, midBandY, -0.02, w + 0.012, 0.065, d + 0.012, true);
      // 3D horizontal cornice stringcourse ledges framing refuge level & upper crown
      this._addMesh(grp, this.geos.corniceBelt, metalMat, 0, midBandY + 0.042, -0.02, w, 1.0, d, true);
      if (lv >= 4) {
        const hiBandY = tBase + Math.floor(nFloors * 0.78) * 0.17;
        this._addMesh(grp, this.geos.box, darkBandMat, 0, hiBandY, -0.02, w + 0.012, 0.065, d + 0.012, true);
        this._addMesh(grp, this.geos.corniceBelt, metalMat, 0, hiBandY + 0.042, -0.02, w, 1.0, d, true);
      }

      const topY = tBase + shaftH;
      this._addMesh(grp, this.geos.corniceBelt, metalMat, 0, topY - 0.012, -0.02, w, 1.0, d, true);
      this._addMesh(grp, this.geos.parapetFrame, metalMat, 0, topY + 0.06, -0.02, w + 0.01, 0.12, d + 0.01, true);
      if (!ab) this._addMesh(grp, this.geos.parapetFrame, ledMat, 0, topY + 0.125, -0.02, w + 0.016, 0.016, d + 0.016, false);
      this._addRooftopKit(grp, w, d, topY, lv, v, roofStyle, ab, 0, -0.02, lv >= 4);
      helipadY = topY + 0.005;
      helipadX = 0.06; helipadZ = 0.04;
    } else if (sil === 1) {
      const mat = ab ? this.m.dustyCBD : (isOffice ? this.m.cbdTealGlass : this.m.cbdDeepAzure);
      const hA = shaftH;
      const hB = Math.max(1.02, Math.floor(nFloors * 0.80) * 0.17);

      this._addMesh(grp, this.geos.box, mat, -0.17, tBase + hA * 0.5, -0.09, 0.36, hA, 0.40, true);
      this._addMesh(grp, this.geos.rectCornerFins, metalMat, -0.17, tBase + hA * 0.5, -0.09, 0.36, hA, 0.40, true);
      this._addMesh(grp, this.geos.box, mat, 0.17, tBase + hB * 0.5, 0.10, 0.36, hB, 0.40, true);
      this._addMesh(grp, this.geos.rectCornerFins, metalMat, 0.17, tBase + hB * 0.5, 0.10, 0.36, hB, 0.40, true);

      const sbY = tBase + Math.floor(nFloors * 0.52) * 0.17;
      this._addMesh(grp, this.geos.box, ab ? this.m.dustyCBD : this.m.atriumGlass, 0, sbY, 0.005, 0.38, 0.10, 0.15, true, -0.46);
      this._addMesh(grp, this.geos.box, metalMat, 0, sbY - 0.055, 0.005, 0.39, 0.018, 0.16, true, -0.46);
      // Structural skybridge cornice collars tying twin towers together
      this._addMesh(grp, this.geos.corniceBelt, metalMat, -0.17, sbY - 0.052, -0.09, 0.36, 1.0, 0.40, true);
      this._addMesh(grp, this.geos.corniceBelt, metalMat, 0.17, sbY - 0.052, 0.10, 0.36, 1.0, 0.40, true);

      const topA = tBase + hA;
      const topB = tBase + hB;
      this._addMesh(grp, this.geos.parapetFrame, metalMat, -0.17, topA + 0.045, -0.09, 0.365, 0.09, 0.405, true);
      this._addMesh(grp, this.geos.parapetFrame, metalMat, 0.17, topB + 0.045, 0.10, 0.365, 0.09, 0.405, true);
      if (!ab) {
        this._addMesh(grp, this.geos.parapetFrame, ledMat, -0.17, topA + 0.095, -0.09, 0.37, 0.015, 0.41, false);
        this._addMesh(grp, this.geos.parapetFrame, ledMat, 0.17, topB + 0.095, 0.10, 0.37, 0.015, 0.41, false);
      }
      this._addRooftopKit(grp, 0.36, 0.40, topB, lv, v, roofStyle, ab, 0.17, 0.10, false);
      if (lv < 4) {
        this._addRooftopKit(grp, 0.36, 0.40, topA, lv, v + 1, roofStyle, ab, -0.17, -0.09, false);
      }
      helipadY = topA + 0.005;
      helipadX = -0.17; helipadZ = -0.09;
    } else if (sil === 2) {
      const mat = ab ? this.m.dustyStoneFin : (isOffice ? this.m.finStoneSilver : this.m.finStoneChampagne);
      const n1 = Math.max(4, Math.round(nFloors * 0.52));
      const n2 = Math.max(2, Math.round(nFloors * 0.28));
      const n3 = Math.max(2, nFloors - n1 - n2);
      const h1 = n1 * 0.17, h2 = n2 * 0.17, h3 = n3 * 0.17;

      this._addMesh(grp, this.geos.box, mat, 0, tBase + h1 * 0.5, 0, 0.68, h1, 0.64, true);
      this._addMesh(grp, this.geos.corniceBelt, stoneTrimMat, 0, tBase + h1 - 0.012, 0, 0.68, 1.0, 0.64, true);
      this._addMesh(grp, this.geos.parapetFrame, stoneTrimMat, 0, tBase + h1 + 0.02, 0, 0.69, 0.04, 0.65, true);

      this._addMesh(grp, this.geos.box, mat, 0, tBase + h1 + h2 * 0.5, 0, 0.54, h2, 0.52, true);
      this._addMesh(grp, this.geos.corniceBelt, stoneTrimMat, 0, tBase + h1 + h2 - 0.012, 0, 0.54, 1.0, 0.52, true);
      this._addMesh(grp, this.geos.parapetFrame, stoneTrimMat, 0, tBase + h1 + h2 + 0.02, 0, 0.55, 0.04, 0.53, true);

      this._addMesh(grp, this.geos.box, mat, 0, tBase + h1 + h2 + h3 * 0.5, 0, 0.42, h3, 0.42, true);
      this._addMesh(grp, this.geos.corniceBelt, stoneTrimMat, 0, tBase + h1 + h2 + h3 - 0.012, 0, 0.42, 1.0, 0.42, true);

      const topY = tBase + h1 + h2 + h3;
      this._addMesh(grp, this.geos.parapetFrame, metalMat, 0, topY + 0.055, 0, 0.43, 0.11, 0.43, true);
      if (!ab) this._addMesh(grp, this.geos.parapetFrame, ledMat, 0, topY + 0.115, 0, 0.435, 0.015, 0.435, false);
      this._addRooftopHVAC(grp, 0.20, tBase + h1 + 0.005, 0.18, ab, 0.72);
      this._addRooftopKit(grp, 0.42, 0.42, topY, lv, v, roofStyle, ab, 0, 0, lv >= 4);
      helipadY = topY + 0.005;
      helipadX = 0; helipadZ = 0;
    } else {
      const mat = ab ? this.m.dustyCBD : (isOffice ? this.m.cbdSlateSilver : this.m.cbdTealGlass);
      const nLo = Math.max(4, Math.floor(nFloors * 0.52));
      const nHi = Math.max(3, nFloors - nLo);
      const hLo = nLo * 0.17, hHi = nHi * 0.17;

      this._addMesh(grp, this.geos.box, mat, -0.025, tBase + hLo * 0.5, 0.015, 0.64, hLo, 0.58, true);
      this._addMesh(grp, this.geos.corniceBelt, metalMat, -0.025, tBase + hLo - 0.010, 0.015, 0.64, 1.0, 0.58, true);
      this._addMesh(grp, this.geos.box, ab ? this.m.dustyCBD : this.m.atriumGlass, 0, tBase + hLo + 0.04, 0, 0.58, 0.08, 0.52, false);
      const hiBase = tBase + hLo + 0.08;
      this._addMesh(grp, this.geos.box, mat, 0.025, hiBase + hHi * 0.5, -0.015, 0.64, hHi, 0.58, true);
      this._addMesh(grp, this.geos.rectCornerFins, metalMat, 0.025, hiBase + hHi * 0.5, -0.015, 0.64, hHi, 0.58, true);
      this._addMesh(grp, this.geos.corniceBelt, metalMat, 0.025, hiBase + 0.012, -0.015, 0.64, 1.0, 0.58, true);

      const topY = hiBase + hHi;
      this._addMesh(grp, this.geos.corniceBelt, metalMat, 0.025, topY - 0.012, -0.015, 0.64, 1.0, 0.58, true);
      this._addMesh(grp, this.geos.parapetFrame, metalMat, 0.025, topY + 0.05, -0.015, 0.645, 0.10, 0.585, true);
      if (!ab) this._addMesh(grp, this.geos.parapetFrame, ledMat, 0.025, topY + 0.105, -0.015, 0.65, 0.015, 0.59, false);
      this._addRooftopKit(grp, 0.64, 0.58, topY, lv, v, roofStyle, ab, 0.025, -0.015, lv >= 4);
      helipadY = topY + 0.005;
      helipadX = 0.08; helipadZ = 0.05;
    }

    if (lv >= 4) {
      const padW = sil === 1 ? 0.24 : 0.27;
      this._addHelipad(grp, helipadX, helipadY, helipadZ, padW, ab);
      const mastX = sil === 1 ? -0.30 : (helipadX - 0.18);
      const mastZ = sil === 1 ? -0.24 : (helipadZ - 0.18);
      this._addMesh(grp, this.geos.spireNeedle, metalMat, mastX, helipadY + 0.38, mastZ, 0.85, 0.82, 0.85, true);
      this._addBeacon(grp, hooks, mastX, helipadY + 0.80, mastZ, x, y0, z, rotRad, ab);
    } else if (lv >= 3) {
      this._addMesh(grp, this.geos.spireNeedle, metalMat, helipadX, helipadY + 0.28, helipadZ, 0.75, 0.62, 0.75, true);
      this._addBeacon(grp, hooks, helipadX, helipadY + 0.60, helipadZ, x, y0, z, rotRad, ab);
    }
  }

  _buildIndustrialI(grp, lv, v, ab, x, y0, z, rotRad, hooks) {
    const flip = (Math.floor(v / 3) % 2 === 1) ? -1 : 1;

    this._addZonedPlotPad(grp, ab, false);
    this._addMesh(grp, this.geos.box, ab ? this.m.abandoned : this.m.asphalt, 0, 0.025, -0.02, 0.82, 0.008, 0.76, false);
    const baseY = 0.028;

    if (lv >= 4) {
      const fabMat = ab ? this.m.dustyInd : this.m.indPanelSilver;
      const officeMat = ab ? this.m.dustyCBD : ((v & 1) === 0 ? this.m.cbdDeepAzure : this.m.cbdSlateSilver);
      const fasciaMat = ab ? this.m.abandonedRust : ((v & 1) === 0 ? this.m.factoryFasciaBlue : this.m.factoryFasciaTeal);
      const silver = ab ? this.m.abandoned : this.m.brushedSilver;

      if ((v & 1) === 0) {
        const fabH = 0.42 + (lv - 4) * 0.14;
        this._addMesh(grp, this.geos.box, fabMat, 0, baseY + fabH * 0.5, -0.08, 0.76, fabH, 0.52, true);
        this._addMesh(grp, this.geos.box, fasciaMat, 0, baseY + fabH + 0.015, -0.08, 0.775, 0.03, 0.535, true);
        this._addMesh(grp, this.geos.parapetFrame, silver, 0, baseY + fabH + 0.04, -0.08, 0.76, 0.04, 0.52, true);

        for (const dx of [-0.22, 0, 0.22]) {
          this._addMesh(grp, this.geos.box, this.m.charcoalFrame, dx, baseY + 0.10, 0.185, 0.12, 0.17, 0.02, false);
        }
        this._addMesh(grp, this.geos.box, silver, 0, baseY + 0.21, 0.24, 0.62, 0.022, 0.12, true);
        const cMat = ab ? this.m.abandonedRust : this.containerMats[v % this.containerMats.length];
        this._addMesh(grp, this.geos.box, cMat, 0.20 * flip, baseY + 0.05, 0.27, 0.11, 0.09, 0.20, true);

        const topY = baseY + fabH + 0.02;
        this._addRooftopHVAC(grp, -0.23, topY, -0.18, ab, 0.92);
        this._addRooftopHVAC(grp, -0.23, topY, 0.02, ab, 0.92);
        if (!ab) {
          for (const pz of [-0.18, 0.02]) {
            const pv = this._addMesh(grp, this.geos.box, this.m.solarPanel, 0.14, topY + 0.03, pz, 0.38, 0.014, 0.14, false);
            pv.rotation.x = 0.20;
          }
        }
      } else {
        const hallH = 0.42;
        const rdH = 0.68;
        this._addMesh(grp, this.geos.box, fabMat, 0.02 * flip, baseY + hallH * 0.5, -0.13, 0.74, hallH, 0.44, true);
        this._addMesh(grp, this.geos.box, officeMat, -0.19 * flip, baseY + rdH * 0.5, 0.15, 0.34, rdH, 0.30, true);
        this._addMesh(grp, this.geos.parapetFrame, silver, -0.19 * flip, baseY + rdH + 0.025, 0.15, 0.35, 0.045, 0.31, true);

        this._addMesh(grp, this.geos.box, silver, 0.18 * flip, baseY + 0.20, 0.14, 0.32, 0.022, 0.13, true);
        const c1 = ab ? this.m.abandonedRust : this.containerMats[(v + 1) % this.containerMats.length];
        this._addMesh(grp, this.geos.box, c1, 0.18 * flip, baseY + 0.05, 0.22, 0.11, 0.09, 0.20, true);

        this._addRooftopKit(grp, 0.34, 0.30, baseY + rdH, lv, v, 'industrial', ab, -0.19 * flip, 0.15, false);
        if (!ab) {
          for (const px of [-0.20, 0.02, 0.24]) {
            const pv = this._addMesh(grp, this.geos.box, this.m.solarPanel, px * flip, baseY + hallH + 0.025, -0.13, 0.17, 0.014, 0.30, false);
            pv.rotation.x = 0.18;
          }
        }
      }
      return;
    }

    const arch = v % 3;

    if (arch === 0) {
      const whMat = ab ? this.m.dustyInd : (((v >> 1) & 1) === 0 ? this.m.indPanelBlue : this.m.indPanelSilver);
      const fascia = ab ? this.m.abandonedRust : (((v >> 1) & 1) === 0 ? this.m.factoryFasciaBlue : this.m.factoryFasciaTeal);
      const whH = 0.36 + (lv - 1) * 0.05;

      this._addMesh(grp, this.geos.box, whMat, 0, baseY + whH * 0.5, -0.12, 0.76, whH, 0.48, true);
      this._addMesh(grp, this.geos.box, fascia, 0, baseY + whH + 0.016, -0.12, 0.775, 0.032, 0.495, false);

      this._addRooftopKit(grp, 0.76, 0.48, baseY + whH + 0.02, lv, v, 'industrial', ab, 0, -0.12, false);

      this._addMesh(grp, this.geos.box, this.m.brushedSilver, 0, baseY + 0.19, 0.17, 0.68, 0.022, 0.13, true);
      const bayXs = [-0.22, 0.0, 0.22];
      for (let i = 0; i < 3; i++) {
        this._addMesh(grp, this.geos.box, this.m.charcoalFrame, bayXs[i], baseY + 0.09, 0.125, 0.11, 0.15, 0.02, false);
        const cMat = ab ? this.m.abandonedRust : this.containerMats[(v + i) % this.containerMats.length];
        this._addMesh(grp, this.geos.box, cMat, bayXs[i], baseY + 0.05, 0.24, 0.105, 0.09, 0.20, true);
      }
    } else if (arch === 1) {
      const hallMat = ab ? this.m.dustyInd : this.m.indPanelWarm;
      const darkRoof = ab ? this.m.abandoned : this.m.steelDark;
      const hallH = 0.38 + (lv - 1) * 0.06;

      this._addMesh(grp, this.geos.box, hallMat, -0.13 * flip, baseY + hallH * 0.5, -0.06, 0.52, hallH, 0.62, true);
      this._addMesh(grp, this.geos.sawtoothRoof, darkRoof, -0.13 * flip, baseY + hallH + 0.045, -0.06, 0.72, 0.58, 0.82, true);

      const gMat = ab ? this.m.abandonedRust : this.m.craneYellow;
      for (const gz of [-0.14, 0.18]) {
        this._addMesh(grp, this.geos.box, gMat, 0.17 * flip, baseY + 0.16, gz, 0.024, 0.32, 0.024, true);
        this._addMesh(grp, this.geos.box, gMat, 0.37 * flip, baseY + 0.16, gz, 0.024, 0.32, 0.024, true);
      }
      this._addMesh(grp, this.geos.box, this.m.steelDark, 0.17 * flip, baseY + 0.32, 0.02, 0.024, 0.022, 0.40, true);
      this._addMesh(grp, this.geos.box, this.m.steelDark, 0.37 * flip, baseY + 0.32, 0.02, 0.024, 0.022, 0.40, true);
      this._addMesh(grp, this.geos.box, gMat, 0.27 * flip, baseY + 0.34, 0.04, 0.24, 0.030, 0.05, true);

      this._addMesh(grp, this.geos.box, this.m.brushedSilver, 0.27 * flip, baseY + 0.035, -0.04, 0.13, 0.055, 0.16, true);
      this._addMesh(grp, this.geos.box, this.m.teakDeck, 0.27 * flip, baseY + 0.04, 0.14, 0.12, 0.07, 0.12, true);

      const stackH = hallH + 0.50;
      const sx = -0.27 * flip, sz = -0.28;
      this._addMesh(grp, this.geos.taperOct, ab ? this.m.abandonedRust : this.m.factoryBrick, sx, baseY + stackH * 0.5, sz, 0.14, stackH, 0.14, true);
      this._addMesh(grp, this.geos.cyl16, this.m.charcoalFrame, sx, baseY + stackH - 0.025, sz, 0.09, 0.045, 0.09, false);
      if (!ab) this._pushSmoke(hooks, sx, baseY + stackH + 0.04, sz, x, y0, z, rotRad, false);
    } else {
      const ctrlMat = ab ? this.m.dustyInd : this.m.indPanelBlue;
      const tankMat = ab ? this.m.abandoned : this.m.whiteComposite;
      const silver = ab ? this.m.abandoned : this.m.brushedSilver;
      const ctrlH = 0.36 + (lv - 1) * 0.05;

      this._addMesh(grp, this.geos.box, ctrlMat, -0.21 * flip, baseY + ctrlH * 0.5, 0.14, 0.34, ctrlH, 0.34, true);
      this._addMesh(grp, this.geos.parapetFrame, silver, -0.21 * flip, baseY + ctrlH + 0.02, 0.14, 0.35, 0.035, 0.35, true);

      for (const [tx, tz, sc] of [[-0.18 * flip, -0.20, 0.82], [0.13 * flip, -0.20, 0.74]]) {
        this._addMesh(grp, this.geos.gasSphereSupport, this.m.steelDark, tx, baseY, tz, sc, sc, sc, true);
        this._addMesh(grp, this.geos.sphere16, tankMat, tx, baseY + 0.33 * sc, tz, 0.34 * sc, 0.34 * sc, 0.34 * sc, true);
        if (!ab) {
          this._addMesh(grp, this.geos.cyl24, this.m.factoryFasciaTeal, tx, baseY + 0.33 * sc, tz, 0.348 * sc, 0.02, 0.348 * sc, false);
        }
      }

      const pipeEW = this._addMesh(grp, this.geos.cyl16, silver, -0.02 * flip, baseY + 0.22, -0.04, 0.028, 0.50, 0.028, true);
      pipeEW.rotation.z = Math.PI * 0.5;
      const pipeNS = this._addMesh(grp, this.geos.cyl16, silver, 0.18 * flip, baseY + 0.22, -0.02, 0.026, 0.38, 0.026, true);
      pipeNS.rotation.x = Math.PI * 0.5;

      const colH = 0.60 + lv * 0.10;
      const cx = 0.19 * flip, cz = 0.15;
      this._addMesh(grp, this.geos.cyl24, silver, cx, baseY + colH * 0.5, cz, 0.14, colH, 0.14, true);
      this._addMesh(grp, this.geos.hemiDome, silver, cx, baseY + colH, cz, 0.14, 0.07, 0.14, true);
      for (let r = 1; r <= 3; r++) {
        this._addMesh(grp, this.geos.cyl24, this.m.steelDark, cx, baseY + (colH * r) * 0.26, cz, 0.175, 0.015, 0.175, false);
      }

      const stackH = colH + 0.22;
      const sx = 0.31 * flip, sz = -0.02;
      this._addMesh(grp, this.geos.cyl16, silver, sx, baseY + stackH * 0.5, sz, 0.052, stackH, 0.052, true);
      if (!ab) this._pushSmoke(hooks, sx, baseY + stackH + 0.03, sz, x, y0, z, rotRad, true);
    }
  }

  // ==================== 2. Landmark, Civic, Energy & Hydroelectric Dam ====================

  // Sculpted Monumental Hydroelectric Gravity Dam Segment (local y=0 corresponds to world y=0)
  createHydroDamSegment(crestY = 1.0, minH = -0.4, isGenerating = false, damHp = 100) {
    const THREE = this.THREE;
    const grp = new THREE.Group();

    const cY = Number.isFinite(crestY) ? crestY : 1.0;
    const mH = Number.isFinite(minH) ? minH : -0.4;
    const baseY = Math.min(-0.65, mH - 0.22);
    const wallH = Math.max(0.45, cY - baseY);
    const midY = baseY + wallH * 0.5;

    // 1. Tapered/Sloped Concrete Gravity Dam Wall (wide anchored toe tapering cleanly to crest)
    this._addMesh(grp, this.geos.damGravityBody, this.m.damConcrete, 0, midY, 0, 1.02, wallH, 1.02, true);

    // 2. Flanking Concrete Buttress Piers + Recessed Vertical Spillway Sluice Bay + Steel Gate Lintel
    this._addMesh(grp, this.geos.damButtresses, this.m.damConcrete, 0, midY, 0, 1.0, wallH, 1.0, true);
    const sluiceH = Math.max(0.24, wallH * 0.62);
    const sluiceY = cY - sluiceH * 0.5 - 0.08;
    this._addMesh(grp, this.geos.box, this.m.darkGranite, 0, sluiceY, 0, 0.48, sluiceH, 1.05, true);
    this._addMesh(grp, this.geos.box, this.m.darkGranite, 0, sluiceY, 0, 1.05, sluiceH, 0.48, true);
    // Steel Tainter-Gate Spillway Lintels near crest
    this._addMesh(grp, this.geos.box, this.m.steelDark, 0, cY - 0.11, 0, 0.54, 0.055, 1.08, true);
    this._addMesh(grp, this.geos.box, this.m.steelDark, 0, cY - 0.11, 0, 1.08, 0.055, 0.54, true);

    // 3. Crest Roadway Deck + Dual Safety Parapet Curbs
    this._addMesh(grp, this.geos.box, this.m.asphalt, 0, cY + 0.018, 0, 1.02, 0.036, 0.88, false);
    this._addMesh(grp, this.geos.parapetFrame, this.m.parapetStone, 0, cY + 0.052, 0, 1.03, 0.055, 1.03, true);

    // 4. Lower Turbine Powerhouse Intake Gallery + Cyan Generation Status / Red Low-HP Hazard Stripe
    const phH = Math.min(0.32, wallH * 0.36);
    const phY = baseY + wallH * 0.28;
    this._addMesh(grp, this.geos.box, this.m.damConcrete, 0, phY, 0, 0.62, phH, 1.14, true);
    this._addMesh(grp, this.geos.box, this.m.damConcrete, 0, phY, 0, 1.14, phH, 0.62, true);

    const statusMat = isGenerating ? this.m.ledLinearCyan : this.m.charcoalFrame;
    this._addMesh(grp, this.geos.box, statusMat, 0, phY + phH * 0.25, 0, 0.46, 0.042, 1.16, false);
    this._addMesh(grp, this.geos.box, statusMat, 0, phY + phH * 0.25, 0, 1.16, 0.042, 0.46, false);

    if (damHp !== undefined && damHp < 65) {
      this._addMesh(grp, this.geos.box, this.m.beaconRed, 0, cY - 0.045, 0, 1.07, 0.035, 1.07, false);
    }

    return grp;
  }

  _buildLandmarkObelisk(grp, ab, x, y0, z, rotRad, hooks) {
    const silver = ab ? this.m.abandoned : this.m.brushedSilver;
    const glassMain = ab ? this.m.dustyCBD : this.m.cbdIceBlue;
    const glassUpper = ab ? this.m.dustyCBD : this.m.cbdSlateSilver;
    const podMat = ab ? this.m.dustyRetail : this.m.retailPodium;
    const refugeMat = ab ? this.m.abandonedRust : this.m.refugeLouvers;
    const ledTrim = ab ? this.m.abandoned : this.m.ledLinearCyan;

    this._addMesh(grp, this.geos.box, ab ? this.m.pavingPlazaDusty : this.m.pavingPlaza, 0, 0.03, 0, 1.06, 0.06, 1.06, true);
    this._addMesh(grp, this.geos.box, podMat, 0, 0.24, 0, 0.88, 0.36, 0.88, true);
    this._addMesh(grp, this.geos.box, silver, 0, 0.43, 0, 0.90, 0.025, 0.90, true);
    if (!ab) {
      for (const [tx, tz] of [[-0.44, -0.44], [0.44, -0.44], [-0.44, 0.44], [0.44, 0.44]]) {
        this._addTinyTree(grp, tx, 0.06, tz, 0.65);
      }
    }

    this._addMesh(grp, this.geos.taperSquare, glassMain, 0, 0.45 + 1.53, 0, 0.84, 3.06, 0.72, true);
    this._addMesh(grp, this.geos.taperSquare, glassMain, 0, 0.45 + 1.53, 0, 0.72, 3.06, 0.84, true);
    this._addMesh(grp, this.geos.rectCornerFins, silver, 0, 0.45 + 1.53, 0, 0.68, 3.06, 0.68, true);
    this._addMesh(grp, this.geos.box, refugeMat, 0, 3.51, 0, 0.64, 0.08, 0.64, true);
    if (!ab) this._addMesh(grp, this.geos.parapetFrame, ledTrim, 0, 3.56, 0, 0.65, 0.02, 0.65, false);

    this._addMesh(grp, this.geos.taperSquare, glassUpper, 0, 3.56 + 1.19, 0, 0.64, 2.38, 0.54, true);
    this._addMesh(grp, this.geos.taperSquare, glassUpper, 0, 3.56 + 1.19, 0, 0.54, 2.38, 0.64, true);
    this._addMesh(grp, this.geos.rectCornerFins, silver, 0, 3.56 + 1.19, 0, 0.52, 2.38, 0.52, true);
    this._addMesh(grp, this.geos.box, refugeMat, 0, 5.94, 0, 0.48, 0.075, 0.48, true);
    if (!ab) this._addMesh(grp, this.geos.parapetFrame, ledTrim, 0, 5.985, 0, 0.49, 0.02, 0.49, false);

    this._addMesh(grp, this.geos.taperSquare, glassMain, 0, 5.99 + 0.85, 0, 0.48, 1.70, 0.40, true);
    this._addMesh(grp, this.geos.taperSquare, glassMain, 0, 5.99 + 0.85, 0, 0.40, 1.70, 0.48, true);
    this._addMesh(grp, this.geos.parapetFrame, silver, 0, 7.72, 0, 0.36, 0.14, 0.36, true);
    if (!ab) {
      this._addMesh(grp, this.geos.box, this.m.atriumGlass, 0, 7.72, 0, 0.32, 0.12, 0.32, false);
      this._addMesh(grp, this.geos.parapetFrame, this.m.ledLinearWhite, 0, 7.80, 0, 0.37, 0.02, 0.37, false);
    }
    this._addHelipad(grp, 0, 7.76, 0, 0.24, ab);

    this._addMesh(grp, this.geos.spireNeedle, silver, 0, 7.79 + 0.42, 0, 1.35, 0.96, 1.35, true, Math.PI * 0.25);
    this._addBeacon(grp, hooks, 0, 8.64, 0, x, y0, z, rotRad, ab);
  }

  _buildOlympicStadium(grp, ab) {
    const shellMat = ab ? this.m.abandoned : this.m.whiteComposite;
    const roofMat = ab ? this.m.abandoned : this.m.brushedSilver;
    const lightMat = ab ? this.m.abandonedRust : this.m.floodlightWhite;

    this._addMesh(grp, this.geos.cyl24, ab ? this.m.pavingPlazaDusty : this.m.pavingPlaza, 0, 0.015, 0, 1.24, 0.03, 1.04, false);
    this._addMesh(grp, this.geos.stadiumBowl, shellMat, 0, 0.02, 0, 1.16, 1.05, 0.94, true);
    this._addMesh(grp, this.geos.stadiumRoof, roofMat, 0, 0.02, 0, 1.16, 1.05, 0.94, true);
    this._addMesh(grp, this.geos.cyl24, ab ? this.m.abandonedRust : this.m.soccerPitch, 0, 0.045, 0, 0.68, 0.015, 0.54, false);

    for (const [sx, sz] of [[-0.48, -0.38], [0.48, -0.38], [-0.48, 0.38], [0.48, 0.38]]) {
      const ang = Math.atan2(-sx, -sz);
      const mast = this._addMesh(grp, this.geos.cyl16, this.m.steelDark, sx, 0.36, sz, 0.026, 0.68, 0.026, true, ang);
      mast.rotation.x = 0.16;
      const head = this._addMesh(grp, this.geos.box, lightMat, sx * 0.88, 0.69, sz * 0.88, 0.13, 0.075, 0.035, false, ang);
      head.rotation.x = 0.45;
    }
  }

  _buildAmusementPark(grp, ab, hooks) {
    const THREE = this.THREE;
    this._addMesh(grp, this.geos.box, ab ? this.m.pavingPlazaDusty : this.m.pavingPlaza, 0, 0.018, 0, 1.06, 0.035, 1.06, false);

    const t1 = ab ? this.m.abandonedRust : this.m.neonRose;
    const t2 = ab ? this.m.abandonedRust : this.m.neonGold;
    const t3 = ab ? this.m.abandonedRust : this.m.neonCyan;

    this._addMesh(grp, this.geos.cyl16, this.m.whiteComposite, -0.32, 0.09, 0.30, 0.22, 0.12, 0.22, true);
    this._addMesh(grp, this.geos.cone8, t1, -0.32, 0.21, 0.30, 0.28, 0.14, 0.28, true);

    this._addMesh(grp, this.geos.cyl16, this.m.whiteComposite, 0.32, 0.09, 0.30, 0.22, 0.12, 0.22, true);
    this._addMesh(grp, this.geos.cone8, t2, 0.32, 0.21, 0.30, 0.28, 0.14, 0.28, true);

    this._addMesh(grp, this.geos.cyl16, t3, 0.34, 0.08, -0.28, 0.20, 0.10, 0.20, true);
    this._addMesh(grp, this.geos.hemiDome, this.m.whiteComposite, 0.34, 0.13, -0.28, 0.22, 0.14, 0.22, true);

    const hubY = 0.92;
    const pylonMat = ab ? this.m.abandoned : this.m.whiteComposite;
    for (const pz of [-0.13, 0.13]) {
      for (const side of [-1, 1]) {
        const leg = this._addMesh(grp, this.geos.cyl16, pylonMat, side * 0.19, hubY * 0.5, pz, 0.032, 0.98, 0.032, true);
        leg.rotation.z = side * 0.38;
      }
    }

    const wheelGroup = new THREE.Group();
    wheelGroup.position.set(-0.04, hubY, 0);
    this._addMesh(wheelGroup, this.geos.ferrisWheelFrame, ab ? this.m.abandoned : this.m.brushedSilver, 0, 0, 0, 1, 1, 1, true);
    if (!ab) {
      const ledTorus = this._addMesh(wheelGroup, this.geos.cyl24, this.m.neonCyan, 0, 0, 0, 0.22, 0.16, 0.22, false);
      ledTorus.rotation.x = Math.PI * 0.5;
    }

    const gondolas = [];
    for (let i = 0; i < 12; i++) {
      const a = (i * Math.PI * 2) / 12;
      const gx = Math.cos(a) * 0.68;
      const gy = Math.sin(a) * 0.68;
      const gMat = ab ? this.m.abandonedRust : this.neonMats[i % this.neonMats.length];
      const pod = new THREE.Mesh(this.geos.capsule, gMat);
      pod.position.set(gx, gy, 0);
      pod.scale.set(0.24, 0.16, 0.28);
      pod.rotation.x = Math.PI * 0.5;
      pod.castShadow = true;
      wheelGroup.add(pod);
      gondolas.push(pod);
    }
    wheelGroup.userData.gondolas = gondolas;
    grp.add(wheelGroup);

    if (!ab && hooks && hooks.ferrisWheels) {
      hooks.ferrisWheels.push(wheelGroup);
    }
  }

  _buildAirport(grp, ab, x, y0, z, rotRad, hooks) {
    const THREE = this.THREE;
    const silver = ab ? this.m.abandoned : this.m.brushedSilver;
    const white = ab ? this.m.abandoned : this.m.whiteComposite;
    const conc = ab ? this.m.abandoned : this.m.roofConcrete;
    const glass = ab ? this.m.dustyCBD : this.m.cbdIceBlue;
    const dark = ab ? this.m.abandonedRust : this.m.asphalt;

    // 1. Concrete Terminal Apron & Grounded Embankment Plinth (front +Z faces access street cleanly!)
    this._addMesh(grp, this.geos.box, ab ? this.m.pavingPlazaDusty : this.m.pavingPlaza, 0, 0.015, 0.02, 1.72, 0.030, 0.88, false);
    this._addMesh(grp, this.geos.box, conc, 0, -0.095, -0.02, 1.78, 0.21, 0.96, false);

    // 2. Sculpted International Terminal Concourse (z = +0.16, wide sweeping gull-wing roof + panoramic curtain wall)
    this._addMesh(grp, this.geos.box, glass, 0, 0.175, 0.18, 0.98, 0.30, 0.40, true);
    this._addMesh(grp, this.geos.box, white, 0, 0.045, 0.18, 1.02, 0.04, 0.43, false);
    this._addMesh(grp, this.geos.gullWingRoof, silver, 0, 0.33, 0.18, 1.18, 1.0, 1.38, true);
    // Street-facing (+Z) departures curbside canopy & illuminated signage band
    this._addShopfrontCanopy(grp, 0, 0.028, 0.38, 1.42, ab, true);
    if (!ab) {
      this._addMesh(grp, this.geos.box, this.m.ledLinearCyan, 0, 0.315, 0.39, 0.86, 0.016, 0.014, false);
    }

    // 3. Three Glass Passenger Boarding Jetbridges + Concrete Piers + Yellow Apron Stand Lead-in Lines
    for (const jx of [-0.32, 0.0, 0.32]) {
      this._addMesh(grp, this.geos.box, glass, jx, 0.135, -0.10, 0.055, 0.056, 0.24, true);
      this._addMesh(grp, this.geos.box, white, jx, 0.166, -0.10, 0.062, 0.010, 0.25, false);
      this._addMesh(grp, this.geos.cyl16, silver, jx, 0.068, -0.20, 0.024, 0.12, 0.024, false);
      if (!ab) {
        this._addMesh(grp, this.geos.box, this.m.craneYellow, jx, 0.032, -0.28, 0.016, 0.004, 0.16, false);
      }
    }

    // 4. Sculpted ATC Control Tower (west flank of concourse) with Flared Cab & Rotating Radar
    const tx = -0.68, tz = 0.20;
    this._addMesh(grp, this.geos.box, conc, tx, 0.12, tz, 0.26, 0.22, 0.26, true);
    this._addMesh(grp, this.geos.taperOct, white, tx, 0.62, tz, 0.22, 1.12, 0.22, true);
    const atcCab = this._addMesh(grp, this.geos.taperOct, glass, tx, 1.24, tz, 0.39, 0.19, 0.39, true);
    atcCab.rotation.z = Math.PI;
    this._addMesh(grp, this.geos.cyl24, silver, tx, 1.355, tz, 0.25, 0.042, 0.25, true);

    const radar = new THREE.Group();
    radar.position.set(tx, 1.425, tz);
    this._addMesh(radar, this.geos.cyl16, silver, 0, -0.02, 0, 0.024, 0.06, 0.024, false);
    this._addMesh(radar, this.geos.box, ab ? this.m.abandonedRust : this.m.craneRed, 0, 0.02, 0, 0.26, 0.032, 0.028, true);
    this._addMesh(radar, this.geos.box, white, 0, 0.02, 0, 0.15, 0.036, 0.032, false);
    grp.add(radar);

    if (!ab && hooks && hooks.radarDishes) hooks.radarDishes.push(radar);
    this._addBeacon(grp, hooks, tx, 1.50, tz, x, y0, z, rotRad, ab);

    // 5. Maintenance Hangar + Aviation Fuel Storage Farm (east flank)
    this._addMesh(grp, this.geos.box, ab ? this.m.dustyInd : this.m.indPanelSilver, 0.68, 0.15, 0.14, 0.36, 0.26, 0.32, true);
    const hangarArch = this._addMesh(grp, this.geos.cyl16, silver, 0.68, 0.27, 0.14, 0.36, 0.32, 0.14, true);
    hangarArch.rotation.x = Math.PI * 0.5;
    this._addMesh(grp, this.geos.box, dark, 0.68, 0.12, -0.024, 0.26, 0.19, 0.012, false);
    for (const fx of [0.98, 1.14]) {
      this._addMesh(grp, this.geos.cyl16, white, fx, 0.085, 0.10, 0.11, 0.14, 0.11, true);
      if (!ab) this._addMesh(grp, this.geos.cyl16, this.m.craneYellow, fx, 0.135, 0.10, 0.115, 0.018, 0.115, false);
    }

    // 6. Parallel Taxiway + 3 Connecting Turnoffs Joining Apron to Runway
    const taxiZ = -0.45;
    this._addMesh(grp, this.geos.box, dark, 0, 0.026, taxiZ, 3.20, 0.020, 0.16, false);
    this._addMesh(grp, this.geos.box, conc, 0, -0.095, taxiZ, 3.28, 0.22, 0.22, false);
    if (!ab) {
      this._addMesh(grp, this.geos.box, this.m.craneYellow, 0, 0.038, taxiZ, 3.10, 0.004, 0.016, false);
    }
    for (const cx of [-1.42, 0.0, 1.42]) {
      this._addMesh(grp, this.geos.box, dark, cx, 0.026, -0.63, 0.18, 0.020, 0.26, false);
      if (!ab) {
        this._addMesh(grp, this.geos.box, this.m.craneYellow, cx, 0.038, -0.63, 0.016, 0.004, 0.24, false);
      }
    }

    // 7. Full-Length Illuminated International Runway along local X-axis (length = 3.80, width = 0.50 at z = -0.82!)
    const rwZ = -0.82;
    const rwLen = 3.80;
    const rwW = 0.50;
    // Engineered concrete embankment plinth extending down to y = -0.21 so runway never floats on gently sloped terrain!
    this._addMesh(grp, this.geos.box, conc, 0, -0.092, rwZ, rwLen + 0.18, 0.24, rwW + 0.14, false);
    // Textured runway deck rotated 90° around Y so piano-keys & centerline run squarely along local X!
    const rwMesh = this._addMesh(grp, this.geos.box, this.m.runway, 0, 0.036, rwZ, rwW, 0.020, rwLen, false, Math.PI * 0.5);
    rwMesh.name = 'airport_runway';

    // 8. Complete Aviation Lighting: Green Threshold Bars, White/Gold Edge Lights, PAPI Glide-Slope & Approach Strobes!
    if (!ab) {
      for (const endX of [-1.86, 1.86]) {
        for (const lz of [-0.98, -0.88, -0.76, -0.66]) {
          this._addMesh(grp, this.geos.sphere16, this.m.strobeGreen, endX, 0.056, lz, 0.026, 0.026, 0.026, false);
        }
      }
      for (let lx = -1.62; lx <= 1.63; lx += 0.46) {
        this._addMesh(grp, this.geos.sphere16, this.m.neonGold, lx, 0.054, rwZ - rwW * 0.5 - 0.02, 0.022, 0.022, 0.022, false);
        this._addMesh(grp, this.geos.sphere16, this.m.neonGold, lx, 0.054, rwZ + rwW * 0.5 + 0.02, 0.022, 0.022, 0.022, false);
      }
      // 4-lamp PAPI Precision Approach Path Indicator beside touchdown zone (2 white + 2 red)
      for (let pi = 0; pi < 4; pi++) {
        const pMat = pi < 2 ? this.m.ledLinearWhite : this.m.beaconRed;
        this._addMesh(grp, this.geos.box, pMat, -1.28, 0.056, rwZ - 0.34 - pi * 0.045, 0.032, 0.024, 0.028, false);
      }
      // Approach strobe guide bars extending off the -X threshold
      for (const ax of [-2.10, -2.30]) {
        this._addMesh(grp, this.geos.box, this.m.ledLinearCyan, ax, 0.046, rwZ, 0.024, 0.016, 0.22, false);
      }
    }
  }

  _buildSeaport(grp, ab, x, y0, z, rotRad, hooks) {
    // Deep-water concrete quay seawall foundation down to y = -0.65 so coastal port NEVER floats over sloping seabed!
    this._addMesh(grp, this.geos.box, ab ? this.m.abandoned : this.m.damConcrete, 0, -0.32, -0.02, 1.08, 0.68, 0.96, false);
    this._addMesh(grp, this.geos.box, ab ? this.m.abandoned : this.m.roofConcrete, 0, 0.03, -0.02, 1.08, 0.18, 0.96, true);
    if (!ab) {
      this._addMesh(grp, this.geos.box, this.m.craneYellow, 0, 0.125, 0.44, 1.06, 0.018, 0.035, false);
    }
    for (const fx of [-0.38, -0.12, 0.14, 0.40]) {
      this._addMesh(grp, this.geos.box, this.m.asphalt, fx, 0.02, 0.47, 0.05, 0.14, 0.03, false);
    }

    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 3; col++) {
        const cx = -0.32 + col * 0.32;
        const cz = -0.34 + row * 0.15;
        const m1 = ab ? this.m.abandonedRust : this.containerMats[(row * 3 + col) % this.containerMats.length];
        const m2 = ab ? this.m.abandoned : this.containerMats[(row * 3 + col + 2) % this.containerMats.length];
        this._addMesh(grp, this.geos.box, m1, cx, 0.165, cz, 0.25, 0.09, 0.105, true);
        if ((row + col) % 2 === 0) {
          this._addMesh(grp, this.geos.box, m2, cx, 0.255, cz, 0.25, 0.09, 0.105, true);
        }
      }
    }

    const craneRed = ab ? this.m.abandonedRust : this.m.craneRed;
    const craneWhite = ab ? this.m.abandoned : this.m.whiteComposite;
    for (const gx of [-0.27, 0.27]) {
      this._addMesh(grp, this.geos.gantryCraneRed, craneRed, gx, 0.12, 0.16, 0.92, 0.95, 0.92, true);
      this._addMesh(grp, this.geos.box, craneWhite, gx, 1.05, 0.16, 0.20, 0.09, 0.22, true);
      this._addMesh(grp, this.geos.box, craneWhite, gx, 1.035, 0.56, 0.16, 0.038, 0.24, false);
      this._addMesh(grp, this.geos.box, this.m.craneYellow, gx, 0.84, 0.64, 0.12, 0.035, 0.08, true);
      this._addBeacon(grp, hooks, gx, 1.46, 0.18, x, y0, z, rotRad, ab);
    }
  }

  _buildNuclearPlant(grp, ab, x, y0, z, rotRad, hooks) {
    const conc = ab ? this.m.abandoned : this.m.damConcrete;
    const white = ab ? this.m.abandoned : this.m.whiteComposite;

    this._addMesh(grp, this.geos.box, ab ? this.m.pavingPlazaDusty : this.m.roofConcrete, 0, 0.015, 0, 1.04, 0.03, 1.04, false);
    this._addMesh(grp, this.geos.cyl24, white, -0.24, 0.30, 0.20, 0.42, 0.58, 0.42, true);
    this._addMesh(grp, this.geos.hemiDome, conc, -0.24, 0.59, 0.20, 0.42, 0.36, 0.42, true);
    if (!ab) {
      this._addMesh(grp, this.geos.cyl24, this.m.ledLinearCyan, -0.24, 0.58, 0.20, 0.43, 0.02, 0.43, false);
    }
    this._addMesh(grp, this.geos.box, ab ? this.m.dustyInd : this.m.indPanelSilver, 0.20, 0.22, 0.24, 0.42, 0.42, 0.34, true);

    this._addMesh(grp, this.geos.coolingTower, this.m.plazaStone, -0.22, 0.02, -0.22, 0.96, 1.08, 0.96, true);
    this._addMesh(grp, this.geos.coolingTower, this.m.plazaStone, 0.24, 0.02, -0.20, 0.96, 1.08, 0.96, true);

    if (!ab) {
      this._pushSmoke(hooks, -0.22, 1.16, -0.22, x, y0, z, rotRad, true);
      this._pushSmoke(hooks, 0.24, 1.16, -0.20, x, y0, z, rotRad, true);
    }
  }

  _buildSolarPlant(grp, ab, x, y0, z, rotRad, hooks) {
    this._addMesh(grp, this.geos.cyl24, ab ? this.m.pavingPlazaDusty : this.m.roofConcrete, 0, 0.012, 0, 1.08, 0.024, 1.08, false);
    this._addMesh(grp, this.geos.heliostatPedestals, this.m.steelDark, 0, 0.02, 0, 1, 1, 1, false);
    this._addMesh(grp, this.geos.heliostatMirrors, ab ? this.m.abandoned : this.m.solarPanel, 0, 0.02, 0, 1, 1, 1, true);

    this._addMesh(grp, this.geos.taperOct, ab ? this.m.abandoned : this.m.whiteComposite, 0, 0.91, 0, 0.22, 1.78, 0.22, true);

    const collarMat = ab ? this.m.abandonedRust : this.m.refugeLouvers;
    const crownMat = ab ? this.m.abandonedRust : this.m.solarReceiverCrown;
    this._addMesh(grp, this.geos.cyl24, collarMat, 0, 1.82, 0, 0.185, 0.045, 0.185, true);
    this._addMesh(grp, this.geos.cyl24, crownMat, 0, 1.97, 0, 0.155, 0.25, 0.155, false);
    if (!ab) {
      this._addMesh(grp, this.geos.cyl24, this.m.neonGold, 0, 1.97, 0, 0.162, 0.032, 0.162, false);
      this._addMesh(grp, this.geos.box, collarMat, 0, 1.97, 0, 0.164, 0.25, 0.014, false);
      this._addMesh(grp, this.geos.box, collarMat, 0, 1.97, 0, 0.014, 0.25, 0.164, false);
    }
    this._addMesh(grp, this.geos.cyl24, collarMat, 0, 2.12, 0, 0.185, 0.045, 0.185, true);
    this._addMesh(grp, this.geos.cyl24, ab ? this.m.abandoned : this.m.brushedSilver, 0, 2.155, 0, 0.15, 0.025, 0.15, true);
    this._addBeacon(grp, hooks, 0, 2.21, 0, x, y0, z, rotRad, ab);
  }

  _buildWastePlant(grp, ab, x, y0, z, rotRad, hooks) {
    this._addMesh(grp, this.geos.box, ab ? this.m.pavingPlazaDusty : this.m.pavingPlaza, 0, 0.015, 0, 0.94, 0.03, 0.94, false);
    const wedgeMat = ab ? this.m.dustyInd : this.m.indPanelSilver;
    this._addMesh(grp, this.geos.copenhillWedge, wedgeMat, -0.04, 0.02, 0.06, 0.95, 0.92, 0.92, true);

    const slopePark = this._addMesh(grp, this.geos.box, ab ? this.m.abandonedRust : this.m.roofGreen, -0.04, 0.73, 0.06, 0.82, 0.035, 0.48, false);
    slopePark.rotation.z = 0.78;
    if (!ab) {
      this._addTinyTree(grp, -0.26, 0.46, 0.14, 0.48);
      this._addTinyTree(grp, 0.08, 0.82, 0.14, 0.48);
    }

    const siloMat = ab ? this.m.abandoned : this.m.whiteComposite;
    this._addMesh(grp, this.geos.cyl24, siloMat, -0.22, 0.24, -0.30, 0.20, 0.46, 0.20, true);
    this._addMesh(grp, this.geos.cyl24, siloMat, 0.02, 0.28, -0.30, 0.20, 0.54, 0.20, true);
    this._addMesh(grp, this.geos.cyl16, siloMat, 0.30, 0.78, -0.24, 0.10, 1.54, 0.10, true);
    if (!ab) {
      this._addMesh(grp, this.geos.cyl16, this.m.neonEmerald, 0.30, 1.48, -0.24, 0.112, 0.04, 0.112, false);
      this._pushSmoke(hooks, 0.30, 1.58, -0.24, x, y0, z, rotRad, true);
    }
  }

  // ==================== 3. Upgraded Civic & Utility Buildings ====================

  _buildWindTurbine(grp, ab, x, y0, z, rotRad, hooks) {
    const THREE = this.THREE;
    const mat = ab ? this.m.abandoned : this.m.whiteComposite;
    this._addMesh(grp, this.geos.cyl24, this.m.roofConcrete, 0, 0.025, 0, 0.32, 0.05, 0.32, true);
    this._addMesh(grp, this.geos.windMast, mat, 0, 0.80, 0, 1, 1, 1, true);
    this._addMesh(grp, this.geos.windNacelle, mat, 0, 1.60, 0, 1, 1, 1, true);
    this._addBeacon(grp, hooks, 0, 1.68, -0.05, x, y0, z, rotRad, ab);

    const hub = new THREE.Group();
    hub.position.set(0, 1.60, 0.13);
    this._addMesh(hub, this.geos.cone8, mat, 0, 0, 0.03, 0.12, 0.10, 0.12, false).rotation.x = Math.PI * 0.5;
    for (let k = 0; k < 3; k++) {
      const arm = new THREE.Group();
      arm.rotation.z = (k * Math.PI * 2) / 3;
      this._addMesh(arm, this.geos.windBlade, mat, 0, 0.22, 0, 1, 1, 0.45, true);
      hub.add(arm);
    }
    grp.add(hub);
    if (!ab && hooks && hooks.windRotors) hooks.windRotors.push(hub);
  }

  _buildThermalPowerPlant(grp, ab, x, y0, z, rotRad, hooks) {
    const wall = ab ? this.m.dustyInd : this.m.indPanelWarm;
    this._addMesh(grp, this.geos.box, this.m.asphalt, 0, 0.015, 0, 0.92, 0.03, 0.92, false);
    this._addMesh(grp, this.geos.box, wall, -0.18, 0.34, 0.04, 0.46, 0.66, 0.72, true);
    this._addMesh(grp, this.geos.box, this.m.brushedSilver, -0.18, 0.69, 0.04, 0.40, 0.06, 0.64, true);

    this._addMesh(grp, this.geos.cyl16, this.m.plazaStone, -0.26, 0.66, -0.26, 0.09, 1.30, 0.09, true);
    this._addMesh(grp, this.geos.coolingTower, ab ? this.m.abandoned : this.m.plazaStone, 0.22, 0.02, 0.12, 0.88, 0.96, 0.88, true);

    if (!ab) {
      this._addMesh(grp, this.geos.cyl16, this.m.craneRed, -0.26, 1.25, -0.26, 0.096, 0.08, 0.096, false);
      this._pushSmoke(hooks, -0.26, 1.34, -0.26, x, y0, z, rotRad, false);
      this._pushSmoke(hooks, 0.22, 1.04, 0.12, x, y0, z, rotRad, true);
    }
  }

  _buildWaterFacility(grp, type, ab) {
    const isSewage = type === 'sewage_out';
    const isTreat = type === 'water_treat';
    const mainMat = ab ? this.m.dustyInd : (isSewage ? this.m.indPanelWarm : this.m.indPanelSilver);
    const poolMat = ab ? this.m.abandonedRust : (isSewage ? this.m.teakDeck : this.m.poolWater);

    this._addMesh(grp, this.geos.box, ab ? this.m.pavingPlazaDusty : this.m.pavingPlaza, 0, 0.015, 0, 0.90, 0.03, 0.90, false);
    this._addMesh(grp, this.geos.box, mainMat, -0.18, 0.22, -0.08, 0.40, 0.42, 0.62, true);

    for (const bz of [-0.18, 0.20]) {
      this._addMesh(grp, this.geos.cyl24, this.m.plazaStone, 0.22, 0.09, bz, 0.34, 0.16, 0.34, true);
      this._addMesh(grp, this.geos.cyl24, poolMat, 0.22, 0.165, bz, 0.29, 0.02, 0.29, false);
      this._addMesh(grp, this.geos.box, this.m.brushedSilver, 0.22, 0.18, bz, 0.32, 0.015, 0.03, false);
    }

    if (isTreat) {
      this._addMesh(grp, this.geos.sphere16, this.m.whiteComposite, -0.18, 0.58, -0.16, 0.30, 0.30, 0.30, true);
      if (!ab) this._addMesh(grp, this.geos.box, this.m.ledLinearCyan, -0.18, 0.44, 0.16, 0.34, 0.022, 0.12, false);
    } else {
      const pipeMat = isSewage ? this.m.steelDark : this.m.airlineBlue;
      for (const px of [-0.26, -0.10]) {
        const p = this._addMesh(grp, this.geos.cyl16, pipeMat, px, 0.10, 0.34, 0.07, 0.34, 0.07, true);
        p.rotation.x = Math.PI * 0.5;
      }
    }
  }

  _buildFireStation(grp, ab, x, y0, z, rotRad, hooks) {
    this._addMesh(grp, this.geos.box, ab ? this.m.pavingPlazaDusty : this.m.pavingPlaza, 0, 0.015, 0, 0.92, 0.03, 0.92, false);
    this._addMesh(grp, this.geos.box, ab ? this.m.dustyStoneFin : this.m.finStoneSilver, -0.08, 0.27, -0.02, 0.64, 0.51, 0.58, true);
    this._addMesh(grp, this.geos.corniceBelt, ab ? this.m.abandoned : this.m.parapetStone, -0.08, 0.518, -0.02, 0.64, 1.0, 0.58, true);
    this._addRooftopKit(grp, 0.56, 0.52, 0.525, 2, 1, 'civic', ab, -0.10, -0.02, false);
    const redMat = ab ? this.m.abandonedRust : this.m.craneRed;
    for (const dx of [-0.26, -0.08, 0.10]) {
      this._addMesh(grp, this.geos.box, redMat, dx, 0.14, 0.28, 0.13, 0.22, 0.03, false);
    }
    this._addMesh(grp, this.geos.box, redMat, 0.28, 0.52, -0.20, 0.22, 1.02, 0.22, true);
    this._addMesh(grp, this.geos.box, this.m.whiteComposite, 0.28, 0.88, -0.20, 0.24, 0.06, 0.24, false);
    this._addBeacon(grp, hooks, 0.28, 1.07, -0.20, x, y0, z, rotRad, ab);
  }

  _buildPoliceStation(grp, ab) {
    this._addZonedPlotPad(grp, ab, false);
    this._addMesh(grp, this.geos.box, ab ? this.m.dustyRetail : this.m.retailPodiumConc, 0, 0.20, 0, 0.76, 0.36, 0.68, true);
    this._addMesh(grp, this.geos.corniceBelt, ab ? this.m.abandoned : this.m.brushedSilver, 0, 0.372, 0, 0.76, 1.0, 0.68, true);
    this._addShopfrontCanopy(grp, 0, 0.024, 0.34, 0.92, ab, true);
    this._addMesh(grp, this.geos.box, ab ? this.m.dustyCBD : this.m.cbdIceBlue, 0, 0.38 + 0.51, -0.04, 0.62, 1.02, 0.52, true);
    if (!ab) {
      this._addMesh(grp, this.geos.parapetFrame, this.m.airlineBlue, 0, 1.43, -0.04, 0.63, 0.06, 0.53, true);
    }
    this._addRooftopKit(grp, 0.62, 0.52, 1.40, 3, 2, 'civic', ab, 0, -0.04, true);
    this._addHelipad(grp, 0, 1.41, -0.04, 0.26, ab);
    this._addMesh(grp, this.geos.spireNeedle, this.m.brushedSilver, 0.20, 1.66, -0.18, 0.7, 0.50, 0.7, false);
  }

  _buildHospital(grp, ab) {
    this._addZonedPlotPad(grp, ab, true);
    const white = ab ? this.m.abandoned : this.m.whiteComposite;
    const glass = ab ? this.m.dustyCBD : this.m.cbdSlateSilver;
    const red = ab ? this.m.abandonedRust : this.m.craneRed;

    this._addMesh(grp, this.geos.box, ab ? this.m.dustyRetail : this.m.retailPodium, 0.04, 0.20, 0.12, 0.76, 0.36, 0.48, true);
    this._addMesh(grp, this.geos.box, red, 0.04, 0.18, 0.39, 0.34, 0.030, 0.10, true);
    if (!ab) {
      // Sunlit hospital podium sky-garden healing pergola & planters on front terrace
      this._addMesh(grp, this.geos.rooftopPergola, this.m.teakDeck, 0.06, 0.384, 0.24, 0.82, 0.82, 0.78, true);
      this._addMesh(grp, this.geos.rooftopPlanterGreens, this.m.lawn, 0.06, 0.384, 0.24, 0.82, 0.82, 0.78, true);
    }

    const wardH = 1.70;
    this._addMesh(grp, this.geos.box, glass, -0.04, 0.024 + wardH * 0.5, -0.08, 0.68, wardH, 0.42, true);
    this._addMesh(grp, this.geos.box, white, -0.36, 0.024 + wardH * 0.5, -0.08, 0.06, wardH + 0.02, 0.44, true);
    this._addMesh(grp, this.geos.box, white, 0.28, 0.024 + wardH * 0.5, -0.08, 0.06, wardH + 0.02, 0.44, true);
    this._addMesh(grp, this.geos.parapetFrame, white, -0.04, 0.024 + wardH + 0.035, -0.08, 0.70, 0.07, 0.44, true);
    this._addRooftopKit(grp, 0.68, 0.42, 0.024 + wardH, 3, 3, 'civic', ab, -0.04, -0.08, true);

    const crossMat = ab ? this.m.abandonedRust : this.m.beaconRed;
    this._addMesh(grp, this.geos.box, crossMat, -0.04, 1.44, 0.14, 0.22, 0.065, 0.025, false);
    this._addMesh(grp, this.geos.box, crossMat, -0.04, 1.44, 0.14, 0.065, 0.22, 0.025, false);
    this._addHelipad(grp, -0.04, 0.024 + wardH + 0.01, -0.08, 0.28, ab);
  }

  _buildSchool(grp, ab) {
    this._addZonedPlotPad(grp, ab, false);
    this._addMesh(grp, this.geos.box, ab ? this.m.abandonedRust : this.m.lawn, 0, 0.028, 0.24, 0.54, 0.014, 0.26, false);

    const mat = ab ? this.m.dustyStoneFin : this.m.finStoneChampagne;
    const hMain = 0.68;
    const hWing = 0.51;
    this._addMesh(grp, this.geos.box, mat, 0, 0.024 + hMain * 0.5, -0.14, 0.74, hMain, 0.36, true);
    this._addMesh(grp, this.geos.corniceBelt, ab ? this.m.abandoned : this.m.parapetStone, 0, 0.024 + hMain - 0.010, -0.14, 0.74, 1.0, 0.36, true);
    this._addMesh(grp, this.geos.box, mat, -0.24, 0.024 + hWing * 0.5, 0.08, 0.26, hWing, 0.36, true);
    this._addMesh(grp, this.geos.parapetFrame, this.m.parapetStone, 0, 0.024 + hMain + 0.025, -0.14, 0.75, 0.05, 0.37, true);
    this._addMesh(grp, this.geos.box, ab ? this.m.abandoned : this.m.parapetStone, 0, 0.024 + hMain + 0.10, -0.14, 0.22, 0.16, 0.20, true);
    this._addMesh(grp, this.geos.taperPyr, ab ? this.m.abandonedRust : this.m.slateRoof, 0, 0.024 + hMain + 0.23, -0.14, 0.28, 0.11, 0.26, true, Math.PI * 0.25);
    this._addRooftopKit(grp, 0.26, 0.36, 0.024 + hWing, 2, 0, 'civic', ab, -0.24, 0.08, false);
  }

  _buildPark(grp) {
    this._addMesh(grp, this.geos.box, this.m.lawn, 0, 0.015, 0, 0.92, 0.03, 0.92, false);
    this._addMesh(grp, this.geos.box, this.m.pavingPlaza, 0, 0.026, 0, 0.90, 0.012, 0.16, false);
    this._addMesh(grp, this.geos.box, this.m.pavingPlaza, 0, 0.026, 0, 0.16, 0.012, 0.90, false);

    if (!this._placeGLB(grp, 'park_fountain', 0, 0.02, 0, 0.92, 1.0, 0.92, false)) {
      this._addMesh(grp, this.geos.cyl24, this.m.plazaStone, 0, 0.06, 0, 0.36, 0.08, 0.36, true);
      this._addMesh(grp, this.geos.cyl24, this.m.poolWater, 0, 0.105, 0, 0.30, 0.02, 0.30, false);
      this._addMesh(grp, this.geos.cyl16, this.m.whiteComposite, 0, 0.16, 0, 0.08, 0.14, 0.08, true);
    }

    for (const [tx, tz] of [[-0.31, -0.31], [0.31, -0.31], [-0.31, 0.31], [0.31, 0.31]]) {
      this._addTinyTree(grp, tx, 0.02, tz, 0.82);
    }
  }

  // ==================== 4 New Flagship Cultural & Tourism Landmarks (v8.0) ====================

  // 1. Wildlife Safari Zoo (Animated Quaternius CC0 Stag/Deer/Alpaca/Fox + Sculpted Giraffe & Giant Panda!)
  _buildZoo(grp, ab, hooks) {
    const THREE = this.THREE;
    const lawnMat = ab ? this.m.abandonedRust : this.m.lawn;
    const woodMat = ab ? this.m.abandoned : this.m.teakDeck;
    const stoneMat = ab ? this.m.abandoned : this.m.parapetStone;

    // Lush park enclosure base + timber perimeter fence + sandy savanna paddock + watering hole
    this._addMesh(grp, this.geos.box, lawnMat, 0, 0.016, 0, 1.08, 0.032, 1.08, false);
    this._addMesh(grp, this.geos.box, stoneMat, 0, 0.030, 0.38, 0.86, 0.014, 0.24, false);
    this._addMesh(grp, this.geos.box, woodMat, 0, 0.034, 0.02, 0.14, 0.016, 0.72, false);
    this._addMesh(grp, this.geos.cyl24, ab ? this.m.abandoned : this.m.poolWater, -0.24, 0.032, -0.18, 0.34, 0.014, 0.28, false);
    this._addMesh(grp, this.geos.cyl24, stoneMat, -0.24, 0.028, -0.18, 0.40, 0.014, 0.34, false);

    // Timber Safari Entrance Archway at +Z street edge
    this._addMesh(grp, this.geos.cyl16, woodMat, -0.24, 0.16, 0.46, 0.045, 0.28, 0.045, true);
    this._addMesh(grp, this.geos.cyl16, woodMat, 0.24, 0.16, 0.46, 0.045, 0.28, 0.045, true);
    this._addMesh(grp, this.geos.box, woodMat, 0, 0.29, 0.46, 0.56, 0.045, 0.06, true);
    if (!ab) {
      this._addMesh(grp, this.geos.box, this.m.neonGold, 0, 0.30, 0.495, 0.34, 0.035, 0.015, false);
    }

    // Perimeter wooden safari railings
    for (const [fx, fz, fsx, fsz] of [
      [-0.51, 0, 0.024, 1.02], [0.51, 0, 0.024, 1.02], [0, -0.51, 1.02, 0.024]
    ]) {
      this._addMesh(grp, this.geos.box, woodMat, fx, 0.075, fz, fsx, 0.016, fsz, false);
      this._addMesh(grp, this.geos.box, woodMat, fx, 0.048, fz, fsx, 0.014, fsz, false);
    }

    // Thatched Safari Viewing Gazebo & Bamboo Shelter
    this._addMesh(grp, this.geos.cyl16, woodMat, 0.30, 0.12, -0.32, 0.035, 0.18, 0.035, true);
    this._addMesh(grp, this.geos.cone8, ab ? this.m.abandonedRust : this.m.terracottaRoof, 0.30, 0.25, -0.32, 0.24, 0.12, 0.24, true);

    // Savanna shade trees
    for (const [tx, tz, sc] of [[-0.40, -0.38, 0.78], [0.40, -0.02, 0.72], [-0.42, 0.18, 0.65]]) {
      this._addTinyTree(grp, tx, 0.028, tz, sc);
    }

    if (ab) return;

    // Animated Wildlife Ensemble inside the Zoo Enclosure!
    const registerWalker = (animalGrp, cx, cz, radius, speed, phase) => {
      animalGrp.position.set(cx, 0.032, cz);
      grp.add(animalGrp);
      if (hooks && Array.isArray(hooks.zooAnimals)) {
        hooks.zooAnimals.push({ obj: animalGrp, cx, cz, radius, speed, phase, baseY: 0.032 });
      }
    };

    // Helper: Sculpted Procedural Giraffe (always available!)
    const makeGiraffe = () => {
      const g = new THREE.Group();
      this._addMesh(g, this.geos.box, this.m.craneYellow, 0, 0.11, 0, 0.055, 0.065, 0.11, true);
      this._addMesh(g, this.geos.cyl16, this.m.craneYellow, 0, 0.21, 0.045, 0.026, 0.17, 0.026, true);
      this._addMesh(g, this.geos.box, this.m.craneYellow, 0, 0.295, 0.065, 0.032, 0.028, 0.055, true);
      this._addMesh(g, this.geos.box, this.m.teakDeck, 0, 0.12, 0.02, 0.058, 0.024, 0.032, false);
      this._addMesh(g, this.geos.box, this.m.teakDeck, 0, 0.21, 0.045, 0.029, 0.022, 0.029, false);
      for (const [lx, lz] of [[-0.018, 0.036], [0.018, 0.036], [-0.018, -0.036], [0.018, -0.036]]) {
        this._addMesh(g, this.geos.cyl16, this.m.craneYellow, lx, 0.045, lz, 0.014, 0.09, 0.014, false);
      }
      return g;
    };

    // Helper: Sculpted Giant Panda
    const makePanda = () => {
      const g = new THREE.Group();
      this._addMesh(g, this.geos.sphere16, this.m.whiteComposite, 0, 0.062, 0, 0.092, 0.078, 0.115, true);
      this._addMesh(g, this.geos.sphere16, this.m.whiteComposite, 0, 0.098, 0.055, 0.068, 0.064, 0.068, true);
      this._addMesh(g, this.geos.sphere16, this.m.asphalt, -0.025, 0.132, 0.045, 0.026, 0.026, 0.020, false);
      this._addMesh(g, this.geos.sphere16, this.m.asphalt, 0.025, 0.132, 0.045, 0.026, 0.026, 0.020, false);
      this._addMesh(g, this.geos.box, this.m.asphalt, 0, 0.058, 0.022, 0.095, 0.045, 0.038, false);
      for (const [lx, lz] of [[-0.032, 0.032], [0.032, 0.032], [-0.032, -0.032], [0.032, -0.032]]) {
        this._addMesh(g, this.geos.cyl16, this.m.asphalt, lx, 0.022, lz, 0.026, 0.044, 0.026, false);
      }
      return g;
    };

    // Slot 1: Real Quaternius CC0 Antlered Stag (or Giraffe fallback)
    const a1 = new THREE.Group();
    if (!this._placeFittedGLB(a1, 'zoo_stag', 0, 0, 0, 0.22, 0.24, 0.22, false, 0)) {
      a1.add(makeGiraffe());
    }
    registerWalker(a1, 0.26, 0.08, 0.14, 0.55, 0.4);

    // Slot 2: Real Quaternius CC0 Fluffy Alpaca (or Giant Panda fallback)
    const a2 = new THREE.Group();
    if (!this._placeFittedGLB(a2, 'zoo_alpaca', 0, 0, 0, 0.18, 0.20, 0.18, false, 0)) {
      a2.add(makePanda());
    }
    registerWalker(a2, -0.22, 0.16, 0.12, 0.48, 2.1);

    // Slot 3: Real Quaternius CC0 Red Fox (or Giraffe)
    const a3 = new THREE.Group();
    if (!this._placeFittedGLB(a3, 'zoo_fox', 0, 0, 0, 0.14, 0.12, 0.15, false, 0)) {
      a3.add(makeGiraffe());
    }
    registerWalker(a3, 0.22, -0.14, 0.12, 0.72, 4.0);

    // Slot 4: Always include iconic sculpted Giraffe & Panda highlight!
    registerWalker(makeGiraffe(), -0.04, -0.32, 0.11, 0.38, 1.2);
    registerWalker(makePanda(), 0.34, 0.24, 0.07, 0.32, 5.2);
  }

  // 2. Royal Victorian Botanical Garden (Crystal Glass Conservatory Dome, Rose Parterres, Lotus Pond & Cherry Blossoms)
  _buildBotanicalGarden(grp, ab) {
    const stoneMat = ab ? this.m.abandoned : this.m.parapetStone;
    const whiteMat = ab ? this.m.abandoned : this.m.whiteComposite;
    const glassMat = ab ? this.m.dustyCBD : this.m.atriumGlass;
    const lawnMat = ab ? this.m.abandonedRust : this.m.lawn;

    // Symmetrical granite plaza & lush botanical lawns
    this._addMesh(grp, this.geos.box, ab ? this.m.pavingPlazaDusty : this.m.pavingPlaza, 0, 0.016, 0, 1.08, 0.032, 1.08, false);
    this._addMesh(grp, this.geos.box, lawnMat, -0.30, 0.032, 0.26, 0.34, 0.012, 0.34, false);
    this._addMesh(grp, this.geos.box, lawnMat, 0.30, 0.032, 0.26, 0.34, 0.012, 0.34, false);

    // Formal rose, tulip & lavender flowerbed parterres
    if (!ab) {
      this._addMesh(grp, this.geos.box, this.m.craneRed, -0.30, 0.044, 0.26, 0.20, 0.018, 0.20, false);
      this._addMesh(grp, this.geos.box, this.m.neonGold, 0.30, 0.044, 0.26, 0.20, 0.018, 0.20, false);
      this._addMesh(grp, this.geos.box, this.m.neonViolet, -0.34, 0.044, -0.34, 0.18, 0.018, 0.18, false);
      this._addMesh(grp, this.geos.box, this.m.neonMagenta, 0.34, 0.044, -0.34, 0.18, 0.018, 0.18, false);
    }

    // Iconic Crystal Glass Conservatory Dome (centered at z = -0.10)
    const cz = -0.08;
    this._addMesh(grp, this.geos.cyl24, stoneMat, 0, 0.07, cz, 0.56, 0.08, 0.56, true);
    this._addMesh(grp, this.geos.cyl24, glassMat, 0, 0.22, cz, 0.50, 0.22, 0.50, false);
    this._addMesh(grp, this.geos.hemiDome, glassMat, 0, 0.33, cz, 0.52, 0.34, 0.52, true);
    // Victorian white-steel structural conservatory ribs & lantern finial
    for (let r = 0; r < 4; r++) {
      this._addMesh(grp, this.geos.box, whiteMat, 0, 0.34, cz, 0.535, 0.016, 0.016, false, (r * Math.PI) / 4);
      this._addMesh(grp, this.geos.box, whiteMat, 0, 0.22, cz, 0.515, 0.22, 0.016, false, (r * Math.PI) / 4);
    }
    this._addMesh(grp, this.geos.cyl16, whiteMat, 0, 0.67, cz, 0.09, 0.08, 0.09, true);
    this._addMesh(grp, this.geos.cone8, this.m.brushedSilver, 0, 0.74, cz, 0.06, 0.08, 0.06, true);
    // Twin vaulted glass conservatory side wings
    this._addMesh(grp, this.geos.box, glassMat, -0.34, 0.15, cz, 0.26, 0.18, 0.22, false);
    this._addMesh(grp, this.geos.box, glassMat, 0.34, 0.15, cz, 0.26, 0.18, 0.22, false);
    this._addMesh(grp, this.geos.box, whiteMat, -0.34, 0.245, cz, 0.28, 0.018, 0.24, true);
    this._addMesh(grp, this.geos.box, whiteMat, 0.34, 0.245, cz, 0.28, 0.018, 0.24, true);
    // Lush tropical tree thriving inside the transparent crystal conservatory!
    if (!ab) {
      this._addTinyTree(grp, 0, 0.08, cz, 1.05);
    }

    // Front Koi Lotus Reflecting Pond + White Arched Stone Footbridge
    this._addMesh(grp, this.geos.cyl24, ab ? this.m.abandoned : this.m.poolWater, 0, 0.036, 0.32, 0.26, 0.014, 0.20, false);
    this._addMesh(grp, this.geos.box, whiteMat, 0, 0.056, 0.32, 0.08, 0.018, 0.24, true);

    // Ornamental Cherry-Blossom & Emerald Trees framing corners
    for (const [tx, tz, pink] of [[-0.44, 0.40, true], [0.44, 0.40, true], [-0.44, -0.44, false], [0.44, -0.44, false]]) {
      this._addMesh(grp, this.geos.cyl16, this.m.teakDeck, tx, 0.07, tz, 0.025, 0.09, 0.025, false);
      this._addMesh(grp, this.geos.treeCrown, ab ? this.m.abandonedRust : (pink ? this.m.neonMagenta : this.m.lawn), tx, 0.15, tz, 0.68, 0.68, 0.68, true);
    }
  }

  // 3. Contemporary City Art Museum (Travertine Colonnade, Cantilevered Glass Gallery, Reflecting Pool & Golden Sculpture)
  _buildMuseum(grp, ab) {
    const stoneMat = ab ? this.m.abandoned : this.m.parapetStone;
    const whiteMat = ab ? this.m.abandoned : this.m.whiteComposite;
    const glassMat = ab ? this.m.dustyCBD : this.m.cbdSlateSilver;

    // Grand tiered travertine museum plaza & front reflecting pool
    this._addMesh(grp, this.geos.box, ab ? this.m.pavingPlazaDusty : this.m.pavingPlaza, 0, 0.016, 0, 1.04, 0.032, 1.04, false);
    this._addMesh(grp, this.geos.box, stoneMat, 0, 0.052, -0.06, 0.90, 0.044, 0.72, true);
    this._addMesh(grp, this.geos.box, ab ? this.m.abandoned : this.m.poolWater, 0, 0.036, 0.36, 0.62, 0.014, 0.18, false);
    if (!ab) {
      // Modern golden abstract sculpture centerpiece in reflecting pool
      const sculp = this._addMesh(grp, this.geos.oct, this.m.neonGold, 0, 0.14, 0.36, 0.09, 0.16, 0.09, true);
      sculp.rotation.set(0.35, 0.6, 0.25);
    }

    // Lower colonnade hall + cantilevered modern upper exhibition wing
    this._addMesh(grp, this.geos.box, glassMat, 0, 0.24, -0.08, 0.76, 0.34, 0.48, true);
    for (let cx = -0.34; cx <= 0.35; cx += 0.17) {
      this._addMesh(grp, this.geos.cyl16, whiteMat, cx, 0.24, 0.19, 0.036, 0.34, 0.036, true);
    }
    this._addMesh(grp, this.geos.box, whiteMat, 0, 0.47, -0.04, 0.90, 0.16, 0.62, true);
    this._addMesh(grp, this.geos.box, glassMat, 0, 0.47, 0.275, 0.74, 0.10, 0.015, false);
    // Sawtooth sculptural museum skylight roof
    this._addMesh(grp, this.geos.box, ab ? this.m.abandoned : this.m.atriumGlass, 0, 0.585, -0.04, 0.56, 0.07, 0.34, false);
    this._addMesh(grp, this.geos.parapetFrame, stoneMat, 0, 0.57, -0.04, 0.91, 0.05, 0.63, true);
  }

  // 4. Oriental Skyline Observation TV Tower (5.5m Soaring Tripod Legs, Glowing Observation Spheres & Night Light Show!)
  _buildTvTower(grp, ab, x, y0, z, rotRad, hooks) {
    const whiteMat = ab ? this.m.abandoned : this.m.whiteComposite;
    const silverMat = ab ? this.m.abandoned : this.m.brushedSilver;
    const glassMat = ab ? this.m.dustyCBD : this.m.cbdIceBlue;
    const accentCyan = ab ? this.m.abandoned : this.m.neonCyan;
    const accentMag = ab ? this.m.abandoned : this.m.neonMagenta;
    const accentGold = ab ? this.m.abandoned : this.m.neonGold;

    // Octagonal waterfront reception plaza & illuminated entry podium
    this._addMesh(grp, this.geos.cyl24, ab ? this.m.pavingPlazaDusty : this.m.pavingPlaza, 0, 0.02, 0, 1.06, 0.04, 1.06, false);
    this._addMesh(grp, this.geos.oct, glassMat, 0, 0.16, 0, 0.64, 0.24, 0.64, true);
    this._addMesh(grp, this.geos.cyl24, silverMat, 0, 0.29, 0, 0.68, 0.03, 0.68, true);

    // 3 Dramatic Angled Tripod Legs + Central Express Elevator Core rising to 3.3m
    this._addMesh(grp, this.geos.cyl16, silverMat, 0, 1.95, 0, 0.13, 3.65, 0.13, true);
    for (let k = 0; k < 3; k++) {
      const ang = (k * Math.PI * 2) / 3;
      const leg = this._addMesh(grp, this.geos.cyl16, whiteMat, Math.cos(ang) * 0.24, 1.05, Math.sin(ang) * 0.24, 0.095, 1.85, 0.095, true);
      leg.rotation.z = Math.cos(ang) * 0.18;
      leg.rotation.x = -Math.sin(ang) * 0.18;
      // Twin upper slender columns between lower & upper spheres
      this._addMesh(grp, this.geos.cyl16, whiteMat, Math.cos(ang) * 0.11, 2.48, Math.sin(ang) * 0.11, 0.055, 1.65, 0.055, true);
    }

    // Lower Luminous Observation Sphere (y = 1.68)
    this._addMesh(grp, this.geos.sphere16, glassMat, 0, 1.68, 0, 0.42, 0.42, 0.42, true);
    if (!ab) {
      this._addMesh(grp, this.geos.cyl24, accentCyan, 0, 1.68, 0, 0.44, 0.035, 0.44, false);
      this._addMesh(grp, this.geos.cyl24, accentMag, 0, 1.54, 0, 0.36, 0.025, 0.36, false);
    }

    // Upper Grand Sky-Deck Revolving Restaurant Sphere (y = 3.28)
    this._addMesh(grp, this.geos.sphere16, glassMat, 0, 3.28, 0, 0.34, 0.34, 0.34, true);
    this._addMesh(grp, this.geos.cyl24, silverMat, 0, 3.32, 0, 0.38, 0.04, 0.38, true);
    if (!ab) {
      this._addMesh(grp, this.geos.cyl24, accentMag, 0, 3.28, 0, 0.36, 0.032, 0.36, false);
      this._addMesh(grp, this.geos.cyl24, accentGold, 0, 3.44, 0, 0.28, 0.024, 0.28, false);
    }

    // Space Capsule Pod (y = 4.18) + Soaring Red-White Broadcast Spire (to y = 5.45)
    this._addMesh(grp, this.geos.sphere16, silverMat, 0, 4.18, 0, 0.18, 0.18, 0.18, true);
    if (!ab) this._addMesh(grp, this.geos.cyl24, accentCyan, 0, 4.18, 0, 0.195, 0.022, 0.195, false);
    this._addMesh(grp, this.geos.cyl16, whiteMat, 0, 4.65, 0, 0.042, 0.85, 0.056, true);
    this._addMesh(grp, this.geos.cyl16, ab ? this.m.abandonedRust : this.m.craneRed, 0, 5.15, 0, 0.020, 0.55, 0.034, false);
    this._addBeacon(grp, hooks, 0, 5.46, 0, x, y0, z, rotRad, ab);
  }

  _buildMetroStation(grp, ab) {
    this._addMesh(grp, this.geos.box, ab ? this.m.pavingPlazaDusty : this.m.pavingPlaza, 0, 0.015, 0, 0.90, 0.03, 0.90, false);
    const vault = this._addMesh(grp, this.geos.capsule, ab ? this.m.dustyCBD : this.m.atriumGlass, 0, 0.14, 0, 1.25, 0.82, 0.72, true);
    vault.rotation.x = Math.PI * 0.5;
    this._addMesh(grp, this.geos.box, this.m.asphalt, 0, 0.09, 0.24, 0.28, 0.14, 0.14, false);
    this._addMesh(grp, this.geos.box, this.m.steelDark, 0.32, 0.26, 0.28, 0.05, 0.48, 0.05, true);
    if (!ab) {
      this._addMesh(grp, this.geos.box, this.m.neonViolet, 0.32, 0.46, 0.28, 0.12, 0.12, 0.07, false);
    }
  }

  _buildHSRStation(grp, ab) {
    this._addMesh(grp, this.geos.box, ab ? this.m.pavingPlazaDusty : this.m.pavingPlaza, 0, 0.02, 0, 0.98, 0.04, 0.98, false);
    this._addMesh(grp, this.geos.box, ab ? this.m.dustyCBD : this.m.cbdSlateSilver, 0, 0.24, 0, 0.84, 0.42, 0.62, true);
    this._addMesh(grp, this.geos.gullWingRoof, ab ? this.m.abandoned : this.m.brushedSilver, 0, 0.44, 0, 0.92, 1.15, 1.52, true);
    if (!ab) {
      this._addMesh(grp, this.geos.box, this.m.ledLinearCyan, 0, 0.52, 0.38, 0.86, 0.025, 0.035, false);
      this._addMesh(grp, this.geos.box, this.m.ledLinearCyan, 0, 0.52, -0.38, 0.86, 0.025, 0.035, false);
    }
  }

  // Modern Roadside EV Bus Stop Shelter (local y=0 base, facing +Z toward road centerline, W≈0.40, D≈0.16, H≈0.24, 6 shared draw calls)
  createBusStopShelter() {
    const THREE = this.THREE;
    const grp = new THREE.Group();
    grp.name = 'busStopShelter';

    this._addMesh(grp, this.geos.busStopMetal, this.m.brushedSilver, 0, 0, 0, 1, 1, 1, true);
    this._addMesh(grp, this.geos.busStopGlass, this.m.balconyGlass, 0, 0, 0, 1, 1, 1, true);
    this._addMesh(grp, this.geos.busStopBench, this.m.teakDeck, 0, 0, 0, 1, 1, 1, true);
    this._addMesh(grp, this.geos.busStopDisplay, this.m.busStopScreen, 0, 0, 0, 1, 1, 1, false);
    this._addMesh(grp, this.geos.busStopHeaderLed, this.m.ledLinearCyan, 0, 0, 0, 1, 1, 1, false);
    const signMesh = this._addMesh(grp, this.geos.busStopSign, this.m.busSign, 0, 0, 0, 1, 1, 1, true);
    signMesh.name = 'busSign';

    return grp;
  }

  // ==================== 4. True-Proportion 3D Road Vehicles, CR400 Train, Airliner & Cargo Ship ====================

  // True-Proportion Modern 3D Road Vehicles (facing +Z, tire bottoms at y = 0.000, night headlights & ruby taillights!)
  createRealisticVehicleObject(kind = 'car', variantIdx = 0, lineColorHex = null) {
    const THREE = this.THREE;
    const grp = new THREE.Group();
    grp.rotation.order = 'YXZ';

    const v = Math.abs(variantIdx | 0);
    const k = String(kind || 'car').toLowerCase();

    if (k === 'bus') {
      // Contemporary Low-Floor Chinese EV Transit Bus (L ≈ 0.50, W ≈ 0.162, H ≈ 0.186) with Custom Route Color Livery!
      const stripeMat = this._getBusLineMat(lineColorHex);
      this._addMesh(grp, this.geos.vehBusBody, this.m.carPearlWhite, 0, 0, 0, 1, 1, 1, true);
      this._addMesh(grp, this.geos.vehBusStripe, stripeMat, 0, 0, 0, 1, 1, 1, false);
      this._addMesh(grp, this.geos.vehBusDark, this.m.cockpitGlass, 0, 0, 0, 1, 1, 1, false);
      this._addMesh(grp, this.geos.vehBusWheels, this.m.tireRubber, 0, 0, 0, 1, 1, 1, true);
      this._addMesh(grp, this.geos.vehBusHL, this.m.vehHeadlight, 0, 0, 0, 1, 1, 1, false);
      this._addMesh(grp, this.geos.vehBusTL, this.m.vehTaillight, 0, 0, 0, 1, 1, 1, false);
      return grp;
    }

    if (k === 'firetruck') {
      // Municipal Aerial-Ladder Fire Engine (uses Kenney CC0 firetruck.glb when loaded + named 'strobe' lightbar!)
      if (this._placeFittedGLB(grp, 'cc0_firetruck', 0, 0, 0, 0.19, 0.22, 0.44, false, 0)) {
        const strobe = this._addMesh(grp, this.geos.box, this.m.beaconRed, 0, 0.205, 0.14, 0.11, 0.018, 0.028, false);
        strobe.name = 'strobe';
        return grp;
      }
      this._addMesh(grp, this.geos.vehFireBody, this.m.craneRed, 0, 0, 0, 1, 1, 1, true);
      this._addMesh(grp, this.geos.vehFireSilver, this.m.brushedSilver, 0, 0, 0, 1, 1, 1, true);
      this._addMesh(grp, this.geos.vehTruckGlass, this.m.cockpitGlass, 0, 0, 0, 1, 1, 1, false);
      this._addMesh(grp, this.geos.vehTruckWheels, this.m.tireRubber, 0, 0, 0, 1, 1, 1, true);
      this._addMesh(grp, this.geos.vehTruckHL, this.m.vehHeadlight, 0, 0, 0, 1, 1, 1, false);
      this._addMesh(grp, this.geos.vehTruckTL, this.m.vehTaillight, 0, 0, 0, 1, 1, 1, false);

      const strobe = this._addMesh(grp, this.geos.box, this.m.beaconRed, 0, 0.190, 0.165, 0.115, 0.018, 0.028, false);
      strobe.name = 'strobe';
      return grp;
    }

    if (k === 'garbagetruck') {
      if (this._placeFittedGLB(grp, 'cc0_garbage', 0, 0, 0, 0.19, 0.22, 0.44, false, 0)) {
        return grp;
      }
      // Clean White Cab + Emerald-Green Rear-Loader Compactor Hopper Truck
      this._addMesh(grp, this.geos.vehTruckCab, this.m.carPearlWhite, 0, 0, 0, 1, 1, 1, true);
      this._addMesh(grp, this.geos.vehGarbageHopper, this.m.garbageGreen, 0, 0, 0, 1, 1, 1, true);
      this._addMesh(grp, this.geos.vehTruckGlass, this.m.cockpitGlass, 0, 0, 0, 1, 1, 1, false);
      this._addMesh(grp, this.geos.vehTruckWheels, this.m.tireRubber, 0, 0, 0, 1, 1, 1, true);
      this._addMesh(grp, this.geos.vehTruckHL, this.m.vehHeadlight, 0, 0, 0, 1, 1, 1, false);
      this._addMesh(grp, this.geos.vehTruckTL, this.m.vehTaillight, 0, 0, 0, 1, 1, 1, false);
      return grp;
    }

    if (k === 'truck') {
      // Modern Cab-Over Cargo / Container Rig (L ≈ 0.44, W ≈ 0.160, H ≈ 0.190)
      const cabMat = (v & 1) === 0 ? this.m.carPearlWhite : this.m.airlineBlue;
      const boxMat = this.containerMats[v % this.containerMats.length];
      this._addMesh(grp, this.geos.vehTruckCab, cabMat, 0, 0, 0, 1, 1, 1, true);
      this._addMesh(grp, this.geos.box, boxMat, 0, 0.118, -0.072, 0.158, 0.142, 0.296, true);
      this._addMesh(grp, this.geos.vehTruckGlass, this.m.cockpitGlass, 0, 0, 0, 1, 1, 1, false);
      this._addMesh(grp, this.geos.vehTruckWheels, this.m.tireRubber, 0, 0, 0, 1, 1, 1, true);
      this._addMesh(grp, this.geos.vehTruckHL, this.m.vehHeadlight, 0, 0, 0, 1, 1, 1, false);
      this._addMesh(grp, this.geos.vehTruckTL, this.m.vehTaillight, 0, 0, 0, 1, 1, 1, false);
      return grp;
    }

    const isTaxi = k === 'taxi';
    const isSuv = k === 'suv' || (!isTaxi && (v % 4 === 3));
    const paint = isTaxi ? this.m.taxiYellow : this.carBodyPalette[v % this.carBodyPalette.length];

    if (isSuv) {
      // Compact Urban SUV (L ≈ 0.31, W ≈ 0.150, H ≈ 0.126)
      this._addMesh(grp, this.geos.vehSuvBody, paint, 0, 0, 0, 1, 1, 1, true);
      this._addMesh(grp, this.geos.vehSuvCabin, this.m.cockpitGlass, 0, 0, 0, 1, 1, 1, true);
      this._addMesh(grp, this.geos.vehSuvWheels, this.m.tireRubber, 0, 0, 0, 1, 1, 1, true);
      this._addMesh(grp, this.geos.vehSuvHL, this.m.vehHeadlight, 0, 0, 0, 1, 1, 1, false);
      this._addMesh(grp, this.geos.vehSuvTL, this.m.vehTaillight, 0, 0, 0, 1, 1, 1, false);
    } else {
      // Sleek Modern Sedan / Taxi (L ≈ 0.30, W ≈ 0.145, H ≈ 0.114)
      this._addMesh(grp, this.geos.vehSedanBody, paint, 0, 0, 0, 1, 1, 1, true);
      this._addMesh(grp, this.geos.vehSedanCabin, this.m.cockpitGlass, 0, 0, 0, 1, 1, 1, true);
      this._addMesh(grp, this.geos.vehSedanWheels, this.m.tireRubber, 0, 0, 0, 1, 1, 1, true);
      this._addMesh(grp, this.geos.vehSedanHL, this.m.vehHeadlight, 0, 0, 0, 1, 1, 1, false);
      this._addMesh(grp, this.geos.vehSedanTL, this.m.vehTaillight, 0, 0, 0, 1, 1, 1, false);

      if (isTaxi) {
        this._addMesh(grp, this.geos.box, this.m.taxiSignGlow, 0, 0.118, -0.012, 0.056, 0.016, 0.024, false);
      }
    }

    return grp;
  }

  createBulletTrainCarObject(isHead = false) {
    const THREE = this.THREE;
    const grp = new THREE.Group();
    grp.rotation.order = 'YXZ';

    if (isHead) {
      this._addMesh(grp, this.geos.fuxingHeadBody, this.m.fuxingBody, 0, 0, 0, 1, 1, 1, true);
      this._addMesh(grp, this.geos.fuxingHeadStripe, this.m.fuxingRedStripe, 0, 0, 0, 1, 1, 1, false);
      this._addMesh(grp, this.geos.fuxingHeadDark, this.m.cockpitGlass, 0, 0, 0, 1, 1, 1, true);
      this._addMesh(grp, this.geos.fuxingHeadlights, this.m.fuxingHeadlight, 0, 0, 0, 1, 1, 1, false);
    } else {
      this._addMesh(grp, this.geos.fuxingMidBody, this.m.fuxingBody, 0, 0, 0, 1, 1, 1, true);
      this._addMesh(grp, this.geos.fuxingMidStripe, this.m.fuxingRedStripe, 0, 0, 0, 1, 1, 1, false);
      this._addMesh(grp, this.geos.fuxingMidDark, this.m.cockpitGlass, 0, 0, 0, 1, 1, 1, true);
      this._addMesh(grp, this.geos.box, this.m.fuxingRoofSilver, 0, 0.242, 0, 0.11, 0.012, 0.36, false);
    }

    return grp;
  }

  createAirlinerObject(variant = 0) {
    const THREE = this.THREE;
    const grp = new THREE.Group();
    grp.rotation.order = 'YXZ';
    const livery = (variant & 1) === 0 ? this.m.airlineBlue : this.m.craneRed;

    this._addMesh(grp, this.geos.fuselage, this.m.whiteComposite, 0, 0.14, -0.02, 1.0, 1.0, 1.0, true);
    this._addMesh(grp, this.geos.fuselage, livery, 0, 0.115, -0.02, 0.96, 0.68, 0.97, false);
    this._addMesh(grp, this.geos.sphere16, this.m.cockpitGlass, 0, 0.175, 0.52, 0.135, 0.075, 0.16, false);
    // Landing nose headlight glow
    this._addMesh(grp, this.geos.sphere16, this.m.vehHeadlight, 0, 0.095, 0.62, 0.032, 0.024, 0.024, false);

    this._addMesh(grp, this.geos.airlinerWing, this.m.whiteComposite, 0, 0.12, 0.08, 1.0, 1.0, 1.0, true);
    const wlL = this._addMesh(grp, this.geos.box, livery, 0.68, 0.165, -0.12, 0.015, 0.09, 0.08, true);
    wlL.rotation.z = -0.22;
    const wlR = this._addMesh(grp, this.geos.box, livery, -0.68, 0.165, -0.12, 0.015, 0.09, 0.08, true);
    wlR.rotation.z = 0.22;

    for (const sx of [-0.28, 0.28]) {
      const pod = this._addMesh(grp, this.geos.cyl16, this.m.whiteComposite, sx, 0.075, 0.06, 0.095, 0.20, 0.095, true);
      pod.rotation.x = Math.PI * 0.5;
      const intake = this._addMesh(grp, this.geos.cyl16, this.m.brushedSilver, sx, 0.075, 0.162, 0.098, 0.018, 0.098, false);
      intake.rotation.x = Math.PI * 0.5;
      const fan = this._addMesh(grp, this.geos.cyl16, this.m.cockpitGlass, sx, 0.075, 0.168, 0.078, 0.012, 0.078, false);
      fan.rotation.x = Math.PI * 0.5;
    }

    this._addMesh(grp, this.geos.airlinerVTail, livery, 0, 0.19, -0.48, 1.0, 1.0, 1.0, true);
    this._addMesh(grp, this.geos.airlinerHTail, this.m.whiteComposite, 0, 0.15, -0.52, 1.0, 1.0, 1.0, true);

    this._addMesh(grp, this.geos.sphere16, this.m.beaconRed, 0.69, 0.21, -0.14, 0.038, 0.038, 0.038, false);
    this._addMesh(grp, this.geos.sphere16, this.m.strobeGreen, -0.69, 0.21, -0.14, 0.038, 0.038, 0.038, false);
    const tailStrobe = this._addMesh(grp, this.geos.sphere16, this.m.beaconRed, 0, 0.485, -0.62, 0.042, 0.042, 0.042, false);
    tailStrobe.name = 'strobe';

    return grp;
  }

  createCargoShipObject(variant = 0) {
    const THREE = this.THREE;
    const grp = new THREE.Group();
    grp.rotation.order = 'YXZ';
    const seed = Math.abs(variant | 0);

    this._addMesh(grp, this.geos.shipHullBoot, this.m.hullCrimson, 0, 0.0, 0, 1.0, 1.0, 1.0, true);
    this._addMesh(grp, this.geos.shipHullMain, this.m.hullNavy, 0, 0.075, 0, 1.0, 1.0, 1.0, true);

    this._addMesh(grp, this.geos.cyl16, this.m.whiteComposite, 0, 0.28, 0.88, 0.022, 0.16, 0.022, false);
    this._addMesh(grp, this.geos.sphere16, this.m.neonGold, 0, 0.37, 0.88, 0.035, 0.035, 0.035, false);

    this._addMesh(grp, this.geos.box, this.m.whiteComposite, 0, 0.30, -0.62, 0.38, 0.22, 0.22, true);
    this._addMesh(grp, this.geos.box, this.m.whiteComposite, 0, 0.44, -0.60, 0.48, 0.07, 0.14, true);
    this._addMesh(grp, this.geos.box, this.m.cockpitGlass, 0, 0.45, -0.528, 0.44, 0.035, 0.015, false);
    // Port (Red) & Starboard (Green) Marine Navigation Bridge Wing Lights + Radar Mast
    this._addMesh(grp, this.geos.sphere16, this.m.beaconRed, 0.24, 0.48, -0.58, 0.024, 0.024, 0.024, false);
    this._addMesh(grp, this.geos.sphere16, this.m.strobeGreen, -0.24, 0.48, -0.58, 0.024, 0.024, 0.024, false);
    this._addMesh(grp, this.geos.cyl16, this.m.brushedSilver, 0, 0.56, -0.60, 0.016, 0.18, 0.016, false);
    this._addMesh(grp, this.geos.box, this.m.whiteComposite, 0, 0.62, -0.60, 0.12, 0.014, 0.018, false);
    this._addMesh(grp, this.geos.box, (seed & 1) ? this.m.airlineBlue : this.m.craneRed, 0, 0.47, -0.70, 0.10, 0.16, 0.11, true);
    this._addMesh(grp, this.geos.box, this.m.asphalt, 0, 0.56, -0.70, 0.102, 0.035, 0.112, false);

    const baysZ = [0.50, 0.18, -0.14, -0.86];
    for (let bIdx = 0; bIdx < baysZ.length; bIdx++) {
      const bz = baysZ[bIdx];
      const cols = bIdx === 0 ? [-0.08, 0.08] : [-0.13, 0.0, 0.13];
      const tiers = bIdx === 3 ? 2 : (bIdx === 0 ? 2 : 3);
      for (let cIdx = 0; cIdx < cols.length; cIdx++) {
        for (let t = 0; t < tiers; t++) {
          const mat = this.containerMats[(bIdx * 3 + cIdx + t * 2 + seed) % this.containerMats.length];
          this._addMesh(grp, this.geos.box, mat, cols[cIdx], 0.25 + t * 0.082, bz, 0.118, 0.08, 0.27, true);
        }
      }
    }

    return grp;
  }

  // Scenic Coastal Leisure Sailboat / Fishing Boat (uses Kenney CC0 watercraft GLBs when loaded + crisp sailboat fallback!)
  createLeisureBoatObject(variant = 0) {
    const THREE = this.THREE;
    const grp = new THREE.Group();
    grp.rotation.order = 'YXZ';
    const key = (variant & 1) === 0 ? 'cc0_sailboat' : 'cc0_fishingboat';
    if (this._placeFittedGLB(grp, key, 0, 0, 0, 0.34, 0.62, 0.56, false, 0)) {
      return grp;
    }
    this._addMesh(grp, this.geos.box, this.m.whiteComposite, 0, 0.045, 0, 0.16, 0.07, 0.44, true);
    this._addMesh(grp, this.geos.box, this.m.airlineBlue, 0, 0.02, 0, 0.15, 0.03, 0.42, false);
    this._addMesh(grp, this.geos.cyl16, this.m.brushedSilver, 0, 0.26, 0.02, 0.014, 0.42, 0.014, false);
    this._addMesh(grp, this.geos.box, this.m.whiteComposite, 0, 0.28, -0.06, 0.012, 0.32, 0.18, true);
    return grp;
  }

  // ==================== 5. Atmospheric Procedural Sky Dome ====================

  createSkyDome() {
    const THREE = this.THREE;
    const geo = new THREE.SphereGeometry(145, 32, 20);

    const uniforms = {
      uTime: { value: 0.0 },
      uNight: { value: 0.0 },
      uSunset: { value: 0.0 },
      uCloudCover: { value: 0.0 },
      uOvercast: { value: 0.0 },
      uSunDir: { value: new THREE.Vector3(0.45, 0.75, 0.48).normalize() }
    };

    const vertexShader = `
      varying vec3 vDir;
      void main() {
        vDir = position;
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPos;
      }
    `;

    const fragmentShader = `
      uniform float uTime;
      uniform float uNight;
      uniform float uSunset;
      uniform float uCloudCover;
      uniform float uOvercast;
      uniform vec3 uSunDir;
      varying vec3 vDir;

      float hash21(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      float noise2D(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        float a = hash21(i);
        float b = hash21(i + vec2(1.0, 0.0));
        float c = hash21(i + vec2(0.0, 1.0));
        float d = hash21(i + vec2(1.0, 1.0));
        return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        mat2 rot = mat2(0.80, 0.60, -0.60, 0.80);
        for (int i = 0; i < 4; i++) {
          v += a * noise2D(p);
          p = rot * p * 2.03 + vec2(17.1, 31.7);
          a *= 0.5;
        }
        return v;
      }

      vec3 hash33(vec3 p) {
        p = fract(p * vec3(0.1031, 0.1030, 0.0973));
        p += dot(p, p.yxz + 33.33);
        return fract((p.xxy + p.yxx) * p.zyx);
      }

      float starLayer(vec3 dir, float scale, float time) {
        vec3 p = dir * scale;
        vec3 id = floor(p);
        vec3 f = fract(p) - 0.5;
        vec3 rnd = hash33(id);
        if (rnd.z < 0.76) return 0.0;
        vec3 center = (rnd - 0.5) * 0.56;
        float dist = length(f - center);
        float size = mix(0.055, 0.115, rnd.x);
        float star = smoothstep(size, size * 0.15, dist);
        float twinkle = 0.66 + 0.34 * sin(time * (1.8 + rnd.y * 4.2) + rnd.z * 62.83);
        return star * twinkle * smoothstep(0.76, 1.0, rnd.z);
      }

      void main() {
        vec3 d = normalize(vDir);
        float up = clamp(d.y, 0.0, 1.0);
        float horizonFactor = pow(1.0 - up, 2.6);

        vec3 dayZenith = vec3(0.16, 0.45, 0.85);
        vec3 dayMid = vec3(0.41, 0.70, 0.95);
        vec3 dayHorizon = vec3(0.76, 0.89, 0.99);
        vec3 dayCol = mix(dayZenith, dayMid, smoothstep(0.85, 0.22, up));
        dayCol = mix(dayCol, dayHorizon, horizonFactor);

        vec3 nightZenith = vec3(0.014, 0.026, 0.068);
        vec3 nightHorizon = vec3(0.052, 0.092, 0.180);
        vec3 nightCol = mix(nightZenith, nightHorizon, pow(1.0 - up, 2.1));

        vec3 sky = mix(dayCol, nightCol, uNight);

        float sunCos = dot(d, uSunDir);
        float sunAzimuth = max(0.0, dot(normalize(vec2(d.x, d.z) + 1e-5), normalize(vec2(uSunDir.x, uSunDir.z) + 1e-5)));
        vec3 sunsetGlowCol = mix(vec3(0.95, 0.38, 0.26), vec3(1.0, 0.76, 0.38), pow(sunAzimuth, 2.0));
        float sunsetBand = uSunset * pow(1.0 - up, 2.2) * (0.35 + 0.65 * sunAzimuth);
        sky = mix(sky, sunsetGlowCol, clamp(sunsetBand * 0.82, 0.0, 0.85));

        float sunVis = smoothstep(-0.10, 0.06, uSunDir.y) * (1.0 - uNight * 0.92);
        float sunDisc = smoothstep(0.9980, 0.9993, sunCos);
        float sunCorona = pow(max(0.0, sunCos), 36.0) * 0.55 + pow(max(0.0, sunCos), 6.0) * 0.14;
        vec3 sunTint = mix(vec3(1.0, 0.97, 0.88), vec3(1.0, 0.58, 0.24), uSunset * 0.80);
        sky += sunTint * (sunDisc * 1.65 + sunCorona) * sunVis;

        if (uNight > 0.02 && d.y > 0.02) {
          float starFade = uNight * smoothstep(0.02, 0.24, d.y);
          float s1 = starLayer(d, 155.0, uTime);
          float s2 = starLayer(d + vec3(0.37, 0.19, -0.23), 240.0, uTime * 1.15);
          vec3 starCol = mix(vec3(0.76, 0.88, 1.0), vec3(1.0, 0.91, 0.74), fract(d.x * 37.0 + d.z * 19.0));
          sky += starCol * (s1 * 1.25 + s2 * 0.95) * starFade;

          vec3 moonDir = normalize(vec3(-uSunDir.x, max(0.34, -uSunDir.y * 0.72 + 0.26), -uSunDir.z));
          float moonCos = dot(d, moonDir);
          float moonDisc = smoothstep(0.9986, 0.9993, moonCos);
          float moonHalo = pow(max(0.0, moonCos), 28.0) * 0.28 + pow(max(0.0, moonCos), 6.0) * 0.06;
          float crater = 0.86 + 0.14 * noise2D(d.xy * 180.0);
          sky += vec3(0.82, 0.90, 1.0) * (moonDisc * crater * 1.15 + moonHalo) * uNight;
        }

        if (d.y > 0.015) {
          vec2 cloudUV = d.xz / (d.y + 0.20);
          float cBase = fbm(cloudUV * 1.05 + vec2(uTime * 0.011, uTime * 0.006));
          float cirrus = noise2D(cloudUV * vec2(2.6, 0.75) - vec2(uTime * 0.018, 0.0));

          float covShift = uCloudCover * 0.34;
          float cumulusMask = smoothstep(0.50 - covShift, 0.78 - covShift * 0.65, cBase);
          float cirrusMask = smoothstep(0.62 - covShift * 0.5, 0.88, cirrus) * 0.35;
          float cloudAlpha = clamp(cumulusMask * (0.78 + uCloudCover * 0.22) + cirrusMask, 0.0, 0.94) * smoothstep(0.015, 0.20, d.y);

          vec3 cloudDay = mix(vec3(0.76, 0.84, 0.94), vec3(1.0, 0.99, 0.98), smoothstep(0.48, 0.76, cBase));
          vec3 cloudStorm = mix(vec3(0.28, 0.33, 0.40), vec3(0.52, 0.58, 0.66), smoothstep(0.35, 0.72, cBase));
          cloudDay = mix(cloudDay, cloudStorm, uOvercast);
          vec3 cloudSunset = mix(vec3(0.52, 0.34, 0.48), vec3(1.0, 0.64, 0.38), smoothstep(0.45, 0.74, cBase));
          vec3 cloudNight = vec3(0.07, 0.11, 0.20);

          vec3 cloudCol = mix(cloudDay, cloudSunset, uSunset * 0.82 * (1.0 - uOvercast * 0.75));
          cloudCol = mix(cloudCol, cloudNight, uNight * 0.88);
          sky = mix(sky, cloudCol, cloudAlpha * (1.0 - uNight * 0.42));
        }

        // Subtle overcast sky desaturation during rain/storm/fog/snow
        vec3 overcastBase = mix(vec3(0.52, 0.60, 0.68), vec3(0.05, 0.07, 0.11), uNight);
        sky = mix(sky, overcastBase, uOvercast * 0.45);

        if (d.y < 0.0) {
          vec3 abyss = mix(vec3(0.56, 0.74, 0.90), vec3(0.03, 0.05, 0.10), uNight);
          sky = mix(sky, abyss, smoothstep(0.0, -0.22, d.y));
        }

        gl_FragColor = vec4(sky, 1.0);
      }
    `;

    const mat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      side: THREE.BackSide,
      depthWrite: false,
      fog: false
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.renderOrder = -1000;
    mesh.frustumCulled = false;

    let elapsed = 0;
    let lastStamp = typeof performance !== 'undefined' ? performance.now() : 0;

    const update = (dayProgress = 0.35, night, sunDir, weatherState = 'clear', weatherIntensity = 0) => {
      const now = typeof performance !== 'undefined' ? performance.now() : lastStamp + 16;
      const dt = Math.min(0.1, Math.max(0.001, (now - lastStamp) * 0.001));
      lastStamp = now;
      elapsed += dt;
      uniforms.uTime.value = elapsed;

      const sunAngle = (dayProgress - 0.25) * Math.PI * 2;
      const sunElev = Math.sin(sunAngle);
      const calcNight = night !== undefined
        ? Math.max(0, Math.min(1, night))
        : Math.max(0, Math.min(1, (-sunElev + 0.16) / 0.42));

      uniforms.uNight.value = calcNight;
      uniforms.uSunset.value = Math.max(0, 1 - Math.abs(sunElev - 0.06) / 0.30);
      const wi = Math.max(0, Math.min(1, weatherIntensity || 0));
      const targetCloud = weatherState === 'storm' ? 1.0 : (weatherState === 'rain' ? 0.88 : (weatherState === 'snow' ? 0.78 : (weatherState === 'fog' ? 0.65 : (weatherState === 'cloudy' ? 0.55 : 0.0))));
      const targetOver = weatherState === 'storm' ? 0.92 : (weatherState === 'rain' ? 0.72 : (weatherState === 'fog' ? 0.68 : (weatherState === 'snow' ? 0.52 : (weatherState === 'cloudy' ? 0.25 : 0.0))));
      uniforms.uCloudCover.value = targetCloud * Math.max(0.4, wi);
      uniforms.uOvercast.value = targetOver * Math.max(0.4, wi);

      if (sunDir) {
        if (typeof sunDir.x === 'number') {
          uniforms.uSunDir.value.set(sunDir.x, sunDir.y, sunDir.z).normalize();
        } else if (Array.isArray(sunDir) && sunDir.length >= 3) {
          uniforms.uSunDir.value.set(sunDir[0], sunDir[1], sunDir[2]).normalize();
        }
      } else {
        uniforms.uSunDir.value.set(Math.cos(sunAngle) * 34, sunElev * 42, 22).normalize();
      }

      this.setNightFactor(calcNight);
    };

    return { mesh, update };
  }
}
