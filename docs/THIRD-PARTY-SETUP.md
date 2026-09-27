# Third-Party Setup — ErrorHarbor

ErrorHarbor follows a **static-first, first-party-where-valuable** architecture.

## 1. GitHub Pages — required

Purpose: static site hosting.

Current files already support Pages deployment from `main /(root)`.

## 2. Cloudflare — recommended

Use Cloudflare for:

- DNS
- HTTPS/domain edge
- caching/security
- Worker API for first-party feedback
- D1 database for Yes/No outcomes and solved-rate data
- Turnstile for forms/anti-spam

Do not make the initial public launch depend on the feedback backend. The current UI falls back to browser localStorage.

## 3. Giscus — comments MVP

Recommended first comment system:

- repository: `wiztechid/ErrorHarbor`
- mapping: pathname
- comments stored in GitHub Discussions

Before activation:

1. enable **Discussions** on the repository
2. install/authorize the Giscus GitHub App if required
3. create/select a discussion category
4. obtain the repository ID and category ID from giscus.app
5. replace the staged community box on article templates with the Giscus script

Keep the credential warning visible above comments.

## 4. Google AdSense

Current pre-approval state:

- publisher ID: `pub-4750547049813961`
- root `ads.txt` is present with the canonical Google DIRECT record
- production AdSense tags are intentionally not active
- staged `.ad-placeholder` inventory is hidden and must not be treated as production placement

Production rules:

- no ad before the first useful answer/check
- no ad inside or immediately adjacent to code/copy controls, warnings, verification, Yes/No feedback, search, TOC/Guide Details or comment input
- do not simply unhide legacy placeholders after approval
- begin with conservative, clearly separated responsive in-page inventory
- keep anchor, side rail, vignette and other automatic formats off initially; enable only after deliberate UX/regression review
- protect mobile/tablet layouts from ad reflow and accidental-click proximity

## 5. Google CMP

For Google advertising to users in the EEA, UK and Switzerland, configure a Google-certified CMP integrated with the applicable IAB TCF requirements. Prefer the consent tooling available through AdSense Privacy & messaging when it satisfies the production setup.

Do not hard-code a fake consent banner. Required consent choices must be presented before advertising/storage technologies that depend on those choices are activated.

Activation sequence:

`AdSense review/approval → Privacy & messaging/CMP configuration → verify regional consent behavior → production AdSense tag → production placement v1 → mobile/tablet/desktop regression QC`

## 6. Search Console

Connect after the custom domain is live and canonical URLs/sitemap are final.

## 7. Analytics

Start lean.

Preferred:
- Search Console for SEO performance
- Cloudflare Web Analytics or one analytics platform, not multiple overlapping trackers

Add GA4 only if its event/reporting depth is actually needed.

## 8. Affiliate programs

Contextual only.

Candidate mapping:
- hosting/server: Cloudways, Kinsta, Hostinger
- VPN/network/privacy: NordVPN, Surfshark
- security: Bitdefender
- webmaster/technical SEO: Semrush

Before activation verify current:
- payout
- recurring commission
- cookie window
- allowed traffic sources
- brand-bidding rules
- geography
- reversal/refund rules

Use `rel="sponsored"` and a visible disclosure near the recommendation.

## 9. Production comments upgrade

If Giscus becomes too restrictive for non-developer visitors:

```
GitHub Pages frontend
        ↓
Cloudflare Worker API
        ↓
D1
        ↓
Turnstile
        ↓
Moderation queue
```

This should become the first-party discussion layer only after traffic justifies the engineering overhead.
