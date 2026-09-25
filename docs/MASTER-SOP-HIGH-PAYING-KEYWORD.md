# MASTER SOP — HIGH PAYING KEYWORD
## ErrorHarbor SEO, Reader-First UX, Internal-Link Graph & Monetization Framework

**Version:** 2.0  
**Status:** ACTIVE  
**Effective:** 2026-09-25

> **North Star:** ErrorHarbor should be the fastest, clearest and most trustworthy place to diagnose a technical error. Every new page must improve both the reader's troubleshooting path and the site's topical-link graph.

---

## 1. Pre-Publish Opportunity Score — MOS

| Factor | Weight |
|---|---:|
| SERP Weakness | 30% |
| CPC / Commercial Value | 25% |
| Ranking Probability | 20% |
| Search Demand | 15% |
| Topical Fit | 10% |

**Rules**
- SERP weakness remains the gatekeeper.
- CPC is a multiplier, not a reason to publish a weak or off-topic page.
- Prefer exact errors, codes, failed commands and reproducible symptoms.
- Do not publish a new URL when an existing canonical page can satisfy the same intent.

### Mandatory SERP reconnaissance before drafting
For every P1/P2 article:
1. Search the exact error and 2–5 close variants.
2. Inspect the dominant SERP intent: troubleshooting page, vendor doc, forum, video, Q&A, etc.
3. Identify what the current SERP leaves unanswered: environment split, verification, safer order, newer version behavior, incomplete diagnosis, or weak trust.
4. Identify the likely snippet answer in the first 100–150 words.
5. Check cannibalization against every existing ErrorHarbor URL.
6. Record the target cluster and parent hub before writing.

No article is approved because a keyword tool looks attractive alone.

---

## 2. Article Quality Score — AQS

| Factor | Weight |
|---|---:|
| Intent match | 20 |
| Diagnostic usefulness | 20 |
| Accuracy / safety | 20 |
| Reader UX | 15 |
| Verification clarity | 10 |
| Original value over SERP | 10 |
| Community readiness | 5 |

**AQS < 80 → do not publish as P1.**

A high AQS requires a complete troubleshooting journey, not a long article.

---

## 3. Reader-First Article Standard

Every core troubleshooting page should normally contain:

1. Exact error/query language in the H1.
2. One-paragraph answer/meaning near the top.
3. Error fingerprint: “You’re likely in the right place if…”
4. Product/environment/version context.
5. **Choose your path** block when multiple root causes are plausible.
6. Quick Check or Quick Fix above monetization.
7. Explicit **Verify** instruction after every meaningful fix.
8. Diagnostic flow ordered from safest / most probable / most reversible.
9. Fix #2 / Fix #3 only when materially distinct.
10. “What not to do” when risky or common bad advice exists.
11. “Still seeing the error?” with the next diagnostic branch.
12. Evidence-to-capture checklist before escalation.
13. Official references / first-party documentation where available.
14. Related troubleshooting links.
15. Community/Giscus layer.

### Reader-first writing rules
- Answer the visitor's immediate question before background theory.
- Use the exact UI labels, commands and error wording when useful.
- Explain what a command changes before the user runs it.
- Separate **diagnostic checks** from **actual fixes**.
- Never imply a fix was tested if it was only derived from documentation.
- Never invent success rates, user counts, community proof or “worked for X%”.
- Avoid generic filler sections that do not change the user's next action.

---

## 4. Trust Standard

A production guide should make it easy for a reader to judge whether to trust it.

Minimum trust signals:
- “Applies to” environment/version context.
- Last-reviewed date.
- Risk level.
- At least 1 authoritative source; prefer 2+ when the topic is version-sensitive or safety-sensitive.
- Clear distinction between official documentation, first-party community evidence and inference.
- Safe rollback / reversal guidance when configuration changes are involved.
- Explicit escalation evidence list for unresolved cases.

For security, system, networking and virtualization changes:
- do not recommend globally disabling protection as the first fix;
- do not recommend unofficial binaries/DLLs;
- preserve least privilege;
- prefer reversible diagnosis before configuration changes.

---

## 5. Mandatory Internal-Link Publication Contract

**A new article is not considered published until every item below is true in the same release.**

### A. Homepage freshness link
Every new article must be linked from the homepage **New troubleshooting guides** section.

- Homepage keeps the latest **8** article URLs.
- A page normally remains there until displaced by newer articles.
- “New” is a freshness/navigation label, not a ranking claim.
- Older pages remain discoverable through hubs, related links, search and sitemap.

### B. Parent hub
Every article must have one declared parent hub in `data/search-index.json`.

Examples:
- JavaScript / Android / SDK → `/errors/dev/`
- VMware / Hyper-V → `/errors/virtualization/`
- TeamViewer / network → `/errors/windows-network/`

The hub must link to the child article.

### C. Sibling links
Every article should link to at least **2 semantically relevant internal destinations**:
- closest sibling article(s);
- then parent hub when a second strong sibling does not exist.

Do not create irrelevant links merely to hit a count.

### D. Backlink reinforcement
When a new article creates a natural relationship with an existing article, update at least one existing page to link back to the new article.

Examples:
- `ReferenceError is not defined` ↔ `TypeError is not a function`
- `Android SDK location not found` ↔ `com.android.application plugin not found`
- Hyper-V article ↔ VMware article

### E. No orphan URLs
Every indexable article must be discoverable through:
- sitemap;
- parent hub;
- and at least one additional internal-link surface (homepage latest or sibling page).

---

## 6. Homepage SEO / Freshness Architecture

Homepage has three distinct crawl surfaces:

