# ErrorHarbor Email Opt-in Funnel

Status: Draft implementation plan — provider and affiliate IDs pending  
Updated: 2026-10-12

## Funnel

`Exact-error guide -> optional field-guide opt-in -> double opt-in -> ebook delivery -> practical follow-up emails -> contextual affiliate resource`

The article's promised troubleshooting answer stays complete and visible without a signup. The email offer is an optional next step for readers who want a reusable incident workflow. Email capture must not interrupt the quick fix, verification steps, safety warnings, or guide navigation.

## Lead magnet

**The First 10 Minutes After a Technical Error** is a short field guide for developers, IT teams, and self-hosters. It teaches readers to capture the exact signal, establish scope and environment, try one lower-risk check, verify the repair, and record a preventive follow-up.

The ebook preview is in `output/pdf/ErrorHarbor_First_10_Minutes_Field_Guide_DRAFT.pdf`. The distribution edition is blocked until ErrorHarbor has approved affiliate URLs and an email provider configured for consent confirmation, delivery, automation, and unsubscribe handling.

## Consent and list rules

The live form must:

1. Ask only for the email address unless a later use justifies another field.
2. State that the field guide is delivered by email and describe the optional follow-up tips/offers.
3. Use separate unchecked controls for (a) the one-time ebook delivery and (b) ongoing promotional emails. The ongoing-email box must not be preselected.
4. Record the form/source, timestamp, consent text/version, confirmation status, and unsubscribe status in the email platform.
5. Use double opt-in before placing a subscriber into the promotional sequence.
6. Provide a working unsubscribe link in every marketing email and honor it automatically.
7. Never import addresses from contacts, support inquiries, scraped pages, purchased lists, or unrelated brands.
8. Never send passwords, keys, logs, diagnostic text, or other troubleshooting data to the email provider.

The site must not claim that an email was collected until the provider confirms success. Add a privacy-policy section naming the selected provider, the collected fields, purpose, retention/deletion path, and subscriber rights before activating the form.

## Form placement

- One calm opt-in panel on the Error Library page and on a small number of relevant article pages after the useful answer/verification path.
- One standalone `/field-guide/` landing page for readers who choose the offer.
- No interruptive modal, full-screen takeover, auto-checked box, forced redirect, or content gate.
- The existing exact-error search and the troubleshooting article remain primary.

Suggested panel copy:

> **Want a repeatable way to handle the next technical error?**  
> Get the free *First 10 Minutes* field guide: capture the right evidence, choose a safer first check, and verify the fix. Optional practical troubleshooting emails are a separate choice.

Primary button: **Email me the free field guide**

## Email sequence

Only subscribers who explicitly select the ongoing-email option and complete double opt-in enter the follow-up sequence. Ebook delivery alone does not authorize promotional messages.

| Timing | Message | Purpose | Commercial rule |
|---|---|---|---|
| Immediately after confirmation | Your field guide is ready | Deliver the ebook and state why the reader is receiving it | No sales pitch |
| Day 2 | Capture the evidence before changing anything | Practical follow-up on exact errors, environment, scope, and redaction | No affiliate CTA |
| Day 5 | Protect the recovered state | Backup/restore testing and recovery planning | Only a directly relevant, clearly disclosed offer |
| Day 9 | Know when the repair fails again | Monitoring, certificates, and alerting | Explain who benefits and offer a no-cost/manual alternative where practical |
| Day 14 | A lightweight prevention checklist | Summarize the post-fix workflow and invite topic preferences | At most one or two relevant, approved offers; clear disclosure |

After the sequence, send occasional practical updates only to the active promotional segment. Keep frequency low and stop if the reader unsubscribes.

## Affiliate rules for email and ebook

- Use only partner-approved tracking links and follow each partner's rules for email traffic.
- A recommendation must solve a real post-problem task already covered by the guide: recovery, monitoring, credentials/certificates, or repeatable builds.
- Label each affiliate recommendation close to the link, e.g. **“Affiliate link: ErrorHarbor may earn a commission if you buy through this link.”**
- Explain why it fits, what it does not replace, and any important limitation. Do not imply that a paid tool is required to fix the original error.
- Link to a short ErrorHarbor resources page when an offer needs comparison or disclosure context; do not conceal or rewrite a partner URL in a way that violates program terms.
- No offer appears in every email by default. No affiliate link ships without approval, working destination, disclosure, and a useful non-commercial alternative.

## Suggested service requirements

Choose a provider that supports embedded forms, double opt-in, consent records, a lead-magnet automation, reliable unsubscribe suppression, export, and an affordable starter limit. Confirm that its current terms permit this editorial newsletter to include directly relevant affiliate links before signup or integration.

No service credential, sender identity, form ID, or affiliate tracking URL is stored in the public repository. Use the provider's secure dashboard or protected deployment secrets.

## Launch gate

- [ ] Email provider/account chosen; sender domain authenticated.
- [ ] Double opt-in and separate unchecked marketing consent configured.
- [ ] Privacy policy updated with the actual provider and retention/deletion details.
- [ ] Affiliate programs approved; links tested; partner email-use terms checked.
- [ ] Distribution ebook has no placeholder URLs and contains nearby disclosure.
- [ ] Signup, confirmation, duplicate signup, failed submission, delivery, unsubscribe, and re-subscribe paths tested.
- [ ] Search Console and site performance checked after the form is added.
- [ ] No email sent to any address that did not opt in and confirm.
