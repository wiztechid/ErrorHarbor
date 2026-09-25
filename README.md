# ErrorHarbor

**Find the cause. Fix the error.**

ErrorHarbor is a reader-first technical troubleshooting site for exact errors, failed commands, error codes and software problems.

## Current build

The repository now contains the first production-oriented static build:

- bright utility-first homepage
- client-side exact-error search
- Error Library and topical hubs
- three launch/sample troubleshooting pages
- Quick Fix → diagnostic flow → verification structure
- per-fix Yes/No feedback UI with local fallback storage
- staged community/Giscus area
- AdSense and contextual affiliate protected zones
- accessibility basics: skip link, focus states, reduced-motion support
- About, Methodology, Privacy, Terms, Disclaimer, Affiliate Disclosure, Contact and Corrections pages
- GitHub Pages static delivery via `.nojekyll`

## Launch content

- `npm command not found`
- `Operating System Not Found in VMware`
- `Invalid Column Name in SQL Server`

These are the initial product/content templates. High-paying keyword publishing must follow the master SOP in `docs/`.

## GitHub Pages

This repository is designed to deploy from the root of the `main` branch.

If Pages is not already enabled:

1. Open **Settings → Pages**
2. Set source to **Deploy from a branch**
3. Choose **main** and **/(root)**
4. Save

The temporary project URL should be similar to:

`https://wiztechid.github.io/ErrorHarbor/`

## Production domain

ErrorHarbor is served at:

`https://errorharbor.com/`

GitHub Pages is configured with the apex custom domain and HTTPS enforcement. Production canonical URLs, Open Graph URLs, schema, `robots.txt`, and `sitemap.xml` use the apex domain.

The legacy GitHub Pages project URL is not the canonical version.

## Third-party services

See `docs/THIRD-PARTY-SETUP.md`.

## Design principle

> SEO earns the click. Reader success earns trust. Real search and revenue data decide what gets scaled.


## SEO publication guard

New articles must be integrated into the full crawl graph in the same release: homepage Latest Guides, parent hub, related links, search registry and sitemap.

Run locally:

`node scripts/validate-publish.mjs`

The `SEO Link Guard` GitHub Action runs the same validation on pushes and pull requests to `main`.

See:
- `docs/MASTER-SOP-HIGH-PAYING-KEYWORD.md`
- `docs/SEO-ARCHITECTURE-v2.md`
