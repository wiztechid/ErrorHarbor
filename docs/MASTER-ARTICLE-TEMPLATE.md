# ErrorHarbor Master Article Template — v2.0 (npm-shell FROZEN)

**Canonical design reference (FROZEN):** `errors/dev/node-npm/npm-command-not-found/index.html`. ALL article shells and the generator must use its header/search/share/sidebar/footer model. The Docker page is a content article, not the master layout. See `docs/NPM-TEMPLATE-FREEZE-v1.md`.

## Locked article shell (must be present on every new article)
1. HTML language, charset, viewport; unique descriptive `<title>`, meta description, canonical URL, Open Graph and Twitter metadata.
2. Existing npm site header including Search another error and breadcrumbs; exactly one meaningful H1.
3. Article metadata (applies-to, actual reviewed date, risk), quick answer, error fingerprint, diagnostic decision path.
4. Ordered fixes with runnable, scoped commands, warnings and verification outcomes; what not to do; still failing/evidence.
5. Authoritative primary references, relevant internal links and optional community discussion.
6. Accessible on-page TOC: every link points to a real section ID; include references/related/community when present.
7. One npm social-share component and `/assets/js/app.js` integration; **do not build a second share widget**. Existing JS normalizes the share bar.
8. **Full footer parity with homepage:** `site-footer`, `footer-grid`, brand, About, Editorial Methodology, Contact, Privacy, Terms, Disclaimer, Affiliate Disclosure, and `footer-bottom`.
9. Keep responsive shell, code overflow handling, link semantics, and existing CSS classes. No global CSS edits for individual articles unless justified and regression-tested.

## Publishing contract
- Draft the article body separately from the shell. Start from the approved master reference and change only article-specific content, metadata, internal links and section IDs.
- Do not modify or delete the locked shell components for individual publication.
- Run `node scripts/check-article-template.mjs errors/<category>/<product>/<slug>/index.html` as a **local/pre-commit check**. This script does not trigger GitHub Actions.
- Resolve every template error, then run article/SEO quality review. Batch corrections before a single final GitHub Actions validation according to `docs/WIZ-GITHUB-MODE-HEMAT-SOP.md`.
- For legacy articles, migrate in audited batches rather than forcing a global rewrite during AdSense review.
- Any intentional template version change requires a separate approved design PR with bumped lock version, 54-article regression and mobile/desktop QC. Regular article publication MUST NOT edit shared CSS/JS or site chrome.

## Article completion gate
Article is not publication-ready if footer links are missing, canonical is absent, TOC anchors are broken, a title/H1 is duplicated, share scripts are duplicated, or required troubleshooting sections are missing. Content quality, safety, references and actual test evidence remain separate editorial gates.

## Generator v1 — create without changing existing articles
- Copy `templates/article.example.json` to a new article input JSON and replace **all** example content with researched, verifiable information.
- Preview target path without writing: `node scripts/generate-article.mjs templates/article.example.json`.
- Generate the file: `node scripts/generate-article.mjs templates/article.example.json --write`.
- Check the generated article locally: `node scripts/check-article-template.mjs errors/dev/example/example-error/index.html`.
- The generator refuses to overwrite existing article paths. Generated files are drafts: editorial evidence, working commands, internal links, search index, sitemap, hub/latest-guide placement and production gates must still be completed separately.
- Do not publish the example JSON as an actual article. Do not auto-update reviewed dates without substantive verification.
- Legacy article migration: first inventory missing template components, then fix in small audited batches; avoid mass rewriting article content.

## Mandatory npm template freeze gate
- Run `node scripts/template-freeze-gate.mjs` before any article PR: checks all 54 registered pages, shared assets, homepage/hub chrome, footer, header, TOC and social-share.
- Run `node scripts/test-template-freeze.mjs` to test failure behavior and prove editorial-only edits remain permitted.
- Generator v2 inherits its chrome from the npm reference; editorial evidence and SEO publication gates remain separate.
