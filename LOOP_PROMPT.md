# Loop Prompt — Goal: Live, Functional Website (autonomous, run-until-done)

**Loop type.** This is a *goal-based* loop (run-until-done), not a recurring/scheduled one.
Building a website is a one-off project: iterate until the Definition of Done is verifiably
true, then stop. Drive it with `/goal`, or a `while` wrapper around `claude -p` that halts on
the completion string below. Do **not** put it on a time interval or cron — there is nothing to
re-trigger once it's done.

Each iteration starts fresh, so **all memory lives in files**. Place `CONTEXT.md` in the project
folder before starting.

---

You are one iteration of an autonomous loop. The loop's single goal: a live, functional,
good-looking website for the organization described in `CONTEXT.md`. No human is watching. Do
not ask questions. Do not wait for approval. Make the most reasonable choice, log it, and keep
moving.

## Source of truth
`CONTEXT.md` in this folder describes the organization, content, brand, and constraints. Read it
every iteration. **Never fabricate real-world facts** (names, statistics, contact info, donation
links, staff, addresses) that aren't in it — use clearly marked `TODO` placeholders in the site
and record each one in `HUMAN_TODO.md`. A site full of honest placeholders is a success; a site
with invented facts is a failure.

## Stack (decided — do not revisit, do not re-litigate)
- **Site generator:** Eleventy (`@11ty/eleventy`), static output.
- **Content:** markdown + YAML data files. Structure content so a CMS can be layered on later.
- **Styles:** hand-written CSS, mobile-first. One self-hosted webfont maximum. No CSS framework.
- **Source control:** GitHub via the `gh` CLI.
- **Hosting:** Cloudflare Pages, deployed by a **GitHub Actions** workflow running
  `wrangler pages deploy`.
- **No** databases, backends, or paid services.

Why GitHub Actions + wrangler and *not* Cloudflare's dashboard Git integration: the dashboard
connection requires a human OAuth click, which would deadlock an unattended loop. The Actions +
`wrangler` path is fully scriptable with an API token.

## Deliberately OUT of scope for this loop
The CMS admin (e.g. Sveltia) and its GitHub OAuth app. That step requires a human and would
deadlock the loop. Leave content files CMS-ready, note the follow-up in `HUMAN_TODO.md`, move on.

## Credentials
Expect: `gh` already authenticated; `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` available
as environment variables or in `.env`. Never commit `.env`. Put deploy tokens into GitHub Actions
secrets via `gh secret set`. If a credential is missing: do every task that doesn't need it,
record the gap in `HUMAN_TODO.md`, and only if **nothing further is possible** write
`STATUS: BLOCKED` plus an exact explanation at the top of `PROGRESS.md`, print `LOOP BLOCKED`,
and stop.

---

## Definition of Done — the exit condition
The loop is complete ONLY when every item is verified true **this iteration**, by actually
running the check — not by trusting a prior iteration's claim.

1. **Build:** `npx @11ty/eleventy` builds with zero errors.
2. **Deployed & reachable:** the site is live on Cloudflare Pages and the `*.pages.dev` URL
   returns HTTP 200 (verify with `curl -sI`).
3. **Real content on the live page:** fetch the *live* URL (not the local build) and confirm the
   HTML contains the organization's actual name and a prominent Donate / "Give to Grow"
   call-to-action. The CTA must be present and prominent; if `CONTEXT.md` does not yet provide the
   real donation URL, the CTA links to a clearly-labeled `TODO` placeholder (logged in
   `HUMAN_TODO.md`) — a placeholder link does **not** block completion, a missing/hidden CTA does.
4. **Valid, accessible HTML (deterministic gate — always runnable):**
   - `npx html-validate` passes on the built output, zero errors.
   - A repo script (`scripts/a11y-check.js` or similar) asserts, over the built HTML: every
     `<img>` has a non-empty `alt`; every page has exactly one `<h1>`; heading levels don't skip;
     `<html lang>` is set; there is a `<main>` landmark; every form control has a label. Zero
     failures. (This is cheap and works without a browser — it is the load-bearing a11y gate.)
5. **Richer quality gate (best-effort, where a headless browser is available):**
   - Lighthouse accessibility ≥ 90 and performance ≥ 90 (`npx lighthouse <url> --output=json`
     or `@lhci/cli`), **or** `npx pa11y <url>` with zero errors.
   - If no headless browser can run in this environment, skip this item, note it in
     `HUMAN_TODO.md` as "run Lighthouse/pa11y manually," and treat item 4 as the binding gate.
6. **Responsive smoke test:** viewport meta present; no element forces horizontal scroll at
   375px width (assert in the a11y/layout script). A 404 page exists.
7. **CI auto-deploy proven once:** pushing a commit to `main` triggers an automatic redeploy that
   goes live. Verify **once**, near the end, by making a trivial content commit and confirming
   the change appears at the live URL.
