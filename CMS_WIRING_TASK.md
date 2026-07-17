# Task: wire up Sveltia CMS and prove it works

Paste this into Claude Code (running locally in the project folder, where `gh` is authenticated).
It's a bounded, verifiable task — not a loop. Do the work, then prove each check, then stop.

## Context (already done by a human — do not redo)
- Repo: `uplift-john/friends-of-sies-website`, branch `main`, hosted at `friends-of-sies.pages.dev`
  (Cloudflare Pages, auto-deploys on push to `main`).
- Auth worker is deployed and configured: `https://sveltia-cms-auth.johnmoye82.workers.dev`
  (GitHub OAuth app + `GITHUB_CLIENT_ID`/`GITHUB_CLIENT_SECRET`/`ALLOWED_DOMAINS` already set).
- Editors: just the repo owner (John) for now — no collaborator setup needed.

## Goal
A working visual editor at `https://friends-of-sies.pages.dev/admin/`: log in with GitHub, edit
content in forms, save → it commits to `main` → the site redeploys. **Do not change any factual
copy, figures, or the TODO placeholders. Do not alter the site's visual design.** This is additive.

## What to build
1. **Admin files** at `src/admin/` (so Eleventy's input dir processes/copies them):
   - `src/admin/index.html` — loads Sveltia CMS. Use the current loader tag from the Sveltia docs
     (as of writing: `<script src="https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js"></script>`);
     verify the page actually loads the CMS with no console errors, and fix the tag from
     https://sveltiacms.app if the CDN path has changed.
   - `src/admin/config.yml` — backend + collections:
     ```yaml
     backend:
       name: github
       repo: uplift-john/friends-of-sies-website
       branch: main
       base_url: https://sveltia-cms-auth.johnmoye82.workers.dev
     media_folder: src/assets/images
     public_folder: /assets/images
     collections: …   # see below
     ```
2. **Passthrough** so `/admin/` is served verbatim: add
   `eleventyConfig.addPassthroughCopy("src/admin")` (or equivalent) to `eleventy.config.js`.
   Confirm the build outputs `_site/admin/index.html` and `_site/admin/config.yml`.

3. **Collections** — expose the structured content, easiest→safest first:
   - **Site settings** — file collection on `src/_data/site.yaml` (its root is a map, so it maps
     directly). Fields: `name`, `shortName`, `tagline`, `email`, `advertisingEmail`, and `taxLine`
     (multiline). This one needs no template changes.
   - **Events** — the highest-value one (lets John drop in the real RunSignUp / Event.Gives /
     donation URLs himself). Expose `src/_data/events.yaml` as an editable list of objects with
     fields: `name`, `season`, `slug`, `summary` (multiline), `participate`, `link`, `linkLabel`.
   - **Funding pillars** — `src/_data/pillars.yaml`: list of `title`, `example`, and `items`
     (list of strings).
   - **Board** — `src/_data/board.yaml`: list of `role`, `name`.

## The one gotcha: root-level list data files
`events.yaml`, `pillars.yaml`, `board.yaml`, and `nav.yaml` have a YAML **list at the root**, which
a Sveltia/Decap file collection can't target directly — the list must live under a top-level key.
For each list file you expose in the CMS:
1. Wrap the array under a key (e.g. `events.yaml` becomes `events:\n  - …`).
2. Update every template that loops that global. In Eleventy a file `src/_data/events.yaml` is the
   global `events`; after wrapping, the loop becomes `{% for event in events.events %}`. Grep for
   each global and fix all references:
   - `events` → used in `src/index.njk` and `src/events.njk`
   - `pillars` → `src/index.njk` and `src/what-we-fund.njk`
   - `board` → `src/about.njk`
   - (leave `nav.yaml` out of the CMS for now — it's structural, not content — so no change there)
3. **Prove the site is unchanged:** run `npx @11ty/eleventy`, and confirm the rendered pages look
   identical to before your change (diff `_site` before/after, or spot-check each affected page).
   The wrap+template edit must be behavior-neutral.

## Verify (do all — a claim without a passed check is not done)
1. `npx @11ty/eleventy` builds with zero errors; `npx html-validate` still passes.
2. Affected pages (home, events, what-we-fund, about) render identically to before.
3. Commit (clear message), push to `main`, wait for the Cloudflare deploy to finish.
4. Open `https://friends-of-sies.pages.dev/admin/` — the Sveltia UI loads, no console errors.
5. Click **Sign in with GitHub** — it round-trips through the worker and logs in successfully.
6. Make a **test edit** (e.g. tweak the site tagline or an event's `linkLabel`), save, confirm a
   commit lands on `main`, the site redeploys, and the change appears live — then **revert the test
   edit** so no stray content ships.
7. Report what was done and paste the live `/admin/` result.

## Rules
- Additive only: never touch factual copy, figures, placeholders, or the design/CSS.
- Never commit `.env` or any secret. Small, legible commits. Don't force-push.
- If Sveltia's loader URL or config schema differs from the above, follow the current docs at
  https://sveltiacms.app and adjust — the verification checks are the source of truth, not this
  file's exact snippets.

## Timing
Run this **before** the design loop and push it first (so the design loop starts from a clean tree),
or **after** the design loop finishes — either works; the CMS and the visual design don't touch each
other. Just don't run both with uncommitted changes in the tree at the same time.
