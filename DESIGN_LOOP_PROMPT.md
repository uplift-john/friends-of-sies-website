# Design Loop Prompt — Goal: make the FRIENDS of SIES site look genuinely good

Feed this to Claude Code with `/goal` from inside
`/Users/johnmoye/Desktop/SIES Friends/friends website`. It is a run-until-done, goal-based loop.
Set a cap of ~8 iterations for the first run so you can watch it.

You are one iteration of an autonomous design loop. The site is already live, builds, and deploys
(Eleventy → Cloudflare Pages). The content and copy are good. **Your only job is the visual design
— look and feel.** The current site is content-complete but visually flat: it uses no photography,
does not use the organization's logo, has a text-only hero, a cramped nav with no mobile menu, and
a color palette that doesn't match the brand. Fix that. No human is watching. Do not ask questions.
Make the most reasonable choice, log it, keep moving.

## Hard scope — what you may and may not touch
- **DO** rework: CSS (`src/assets/css/`), layout templates and includes (`src/_includes/`), the
  markup/structure of `.njk` pages *for presentation* (wrappers, image slots, section ordering,
  classes), the header/footer, fonts, images/asset handling, favicon.
- **DO NOT** change any factual copy, figures, names, quotes, tax wording, or the TODO placeholders
  in `CONTEXT.md` / `HUMAN_TODO.md`. Don't invent facts or images. Don't remove real content.
- **DO NOT** regress what already works: after every change the site must still build with
  `npx @11ty/eleventy`, pass `npx html-validate`, keep every image's `alt` text, keep the Donate
  CTA prominent, and keep the a11y checks green. Redeploy and confirm the live URL still returns
  200 at the end.
- Keep the stack: hand-written CSS, one self-hosted webfont max (Fraunces is already installed and
  is fine to keep). No CSS framework, no build-step bloat.

## Step 0 — Give yourself EYES (this is the point of the loop)
You cannot design what you can't see. Before iterating, set up visual verification and use it every
iteration:
1. Ensure a headless screenshot tool is available (e.g. `npm i -D playwright && npx playwright
   install chromium`, or puppeteer). Install it if missing.
2. Build and serve locally (`npx @11ty/eleventy --serve`, note the localhost port).
3. Write a small script (`scripts/screenshots.mjs`) that captures **full-page** screenshots of
   every page at **three widths: 1440 (desktop), 768 (tablet), 390 (mobile)** into
   `design-review/`. Re-run it after each change.
4. **Open and actually look at the screenshots** (read the image files). Judge them like a
   demanding art director. A change you haven't looked at is not done.

## Assets & imagery
- **Use the real logo.** `logo.png` is a coastal roundel ("Together We Are an Ocean," SIES 2026) in
  navy / teal / sea-green / sky-blue with a golden sun. Put it in the header (replace the text-only
  wordmark placeholder), sized tastefully, with proper `alt`. Optimize it (it's ~1MB — resize/
  compress into `src/assets/images/`). `soar on skimmers.png` is event art usable on the Events /
  Fun Run section.
- **Photography is the biggest single upgrade.** Look in the project folder and `src/assets/images/`
  for photos of students, teachers, the aquarium/touch tanks, the garden, the Fun Run, campus.
  Use them: a hero image, one image per value pillar, story/impact section images. Handle them
  responsively (`max-width:100%`, correct aspect ratios, `object-fit: cover`, lazy-load below the
  fold, real `alt` text describing the scene).
