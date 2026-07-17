# PROGRESS

STATUS: DESIGN LOOP IN PROGRESS (content loop completed earlier — see git history)

## Design loop

ITERATION: 1 (max 8)
Live URL: https://friends-of-sies.pages.dev/ · push to main auto-deploys.
Eyes: `node scripts/screenshots.mjs` → design-review/ (8 pages × 1440/768/390).

### Rubric scores (after iteration 1)
1. Hero: 8 — full-bleed playground photo, navy scrim, big Fraunces H1, coral CTA
2. Brand fit: 7 — logo in header, palette from logo, gold accent introduced
3. Imagery: 6 — hero photo done; pillars/inner pages still text-only
4. Hierarchy & type: 7
5. Whitespace & rhythm: 5 — body still one monotonous column
6. Components: 5 — pillar cards/stats flat, footer plain
7. Color & contrast: 7
8. Mobile: 5 — nav wraps to two rows, no hamburger ← WEAKEST (tied w/ rhythm)
9. Consistency: 7
10. Polish: 6 — favicon + wave divider added; hover/focus improved

### Iteration log
- **Iter 1 — imagery/brand foundation.** Optimized 6 real photos + logo into
  src/assets/images/ (sources moved to source-photos/). Logo + favicon in header,
  full-bleed photo hero with scrim + wave, palette vars from logo (navy #1c3d5a,
  teal #2b7a78, mist, gold), button depth/hover/focus-visible.
  Decision: coral stays the ONE action color; gold is highlight-only (hero-note,
  focus rings). Hero photo = playground community shot (widest, reads "campus").
  Decision: header logo alt is descriptive (a11y gate requires non-empty alt).

### Next
Iter 2: mobile nav (accessible hamburger ≤768px) — weakest criterion (Mobile 5).
Then: section rhythm/alternating bands + pillar cards w/ photos; inner pages.

## Definition of Done (content loop) — all complete
Build ✓ · Live 200 ✓ · CTA ✓ · validate+a11y ✓ · Lighthouse 98/95 ✓ · CI deploy ✓

## Key facts
- Repo: uplift-john/friends-of-sies-website (private)
- Cloudflare Pages project: friends-of-sies; secrets in GitHub Actions
- One webfont: Fraunces variable woff2, headings only
- Donate CTAs → /ways-to-give/ (real platform URLs are HUMAN_TODO placeholders)
