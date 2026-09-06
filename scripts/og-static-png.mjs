// GitHub Pages types files by extension, so Next's extension-less
// `opengraph-image` route output is served as application/octet-stream and
// rejected by social crawlers. Rename to .png and repoint the meta tags.
// The filename carries a content hash because LinkedIn keys its image mirror
// on the path and ignores Next's `?hash` query, so a retitled card only
// reaches it when the path changes too.
// No-ops when `out/` is absent (e.g. Vercel builds).
import { readdir, rename, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { createHash } from "node:crypto";
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

// Route prefix ("" for the site card, "/articles/<slug>" for a dispatch)
// mapped to the hashed filename that replaces it in the meta tags.
const routes = new Map();
for (const file of files) {
  if (path.basename(file) !== "opengraph-image") continue;
  const hash = createHash("sha256")
    .update(await readFile(file))
    .digest("hex")
    .slice(0, 8);
  const name = `opengraph-image.${hash}.png`;
  await rename(file, path.join(path.dirname(file), name));
  const prefix = path.dirname(path.relative(OUT, file));
  routes.set(prefix === "." ? "" : `/${prefix}`, name);
}

// Longest prefix first so the site-level "" pass cannot claim article URLs.
const ordered = [...routes].sort((a, b) => b[0].length - a[0].length);

let patched = 0;
for (const file of files) {
  if (!file.endsWith(".html")) continue;
  const html = await readFile(file, "utf8");
  let next = html;
  for (const [prefix, name] of ordered) {
    next = next.replaceAll(
      new RegExp(`${prefix}/opengraph-image(?=[?"'])`, "g"),
      `${prefix}/${name}`
    );
  }
  if (next !== html) {
    await writeFile(file, next);
    patched += 1;
  }
}

console.log(
  `og-static-png: hashed ${routes.size} image(s), patched ${patched} page(s)`
);
