// Full-page screenshots of every page at 3 widths into design-review/.
// Usage: node scripts/screenshots.mjs [baseUrl]  (default http://localhost:8080)
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const base = process.argv[2] || 'http://localhost:8080';
const pages = [
  ['home', '/'],
  ['about', '/about/'],
  ['what-we-fund', '/what-we-fund/'],
  ['events', '/events/'],
  ['ways-to-give', '/ways-to-give/'],
  ['for-businesses', '/for-businesses/'],
  ['friends-and-pta', '/friends-and-pta/'],
  ['contact', '/contact/'],
];
const widths = [
  ['desktop', 1440, 900],
  ['tablet', 768, 1024],
  ['mobile', 390, 844],
];

mkdirSync('design-review', { recursive: true });
const browser = await chromium.launch();
for (const [wname, width, height] of widths) {
  const ctx = await browser.newContext({ viewport: { width, height } });
  const page = await ctx.newPage();
  for (const [pname, path] of pages) {
    await page.goto(base + path, { waitUntil: 'networkidle' });
    await page.screenshot({ path: `design-review/${pname}-${wname}.png`, fullPage: true });
  }
  await ctx.close();
}
await browser.close();
console.log('done →', pages.length * widths.length, 'screenshots in design-review/');
