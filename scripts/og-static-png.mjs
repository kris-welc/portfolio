// GitHub Pages types files by extension, so Next's extension-less
// `opengraph-image` route output is served as application/octet-stream and
// rejected by social crawlers. Rename to .png and repoint the meta tags.
// No-ops when `out/` is absent (e.g. Vercel builds).
import { readdir, rename, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const OUT = path.resolve("out");

if (!existsSync(OUT)) {
  process.exit(0);
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files;
}

const files = await walk(OUT);

let renamed = 0;
for (const file of files) {
  if (path.basename(file) === "opengraph-image") {
    await rename(file, `${file}.png`);
    renamed += 1;
  }
}

let patched = 0;
for (const file of files) {
  if (!file.endsWith(".html")) continue;
  const html = await readFile(file, "utf8");
  const next = html.replaceAll(
    /\/opengraph-image(?=[?"'])/g,
    "/opengraph-image.png"
  );
  if (next !== html) {
    await writeFile(file, next);
    patched += 1;
  }
}

console.log(`og-static-png: renamed ${renamed} image(s), patched ${patched} page(s)`);
