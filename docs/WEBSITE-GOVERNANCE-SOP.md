# WEBSITE GOVERNANCE SOP
## Universal Content, SEO, UX, Trust, Publication & Monetization Governance

**Version:** 1.0  
**Status:** ACTIVE BASELINE  
**Effective:** 2026-09-27  
**Reference implementation:** ErrorHarbor  
**Scope:** Reusable across content websites, tools, editorial libraries, niche sites and future GitHub-hosted properties.

> **North Star:** Every public URL must have a clear user purpose, distinct value, trustworthy evidence, a valid place in the site architecture, and a controlled lifecycle from discovery to update or retirement. Traffic and monetization are outcomes of usefulness—not substitutes for it.

---

## 0. Purpose and Governance Model

This SOP is the universal governance layer for websites operated under the same publishing discipline.

It is intentionally **site-agnostic**. A site's niche-specific master SOP may add stricter requirements, but it must not silently weaken this baseline.

Governance hierarchy:

```text
WEBSITE-GOVERNANCE-SOP.md
        ↓
Site-specific Master SOP / Editorial Standard
        ↓
SEO / Content / Tool / Monetization overlays
        ↓
CURRENT.md
        ↓
CHANGELOG.md
        ↓
Automated validators + deployment + live QC
```

### Rule precedence

1. Legal, platform and safety requirements.
2. Website Governance SOP.
3. Site-specific master SOP.
4. Page/template-specific rules.
5. Temporary experiment rules.

A lower layer may be **stricter**, but not weaker, unless the exception is explicitly documented with reason, scope, owner, date and rollback condition.

---

# 1. Core Governance Principles

These rules are non-negotiable across sites.

1. **Reader/user value before traffic.**
2. **Intent before keyword volume.**
3. **Evidence before assertion.**
4. **One canonical intent before multiple competing URLs.**
5. **Distinct substance before scaling.**
6. **Architecture before URL count.**
7. **Useful first action before monetization.**
8. **Verification before declaring a workflow complete.**
9. **Live production state before claiming deployment success.**
10. **Measured data before optimization.**
11. **Transparent uncertainty before fabricated confidence.**
12. **Update, merge or retire when a URL no longer deserves to exist.**

---

# 2. Universal Website Lifecycle

Every meaningful content or product surface follows:

```text
OPPORTUNITY
→ EVIDENCE
→ INTENT
→ CANNIBALIZATION CHECK
→ CONTENT / PRODUCT DESIGN
→ READER-FIRST QC
→ SEO / DISCOVERY ARCHITECTURE
→ INTERNAL GRAPH
→ PUBLICATION GATE
→ DEPLOYMENT
→ LIVE QC
→ SEARCH / USER DATA
→ UPDATE / MERGE / RETIRE
→ CHANGELOG
```

No stage should be skipped merely because content can be generated or deployed quickly.

---

# 3. Opportunity Gate

Before creating a new indexable URL, define:

- target user;
- exact problem/question/job-to-be-done;
- search or discovery intent;
- evidence that the need exists;
- current competing answers or alternatives;
- the gap the new page will fill;
- parent topic/hub;
- likely related pages;
- why this requires a new URL rather than improving an existing one.

### Decision

Every candidate must end in one of four states:

- **GO** — distinct need and meaningful value gap;
- **HOLD** — promising but evidence or scope is incomplete;
- **MERGE** — existing canonical page should absorb the intent;
- **SKIP** — weak, duplicate, obsolete, unsafe or strategically irrelevant.

A keyword, trend, CPC value, competitor page or AI suggestion alone is not sufficient reason to publish.

---

# 4. Evidence & Research Standard

Claims must be supported at the level appropriate to their consequence.

Preferred evidence order:

1. authoritative / first-party source;
2. primary data or official documentation;
3. credible specialist source;
4. corroborated community evidence;
5. clearly labeled editorial inference.

### Mandatory rules

- Do not invent facts, tests, user outcomes, quotes, statistics, dates or consensus.
- Do not claim first-hand testing unless testing actually occurred.
- Separate documented facts from inference.
- Record version/date/context for information that can become stale.
- For consequential advice, prefer reversible and lower-risk actions first.
- Re-check time-sensitive claims before publication or material updates.
- Never use AI-generated text as the sole authority for a factual claim.

---

# 5. Intent Ownership & Cannibalization Guard

Each indexable URL must own a distinct primary intent.

Before publishing:

