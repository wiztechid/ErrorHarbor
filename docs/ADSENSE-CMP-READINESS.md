# ErrorHarbor — AdSense CMP Readiness

Status: PREPARED / ADS INACTIVE
Updated: 2026-09-26

## Production rule
Do not add or activate AdSense ad tags merely to simulate readiness. Advertising and consent activation happens only after the AdSense site/account workflow is ready and the selected CMP configuration is published.

## Planned consent architecture
1. Use Google Privacy & messaging (Google CMP) or another Google-certified CMP.
2. For EEA, UK and Switzerland traffic, use a Google-certified CMP integrated with IAB TCF where required for Google advertising.
3. Configure the consent message and the site's ad-technology providers in the AdSense account.
4. Provide the CMP's privacy-options / consent-revocation control where required.
5. Do not build a cosmetic custom cookie banner that claims to control Google advertising without actually passing the required consent signals.
6. Test consent choices before enabling production ads: initial choice, reject/decline where offered, consent, reopen privacy options, and regional behavior.
7. Re-audit Privacy Policy whenever advertising, analytics, CMP, community or affiliate infrastructure materially changes.

## Current repository state
- Privacy Policy contains explicit future Google AdSense disclosure, cookie/web-beacon/IP/identifier disclosure, Google partner-sites link and regional CMP intent.
- Terms, Disclaimer and Affiliate Disclosure use consistent advertising/editorial-separation language.
- Contact for privacy/corrections: info@errorharbor.com.
- No AdSense ad tag should be added by this readiness document.
- ads.txt must use the real publisher ID supplied by the user's AdSense account; never guess or use a placeholder in production.

## Activation gate
Before production activation verify:
- AdSense publisher/site status is ready for the next integration step.
- Real publisher ID is known and ads.txt is correct.
- Selected CMP is Google-certified for the traffic/use case.
- Consent/revocation UI works.
- Privacy Policy reflects the actual active stack, not merely planned services.
- Ad placement does not imitate navigation, downloads, commands, warnings or other site controls.
- Final mobile/tablet/desktop regression and policy QC passes.
