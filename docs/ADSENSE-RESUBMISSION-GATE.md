# ErrorHarbor — AdSense Resubmission Gate

Status: PRE-RESUBMISSION / evidence required. This checklist is an internal quality gate, not a claim of Google AdSense approval.

## P0 — Technical and trust checks
- [x] Repository has `robots.txt` allowing crawl and advertising `ads.txt` with publisher declaration (checked 2026-10-17).
- [x] Repository has `sitemap.xml` and a publication validation script.
- [x] Homepage footer links to About, Editorial Methodology, Contact, Privacy, Terms, Disclaimer and Affiliate Disclosure (checked 2026-10-17).
- [ ] Verify all those links return HTTP 200 in production and their content accurately describes current site behavior.
- [ ] Review Privacy / Contact / Terms / Disclaimer `noindex,follow` decisions. Noindex alone is not an AdSense rejection reason; only change based on clear indexation and transparency goals.
- [ ] Verify responsive layout and accessibility on mobile/desktop across homepage, hub, article, trust and legal templates.
- [ ] Verify no broken links, incorrect canonical, accidental noindex, duplicate titles, orphan articles or sitemap/index mismatches in the final publication batch.
- [ ] Verify no obstructive ads, misleading CTAs, nonfunctional widgets or placeholder content.

## P0 — Editorial usefulness and policy
- [x] Inventory every published article with URL, target error, distinct intent, reviewed date, testable fix, evidence and outbound sources; completed in [ARTICLE-CONTENT-AUDIT-2026-10-29.md](ARTICLE-CONTENT-AUDIT-2026-10-29.md).
- [x] Checked troubleshooting command guidance for safety, reversibility, environment differences and verification; platform-specific execution limits are recorded in the audit ledger.
- [x] Reviewed thinness, intent overlap, source support, unsupported-test wording and diagnostic value across all 54 guides; corrected the stale npm v8 reference in PR #38. No remaining corpus-level blocker was identified in this pass.
- [ ] Ensure byline/editorial accountability, corrections channel and original problem-solving value.
- [ ] Confirm monetization/affiliate disclosures match actual behavior; no unsupported statements about Google approval.

## P1 — Search Console evidence
- [ ] Record indexed / crawled-not-indexed / discovered-not-indexed counts from GSC (no invented numbers).
- [ ] Inspect representative excluded URLs and compare canonical, internal links and actual page quality.
- [ ] Verify sitemap processing and indexation requests only after real corrections.

## Google feedback record — 2026-10-17 (historical)

On Oct 17, the intended AdSense account (`pub-4750547049813961`) showed “Meet AdSense program policies.” The Oct 7 email recommended focusing on content and listed insufficient content/content quality as common examples. The Oct 29 dashboard screenshot later supplied by the owner explicitly shows “Needs attention — Low value content”; see the current status below. PR #24 corrected missing Docker BuildKit context branches. The Oct 17 audit note is historical and does not describe completion of the later per-page review.

### Current AdSense dashboard and completed article audit — 2026-10-29

The owner-provided Sites screenshot shows **Needs attention — Low value content** and **ads.txt Authorized**. The label is confirmed; the screenshot does not identify specific failing URLs or the exact reason behind the site-level decision.

The full per-URL review is recorded in [ARTICLE-CONTENT-AUDIT-2026-10-29.md](ARTICLE-CONTENT-AUDIT-2026-10-29.md). It covers all 54 published troubleshooting articles, confirms all 54 production URLs return HTTP 200 and align across canonical, visible review date, Article dateModified and sitemap lastmod, and records 161 unique reference URLs opened. Six guides now contain bounded first-party reproductions; the UptimeRobot guide has a separate recorded lab. Platform-specific fixes are labeled as source-reviewed, not personally tested in this runtime. The content audit is complete; the remaining technical/trust, responsive and Search Console checks below remain open.

### Search Console snapshot — 2026-10-17

For verified property `sc-domain:errorharbor.com`, Page indexing shows 26 indexed and 41 not indexed: 4 excluded by `noindex`, 3 redirect URLs, 34 “Discovered – currently not indexed,” and 0 “Crawled – currently not indexed.” The Sitemaps report shows `https://errorharbor.com/sitemap.xml` status **Success**, last read 2026-10-16, with 61 discovered pages. On 2026-10-17, the production sitemap and repository `sitemap.xml` were both checked and contain the same 63 URLs. GSC’s 61-page count is from its earlier read, so refresh the report after its next processing update; do not treat that difference alone as a sitemap defect. The page examples and four `noindex` targets have not yet been inspected individually. Google defines discovered-not-indexed as found but not crawled yet, and sitemap submission is a hint rather than a guarantee of crawling/indexing.

Repository inspection on 2026-10-17 found six pages carrying `noindex,follow` (Contact, Privacy, Terms, Disclaimer, Affiliate Disclosure, Corrections); all are omitted from the sitemap. Search Console lists four `noindex` URLs, but their exact URLs are not available in the current report view. The two-count difference remains unresolved until the examples can be inspected; do not remove `noindex` directives broadly just to increase counts.
## Release decision
- **HOLD:** any P0 critical issue unresolved or missing evidence.
- **READY FOR RESUBMISSION:** P0 items complete with evidence, key pages verified live, article sampling reviewed, and release checks GREEN. Approval remains Google's decision.
- Do not change production or trigger expensive GitHub Actions until corrections are collected in a single batch.
- Record evidence links, issue owner, fixes, PR SHA, final validation run and production checks before changing this status.