- compare the candidate with the current corpus;
- compare title/H1/query target;
- compare the user's expected answer;
- compare the recommended action or outcome;
- check whether two URLs would reasonably compete for the same query.

### Merge rule

If two pages answer substantially the same intent, prefer:

```text
stronger canonical page
+ expanded coverage
+ redirects/canonical cleanup when needed
```

over maintaining two weak competing pages.

Wording variants are not automatically separate intents.

---

# 6. Content Value & Mass-Scale Guard

Shared design systems, components and editorial structures are allowed.

**Cloned substance is not.**

Every indexable page must contain a page-specific value layer such as:

- original diagnosis or decision logic;
- unique explanation;
- current evidence synthesis;
- useful calculation/tool;
- comparison framework;
- first-party data;
- structured workflow;
- problem-specific examples;
- meaningful local/domain expertise;
- verification or next-step guidance.

### Prohibited scaling pattern

Do not mass-publish pages where the primary change is only:

- keyword;
- city/product/error/version name;
- superficial intro;
- reordered generic advice;
- generated FAQ filler;
- template variables without distinct reasoning.

If the page's unique value cannot be stated in one clear sentence, **HOLD / MERGE / SKIP**.

Fewer strong pages are preferable to a larger low-value corpus.

---

# 7. Reader-First Standard

A page must help the user before asking the user to navigate, convert or view monetization.

The first screen / opening section should normally establish:

- what the page is about;
- whether the user is in the right place;
- the direct answer or first useful action;
- essential context or limitations.

### Reader-first rules

- Put the answer before background history.
- Use headings that represent real decisions/questions.
- Remove filler that does not change understanding or next action.
- Explain risks before consequential actions.
- Make verification explicit where the page asks the user to do something.
- Provide a useful unresolved/next-step path where appropriate.
- Use tables only when they clarify a decision.
- Use FAQs only for genuine recurring sub-intents.
- Never pad pages to reach an arbitrary word count.

---

# 8. Trust & Editorial Integrity

Every production site should expose sufficient trust information for a reasonable visitor to understand who/what the site is, how content is produced and how issues can be corrected.

Baseline trust layer where applicable:

- About;
- Contact;
- Privacy Policy;
- Terms;
- Disclaimer;
- Editorial Methodology;
- Corrections mechanism;
- Affiliate Disclosure when affiliate monetization exists.

### Editorial integrity

- Advertising must not determine factual conclusions.
- Affiliate payout must not determine recommendations.
- Sponsored relationships must be disclosed.
- Material corrections should be visible or logged where appropriate.
- AI assistance may accelerate research, drafting or QA, but it does not replace evidence, editorial judgment or verification.
- Never fabricate authorship, expertise, testing or community validation.

---

# 9. SEO Architecture Baseline

Every indexable page should normally have:

- one clear primary intent;
- unique title;
- unique meta description;
- one primary H1;
- self-referencing canonical;
- correct robots/indexability state;
- production hostname;
- sitemap membership;
- valid Open Graph metadata where social sharing matters;
- appropriate structured data;
- parent/hub relationship;
- useful internal links;
- at least one meaningful inbound discovery path.

### Structured data

Use schema because it accurately describes visible content—not because a schema type exists.

Do not create:
- invisible FAQ content only for schema;
- misleading ratings;
- fabricated authors;
- unsupported review data;
- structured data inconsistent with the visible page.

---

# 10. Internal-Link Graph Contract

Every indexable page must belong to the site graph.

Preferred model:

```text
Homepage
→ Primary section / library
→ Hub / category
→ Page
→ Related page(s)
```

### No-orphan rule

An indexable page should be discoverable through:

1. sitemap;
2. parent/hub or equivalent durable navigation;
3. at least one additional relevant internal discovery surface.

New pages should create reciprocal/contextual reinforcement when a real relationship exists.

Do not add irrelevant links merely to satisfy a numeric quota.

Anchor text should describe the destination's purpose.

---

# 11. Hub / Category Governance

A hub exists for users, not merely to create an SEO URL.

An indexable hub should provide:

- clear topic definition;
- meaningful browsing value;
- live child content;
- unique summary/context;
- coherent taxonomy.

Thin, empty or placeholder hubs should remain non-indexable until useful.

Never expose "Coming Soon" collections as if they were mature content libraries.

---

# 12. Internal Search / Registry Parity

If a site maintains an internal search index, content registry or content manifest, it becomes part of publication governance.

All major public hubs and indexable content expected to be discoverable through internal search must be registered.

A new page is incomplete if:

