# Legacy article shell parity — batch 2026-10-17

Scope: the 54 entries with `kind: article` in `data/search-index.json`; four `kind: hub` entries are excluded from the article-specific TOC gate.

## Repository inspection
- The first 20 index entries were sampled; article shell components were present. Hub entries have no article TOC by design.
- Article entries 20–35 revealed five legacy articles with copyright-only footer. Their footer markup was updated to the full homepage trust/footer navigation in this PR:
  - `errors/dev/sftp/bad-ownership-or-modes-for-chroot-directory/`
  - `errors/dev/sftp/subsystem-request-failed-on-channel-0/`
  - `errors/dev/ssh/too-many-authentication-failures/`
  - `errors/dev/ssh/kex-exchange-identification-connection-closed/`
  - `errors/virtualization/vmware/nested-virtualization-not-supported-module-hv-power-on-failed/`
- The Docker BuildKit article footer was already updated earlier in this PR.
- The remaining 18 article entries inspected had footer-grid, social-share and TOC markers.
- This is a source-level audit, not a rendered browser QA or executed Node test.

## Final validation — pending
1. Run locally: `node scripts/generate-article.mjs templates/article.example.json` (dry run only; **do not publish** example).
2. Generate an isolated sample in a disposable working copy, run `node scripts/check-article-template.mjs errors/dev/example/example-error/index.html`, then remove sample.
3. Run `node scripts/audit-article-parity.mjs --strict`.
4. Run `node scripts/validate-publish.mjs` and check that generated articles are registered and linked before publication.
5. Verify homepage and 3 representative articles in desktop/mobile preview.
6. Only after corrections are complete, trigger **one final GitHub Actions validation** and attach the run URL to PR #16.
7. Do not merge or deploy until all required checks are GREEN and production verification is planned.

## Guardrails
- No mass rewrite of troubleshooting content.
- No automatic changes to `dateModified`, GSC, sitemap, or AdSense status.
- Do not interpret this source audit as proof that AdSense will approve the site.


## Resume audit update — 2026-10-17 (source-only; no release)
- Repository `main` registry currently contains **54 articles + 4 hubs**; `docs/CURRENT.md` still carried a historical 52-article snapshot.
- All 54 registered article sources were examined in three batches against footer-grid, canonical, TOC, share mount and trust-link presence. 48 used the required absolute paths; six used legitimate relative `../../../../` trust links.
- Original audit script incorrectly required literal root-relative footer href strings, producing **six false positives**. Fixed `scripts/audit-article-parity.mjs` to resolve each anchor against its nested page URL, require same origin, and compare final URL path.
- Six already-modified legacy pages in this PR had their HTML bodies compared with `main` after excluding the footer: **all six changes are footer-only**; no troubleshooting body/content drift.
- A local Node.js fixture check verified 42 relative links (six nested article paths × seven destinations), plus a regex extraction test and negative cases rejecting external and misspelled destinations.
- **Do not interpret this as an executed `node scripts/audit-article-parity.mjs --strict` or browser QA.** The complete script still requires execution in a checkout, alongside generator smoke, publish validator and final manual UI test.
- PR #16 stays **DRAFT / DO NOT MERGE** pending those required tests, live/mobile parity and AdSense freeze review. No production changes or GitHub Actions runs were made by this audit.
