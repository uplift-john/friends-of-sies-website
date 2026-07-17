#!/usr/bin/env node
/**
 * Deterministic accessibility & layout checks over the built HTML in _site/.
 * No browser required. Exits non-zero on any failure.
 *
 * Checks per page:
 *  - <html lang> is set
 *  - viewport meta present
 *  - exactly one <h1>
 *  - heading levels don't skip (h2 -> h4 forbidden)
 *  - every <img> has a non-empty alt
 *  - a <main> landmark exists
 *  - every form control (input/select/textarea) has an associated <label>
 *  - no inline style or attribute forcing a fixed width > 375px
 * Site-wide:
 *  - 404.html exists
 */
const fs = require("fs");
const path = require("path");

const SITE = path.join(__dirname, "..", "_site");
let failures = 0;

function fail(file, msg) {
  failures++;
  console.error(`FAIL ${file}: ${msg}`);
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : p.endsWith(".html") ? [p] : [];
  });
}

const pages = walk(SITE);
if (pages.length === 0) {
  console.error("FAIL: no HTML pages found in _site/ — run the build first.");
  process.exit(1);
}

for (const page of pages) {
  const rel = path.relative(SITE, page);
  const html = fs.readFileSync(page, "utf8");

  if (!/<html[^>]*\slang\s*=\s*["'][a-zA-Z-]+["']/.test(html)) {
    fail(rel, "<html lang> missing");
  }
  if (!/<meta[^>]*name\s*=\s*["']viewport["']/.test(html)) {
    fail(rel, "viewport meta missing");
  }

  const h1s = html.match(/<h1[\s>]/g) || [];
  if (h1s.length !== 1) fail(rel, `expected exactly one <h1>, found ${h1s.length}`);

  const headings = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
  let prev = 0;
  for (const level of headings) {
    if (level > prev + 1) fail(rel, `heading level skips from h${prev} to h${level}`);
    prev = level;
  }

  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    const tag = m[0];
    const alt = tag.match(/\salt\s*=\s*["']([^"']*)["']/);
    if (!alt || alt[1].trim() === "") fail(rel, `<img> without non-empty alt: ${tag.slice(0, 80)}`);
  }

  if (!/<main[\s>]/.test(html)) fail(rel, "<main> landmark missing");

  for (const m of html.matchAll(/<(input|select|textarea)\b[^>]*>/g)) {
    const tag = m[0];
    if (/type\s*=\s*["'](hidden|submit|button)["']/.test(tag)) continue;
    const id = tag.match(/\sid\s*=\s*["']([^"']+)["']/);
    const labelled =
      (id && new RegExp(`<label[^>]*\\sfor\\s*=\\s*["']${id[1]}["']`).test(html)) ||
      /aria-label\s*=/.test(tag);
    if (!labelled) fail(rel, `form control without label: ${tag.slice(0, 80)}`);
  }

  for (const m of html.matchAll(/style\s*=\s*["'][^"']*width\s*:\s*(\d+)px/g)) {
    if (Number(m[1]) > 375) fail(rel, `inline fixed width ${m[1]}px exceeds 375px viewport`);
  }
  for (const m of html.matchAll(/\swidth\s*=\s*["'](\d+)["']/g)) {
    if (Number(m[1]) > 375) fail(rel, `width attribute ${m[1]} exceeds 375px viewport`);
  }
}

if (!fs.existsSync(path.join(SITE, "404.html"))) {
  fail("(site)", "404.html missing");
}

console.log(`Checked ${pages.length} pages.`);
if (failures > 0) {
  console.error(`${failures} failure(s).`);
  process.exit(1);
}
console.log("a11y-check: all checks passed.");