8. **Docs:** `README.md` documents the architecture and how to run/deploy. `HUMAN_TODO.md` lists
   everything that still needs a human (placeholders, CMS, manual Lighthouse if skipped, etc.).

When ALL items pass **and a fresh verification subagent confirms them** (see step 6 of the
protocol): write `STATUS: COMPLETE` as the first line of `PROGRESS.md`, print `LOOP COMPLETE` as
your final output, and stop. (Configure the loop runner to halt on `LOOP COMPLETE`.)

## Suggested milestone order (to keep "pick ONE task" from thrashing)
Deploy early, then iterate on a live site. Rough sequence — adapt to reality, don't treat as rigid:
1. Eleventy scaffold builds locally (empty-ish site is fine).
2. GitHub repo created, initial commit pushed.
3. **First deploy live** — a near-empty page returning 200 at `*.pages.dev`. (Prove the pipeline
   before pouring in content.)
4. GitHub Actions workflow deploys on push; secrets set.
5. Real content, structure, navigation from `CONTEXT.md`.
6. Design pass: layout, the one webfont, responsive CSS, Donate CTA.
7. Accessibility + validation gates green.
8. CI-redeploy proof, docs, final full verification.

---

## Iteration protocol — follow exactly, every iteration
1. **Orient.** Read `CONTEXT.md`, `PROGRESS.md` (create it if absent, seeded with the Definition
   of Done as a checklist and `ITERATION: 0`), and `HUMAN_TODO.md`. Run `git log --oneline -10`.
   **Increment the iteration counter** in `PROGRESS.md`.
2. **Cheap re-verify (every iteration).** Re-run the *fast* load-bearing checks only: does the
   build pass, and does the live URL still return 200? If either regressed, fixing it is now the
   priority. (Save the *full, expensive* verification for the exit check — don't re-run Lighthouse
   or the CI-redeploy proof every pass; that just burns tokens.)
3. **Pick ONE task.** The single highest-value step toward the next open Definition-of-Done item,
   guided by the milestone order. One task per iteration — small, completable, verifiable. Do not
   start a second task.
4. **Execute and verify.** Do the task, then prove it worked (build it, `curl` it, run the
   script). A task without a passed verification is not done.
5. **Record.** Commit with a clear message. Update `PROGRESS.md`: what was done, what was
   *verified* (and how), the exact next task, and any decision with one line of reasoning.
   **Keep `PROGRESS.md` lean** — a checklist, a short decision log, the next task, and the
   counter. Prune stale detail; this file is re-read and re-sent every iteration, so bloat costs
   real money. Update `HUMAN_TODO.md` if anything new needs a human.
6. **Exit check (maker ≠ checker).** Only when you believe all Definition-of-Done items could now
   pass: spawn a **fresh subagent** (clean context, strict instructions) to independently run the
   full verification. The agent that built the site does not certify it. If the subagent confirms
   all items → write `STATUS: COMPLETE`, print `LOOP COMPLETE`, stop. Otherwise, record what
   failed and end the iteration normally.

## Stop conditions (there must always be a way out)
- **Success:** all Definition-of-Done items verified by the checker subagent → `STATUS: COMPLETE`
  / `LOOP COMPLETE`.
- **Blocked:** a hard external blocker (missing credential, no path forward) → `STATUS: BLOCKED`
  with an exact explanation → `LOOP BLOCKED`.
- **Hard cap:** set `MAX_ITERATIONS` (e.g. 25). When the counter reaches it and the loop is not
  done, write `STATUS: HALTED — reached MAX_ITERATIONS` at the top of `PROGRESS.md` with a
  one-paragraph summary of what's done, what's left, and the single biggest obstacle. Print
  `LOOP HALTED` and stop. This is the backstop against a loop that runs all night for nothing.

## Rules
- Never redo work that re-verifies as done. Never "improve" finished areas while
  Definition-of-Done items remain open.
- **Design bar (aspiration, gated by the objective checks above):** this represents the
  organization to donors and the public — warm, modern, trustworthy, mobile-first, one
  self-hosted webfont max. Ship the good-enough-to-be-proud-of version; polish is not an excuse
  to delay deploying. Deploy early, iterate live.
- **Stuck rule:** if the same task fails 3 iterations running, stop repeating the approach. Log
  it in `PROGRESS.md` under "Stuck," try a different approach next iteration; if that also fails,
  route around it or escalate to `HUMAN_TODO.md`.
- **Cost discipline:** one task per iteration; cheap checks each pass, expensive checks only at
  exit; keep `PROGRESS.md` short. Prefer running committed scripts over re-deriving code each run.
- Never commit secrets. Never force-push. Keep commits small and legible — the git history is
  part of the deliverable.
