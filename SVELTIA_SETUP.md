# Sveltia CMS — setup plan for the FRIENDS of SIES site

**Goal:** give board members a friendly visual editor at `friends-of-sies.pages.dev/admin/` where
they log in with GitHub, edit content in forms, hit save — and the change commits to the repo and
auto-deploys. No code, no markdown.

**Your repo:** `uplift-john/friends-of-sies-website` · branch `main` · site `friends-of-sies.pages.dev`

**Timing:** do this **after** the design pass lands. The redesign only changes presentation, so the
content files below won't move — but there's no reason to configure the CMS twice.

---

## What the CMS will let people edit (no templates, no code)
Scoped to the structured content files, so an editor can't accidentally break the layout:
- **Site info** (`src/_data/site.yaml`) — org name, tagline, contact emails, the tax line.
- **Board roster** (`src/_data/board.yaml`) — add/remove/reorder members and roles.
- **Events** (`src/_data/events.yaml`) — the four fundraisers: name, season, summary, how to
  participate, and the registration/donation link for each (so you can drop in the real RunSignUp /
  Event.Gives / donation URLs the moment you have them, without touching me or code).
- **Funding pillars** (`src/_data/pillars.yaml`) — the "what your gift becomes" cards.

Page bodies and layout stay out of the CMS on purpose — those are design, not content.

---

## The split: what only YOU can do vs. what I'll do

### Part A — the human-only steps (the reason the loop skipped this)
These require clicking through GitHub/Cloudflare while signed in as you. ~10 minutes.

**1. Deploy the auth worker.**
Sveltia needs a tiny authenticator because you're on Cloudflare Pages (not Netlify). Use the
official `sveltia-cms-auth` Cloudflare Worker.
- Go to https://github.com/sveltia/sveltia-cms-auth and use its "Deploy to Cloudflare" button
  (or `wrangler deploy` from a clone).
- Copy the resulting Worker URL — it looks like
  `https://sveltia-cms-auth.<your-subdomain>.workers.dev`. You'll need it twice below.

**2. Create a GitHub OAuth app.**
- Go to https://github.com/settings/applications/new
- **Application name:** `FRIENDS of SIES CMS`
- **Homepage URL:** `https://friends-of-sies.pages.dev`
- **Authorization callback URL:** `<YOUR_WORKER_URL>/callback`
  (e.g. `https://sveltia-cms-auth.your-subdomain.workers.dev/callback`)
- Click **Register application**, then **generate a client secret**. Copy the **Client ID** and
  **Client Secret** (the secret is shown once).

**3. Give the worker its secrets.**
In the Cloudflare dashboard → your `sveltia-cms-auth` Worker → **Settings → Variables**, add:
- `GITHUB_CLIENT_ID` = the Client ID from step 2
- `GITHUB_CLIENT_SECRET` = the Client Secret from step 2 (click **Encrypt**)
- `ALLOWED_DOMAINS` = `friends-of-sies.pages.dev` (optional but recommended — locks the worker to
  your site)
Redeploy the worker if prompted.

**4. Decide who can edit.**
Anyone you want to edit content needs to be a **collaborator on the GitHub repo** (`uplift-john/
friends-of-sies-website` → Settings → Collaborators). They log into the CMS with their own GitHub
account. Send me (or note) the list of board members who should have access and their GitHub
usernames — or invite them yourself.

### Part B — what I'll do once you've done Part A
- Add `admin/index.html` (loads Sveltia) and `admin/config.yml` (the backend + the collections
  above), with `base_url` pointed at your Worker URL.
- Wire the list-based data files so they edit cleanly in the CMS (a small, safe adjustment so
  board/events/pillars show up as add/remove lists).
- Make Eleventy publish the `/admin/` route, commit, and verify the login + a test edit actually
  round-trips to a live change.

You hand me the Worker URL from step 1 (and confirm steps 2–3 are done); I do the rest and test it.

---

## Starter config (for reference — I'll finalize and commit this)
`admin/config.yml` backend section will be:

```yaml
backend:
  name: github
  repo: uplift-john/friends-of-sies-website
  branch: main
  base_url: https://sveltia-cms-auth.<your-subdomain>.workers.dev   # your Worker URL
```

Collections will map to `src/_data/site.yaml`, `board.yaml`, `events.yaml`, and `pillars.yaml`
with proper form fields (text, list, and link fields), so editing is point-and-click.

---

## Notes
- **Security:** the OAuth app and worker only allow editing by people you've added as repo
  collaborators; the `ALLOWED_DOMAINS` variable keeps the authenticator scoped to your site.
- **No new hosting cost:** the worker runs on Cloudflare's free tier alongside your Pages site.
- **It commits to git:** every CMS save is a normal commit, so you keep full version history and can
  roll back anything.

Sources: [Sveltia CMS — GitHub backend](https://sveltiacms.app/en/docs/backends/github),
[sveltia-cms-auth setup](https://github.com/sveltia/sveltia-cms-auth/blob/main/README.md).
