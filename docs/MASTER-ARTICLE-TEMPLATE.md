# ErrorHarbor Master Article Template — v1.0

**Canonical design reference:** `errors/dev/docker/failed-to-compute-cache-key-not-found/index.html` (after the footer parity patch in this branch). Reuse its shell and CSS classes; do not recreate the header, footer, social controls, or navigation from scratch for each article.

## Locked article shell (must be present on every new article)
1. HTML language, charset, viewport; unique descriptive `<title>`, meta description, canonical URL, Open Graph and Twitter metadata.
2. Existing site header and breadcrumbs; exactly one meaningful H1.
3. Article metadata (applies-to, actual reviewed date, risk), quick answer, error fingerprint, diagnostic decision path.
4. Ordered fixes with runnable, scoped commands, warnings and verification outcomes; what not to do; still failing/evidence.
5. Authoritative primary references, relevant internal links and optional community discussion.
6. Accessible on-page TOC: every link points to a real section ID; include references/related/community when present.
7. Existing social-share component and `/assets/js/app.js` integration; **do not build a second share widget**. Existing JS creates/replaces the share bar.
8. **Full footer parity with homepage:** `site-footer`, `footer-grid`, brand, About, Editorial Methodology, Contact, Privacy, Terms, Disclaimer, Affiliate Disclosure, and `footer-bottom`.
9. Keep responsive shell, code overflow handling, link semantics, and existing CSS classes. No global CSS edits for individual articles unless justified and regression-tested.

## Publishing contract
- Draft the article body separately from the shell. Start from the approved master reference and change only article-specific content, metadata, internal links and section IDs.
- Do not modify or delete the locked shell components for individual publication.
- Run `node scripts/check-article-template.mjs errors/<category>/<product>/<slug>/index.html` as a **local/pre-commit check**. This script does not trigger GitHub Actions.
- Resolve every template error, then run article/SEO quality review. Batch corrections before a single final GitHub Actions validation according to `docs/WIZ-GITHUB-MODE-HEMAT-SOP.md`.
- For legacy articles, migrate in audited batches rather than forcing a global rewrite during AdSense review.
- Any intentional template version change requires a dedicated change record and a representative mobile/desktop regression check.

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
