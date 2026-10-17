# ErrorHarbor — npm Master Template Freeze v1.0.0

**Canonical design:** [npm command not found](https://errorharbor.com/errors/dev/node-npm/npm-command-not-found/).

**Purpose:** Keep the website's design consistent when publishing future articles. This is a layout freeze, **not** a freeze on helpful editorial corrections, original troubleshooting content or evidence.

## FROZEN components
- Article header: ErrorHarbor branding, Error Library link, and **Search another error**.
- Breadcrumb/article wrapper and the shared responsive CSS/JavaScript.
- Exactly one social-share panel with WhatsApp, Facebook, X and Telegram.
- Sidebar: **On this page/TOC**, **Guide details**, and a reserved **hidden** AdSense slot. Article-specific TOC labels and existing guide details are preserved.
- Homepage layout except the **six latest article cards** and their matching ItemList schema entries; hub page chrome except links/content within `<main>`.
- Footer: brand, About, Editorial Methodology, Contact, Privacy, Terms, Disclaimer and Affiliate Disclosure.
- SHA-256 fingerprints in `templates/npm-v1.freeze.json` for CSS, JS, npm reference shell, homepage chrome and hub chrome.

## Initial normalization of 54 articles
- `node scripts/migrate-npm-shell.mjs --all` previews changes.
- `node scripts/migrate-npm-shell.mjs --all --write` performs the one-time batch. It rewrites **53 non-reference articles** and leaves the original npm reference unchanged.
- Content, H1, article body (except the share panel), structured data, actual dates, canonical URL and all technical advice are **preserved**. The migrator fails if any other article-body text changes.
- A second dry-run must report **0 changed**; this proves idempotency.
- The `scripts/template-freeze-gate.mjs` must pass **54/54** registered articles and reject new unregistered article pages. It checks header, footer, share, sidebar, TOC targets, canonical, shared assets, homepage/hub chrome.
- `node scripts/test-template-freeze.mjs` proves hostile layout changes FAIL and content-only changes can PASS.

## Publishing the next article without changing the template
1. Research a distinct, verified exact-error intent. Record real sources, safe steps and verification.
2. Copy `templates/article.example.json`, fill the fields with actual evidence, then dry-run `node scripts/generate-article.mjs path/to/input.json`.
3. Run the generator with `--write` only on a new slug in a feature branch. Existing article paths cannot be overwritten.
4. Run `node scripts/check-article-template.mjs errors/<category>/<product>/<slug>/index.html`; the generator builds the npm shell and does not invent a new layout.
5. Change **content only** in the homepage's latest-six cards/ItemList and in the parent hub's `<main>`. Add the URL and metadata to `data/search-index.json`, `sitemap.xml`, and relevant internal links.
6. Run `node scripts/template-freeze-gate.mjs` and `node scripts/validate-publish.mjs` locally. The GitHub SEO Link Guard also runs these lightweight checks on PRs.
7. Use heavy Chromium full-site tests only after one completed change batch. Merge/publish only if required gates PASS; verify GitHub Pages production after deploy.

## Deliberate redesign
Changes to the npm master header, sidebar, footer, homepage/hub chrome or global CSS/JS need a **separate explicitly approved versioned design-migration PR** with mobile and desktop visual comparisons, accessibility audit, a new lock manifest and complete regression. Never silently update the hashes just to bypass the lock.

## Quality evidence before production
In the isolated working checkout, 54 article sources passed the freeze gate, 7 hostile changes were rejected, and 108 Chromium render combinations (54 pages × 390px and 1366px) passed with the actual CSS and shared JavaScript injected into the rendered document. Those checks do **not** substitute for the subsequent GitHub-hosted HTTP/Chromium gate or live production verification.

AdSense approval, tags and consent rollout are intentionally out of scope; no new ad script is activated by this freeze.
