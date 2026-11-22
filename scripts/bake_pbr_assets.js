const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const ASSETS_SRC = path.join(ROOT, 'assets_src');
const WWW = path.join(ROOT, 'www');
const TEX_OUT = path.join(WWW, 'assets', 'textures');
const MODEL_OUT = path.join(WWW, 'assets', 'models');
const ICON_OUT = path.join(WWW, 'icons');

for (const dir of [WWW, TEX_OUT, MODEL_OUT, ICON_OUT]) {
  fs.mkdirSync(dir, { recursive: true });
}

// 14 Flagship PBR material definitions (Hero 7 building facades baked at 1024x1024 Albedo + enhanced architectural Normal/Roughness!)
const MATERIALS = [
  { key: 'facade_office_glass',     src: 'facades/facade_office_glass.jpg',     profile: 'glass_curtain', normalStrength: 3.1, cropInset: 0.0, albedoSize: 1024 },
  { key: 'facade_office_stone',     src: 'facades/facade_office_stone.jpg',     profile: 'facade_mix',    normalStrength: 3.2, cropInset: 0.0, albedoSize: 1024 },
  { key: 'facade_res_beige',        src: 'facades/facade_res_beige.jpg',        profile: 'facade_mix',    normalStrength: 2.9, cropInset: 0.0, albedoSize: 1024 },
  { key: 'facade_res_grey',         src: 'facades/facade_res_grey.jpg',         profile: 'facade_mix',    normalStrength: 2.9, cropInset: 0.0, albedoSize: 1024 },
  { key: 'facade_retail_podium',    src: 'facades/facade_retail_podium.jpg',    profile: 'facade_mix',    normalStrength: 3.0, cropInset: 0.0, albedoSize: 1024 },
  { key: 'facade_villa_plaster',    src: 'facades/facade_villa_plaster.jpg',    profile: 'plaster_mix',   normalStrength: 2.6, cropInset: 0.0, albedoSize: 1024 },
  { key: 'facade_industrial_panel', src: 'facades/facade_industrial_panel.jpg', profile: 'metal_panel',   normalStrength: 3.3, cropInset: 0.0, albedoSize: 1024 },
  { key: 'roof_concrete',           src: 'facades/roof_concrete.jpg',           profile: 'stone_matte',   normalStrength: 2.6, cropInset: 0.0, albedoSize: 768 },
  { key: 'roof_solar_green',        src: 'facades/roof_solar_green.jpg',        profile: 'solar_roof',    normalStrength: 2.6, cropInset: 0.0, albedoSize: 768 },
  { key: 'paving_plaza',            src: 'facades/paving_plaza.jpg',            profile: 'stone_matte',   normalStrength: 2.6, cropInset: 0.0, albedoSize: 768 },
  { key: 'road_2lane',              src: 'textures/road_2lane.jpg',             profile: 'road_asphalt',  normalStrength: 2.0, cropInset: 0.0, albedoSize: 768 },
  { key: 'road_4lane',              src: 'textures/road_4lane.jpg',             profile: 'road_asphalt',  normalStrength: 2.0, cropInset: 0.0, albedoSize: 768 },
  { key: 'road_hub',                src: 'textures/road_hub.jpg',               profile: 'road_asphalt',  normalStrength: 2.0, cropInset: 0.095, albedoSize: 768 },
  { key: 'dam_concrete',            src: 'textures/dam_concrete.jpg',           profile: 'dam_concrete',  normalStrength: 3.1, cropInset: 0.0, albedoSize: 768 }
];

const jobSpec = {
  albedoSize: 768,
  pbrSize: 512,
  iconSrc: path.join(ASSETS_SRC, 'app_icon.jpg'),
  iconOutDir: ICON_OUT,
  items: MATERIALS.map((m) => ({
    key: m.key,
    src: path.join(ASSETS_SRC, m.src),
    outAlbedo: path.join(TEX_OUT, `${m.key}.jpg`),
    outNorm: path.join(TEX_OUT, `${m.key}_norm.jpg`),
    outRough: path.join(TEX_OUT, `${m.key}_rough.jpg`),
    profile: m.profile,
    normalStrength: m.normalStrength,
    cropInset: m.cropInset,
    albedoSize: m.albedoSize || 768
  }))
};

for (const it of jobSpec.items) {
  if (!fs.existsSync(it.src)) {
    throw new Error(`Missing source PBR texture: ${it.src}`);
  }
}

const jobJsonPath = path.join(ROOT, 'scripts', '_pbr_job.json');
fs.writeFileSync(jobJsonPath, JSON.stringify(jobSpec, null, 2), 'utf8');