- it is live but absent from required search/registry data;
- its metadata is stale;
- its parent mapping is missing;
- the registry points to a dead URL.

Where practical, automated publication checks should enforce registry parity.

---

# 13. Atomic Publication Contract

A publication is an **atomic release**, not merely a new HTML/Markdown file.

Update together where applicable:

1. page/content file;
2. content/search registry;
3. parent hub;
4. homepage freshness surface;
5. related links;
6. relevant backlink from existing content;
7. sitemap;
8. canonical/OG/schema metadata;
9. CURRENT/status documentation;
10. CHANGELOG;
11. validator expectations/tests.

### Definition of published

```text
source committed
+ validator PASS
+ deployment PASS
+ public URL live
+ live QC PASS
= PUBLISHED
```

A source commit alone is not a completed publication.

---

# 14. Mechanical Publication Gate

Automate what can be objectively checked.

Recommended validator coverage:

- expected file exists;
- canonical matches production URL;
- indexable content is not accidentally `noindex`;
- sitemap contains the canonical URL;
- sitemap is valid;
- parent hub exists;
- hub links to child;
- required internal registry contains the page;
- related/internal links resolve;
- homepage freshness module is synchronized when used;
- no orphan indexable pages;
- no placeholder production content;
- required metadata/schema exists;
- site-specific mandatory surfaces are synchronized.

A validator PASS proves mechanical consistency, not editorial quality.

---

# 15. Live QC Gate

After deployment, verify the public site—not only repository source.

Minimum live checks:

- HTTP availability;
- rendered content;
- mobile readability;
- canonical;
- robots/indexability;
- title/meta/H1;
- structured-data parity;
- internal links;
- navigation;
- assets;
- forms/tools where present;
- overflow/layout regressions;
- accidental staging text;
- monetization state;
- consent state;
- obvious thin/Soft-404 behavior.

A release that fails live QC is not complete.

---

# 16. Search & Discovery Feedback Loop

After publication, use real data to improve decisions.

Useful signals:

- Search Console impressions/queries;
- indexing/canonical status;
- CTR;
- ranking movement;
- internal-search terms;
- user feedback;
- tool completion;
- conversions where relevant;
- engagement/problem-resolution signals;
- revenue only after sufficient traffic.

### Optimization rules

- impressions + weak rank → inspect intent/depth/internal graph;
- good rank + weak CTR → inspect title/snippet alignment;
- multiple URLs for same query → cannibalization review;
- Soft 404 → deepen, merge or noindex;
- unexpected query family → evaluate as a new opportunity;
- do not rewrite pages daily while search systems are still discovering them.

Real user/search data should progressively override pre-publication assumptions.

---

# 17. Update / Merge / Retire Lifecycle

Every URL should remain useful enough to justify maintenance.

### UPDATE when
- facts/version/process changed;
- query intent evolved;
- evidence improved;
- page has traction but incomplete coverage;
- internal links or UX can materially improve the outcome.

### MERGE when
- two URLs substantially overlap;
- one canonical can serve both intents better;
- thin variants are fragmenting authority.

### RETIRE / NOINDEX / REDIRECT when
- intent is obsolete;
- content is no longer trustworthy;
- the page cannot provide standalone value;
- a stronger canonical replacement exists;
- the page creates persistent duplication or Soft-404 risk.

Do not preserve weak URLs solely because they already exist.

---

# 18. Monetization Governance

Monetization is an overlay on useful content, not the content architecture.

### Universal rules

- no monetization before the first useful answer/action when it would delay or obscure user value;
- do not imitate navigation, download buttons, controls or warnings;
- separate ads/affiliate modules visually from editorial actions;
- do not place monetization where accidental interaction is likely;
- do not compromise mobile usability;
- disclose affiliate/sponsored relationships;
- do not let commercial payout override relevance or safety.

Protected interaction zones normally include:

- primary answer/action;
- code/copy controls;
- warnings;
- forms;
- verification controls;
- feedback controls;
- navigation/search;
- community/comment input.

---

# 19. AdSense / Advertising Readiness Overlay

This section applies only to sites using or preparing for Google AdSense or comparable advertising.

Advertising readiness is a **corpus-level quality gate**.

Recommended sequence:

1. Publisher Identity & Trust
2. Content Value / Low-Value / Scaled-Content Risk
3. Crawl Graph / Navigation / Dead Ends
4. Ad Placement / UX / Accidental-Click Risk
5. Privacy / Consent / Implementation Readiness
6. Final Submission Readiness

### Pre-approval state

