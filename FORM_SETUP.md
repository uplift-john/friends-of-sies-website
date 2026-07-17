# Volunteer form — one-time setup (Resend + Turnstile)

The volunteer form on `/ways-to-give/#volunteer` posts to a Cloudflare Pages Function
(`functions/api/volunteer.js`) that emails submissions to siesfriends.skimmers@gmail.com via
Resend, with Cloudflare Turnstile blocking spam. It needs two free accounts/keys before it can
go live. Total time: ~10 minutes.

## 1. Resend (sends the email) — free tier: 100 emails/day
1. Sign up at https://resend.com (free plan).
2. In the Resend dashboard: **Domains** → **Add Domain** → enter `siesfriends.org`.
3. Resend shows 2–3 DNS records (SPF/DKIM, TXT + MX or CNAME). Add each in the
   **Cloudflare dashboard** → siesfriends.org → **DNS** → **Add record**, copying
   name/type/value exactly. (These records only authorize Resend to send *from* the domain —
   they don't affect the website or any existing email.)
4. Back in Resend, click **Verify** on the domain (may take a few minutes).
5. **API Keys** → **Create API Key** → name it `friends-website-form`, permission
   **Sending access** only. Copy the key (shown once) — you'll paste it in step 3 below.

## 2. Turnstile (blocks spam bots) — free
1. Cloudflare dashboard → **Turnstile** (left sidebar) → **Add widget**.
2. Name: `friends volunteer form`. Hostnames: add `siesfriends.org` **and**
   `friends-of-sies.pages.dev`. Widget mode: **Managed** (default).
3. You get two values: a **Site Key** (public) and a **Secret Key**.
   - Send the **Site Key** to Claude Code — it goes in the page markup
     (`src/ways-to-give.njk`, replacing the `1x00000000000000000000AA` test key).
   - The **Secret Key** goes in step 3 below.

## 3. Add the two secrets to the Pages project
1. Cloudflare dashboard → **Workers & Pages** → **friends-of-sies** → **Settings** →
   **Variables and Secrets** (Production).
2. Add secret `RESEND_API_KEY` = the Resend API key from step 1.
3. Add secret `TURNSTILE_SECRET_KEY` = the Turnstile Secret Key from step 2.

## 4. Tell Claude Code
Reply with the Turnstile **Site Key** (the public one). Claude swaps it in, pushes, and tests a
real submission end-to-end.

---
**Local development note:** `npx wrangler pages dev _site` runs the site + function locally.
Put test keys in a `.dev.vars` file at the repo root (gitignored — never commit real keys).
Turnstile's official always-pass test pair works locally: site key `1x00000000000000000000AA`,
secret `1x0000000000000000000000000000000AA`.
