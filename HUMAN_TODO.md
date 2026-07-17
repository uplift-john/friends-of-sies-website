# HUMAN_TODO — items that need a human

## Blocking deploy
- [ ] **Cloudflare credentials missing.** Set `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as environment variables or in a `.env` file in this folder (never committed). Token needs "Cloudflare Pages — Edit" permission. Until provided, the site cannot be deployed and GitHub Actions secrets cannot be set.

## Content placeholders on the site (from CONTEXT.md "DO NOT INVENT")
- [ ] Logo / visual identity — site uses a text wordmark placeholder ("FRIENDS of SIES").
- [ ] Donation URL for Give to Grow / Donate buttons — currently `TODO` placeholder links.
- [ ] Fun Run registration URL (RunSignUp) — placeholder.
- [ ] Auction platform URL (Event.Gives) — placeholder.
- [ ] Exact 501(c)(3)/tax-deductibility wording — using safe phrasing from CONTEXT.md §6; confirm with treasurer + CCF before publishing.
- [ ] Final approved impact figures — site uses rounded ranges from CONTEXT.md §4; board must approve.
- [ ] Fun Run date Oct 23, 2026 — confirm. Spring 2027 auction date/theme — not set.
- [ ] Mailing address — not published (none provided).
- [ ] Newsletter signup form posts to a `TODO` placeholder action — choose an email provider and wire it up.

## Post-launch / out of loop scope
- [ ] CMS admin (e.g. Sveltia) + GitHub OAuth app setup.
