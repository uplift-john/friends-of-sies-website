# SETUP.md — Credentials & prerequisites for the FRIENDS of SIES build loop

Do this once, before running the loop. When all three checks at the bottom pass, the loop has a
clear runway to build **and** deploy without stopping.

## 0. Prerequisites (install if missing)
The loop needs Node.js (for Eleventy + wrangler), git, and the GitHub CLI. On a Mac with
Homebrew:

```
brew install node git gh
```

Verify:
```
node -v      # want v18 or higher
git --version
gh --version
```

## 1. GitHub CLI authenticated
The loop creates the repo and sets deploy secrets through `gh`.

```
gh auth status
```
If it says you're not logged in:
```
gh auth login          # choose: GitHub.com → HTTPS → login with a browser
```
Make sure the login has permission to **create repositories**.

## 2. A Cloudflare account
If you don't have one, sign up (free) at https://dash.cloudflare.com/sign-up . No credit card or
custom domain is needed — Pages gives you a free `*.pages.dev` URL.

## 3. Find your Account ID
In the Cloudflare dashboard, go to **Workers & Pages**. Your **Account ID** is shown in the
right-hand sidebar (copy it). Shortcut: it's also the long string in the dashboard URL —
`https://dash.cloudflare.com/<THIS-IS-YOUR-ACCOUNT-ID>`.

## 4. Create the API token
1. Cloudflare dashboard → your profile icon (top right) → **My Profile** → **API Tokens**.
   (Direct link: https://dash.cloudflare.com/profile/api-tokens )
2. Click **Create Token** → scroll to **Custom token** → **Get started**.
3. Set exactly one permission row:
   - **Account** · **Cloudflare Pages** · **Edit**
4. Under **Account Resources**, choose **Include** → your account.
5. **Continue to summary** → **Create Token**.
6. **Copy the token now** — Cloudflare shows it only once. If you lose it, just make a new one.

## 5. Give the loop the credentials
Create a `.env` file **inside** `/Users/johnmoye/Desktop/SIES Friends/friends website/` with:

```
CLOUDFLARE_API_TOKEN=paste-your-token-here
CLOUDFLARE_ACCOUNT_ID=paste-your-account-id-here
```

Never commit this file. The loop is instructed to keep `.env` out of git and to copy these into
GitHub Actions secrets (`gh secret set ...`) for the automated deploys — you don't have to do
that part by hand.

## 6. Pre-flight verification (run all three)
From inside the project folder:

```
cd "/Users/johnmoye/Desktop/SIES Friends/friends website"

# a) GitHub ready?
gh auth status

# b) Cloudflare token valid? (loads the two vars from .env, then asks Cloudflare who you are)
export $(grep -v '^#' .env | xargs) && npx wrangler whoami

# c) You're in the right folder with the context file?
pwd && ls -la          # should list CONTEXT.md and LOOP_PROMPT.md
```

If `wrangler whoami` prints your account (and shows the "Pages: Edit" permission), the deploy
credential works. You're clear to run the loop.

## Security notes
- The API token is like a password for your Cloudflare Pages. Keep it only in `.env` (and later in
  GitHub Actions secrets). Don't paste it into chats, commits, or screenshots.
- The token is scoped to **Pages: Edit** only — it can't touch DNS, billing, or other zones. That's
  the minimum the deploy needs and the safest choice.
- If it's ever exposed, delete it in the API Tokens page and create a new one; nothing else breaks.
