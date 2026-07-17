# PROGRESS

STATUS: BLOCKED — deploy requires Cloudflare credentials (see below and HUMAN_TODO.md)

ITERATION: 8

## Definition of Done checklist
- [x] 1. Build: `npx @11ty/eleventy` zero errors (verified iter 8)
- [ ] 2. Deployed & reachable — **BLOCKED**: no `CLOUDFLARE_API_TOKEN`/`CLOUDFLARE_ACCOUNT_ID` in env or `.env`; wrangler not logged in
- [ ] 3. Live page has org name + Donate CTA — content is built and verified locally; needs deploy (blocked by #2)
- [x] 4. `npx html-validate` passes (0 errors) + `scripts/a11y-check.js` 0 failures (verified iter 8)
- [x] 5. Lighthouse (headless system Chrome, against localhost): performance 100, accessibility 95 — re-run against live URL after deploy
- [x] 6. Responsive checks in a11y script pass; 404 page exists
- [ ] 7. CI auto-deploy proven once — blocked by #2 (workflow committed; secrets not settable without values)
- [x] 8. README.md + HUMAN_TODO.md complete

## What's built (all verified this session)
- Eleventy site, 9 pages: Home, What We Fund, Ways to Give, Events, Our Story,
  For Businesses, FRIENDS & PTA, Contact/newsletter, 404
- YAML data files (board, events, pillars, nav, site strings) — CMS-ready
- Coastal design system, Fraunces self-hosted webfont, mobile-first CSS
- Quality gates green: html-validate 0 errors, a11y-check 0 failures, LH perf 100 / a11y 95
- GitHub repo: uplift-john/friends-of-sies-website (private), all work pushed
- Deploy workflow committed: .github/workflows/deploy.yml (wrangler pages deploy)

## Decision log
- Iter 1: No Cloudflare credentials anywhere → built everything else first.
- Iter 1: Repo under active gh account `uplift-john`.
- Iter 4: Donate CTAs link to /ways-to-give/ where each platform slot is a labeled
  "link coming soon" placeholder with a mailto fallback (honest, accessible, no dead #links).
- Iter 5: Fraunces variable woff2 (67KB, OFL) from Google Fonts CDN — the one webfont.
- Iter 7: Lighthouse run against localhost since no live URL exists yet.

## To unblock (human)
Provide Cloudflare credentials, then the remaining steps are:
1. `gh secret set CLOUDFLARE_API_TOKEN` and `gh secret set CLOUDFLARE_ACCOUNT_ID`
2. Push any commit (or `gh workflow run deploy.yml`) → first deploy creates the
   `friends-of-sies` Pages project
3. Verify live URL 200 + content, re-run Lighthouse against live URL, prove CI
   redeploy with a trivial commit, then run the exit-check subagent

## Next task
Blocked on credentials. When provided: set GitHub secrets and trigger first deploy.
