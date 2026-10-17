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