Prefer:
- useful site fully live;
- trust/legal pages complete;
- real publisher identity/configuration only;
- ads.txt correct when required;
- staged ad placeholders hidden;
- production ad code intentionally controlled.

Never:
- guess publisher IDs;
- fake a consent banner;
- activate ads merely to look "ready";
- make ads the primary navigation surface;
- assume a readiness PASS guarantees platform approval.

### Consent

Consent implementation must reflect the actual active advertising/analytics stack and applicable regional requirements.

For Google advertising, use the supported Google Privacy & messaging / applicable certified consent architecture required for the site's traffic and configuration. Do not create cosmetic consent UI that does not actually control dependent technologies.

---

# 20. Affiliate Governance

Affiliate links are contextual recommendations, not filler inventory.

Require:

- clear relevance;
- useful editorial context before the recommendation;
- visible disclosure;
- appropriate sponsored link attributes;
- current program/offer verification before making material claims.

Avoid:
- unrelated affiliate blocks;
- false scarcity;
- invented discounts;
- recommendations based only on commission;
- placing affiliate CTAs where they can be mistaken for required workflow steps.

---

# 21. Analytics & Data Minimalism

Collect only data that supports a defined decision.

Prefer a lean measurement stack.

Before adding a tracker, define:

- what question it answers;
- what decision it changes;
- privacy/consent impact;
- performance cost;
- whether existing tools already provide the signal.

Do not stack multiple analytics products without a clear reason.

---

# 22. AI-Assisted Publishing Governance

AI may assist with:

- opportunity discovery;
- research organization;
- drafting;
- editing;
- metadata;
- internal-link suggestions;
- code generation;
- QA;
- corpus audits.

AI must not be treated as independent evidence.

### Mandatory AI safeguards

- verify factual claims;
- verify current/version-sensitive information;
- inspect generated links/references;
- check page-specific substance;
- run cannibalization review;
- remove generic filler;
- ensure no fabricated testing, metrics or quotes;
- inspect the live rendered result;
- do not mass-publish unreviewed generated pages.

The relevant question is not "Was AI used?" but:

**"Does this page provide accurate, distinct, useful, accountable value?"**

---

# 23. Security & Operational Safety

- Never commit secrets, API keys or private credentials.
- Use environment/secret management for sensitive values.
- Do not expose private user data in public repositories.
- Validate third-party scripts before production use.
- Minimize dependencies where a static/first-party solution is sufficient.
- Keep rollback possible for major releases.
- Treat external embeds, analytics, ads, comments and forms as separate risk surfaces.
- Re-audit privacy/security when the active third-party stack changes.

---

# 24. CURRENT.md Standard

Each maintained site should have a concise current-state record.

Recommended fields:

- current production state;
- active architecture/SOP version;
- corpus/page count where useful;
- latest completed QC;
- known blockers;
- intentionally inactive features;
- next allowed action;
- freeze/hold status;
- major external-service state.

CURRENT is the operational truth.

Do not use old chat history as the only record of production state.

---

# 25. CHANGELOG Standard

Material governance, architecture and production changes must be logged.

Record:

- date;
- version or affected system;
- what changed;
- why;
- evidence/trigger;
- impact;
- migration/rollback note when relevant.

Do not silently change:

- publication gates;
- scoring systems;
- indexability policy;
- monetization rules;
- consent architecture;
- canonical ownership;
- content-quality thresholds.

---

# 26. Site-Specific Override Contract

Each site may maintain a local overlay, for example:

```text
docs/SITE-GOVERNANCE-OVERRIDES.md
```

An override should state:

- baseline rule being extended;
- site-specific requirement;
- reason;
- affected content types;
- validator impact;
- effective date.

Examples:

- bilingual/hreflang rules;
- troubleshooting verification requirements;
- calculator/tool validation;
- local-government/legal citation rules;
- health/YMYL review;
- product/affiliate shopping rules.

Overrides should normally **add rigor**, not create loopholes.

---

# 27. Governance Severity

Use a common issue severity language.

### P0 — Blocker
Could cause major legal, policy, security, indexability, trust or production failure.

**Action:** stop release.

### P1 — Must fix
Material user, SEO, factual, UX or architecture defect.

**Action:** fix before declaring the affected release complete.

### P2 — Improve
Meaningful but non-blocking consistency or optimization issue.

**Action:** schedule; fix immediately when cheap and durable.

### P3 — Polish
Cosmetic or low-impact refinement.

**Action:** batch with future maintenance.