const psScript = `
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$cs = @"
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

public static class PbrBaker
{
    private static ImageCodecInfo GetJpegCodec()
    {
        foreach (var c in ImageCodecInfo.GetImageEncoders())
            if (c.MimeType == "image/jpeg") return c;
        return null;
    }

    private static void SaveJpeg(Bitmap bmp, string path, long quality)
    {
        var codec = GetJpegCodec();
        using (var ep = new EncoderParameters(1))
        {
            ep.Param[0] = new EncoderParameter(Encoder.Quality, quality);
            bmp.Save(path, codec, ep);
        }
    }

    private static Bitmap ResizeCrop(Bitmap src, int size, double cropInset)
    {
        var dst = new Bitmap(size, size, PixelFormat.Format24bppRgb);
        using (var g = Graphics.FromImage(dst))
        {
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;
            g.SmoothingMode = SmoothingMode.HighQuality;
            g.PixelOffsetMode = PixelOffsetMode.HighQuality;
            g.CompositingQuality = CompositingQuality.HighQuality;
            int ix = (int)Math.Round(src.Width * cropInset);
            int iy = (int)Math.Round(src.Height * cropInset);
            int sw = Math.Max(1, src.Width - ix * 2);
            int sh = Math.Max(1, src.Height - iy * 2);
            g.DrawImage(src, new Rectangle(0, 0, size, size), new Rectangle(ix, iy, sw, sh), GraphicsUnit.Pixel);
        }
        return dst;
    }

    private static byte ClampByte(double v)
    {
        if (v < 0) return 0;
        if (v > 255) return 255;
        return (byte)(v + 0.5);
    }

    public static void BakeIcon(string srcPath, string outPath, int size)
    {
        using (var src = new Bitmap(srcPath))
        using (var dst = ResizeCrop(src, size, 0.0))
        {
            dst.Save(outPath, ImageFormat.Png);
        }
    }

    public static void BakeMaterial(string srcPath, string outAlbedo, string outNorm, string outRough,
                                    int albedoSize, int pbrSize, string profile, double normalStrength, double cropInset)
    {
        using (var src = new Bitmap(srcPath))
        {
            // 1. High-Res Albedo (1024x1024 on 7 hero facades, 768x768 on secondary/roads/dam)
            using (var alb = ResizeCrop(src, albedoSize, cropInset))
            {
                SaveJpeg(alb, outAlbedo, albedoSize >= 1024 ? 88L : 86L);
            }

            // 2. PBR Working Bitmap (512x512) for fast seamless Sobel Normal + Physical Roughness
            using (var pbrSrc = ResizeCrop(src, pbrSize, cropInset))
            {
                int w = pbrSrc.Width, h = pbrSrc.Height;
                var rect = new Rectangle(0, 0, w, h);
                var srcData = pbrSrc.LockBits(rect, ImageLockMode.ReadOnly, PixelFormat.Format24bppRgb);
                int stride = srcData.Stride;
                byte[] rgb = new byte[stride * h];
                Marshal.Copy(srcData.Scan0, rgb, 0, rgb.Length);
                pbrSrc.UnlockBits(srcData);

                double[] height = new double[w * h];
                byte[] roughBuf = new byte[stride * h];

                for (int y = 0; y < h; y++)
                {
                    int row = y * stride;
                    double vFrac = (double)y / (h - 1);
                    for (int x = 0; x < w; x++)
                    {
                        int p = row + x * 3;
                        double b = rgb[p] / 255.0;
                        double g = rgb[p + 1] / 255.0;
                        double r = rgb[p + 2] / 255.0;
                        double lum = 0.299 * r + 0.587 * g + 0.114 * b;
                        double maxC = Math.Max(r, Math.Max(g, b));
                        double minC = Math.Min(r, Math.Min(g, b));
                        double sat = maxC > 0.001 ? (maxC - minC) / maxC : 0.0;
                        double blueDom = b - 0.5 * (r + g);

                        double ht = lum;
                        double rough = 0.78;

                        if (profile == "glass_curtain")
                        {
                            // Dark or cool-blue glass panes -> ultra-glossy mirror IBL; bright silver mullions -> satin metal
                            bool isGlass = (lum < 0.56) || (blueDom > 0.045);
                            ht = isGlass ? lum * 0.35 : 0.72 + lum * 0.28;
                            rough = isGlass ? (0.08 + lum * 0.08) : (0.34 + (1.0 - lum) * 0.14);
                        }
                        else if (profile == "facade_mix" || profile == "plaster_mix")
                        {
                            // Windows are darker or cooler blue-grey; walls/frames are brighter/warmer
                            bool isWindow = (lum < 0.38) || (blueDom > 0.050 && lum < 0.62);
                            if (isWindow)
                            {
                                ht = lum * 0.24;
                                rough = 0.10 + lum * 0.14;
                            }
                            else
                            {
                                ht = 0.58 + lum * 0.42;
                                rough = (profile == "plaster_mix" ? 0.84 : 0.76) + (1.0 - lum) * 0.14;
                            }
                        }
                        else if (profile == "metal_panel")
                        {
                            ht = lum;
                            rough = 0.40 + (1.0 - lum) * 0.24;
                        }
                        else if (profile == "solar_roof")
                        {
                            bool isSolar = (blueDom > 0.04 && lum < 0.52);
                            bool isGreen = (g > r + 0.04 && g > b + 0.02);
                            if (isSolar) { ht = 0.45 + lum * 0.25; rough = 0.15 + lum * 0.10; }
                            else if (isGreen) { ht = 0.62 + lum * 0.38; rough = 0.88; }
                            else { ht = 0.45 + lum * 0.45; rough = 0.78 + (1.0 - lum) * 0.12; }
                        }
                        else if (profile == "road_asphalt")
                        {
                            bool isPaint = (lum > 0.72) || (r > 0.68 && g > 0.50 && b < 0.35); // white/yellow paint
                            bool isSidewalk = (lum > 0.48 && sat < 0.12 && !isPaint);
                            if (isPaint) { ht = 0.58; rough = 0.44; }
                            else if (isSidewalk) { ht = 0.55 + lum * 0.45; rough = 0.76 + (1.0 - lum) * 0.12; }
                            else { ht = lum * 0.85; rough = 0.66 + (0.45 - Math.Min(0.45, lum)) * 0.35; }
                        }
                        else if (profile == "dam_concrete")
                        {
                            // Wet mossy base along bottom 20% has lower roughness (damp water sheen)
                            double wetZone = Math.Max(0.0, (vFrac - 0.76) / 0.24);
                            double damp = wetZone * (0.55 + 0.45 * Math.Max(0.0, (0.55 - lum) * 2.0));
                            ht = lum;
                            rough = Math.Max(0.24, 0.84 - damp * 0.48 + (0.5 - lum) * 0.08);
                        }
                        else // stone_matte
                        {
                            ht = lum;
                            rough = 0.76 + (1.0 - lum) * 0.16;
                        }

                        height[y * w + x] = ht;
                        byte rb = ClampByte(Math.Max(0.08, Math.Min(0.96, rough)) * 255.0);
                        roughBuf[p] = rb;
                        roughBuf[p + 1] = rb;
                        roughBuf[p + 2] = rb;
                    }
                }

                // 3. Sobel 3x3 Tangent-Space Normal Map (seamless wrap)
                byte[] normBuf = new byte[stride * h];
                for (int y = 0; y < h; y++)
                {
                    int ym = (y - 1 + h) % h;
                    int yp = (y + 1) % h;
                    int row = y * stride;
                    for (int x = 0; x < w; x++)
                    {
                        int xm = (x - 1 + w) % w;
                        int xp = (x + 1) % w;

                        double tl = height[ym * w + xm];
                        double tc = height[ym * w + x];
                        double tr = height[ym * w + xp];
                        double ml = height[y * w + xm];
                        double mr = height[y * w + xp];
                        double bl = height[yp * w + xm];
                        double bc = height[yp * w + x];
                        double br = height[yp * w + xp];

                        double dX = (tr + 2.0 * mr + br) - (tl + 2.0 * ml + bl);
                        double dY = (bl + 2.0 * bc + br) - (tl + 2.0 * tc + tr);

                        double nx = -dX * normalStrength;
                        double ny = -dY * normalStrength;
                        double nz = 1.0;
                        double invLen = 1.0 / Math.Sqrt(nx * nx + ny * ny + nz * nz);
                        nx *= invLen; ny *= invLen; nz *= invLen;

                        int p = row + x * 3;
                        // Format24bppRgb stores BGR byte order
                        normBuf[p]     = ClampByte((nz * 0.5 + 0.5) * 255.0);
                        normBuf[p + 1] = ClampByte((ny * 0.5 + 0.5) * 255.0);
                        normBuf[p + 2] = ClampByte((nx * 0.5 + 0.5) * 255.0);
                    }
                }

                using (var normBmp = new Bitmap(w, h, PixelFormat.Format24bppRgb))
                {
                    var nd = normBmp.LockBits(rect, ImageLockMode.WriteOnly, PixelFormat.Format24bppRgb);
                    Marshal.Copy(normBuf, 0, nd.Scan0, normBuf.Length);
                    normBmp.UnlockBits(nd);
                    SaveJpeg(normBmp, outNorm, 84L);
                }

                using (var roughBmp = new Bitmap(w, h, PixelFormat.Format24bppRgb))
                {
                    var rd = roughBmp.LockBits(rect, ImageLockMode.WriteOnly, PixelFormat.Format24bppRgb);
                    Marshal.Copy(roughBuf, 0, rd.Scan0, roughBuf.Length);
                    roughBmp.UnlockBits(rd);
                    SaveJpeg(roughBmp, outRough, 80L);
                }
            }
        }
    }
}
"@

Add-Type -TypeDefinition $cs -ReferencedAssemblies System.Drawing

$spec = Get-Content -Raw -Path '${jobJsonPath.replace(/\\/g, '\\\\')}' | ConvertFrom-Json
foreach ($it in $spec.items) {
    $albSz = if ($it.albedoSize) { [int]$it.albedoSize } else { [int]$spec.albedoSize }
    [PbrBaker]::BakeMaterial($it.src, $it.outAlbedo, $it.outNorm, $it.outRough,
                             $albSz, [int]$spec.pbrSize,
                             [string]$it.profile, [double]$it.normalStrength, [double]$it.cropInset)
    Write-Output ("Baked PBR (" + $albSz + "px): " + $it.key)
}

if (Test-Path $spec.iconSrc) {
    [PbrBaker]::BakeIcon($spec.iconSrc, (Join-Path $spec.iconOutDir "apple-touch-icon-180.png"), 180)
    [PbrBaker]::BakeIcon($spec.iconSrc, (Join-Path $spec.iconOutDir "icon-192.png"), 192)
    [PbrBaker]::BakeIcon($spec.iconSrc, (Join-Path $spec.iconOutDir "icon-512.png"), 512)
    Write-Output "Baked PWA App Icons (180, 192, 512)"
}
`;

