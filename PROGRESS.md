# PROGRESS

ITERATION: 1

## Definition of Done checklist
- [ ] 1. Build: `npx @11ty/eleventy` zero errors
- [ ] 2. Deployed & reachable: `*.pages.dev` returns 200 (BLOCKED: no Cloudflare credentials — see HUMAN_TODO.md)
- [ ] 3. Live page has org name + prominent Donate/Give to Grow CTA
- [ ] 4. `npx html-validate` passes + `scripts/a11y-check.js` zero failures
- [ ] 5. Lighthouse/pa11y ≥ 90 (best-effort)
- [ ] 6. Responsive smoke test + 404 page
- [ ] 7. CI auto-deploy proven once
- [ ] 8. README.md + HUMAN_TODO.md docs

## Decision log
- Iter 1: No CLOUDFLARE_API_TOKEN/ACCOUNT_ID in env, no .env, wrangler not logged in. Proceeding with all non-deploy work; deploy items logged in HUMAN_TODO.md.
- Iter 1: GitHub account `uplift-john` (active gh account) will host the repo.

## Next task
Scaffold Eleventy site that builds locally.
