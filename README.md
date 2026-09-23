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

## Custom domain

Do **not** add final canonical URLs, sitemap hostnames or a `CNAME` file until the custom domain is connected and verified. After the domain is ready:

1. add `CNAME`
2. update canonical/OG URLs
3. create production `sitemap.xml`
4. update `robots.txt` with the sitemap URL
5. verify HTTPS
6. connect Google Search Console
7. only then submit sitemap/indexing

## Third-party services

See `docs/THIRD-PARTY-SETUP.md`.

## Design principle

> SEO earns the click. Reader success earns trust. Real search and revenue data decide what gets scaled.
