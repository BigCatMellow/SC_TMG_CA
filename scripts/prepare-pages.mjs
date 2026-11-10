// Publish only the runnable companion, not source PDFs, tests, docs or .git.
import { copyFile, cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { deflateSync } from 'node:zlib';

const root = new URL('../', import.meta.url);
const dest = new URL('../dist-pages/', import.meta.url);
await rm(dest, { recursive: true, force: true });
await mkdir(dest, { recursive: true });

const files = (await readdir(root, { withFileTypes: true }))
  .filter(entry => entry.isFile() &&
    (entry.name.endsWith('.html') || entry.name.endsWith('.js') ||
     entry.name.endsWith('.css') || entry.name === 'manifest.webmanifest'))
  .map(entry => entry.name);
for (const name of files) await copyFile(new URL('../' + name, import.meta.url),
  new URL('../dist-pages/' + name, import.meta.url));
for (const folder of ['uploads', 'portraits', 'vendor']) {
  await cp(new URL('../' + folder + '/', import.meta.url),
    new URL('../dist-pages/' + folder + '/', import.meta.url), { recursive: true });
}
await writeFile(new URL('../dist-pages/.nojekyll', import.meta.url), '');

function crc32(data) {
  let c = 0xffffffff;
  for (const n of data) {
    c ^= n;
    for (let i = 0; i < 8; i++) c = (c & 1) ? (c >>> 1) ^ 0xedb88320 : c >>> 1;
  }
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const head = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const check = Buffer.alloc(4); check.writeUInt32BE(crc32(Buffer.concat([head, data])));
  return Buffer.concat([len, head, data, check]);
}
function inPolygon(x, y, corners) {
  let inside = false;
  for (let i = 0, j = corners.length - 1; i < corners.length; j = i++) {
    const [xi, yi] = corners[i], [xj, yj] = corners[j];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
function hex(radius) {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = i * Math.PI / 3 - Math.PI / 2;
    return [.5 + Math.cos(angle) * radius, .5 + Math.sin(angle) * radius];
  });
}
function makePng(size) {
  const raw = Buffer.alloc((size * 4 + 1) * size, 0);
  const outer = hex(.35), inner = hex(.305);
  const core = [[.5,.36],[.545,.455],[.64,.5],[.545,.545],
    [.5,.64],[.455,.545],[.36,.5],[.455,.455]];
  for (let y = 0; y < size; y++) {
    const row = y * (size * 4 + 1);
    for (let x = 0; x < size; x++) {
      const nx=(x+.5)/size, ny=(y+.5)/size;
      const isRing = inPolygon(nx, ny, outer) && !inPolygon(nx, ny, inner);
      const isCore = inPolygon(nx, ny, core);
      const color = isCore ? [233,236,242,255] : isRing ? [176,110,247,255] : [5,6,10,255];
      const offset = row + 1 + x*4;
      for (let channel=0; channel<4; channel++) raw[offset+channel]=color[channel];
    }
  }
  const ihdr=Buffer.alloc(13);
  ihdr.writeUInt32BE(size,0); ihdr.writeUInt32BE(size,4);
  ihdr[8]=8; ihdr[9]=6;
  return Buffer.concat([
    Buffer.from([137,80,78,71,13,10,26,10]),
    chunk('IHDR',ihdr),
    chunk('IDAT',deflateSync(raw,{level:9})),
    chunk('IEND',Buffer.alloc(0))
  ]);
}
await mkdir(new URL('../dist-pages/icons/', import.meta.url), { recursive: true });
for (const size of [192,512])
  await writeFile(new URL('../dist-pages/icons/icon-' + size + '.png', import.meta.url), makePng(size));

// Offline cache list: every page, script, style and font, the faction logos and the
// cutout portraits. Other images are cached the first time they are viewed.
import { createHash } from 'node:crypto';
import { readFile as readText } from 'node:fs/promises';
async function walk(dir, prefix = '') {
  const out = [];
  for (const entry of await readdir(new URL(dir, dest), { withFileTypes: true })) {
    const rel = prefix + entry.name;
    if (entry.isDirectory()) out.push(...await walk(dir + entry.name + '/', rel + '/'));
    else out.push(rel);
  }
  return out;
}
const everything = await walk('./');
const precache = ['./', ...everything.filter(rel =>
  (!rel.includes('/') && /\.(html|js|css|webmanifest)$/.test(rel) && rel !== 'sw.js') ||
  rel.startsWith('vendor/') ||
  /^uploads\/[a-z]+logo\.png$/.test(rel) ||
  rel.startsWith('portraits/cutout/') ||
  rel.startsWith('icons/')
).filter(rel => !/^uploads\/.*\.html$/.test(rel)).sort()];
const hash = createHash('sha256');
for (const rel of precache.slice(1)) hash.update(rel).update(await readFile(new URL(rel, dest)));
const sw = (await readText(new URL('sw.js', dest), 'utf8'))
  .replace("const VERSION = 'dev';", "const VERSION = '" + hash.digest('hex').slice(0, 12) + "';")
  .replace("const PRECACHE = ['./', 'index.html'];", 'const PRECACHE = ' + JSON.stringify(precache.map(encodeURI)) + ';');
await writeFile(new URL('sw.js', dest), sw);

console.log('Prepared GitHub Pages site:', files.length, 'root assets + portraits/uploads + app icons;', precache.length, 'files precached for offline');
