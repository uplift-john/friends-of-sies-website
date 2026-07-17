# FRIENDS of SIES — Website

Static website for **FRIENDS of Sullivan's Island Elementary School**, the parent-run
board that funds the teachers, programs, and resources the school district doesn't pay for.

## Architecture

- **Generator:** [Eleventy](https://www.11ty.dev/) v3, static output to `_site/`
- **Content:** Nunjucks page templates in `src/`, structured data in `src/_data/*.yaml`
  (board, events, value pillars, nav, site strings) — organized so a git-based CMS
  (e.g. Sveltia) can be layered on later
- **Styles:** hand-written mobile-first CSS (`src/assets/css/style.css`), no framework.
  One self-hosted webfont: Fraunces (variable, OFL license) for headings
- **Hosting:** Cloudflare Pages, deployed by GitHub Actions
  (`.github/workflows/deploy.yml`) running `wrangler pages deploy`
- **Source of truth for content/facts:** `CONTEXT.md`. Unconfirmed facts appear on the
  site only as labeled placeholders, tracked in `HUMAN_TODO.md`

## Develop

```sh
npm install
npm start          # dev server with live reload
npm run build      # build to _site/
npm run check      # html-validate + scripts/a11y-check.js over the built output
```

`scripts/a11y-check.js` is the deterministic accessibility gate: alt text, one h1 per
page, no heading-level skips, `<html lang>`, `<main>` landmark, labeled form controls,
viewport meta, no fixed widths past 375px, and a 404 page.

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and deploys
`_site/` to the Cloudflare Pages project `friends-of-sies`.

Required GitHub Actions secrets (set with `gh secret set <NAME>`):

- `CLOUDFLARE_API_TOKEN` — API token with "Cloudflare Pages — Edit" permission
- `CLOUDFLARE_ACCOUNT_ID` — the Cloudflare account ID

The workflow creates the Pages project on first run if it doesn't exist.

## Outstanding human tasks

See `HUMAN_TODO.md` — donation/registration URLs, logo, newsletter provider,
tax-wording confirmation, and Cloudflare credentials are all pending human input.

## Loop files

`CONTEXT.md`, `LOOP_PROMPT.md`, `PROGRESS.md`, and `HUMAN_TODO.md` document the
autonomous build loop that produced this site.