- **If photos are missing:** do NOT fabricate or hotlink stock images. Use tasteful, on-brand
  placeholders (solid brand-color blocks or subtle gradients with a small caption like "photo:
  Fun Run") so the layout still reads as designed — and write an exact **shot list** to
  `IMAGE_WISHLIST.md`: for each slot, the page/section, the ideal orientation (landscape/portrait),
  a suggested pixel size, and what the photo should show. This tells the human exactly what to drop
  into `src/assets/images/`.

## Design direction (the North Star)
Warm, modern, trustworthy, coastal, community-minded — a real nonprofit that parents and local
donors trust. Concrete and photo-led, not corporate. Distinct from the school's own branding.

**Palette — derive from the logo** (sample `logo.png`; these are close starting values):
- Harbor navy `#1c3d5a` (primary text / dark sections)
- Deep teal `#2b7a78`, sea-green `#4c9d8a` (secondary / accents / section tints)
- Sky mist `#cfe4e2` (soft backgrounds)
- **Sun gold `#f4c04e`** — the logo's warm spark; currently unused. Bring it in as a highlight.
- Warm sand `#fdfaf5` (page background), white cards.
- Pick ONE energetic action color for the Donate/CTA buttons that pops against navy/teal and passes
  WCAG AA — a warm coral (`~#e2703a`) or the sun gold. Use it consistently and sparingly so
  "Donate" always looks like the primary action.

**Typography:** keep Fraunces for headings; use a clean system sans for body. Establish a clear type
scale (bigger, more confident hero H1 — it's currently small), comfortable line length (~60–70ch),
and consistent vertical rhythm.

**Layout system:**
- A real **hero**: full-bleed or large image (or on-brand color block if no photo yet) with the
  headline "Friends builds what's possible." and one obvious Donate CTA above the fold.
- Break the single-column monotony: alternate section backgrounds (sand / white / a soft
  navy-or-teal band), use generous whitespace and a consistent spacing scale, and let some sections
  go **full-bleed** while text stays in a comfortable measure.
- **Coastal motif:** a subtle wave-shaped divider (SVG) between some sections echoes the logo — use
  it lightly, not everywhere.
- **Components with depth:** value-pillar cards with an image or icon, soft shadows, consistent
  border-radius, real hover and focus states. Make the stat/impact numbers a striking, confident
  band (big Fraunces numerals) rather than plain boxes.
- **Responsive nav:** the desktop nav is overcrowded; add a proper mobile menu (hamburger →
  accessible toggle) and make sure nothing overflows at 390px. Keep Donate visually distinct in the
  nav at all sizes.
- Add a favicon derived from the logo.

## Design rubric — the gate (score every criterion 1–10 from the screenshots)
Done requires **every** criterion ≥ 8, confirmed by a fresh reviewer subagent (see protocol).
1. **First impression / hero** — image or strong color anchor, confident headline, one obvious CTA
   above the fold. Would a parent trust this in 3 seconds?
2. **Brand fit** — palette clearly derived from the logo (incl. the gold); logo actually used; warm
   and coastal, not generic template.
3. **Imagery** — real photos (or clean placeholders) used well; correct aspect ratios, no
   distortion/pixelation; every image has meaningful alt.
4. **Visual hierarchy & type** — clear H1→H2→body scale, confident sizes, good line length, nothing
   cramped or orphaned.
5. **Whitespace & rhythm** — generous, consistent spacing scale; sections breathe; layout isn't one
   monotonous column.
6. **Components** — buttons, cards, nav, stat band, footer look intentionally designed (depth,
   consistent radius, hover/focus states), not browser-default.
7. **Color use & contrast** — cohesive, not garish; all text passes WCAG AA contrast.
8. **Mobile (390px)** — no horizontal overflow; working mobile nav; tap targets ≥ 44px; hero and
   cards reflow cleanly.
9. **Consistency across pages** — header, footer, spacing, and components are uniform on every page.
10. **Polish** — favicon, wave/coastal detailing, hover/focus, no visual bugs in any screenshot.

## Iteration protocol — every iteration
1. **Orient.** Read `PROGRESS.md` (create/extend it with this rubric as a checklist + an
   `ITERATION` counter; increment it) and `HUMAN_TODO.md`. `git log --oneline -8`.
2. **Look first.** Re-run the screenshot script; view the current screenshots at all three widths;
   score the rubric honestly and name the **single weakest criterion**.
3. **Fix the weakest thing.** One focused improvement toward that criterion. Build it.
4. **Verify by looking.** Re-screenshot, re-view, re-score. Also run `npx @11ty/eleventy` and
   `npx html-validate` — zero errors. A change you haven't re-screenshotted is not done.
5. **Record & commit.** Small commit with a clear message. Update `PROGRESS.md`: what changed, new
   scores, next weakest item, and any design decision with one line of reasoning. Update
   `IMAGE_WISHLIST.md` / `HUMAN_TODO.md` as needed. Keep `PROGRESS.md` lean.
6. **Exit check (maker ≠ checker).** When you believe every criterion is ≥ 8, spawn a **fresh
   reviewer subagent** with clean context: give it only the rubric and the latest screenshots and
   have it score independently and strictly. If it confirms all ≥ 8 **and** build/validate/live-200
   pass → redeploy, confirm the change is live, write `STATUS: DESIGN COMPLETE` at the top of
   `PROGRESS.md`, print `LOOP COMPLETE`, and stop. Otherwise fix what the reviewer flagged and
   continue.

## Stop conditions
- **Success:** reviewer subagent confirms the full rubric on the live site → `LOOP COMPLETE`.
- **Blocked:** a hard external blocker (e.g. deploy credential broken) → write `STATUS: BLOCKED`
  with the exact reason → print `LOOP BLOCKED`.
- **Hard cap:** set `MAX_ITERATIONS` (e.g. 12). On reaching it, write `STATUS: HALTED` with current
  rubric scores and the biggest remaining issue, print `LOOP HALTED`, stop. Never loop forever.

## Rules
- Don't gold-plate one area while another criterion is below 8 — always fix the weakest thing next.
- If the same fix fails 3 iterations running, log it under "Stuck" in `PROGRESS.md`, try a different
  approach, then route around it or escalate to `HUMAN_TODO.md`.
- Never commit secrets or the `.env`. Never force-push. Small, legible commits.
- Ship good-enough-to-be-proud-of and deploy; the live site is the deliverable, not a local preview.