A large number of P2/P3 issues may collectively become P1 if they create systemic low quality.

---

# 28. Release Status Vocabulary

Use explicit states:

- **DRAFT**
- **QC**
- **READY**
- **DEPLOYING**
- **LIVE**
- **HOLD**
- **FROZEN**
- **RETIRED**

Do not use "done" when only source work is complete.

### FROZEN

A frozen site/content batch means:

- no unnecessary structural/content churn;
- only P0/P1 fixes, required platform actions or explicitly approved changes;
- preserve a stable review/indexing/approval state;
- resume scaling only after the relevant external or governance gate clears.

---

# 29. Universal Final Publication Checklist

Before declaring an indexable page complete:

- [ ] user intent is explicit;
- [ ] distinct value/moat is explicit;
- [ ] evidence is adequate/current;
- [ ] cannibalization checked;
- [ ] reader receives useful value early;
- [ ] claims/risks/limitations are accurate;
- [ ] title/meta/H1/canonical/indexability are correct;
- [ ] structured data matches visible content;
- [ ] sitemap updated;
- [ ] parent/hub updated;
- [ ] internal registry/search updated where used;
- [ ] related/internal links are useful;
- [ ] inbound discovery exists;
- [ ] monetization does not obstruct the task;
- [ ] validator passes;
- [ ] deployment passes;
- [ ] live QC passes;
- [ ] CURRENT/CHANGELOG updated when material.

If a mandatory item fails, the page is not fully published.

---

# 30. Universal Corpus-Level QC

Page-level quality is necessary but insufficient.

Periodically audit the whole corpus for:

- duplicate intent;
- thin pages;
- mass-template appearance;
- stale facts;
- broken links;
- orphan pages;
- inconsistent metadata;
- sitemap/registry mismatch;
- hub quality;
- internal-search parity;
- trust/legal consistency;
- ad/affiliate UX;
- consent/privacy parity;
- mobile regressions;
- dead third-party integrations;
- indexability drift.

Corpus-level defects should be fixed at the system/template/validator level whenever possible, not repeatedly patched page by page.

---

# 31. Governance Improvement Rule

Every repeated defect should trigger the question:

**"Can this failure be prevented permanently by the SOP, template, registry or validator?"**

Preferred order:

```text
fix instance
→ identify pattern
→ update system rule
→ automate check where possible
→ record change
```

The goal is not merely to pass today's audit. The goal is to make the same class of defect harder to reintroduce.

---

# 32. Definition of a Healthy Website

A healthy site is not defined by article count.

It has:

- clear user purpose;
- distinct page intents;
- trustworthy content;
- coherent architecture;
- no orphan indexable pages;
- controlled publishing;
- live verification;
- transparent monetization;
- minimal policy risk;
- measurable user/search feedback;
- disciplined updates and retirement;
- documented operational state.

The durable loop is:

```text
USEFULNESS
→ TRUST
→ DISCOVERY
→ USER SUCCESS
→ DATA
→ BETTER DECISIONS
→ SUSTAINABLE MONETIZATION
```

---

## Appendix A — Reference Implementation: ErrorHarbor

ErrorHarbor is the originating reference implementation for v1.0.

Patterns generalized from ErrorHarbor include:

- reader-first content;
- distinct diagnostic moat;
- anti-mass-template safeguards;
- live SERP / evidence-led opportunity selection;
- one-intent-one-canonical discipline;
- homepage → library → hub → article graph;
- internal-search registry parity;
- atomic publication;
- mechanical publish gates;
- deployment + live QC;
- corpus-level AdSense readiness;
- protected first-useful-answer zones;
- controlled consent/advertising activation;
- CURRENT + CHANGELOG operational governance;
- freeze discipline during external review.

ErrorHarbor-specific values—publisher ID, error taxonomy, exact article structure, HPK scoring weights, troubleshooting-only requirements and service credentials—remain in ErrorHarbor's local SOPs and are **not universal defaults**.

---

## Appendix B — Minimum Files Recommended Per Site

```text
docs/
├── WEBSITE-GOVERNANCE-SOP.md
├── SITE-GOVERNANCE-OVERRIDES.md   # optional but recommended
├── CURRENT.md
├── SEO-ARCHITECTURE.md            # when architecture is non-trivial
├── MONETIZATION-READINESS.md       # when monetized
└── THIRD-PARTY-SETUP.md            # when external services exist

CHANGELOG.md
```

A small site may combine overlays, but it should still preserve a single authoritative governance baseline and a clear current-state record.