const psPath = path.join(ROOT, 'scripts', '_run_pbr_baker.ps1');
fs.writeFileSync(psPath, psScript, 'utf8');

console.log('Baking 14 full PBR material suites (Albedo 768 + Normal 512 + Roughness 512) + iOS App Icons...');
const psOut = execFileSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', psPath], { encoding: 'utf8' });
process.stdout.write(psOut);

try { fs.unlinkSync(jobJsonPath); } catch {}
try { fs.unlinkSync(psPath); } catch {}

// Also extract smoke sprite & GLB models from src/assets_bundle.js to www/assets/ for decoupled PWA loading
const bundleSrc = fs.readFileSync(path.join(ROOT, 'src', 'assets_bundle.js'), 'utf8');
const smokeMatch = bundleSrc.match(/SMOKE_PNG_URI\s*=\s*"data:image\/png;base64,([^"]+)"/);
if (smokeMatch) {
  fs.writeFileSync(path.join(TEX_OUT, 'smoke.png'), Buffer.from(smokeMatch[1], 'base64'));
}
const glbStart = bundleSrc.indexOf('export const GLB_ASSETS = ');
if (glbStart >= 0) {
  const jsonText = bundleSrc.slice(glbStart + 'export const GLB_ASSETS = '.length).trim().replace(/;\s*$/, '');
  const glbMap = JSON.parse(jsonText);
  for (const [k, b64] of Object.entries(glbMap)) {
    fs.writeFileSync(path.join(MODEL_OUT, `${k}.glb`), Buffer.from(b64, 'base64'));
  }
  console.log(`Extracted ${Object.keys(glbMap).length} binary GLBs to www/assets/models/`);
}

