# ErrorHarbor — npm Article Template FROZEN v1.0

**Authoritative visual reference:** https://errorharbor.com/errors/dev/node-npm/npm-command-not-found/

**Baseline:** previous production `806d1165b279360d227e268e33f88e36a1b2b655`. New npm design freeze applies only after review, merge, production deployment and live verification.

## Invariants
- All 54 registered article pages share the npm header, visible Error Library link, Search another error input, sidebar with TOC and guide details, four social-share destinations, reserved hidden ad rail, and seven-link trust/legal footer.
- Article-specific title, exact errors, Quick Fix, diagnostics, commands, evidence, source links, schema, canonicals, publication dates and genuine review dates remain unchanged by the one-time migration. The share bar alone is regenerated with each article URL/title.
- Global CSS and JS fingerprints are immutable. Homepage design and hub chrome are immutable while Latest Guides content/ItemList, search registry, sitemap and article-list links can change with a genuinely new article.
- Do not edit a shared layout file as a side effect of publishing content. Theme changes require separate approved versioned migration, full desktop/mobile regression and a replacement manifest.
- AdSense tags and consent implementation are outside this freeze and require separate review; existing placeholder remains hidden.

## Enforcement
- `scripts/migrate-npm-shell.mjs` normalizes the existing corpus and refuses to alter editorial body except static share bar. Dry run must report 0 changes after migration.
- `scripts/npm-freeze-gate.mjs` compares `templates/npm-shell.freeze.json` against CSS, JS, homepage/hub chrome, reference header/footer, and checks all registered articles every run.
- `scripts/test-article-generator.mjs` verifies generator shell parity. New article generator reads npm header/footer from the reference instead of hardcoding alternative templates.
- PR/main lightweight GitHub CI runs freeze, generator and SEO publication gates. Browser/Playwright deep checks only on demand after meaningful layout changes.
- New article publishing can edit its own editorial markup, metadata, primary references, search registry, sitemap, latest-six data and hub `<main>` links; cannot change locked chrome. No silent SHA refresh permitted.
- Fail closed: any lock drift requires correction or a new explicit design-migration PR, never an automatic unlock.

## Rollout
1. Normalize 54 pages on dedicated branch, retain main untouched until verification.
2. Run generator regression, full 54-page freeze, SEO publication gate, Playwright smoke mobile/desktop.
3. Review PR and merge only if all green; verify actual GitHub Pages deployment and live site.
4. Record the release SHA and enable routine content-only publishing.

**Important:** a code freeze is not a guarantee of Google AdSense approval, search indexing, or editorial quality; those remain independent gates.
