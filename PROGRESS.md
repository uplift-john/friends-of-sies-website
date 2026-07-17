# PROGRESS

STATUS: DESIGN LOOP IN PROGRESS (content loop completed earlier — see git history)

## Design loop

ITERATION: 8 (max 8 — hard cap)
Live URL: https://friends-of-sies.pages.dev/ · push to main auto-deploys.
Eyes: `node scripts/screenshots.mjs` → design-review/ (8 pages × 1440/768/390).

### Rubric self-scores (after iteration 6) — believed all ≥ 8, pending reviewer
1. Hero: 8 · 2. Brand fit: 8 · 3. Imagery: 8 · 4. Hierarchy & type: 8
5. Whitespace & rhythm: 8 · 6. Components: 8 · 7. Color & contrast: 8
8. Mobile: 8 · 9. Consistency: 8 · 10. Polish: 8

### Iteration log
- **Iter 1 — imagery/brand foundation.** Optimized 6 real photos + logo into
  src/assets/images/ (sources → source-photos/). Logo + favicon in header,
  full-bleed photo hero with scrim + wave, palette vars from logo.
  Decision: coral = the ONE action color; gold = highlight only (stats, focus).
  Decision: header logo alt is descriptive (a11y gate requires non-empty alt).
- **Iter 2 — mobile nav.** Accessible hamburger ≤900px (aria-expanded, Escape,
  44px targets), Donate pinned in header at all sizes. Overflow at 390px: 0px.
- **Iter 3 — rhythm/components.** Full-bleed alternating bands (sand/white/
  navy/mist/teal), photo pillar cards, navy stat band w/ gold Fraunces numerals,
  gold-topped season cards, teal closing band. Fixed stat wrap on mobile.
- **Iter 4 — consistency.** Shared navy→teal page-hero band + sand wave on all
  7 inner pages + 404; events page: Soar on Skimmers art + beach photo; About:
  garden figure; card styling for event/give sections; unified closing CTAs.
- **Iter 5 — cards everywhere + AA.** .card/.card-duo on PTA/businesses/contact,
  fund-pillar thumbnails, newsletter form focus states. Contrast math fixes:
  accent #d96c3f→#b95428 (white text 4.8:1), band-sea gradient end darkened,
  page-hero lede lightened.
- **Iter 6 — verification pass.** Re-viewed all pages/widths; checked suspected
  CTA clipping at 390px (false alarm — thumbnail artifact; live box is correct).
- **Reviewer #1 verdict: FAIL** (Imagery 7; rest 8–9). Flagged: placeholder tile
  in home grid, 4 imageless pages, orphaned "PTA?", tablet 3+1 season grid,
  placeholder label contrast, gold strong on PTA hero, closing band on only 3
  pages. Out-of-scope flags (link placeholders, newsletter wording, dual emails)
  → HUMAN_TODO.md.
- **Iter 7 — reviewer fixes.** Photos on all 8 pages (ways-to-give ×2,
  for-businesses, friends-and-pta, contact), closing teal CTA band sitewide,
  placeholder tile redesigned (navy/teal + gold sun, white label),
  text-wrap: balance, explicit 2×2/4-across season grid, #ffdf9e strong text.
  Decision: Arts & Enrichment keeps an honest placeholder — inventing/stock
  photos is prohibited; the shot is #1 on IMAGE_WISHLIST.md.

- **Reviewer #2 verdict: FAIL** (Polish 7; rest 8–9). Named blockers: 501(c)(3)
  breaking mid-term, small gold hero microcopy contrast, newsletter Sign-up in
  Donate coral. Minor: ragged season tag, events first card unbalanced, hero
  lede over thin scrim.
- **Iter 8 — polish blockers.** Word joiners inside 501(c)(3) (invisible; tax
  wording unchanged), hero note lightened/enlarged (#ffe9b8, 1.05rem), scrim
  deepened, hero lede narrowed to 30rem, Sign-up → teal .btn-sea, season-tag
  text-wrap balance, Give to Grow event card gets harvest photo. Verified via
  element crops: taxline single-line; photo present.

### Next
Reviewer #3 (fresh) re-scores. PASS → push (CI deploys) → live 200 →
DESIGN COMPLETE. FAIL → STATUS: HALTED (cap reached) with scores.

## Definition of Done (content loop) — all complete
Build ✓ · Live 200 ✓ · CTA ✓ · validate+a11y ✓ · Lighthouse 98/95 ✓ · CI deploy ✓

## Key facts
- Repo: uplift-john/friends-of-sies-website (private)
- Cloudflare Pages project: friends-of-sies; secrets in GitHub Actions
- One webfont: Fraunces variable woff2, headings only
- Donate CTAs → /ways-to-give/ (real platform URLs are HUMAN_TODO placeholders)