// Build deterministic manifest.json of all external assets
const assetFiles = [];
function collectFiles(dir, relPrefix) {
  for (const name of fs.readdirSync(dir).sort()) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      collectFiles(full, `${relPrefix}${name}/`);
    } else if (name !== 'manifest.json') {
      assetFiles.push({ path: `${relPrefix}${name}`, bytes: stat.size });
    }
  }
}
collectFiles(path.join(WWW, 'assets'), 'assets/');
collectFiles(ICON_OUT, 'icons/');

const hashObj = crypto.createHash('sha256');
for (const f of assetFiles) {
  hashObj.update(f.path);
  hashObj.update(String(f.bytes));
}
const versionHash = hashObj.digest('hex').slice(0, 10);
const totalBytes = assetFiles.reduce((s, f) => s + f.bytes, 0);

const manifest = {
  version: `v7.5-${versionHash}`,
  generatedAt: new Date().toISOString(),
  totalBytes,
  fileCount: assetFiles.length,
  textures: MATERIALS.map((m) => ({
    key: m.key,
    albedo: `assets/textures/${m.key}.jpg`,
    normal: `assets/textures/${m.key}_norm.jpg`,
    roughness: `assets/textures/${m.key}_rough.jpg`
  })),
  smoke: 'assets/textures/smoke.png',
  files: assetFiles
};

fs.writeFileSync(path.join(WWW, 'assets', 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');
console.log(`Wrote www/assets/manifest.json: ${manifest.fileCount} files, ${(totalBytes / 1024 / 1024).toFixed(2)} MB (version ${manifest.version})`);
