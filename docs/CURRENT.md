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

- Google Search Console verification + sitemap submission
- AdSense publisher script + ads.txt
- Google CMP configuration
- Cloudflare Worker + D1 feedback endpoint
- Turnstile
- real affiliate IDs/links
- production analytics
- real solved-rate display
- first validated HPK expansion batch

## Next product milestone

**P0: verify Search Console, submit sitemap, then publish the first validated HPK cluster.**


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
