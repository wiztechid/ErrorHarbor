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

## Release decision
- **HOLD:** any P0 critical issue unresolved or missing evidence.
- **READY FOR RESUBMISSION:** P0 items complete with evidence, key pages verified live, article sampling reviewed, and release checks GREEN. Approval remains Google's decision.
- Do not change production or trigger expensive GitHub Actions until corrections are collected in a single batch.
- Record evidence links, issue owner, fixes, PR SHA, final validation run and production checks before changing this status.
