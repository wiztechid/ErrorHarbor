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
- [ ] Inventory every published article with URL, target error, distinct intent, reviewed date, testable fix, evidence and outbound sources.
- [ ] Check troubleshooting commands for safety, reversibility, environment differences and explicit verification after each fix.
- [ ] Flag thin/duplicative articles, inaccurate instructions, generic AI filler, unsupported claims, broken commands and content that adds no value beyond vendor documentation.
- [ ] Ensure byline/editorial accountability, corrections channel and original problem-solving value.
- [ ] Confirm monetization/affiliate disclosures match actual behavior; no unsupported statements about Google approval.

## P1 — Search Console evidence
- [ ] Record indexed / crawled-not-indexed / discovered-not-indexed counts from GSC (no invented numbers).
- [ ] Inspect representative excluded URLs and compare canonical, internal links and actual page quality.
- [ ] Verify sitemap processing and indexation requests only after real corrections.

## Google feedback / content audit record — 2026-10-17

The intended AdSense account (`pub-4750547049813961`) shows “Meet AdSense program policies.” The Oct 7 email recommends focusing on content and gives insufficient content/content quality as common examples; it does not identify a specific failing URL or confirm the exact issue. A corpus-level source scan found 54 published error guides, each with at least one external reference. It identified one unusually short Docker BuildKit guide missing stdin-context, parent-path and named-context branches. Those paragraphs were added in PR #24 without changing the frozen article structure; the SEO/template workflow and Pages deployment passed, and the live article was checked. This is a focused correction, not completion of the per-page accuracy audit. Keep all remaining P0 checks open and do not treat approval as guaranteed.

### Search Console snapshot — 2026-10-17

For verified property `sc-domain:errorharbor.com`, Page indexing shows 26 indexed and 41 not indexed: 4 excluded by `noindex`, 3 redirect URLs, 34 “Discovered – currently not indexed,” and 0 “Crawled – currently not indexed.” The Sitemaps report shows `https://errorharbor.com/sitemap.xml` status **Success**, last read 2026-10-16, with 61 discovered pages. These are separate report totals. The page examples and the four `noindex` targets have not yet been checked individually; retain the related P0 checks as open. Google defines discovered-not-indexed as found but not crawled yet, and sitemap submission is a hint rather than a guarantee of crawling/indexing.

## Release decision
- **HOLD:** any P0 critical issue unresolved or missing evidence.
- **READY FOR RESUBMISSION:** P0 items complete with evidence, key pages verified live, article sampling reviewed, and release checks GREEN. Approval remains Google's decision.
- Do not change production or trigger expensive GitHub Actions until corrections are collected in a single batch.
- Record evidence links, issue owner, fixes, PR SHA, final validation run and production checks before changing this status.
