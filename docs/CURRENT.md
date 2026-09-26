# CURRENT — ErrorHarbor

**Status:** Production domain live; SEO cutover complete  
**Version:** Theme v2.1 · Production  
**Repository:** `wiztechid/ErrorHarbor`

## Implemented

- Homepage utility search
- Bright reader-first design system
- Popular exact-error section
- Error Library
- Developer, Windows/Network and Virtualization hubs
- Three initial troubleshooting pages
- Quick Fix before monetization
- Diagnostic flow and verification
- Per-fix feedback UI
- Staged community comments area
- Legal/trust pages
- Client-side search index
- Static GitHub Pages architecture

## Intentionally pending

- AdSense publisher script + ads.txt
- Google CMP configuration
- Cloudflare Worker + D1 feedback endpoint
- Turnstile
- real affiliate IDs/links
- production analytics
- real solved-rate display
- monitor HPK expansion batches #1–#2 in Search Console

## Next product milestone

**P0: monitor indexing/query signals for batches #1–#2 while enforcing the SEO Architecture v2 publication graph.**


## Giscus comments activated — 2026-09-23

- GitHub Discussions enabled for `wiztechid/ErrorHarbor`
- Giscus repository ID: `R_kgDOUmgggA`
- Giscus category: `Announcements`
- Giscus category ID: `DIC_kwDOUmgggM4DGNES`
- Mapping: pathname
- Reactions enabled
- Comment input positioned above comments
- Lazy loading enabled
- English/light theme


## Giscus visual integration QC — 2026-09-23

- verified latest Giscus-enabled GitHub Pages deployment completed successfully
- changed Giscus theme to `noborder_light` to blend with ErrorHarbor article surfaces
- added reader-facing GitHub Discussions sign-in note
- deferred the third-party Giscus script until the reader approaches the community section
- retained Giscus iframe lazy loading
- added loading and failure fallback states
- added direct GitHub Discussions fallback link
- kept article CSS outside the Giscus iframe; iframe internals are controlled via the Giscus theme


## Final Regression QC v2.1 — 2026-09-23

Regression cleanup:
- removed unpublished Coming Soon items from live Developer and Virtualization hubs
- removed Windows & Network hub from the public Error Library until a real guide exists
- removed the empty Windows hub from client-side search results
- switched staging robots policy to allow crawling so page-level noindex can be honored
- confirmed three launch articles retain sticky search, per-fix feedback, related troubleshooting and Giscus configuration


## Production SEO cutover — 2026-09-25

- custom domain: `https://errorharbor.com/`
- GitHub Pages DNS check successful
- HTTPS enforcement enabled
- removed staging noindex from production/indexable pages
- added self-referencing canonical URLs
- added Open Graph URLs and summary Twitter cards
- normalized WebSite/WebPage/CollectionPage/Article schema
- added BreadcrumbList schema to launch articles
- created production `sitemap.xml`
- updated `robots.txt` to allow crawling and advertise the sitemap
- kept empty Windows hub and legal/utility pages noindex where appropriate


## HPK expansion batch #1 — 2026-09-25

Published five source-grounded developer troubleshooting guides:
- Debug Assertion Failed in C++
- MySQL Failed to Open File Error 2
- Hadoop Command Not Found
- SignTool.exe Not Found
- Plugin with id 'com.android.application' not found

All five use the v2.1 article pattern: exact-error fingerprint, safe first check, verification, per-fix feedback, official references, related guides and Giscus community.


## Soft-404 guard — virtualization hub — 2026-09-25

- Google live test classified the thin `/errors/virtualization/` category page as Soft 404
- kept the hub available for navigation but changed it to `noindex,follow`
- removed the thin hub from sitemap and client-side search
- kept the real VMware troubleshooting article indexable and in sitemap
- re-enable hub indexing after the cluster has multiple substantive live guides


## HPK expansion batch #2 — 2026-09-25

Published five additional exact-error guides:
- JavaScript ReferenceError: x is not defined
- JavaScript TypeError: x is not a function
- Android SDK Location Not Found
- A Hypervisor Has Been Detected
- TeamViewer Protocol Negotiation Failed

Cluster handling:
- Developer hub deepened with three new live guides
- Virtualization hub now has two live guides but remains `noindex,follow` after the earlier Soft-404 signal
- Windows & Network hub now has one live guide and remains `noindex,follow` until the cluster is deeper
- all five article URLs are indexable, internally linked, searchable and included in sitemap


## Reader-first QC Batch #2 — 2026-09-25

Trust and completeness pass:
- added choose-your-path decision blocks above deeper troubleshooting
- added explicit verification after Fix #2 and Fix #3
- added “What not to do” safety guidance
- added escalation evidence checklists
- added/clarified current official references for MDN, Android, Microsoft/Broadcom and TeamViewer
- fixed the JavaScript ReferenceError sample so literal script tags render as code rather than being parsed by the browser
- added Android OS-specific SDK path guidance and CI/ANDROID_HOME distinction
- clarified that “A hypervisor has been detected” is often informational and that current VMware Workstation may use WHP
- added TeamViewer status-first troubleshooting and stronger firewall/IP safety guidance


## SEO Architecture v2 / Publish Graph — 2026-09-25

New production rule:
- every new article enters Homepage Latest Guides, its parent hub, sitemap and search registry in the same release
- homepage Latest Guides retains the newest 8 article URLs
- new articles must include related links and receive a relevant backlink from an existing sibling when available
- search registry now stores publish date/order, cluster, hub and summary metadata
- homepage now exposes an ItemList for the latest guides
- repository publish validator checks canonical, indexability, sitemap, hub link, latest homepage link, related links and inbound-link coverage
- thin hubs remain subject to noindex/Soft-404 protection until materially useful
- GSC is now the feedback loop for title/snippet refinement, cluster scaling and cannibalization control


## Corpus-wide SEO Architecture v2 QC — 2026-09-25

- audited all live registry entries: 13 indexable troubleshooting articles + 1 indexable Developer Errors hub
- upgraded the 8 pre-Batch-2 articles to the same reader-first trust standard already applied to Batch #2
- added choose-your-path blocks, post-fix verification, What not to do, and escalation evidence capture where missing
- added authoritative references to the original VMware, npm and SQL Server launch guides
- refreshed reviewed/dateModified signals after substantive review
- tightened the publish validator to enforce v2 article anatomy, OG/schema completeness, title/meta uniqueness, and explicit verification
- retained noindex protection on thin Virtualization and Windows & Network hubs while their article pages remain indexable


## P0 MySQL intent rescope — 2026-09-25

- narrowed the existing MySQL Errcode 2 guide to the LOAD DATA / LOAD XML file-not-found intent
- retained the existing URL and canonical to avoid unnecessary URL churn
- aligned title, H1, lede, fingerprint, Applies to metadata and search-registry keywords with the narrower intent
- preserved INFILE vs LOCAL INFILE and secure_file_priv diagnostics because they directly serve this import-file intent
- reserved broader MySQL Errcode 2 / can't-open-file contexts for separate intent review rather than letting this page cannibalize them


## Windows SDK / SignTool cluster expansion — 2026-09-26

- published deep supporting guide: `'signtool' Is Not Recognized`
- separated command-resolution/PATH intent from the anchor `SignTool.exe Not Found` installation/discovery intent
- added shell vs exact-path vs session-PATH vs CI/CD decision flow with explicit verification
- reinforced two-way internal linking between the SignTool anchor and supporting guide
- added the new URL to Developer hub, homepage latest-8, search registry and sitemap
- grounded the guide in current Microsoft SignTool, Developer shell and MSIX CI/CD documentation