1. **Featured exact-error guides** — durable flagship pages.
2. **New troubleshooting guides** — latest 8 publication URLs.
3. **Error Library** — cluster/hub discovery.

The homepage Latest section must be updated in the same commit as new articles.

Homepage structured data:
- `WebSite`
- `ItemList` for the current latest guides

Do not turn the homepage into a long archive. The hub system owns long-term navigation.

---

## 7. Hub / Cluster Architecture

A hub exists to help both readers and crawlers understand a troubleshooting family.

### Hub rules
- meaningful title + description;
- links only to live pages;
- no “Coming Soon” blocks;
- no duplicate thin tag pages;
- `CollectionPage` schema when indexable;
- child pages inherit the hub in breadcrumbs.

### Indexability gate
A thin hub can remain `noindex,follow` until it has enough substantive child pages and clear browsing value.

Baseline:
- 1 article → keep noindex;
- 2 articles → review for thin/Soft-404 risk;
- 3+ strong child pages → eligible for indexability review, not automatic approval.

A prior Google Soft-404 signal overrides the numeric threshold until the hub has materially improved.

---

## 8. SERP Architecture v2

Every indexable article must ship with:

- self-referencing canonical;
- indexable robots state;
- unique title;
- unique meta description;
- Open Graph URL/title/description;
- `Article` structured data;
- `BreadcrumbList` structured data;
- production hostname `https://errorharbor.com/`;
- sitemap entry;
- parent-hub link;
- homepage/latest link while current;
- related internal links.

### Title / snippet principles
- Put the exact error/query early.
- Use the second half of the title to promise the diagnostic angle, not clickbait.
- Meta description should state the likely meaning + first useful branch.
- First paragraph should satisfy “What does this mean / what should I check first?”
- Use H2s that reflect real decision points, not generic “Introduction / Conclusion”.

### Featured snippet / answer-block readiness
Where appropriate:
- short definition in 1–2 sentences;
- concise ordered steps;
- explicit command + expected output;
- comparison tables only when they clarify a decision;
- visible FAQs only when they answer genuine recurring sub-intents.

**Do not add FAQPage schema to generic boilerplate FAQs.**

---

## 9. Search Index Registry

`data/search-index.json` is both the on-site search source and the publication registry.

Each article entry must include:
- `kind: "article"`
- `published`
- `publish_order`
- `cluster`
- `hub`
- `summary`
- title / URL / product / type / keyword aliases

New content is incomplete until this registry is updated.

---

## 10. Mechanical Publish Gate

The repository contains a publish validator.

It must verify:
- article file exists;
- canonical matches production URL;
- indexable article is not `noindex`;
- sitemap contains the URL;
- declared hub exists and links to the article;
- related section has useful internal links;
- latest 8 articles are linked from homepage;
- no current article becomes orphaned.

A failed gate means **do not call the batch production-ready**.

---

## 11. Engagement & Community

Each meaningful fix may ask:
- Yes, fixed
- No, continue

When enough real server-side data exists:

`Solved Rate = Yes responses / Valid feedback responses`

Never fabricate solved rates.

Community comments are diagnostic research:
- fix confirmation;
- new environment/version;
- additional root cause;
- wording of real user errors;
- new article/variant opportunity.

A community suggestion becomes “Verified Community Fix” only after review/reproduction or strong corroboration.

---

## 12. Post-Publish Search Console Loop

### Day 0
- sitemap updated;
- new article live;
- live URL test if needed;
- manual request indexing only for priority pages.

### Day 3–7
Review:
- discovered / crawled / indexed state;
- first impressions;
- queries Google associates with the page;
- canonical selection;
- Soft-404 or duplicate signals.

### Day 14
- refine title/meta only if query alignment or CTR evidence warrants it;
- strengthen internal links for pages Google is discovering but not valuing;
- merge/split only when intent evidence supports it.

### Day 28+
- evaluate page/cluster by real search data;
- watch query cannibalization;
- scale the cluster showing the best mix of impressions, ranking progress, reader success and monetization potential.

Do not rewrite pages daily while Google is still discovering them.

---

## 13. Post-Publish RVS

| Factor | Weight |
|---|---:|
| Actual Revenue Density / RPM | 35% |
| Organic Growth | 20% |
| Ranking Strength | 15% |
| US Traffic Quality | 10% |
| Expansion Potential | 10% |
| Engagement / Problem Resolution | 10% |

Real GSC, solved-rate and monetization data override keyword-tool assumptions once enough data exists.

---

## 14. Affiliate Rules

Affiliate recommendations are contextual only.

Preferred:
- after real troubleshooting value;
- maximum roughly 1 block for short/medium pages, 2 for long pages;
- visually separated from technical instructions;
- clear disclosure;
- `rel="sponsored"`.

A high payout never overrides relevance, safety or reader trust.

---

## 15. Monetization Quality Rule

> **Maximize Revenue Density without materially reducing Solved Rate, trust or problem-resolution speed.**

No ads before the first useful check/fix.

Protected zones:
- H1 / fingerprint;
- Quick Check / Quick Fix;
- commands and warnings;
- diagnostic decision tree;
- verification;
- feedback;
- search and comments.

---

## 16. Non-Negotiables

1. Reader success before page length.
2. SERP weakness before CPC excitement.
3. Exact intent before broad traffic.
4. One canonical page beats cannibalization.
5. Cluster authority beats random keyword chasing.
6. Every fix needs a verification state.
7. Every new article must join homepage + hub + sibling link graph.
8. No orphan pages.
9. No fabricated testing, solved rates or community proof.
10. No mass-published templated troubleshooting.
11. No ads obstructing the first useful action.
12. Scale only clusters that combine search traction, reader success and monetization quality.
