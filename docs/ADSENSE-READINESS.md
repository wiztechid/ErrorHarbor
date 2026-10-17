# ErrorHarbor — AdSense Readiness

**Updated:** 2026-10-17  
**Publisher ID:** `pub-4750547049813961`  
**Status:** PRE-RESUBMISSION HOLD. Source-level QC is useful but does not replace the unfinished live, Search Console and editorial checks in `ADSENSE-RESUBMISSION-GATE.md`.

## Canonical publisher record

```text
google.com, pub-4750547049813961, DIRECT, f08c47fec0942fa0
```

## Publisher record check — 2026-10-17

The earlier AdSense dashboard inspection used the wrong Google account. Do not use that account's publisher ID or site status as ErrorHarbor evidence. The canonical publisher ID remains `pub-4750547049813961`, as confirmed by the site owner. The intended account was checked on 2026-10-17: it shows “Your account wasn't approved” / “Meet AdSense program policies.” The Oct 7 email says to focus on content and mentions insufficient content or content quality as common issues, but it does not identify a particular URL or confirm which issue applies. Keep resubmission on hold until the remaining evidence and checks are complete.

## Deep Final QC ledger

| Gate | Scope | Status | Durable result |
|---|---|---|---|
| #1 | Publisher Identity & Trust | PASS | Trust/legal layer; AI-assisted workflow disclosure; advertising-choice disclosure |
| #2 | Content Value / Low-Value / Scaled Content | PARTIAL | 54 published error guides inventoried at corpus level; the shortest guide had identifiable missing BuildKit branches and was improved in PR #24; full per-page evidence/accuracy review remains open |
| #3 | Crawl Graph / Navigation / Dead Ends | PASS | sitemap repaired/guarded; four pillar hubs searchable; crawl graph protected |
| #4 | Ad Placement / UX / Accidental Clicks | PRE-MONETIZATION PASS | staged slots hidden; interactive zones protected; production placement is a separate release |
| #5 | Privacy / Consent Message / Implementation | PASS | privacy/consent-message wording hardened; ads.txt/publisher ID guarded; production tags blocked before intentional activation |
| #6 | Final Submission Readiness | HOLD | PR #24 targeted content update passed SEO/template QC and Pages deployment; account remains unapproved; Search Console, complete responsive/legal/link checks remain open |

## Google review and focused content audit — 2026-10-17

- Intended publisher record remains `pub-4750547049813961`; production `ads.txt` was verified against it.
- Google’s message is broad: it recommends focusing on content and lists insufficient content/content quality as common examples. It does not name a failing page or establish the precise cause. See the open checks in the resubmission gate; do not represent this as a confirmed low-value-content finding.
- A source-level scan found 54 error-guide URLs (separate from category/library pages). All have external references; one guide was a clear length outlier and omitted relevant Docker BuildKit context branches. PR #24 added those diagnostics while preserving the frozen HTML structure. SEO/template check and Pages deployment passed, and production content was verified.
- This one focused correction does not complete the corpus accuracy review or guarantee approval. Keep HOLD until all P0 items are evidenced and account/GSC checks are complete.

### Search Console snapshot — 2026-10-17

For verified property `sc-domain:errorharbor.com`, Page indexing shows 26 indexed and 41 not indexed: 4 excluded by `noindex`, 3 redirect URLs, 34 “Discovered – currently not indexed,” and 0 “Crawled – currently not indexed.” The Sitemaps report shows `https://errorharbor.com/sitemap.xml` status **Success**, last read 2026-10-16, with 61 discovered pages. The current repository sitemap has 63 URLs, so recheck after GSC refresh. These are separate report totals. The page examples and the four `noindex` targets have not yet been checked individually; retain the related P0 checks as open. Google defines discovered-not-indexed as found but not crawled yet, and sitemap submission is a hint rather than a guarantee of crawling/indexing.

Repository follow-up on 2026-10-17: the current sitemap contains 63 URLs, while Search Console last read it on 2026-10-16 and reported 61 discovered pages; recheck after the next GSC refresh. Source inspection found six pages intentionally marked `noindex,follow` (Contact, Privacy, Terms, Disclaimer, Affiliate Disclosure, Corrections), all omitted from the sitemap. Search Console currently lists only four noindex URLs, so reconcile the report examples when accessible; do not remove noindex directives broadly just to increase counts.

## Content / scaled-content guard

A shared visual/editorial framework is allowed; cloned reasoning is not. Every new article must prove a distinct intent and diagnostic moat, use problem-specific evidence/remediation/verification, and pass corpus cannibalization review. If the unique moat cannot be stated, HOLD/MERGE/SKIP.

## Pre-approval advertising state

- production AdSense script intentionally inactive;
- reserved `.ad-placeholder` hidden;
- never unhide staged placeholders as the production implementation;
- no production ad before first useful answer/check or adjacent to Copy, Yes/No feedback, search, TOC/Guide Details, warnings, verification or community input.

## Consent-message contract

For relevant EEA/UK/Switzerland traffic when Google advertising is activated, configure the consent message through Google AdSense Privacy & messaging and present the user choices available for the applicable region/configuration before dependent advertising/storage technologies activate. Do not add a separate third-party CMP unless the production setup later requires one.

## Production activation

`AdSense approval → Privacy & messaging / user-choice consent message → verify regional consent → production AdSense tag → production placement v1 → responsive regression QC → conservative optimization`

Start with clearly separated responsive in-page inventory. Keep anchor, side rail, vignette and other automatic formats off until separately reviewed.

## Submission freeze

As of 2026-10-02, the pre-submission repository is frozen for non-essential changes. During AdSense review, avoid cosmetic redesign, artificial publication-date changes, bulk content expansion, or monetization experiments. Allow only P0 correctness/security/legal fixes or changes required by Google review feedback.

## Approval caveat

Readiness controls reduce policy, quality and implementation risk; they do not guarantee Google AdSense approval.
