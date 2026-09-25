# ErrorHarbor — SEO Architecture v2

**Status:** Production standard  
**Effective:** 2026-09-25

## Crawl graph

```text
Homepage
├── Featured guides
├── Latest 8 guides
└── Error Library
    ├── Developer Errors
    │   ├── JavaScript
    │   ├── Android / Gradle
    │   ├── C / C++
    │   ├── Windows SDK
    │   ├── Hadoop / CLI
    │   └── SQL / Database
    ├── Windows & Network
    │   └── TeamViewer / network errors
    └── Virtualization
        ├── VMware
        └── Hyper-V
```

Each article links back through BreadcrumbList + parent hub and sideways through Related Troubleshooting.

## Opportunity discovery

SEO Architecture v2 is not tied to one keyword export. New URLs may originate from the HPK audit, live SERPs, GSC, recent vendor/support material, release notes, GitHub/issues, technical communities, on-site search and recurring error variants.

Before a URL is created, require:
`fresh/current applicability → live SERP gap → cannibalization check → parent cluster decision`.

A wording variant that shares the same search intent should reinforce the existing canonical page rather than create a competing URL.

## New-article atomic release

A content release must update together:

1. article HTML;
2. `data/search-index.json`;
3. parent hub;
4. homepage Latest Guides;
5. at least one relevant sibling backlink when available;
6. article Related Troubleshooting;
7. `sitemap.xml`;
8. canonical / OG / Article + Breadcrumb schema;
9. CURRENT + CHANGELOG;
10. publish-link validator.

The release is complete only after SEO Link Guard passes, Pages deployment succeeds, and the public URL passes live QC.

## Latest Guides

Homepage shows the latest 8 article entries by `publish_order`.

Purpose:
- immediate reader discovery;
- stronger crawl path to new URLs;
- faster integration of new pages into the site graph;
- visible site freshness without turning the homepage into an archive.

## Hub indexability

Do not index a category simply because it exists.

Review a hub for indexing only when:
- it has substantive child pages;
- it provides useful navigation/summary value;
- it no longer resembles an empty or Soft-404 page;
- title/description and internal links are unique.

## Internal-link quality

Use contextual links, not keyword stuffing.

Strong link:
> If Android Studio can find the plugin but not the SDK, see **Android SDK Location Not Found**.

Weak link:
> Click here for another article.

Anchor text should identify the problem the destination solves.

## SERP feedback loop

Search Console query data becomes the next content map:
- impression but low rank → strengthen topical depth / matching;
- good rank, low CTR → review title/snippet;
- multiple URLs for same query → cannibalization review;
- Soft 404 → noindex or materially deepen;
- unexpected query cluster → candidate supporting article.

## Success metric

The desired graph is not “more URLs”.

It is:

`search query → exact page → correct diagnostic path → verified outcome → useful next page if unresolved`


## Corpus parity gate

SEO Architecture v2 applies to the full live corpus, not only newly published pages.

The automated publish gate now checks every indexable article for:
- concise answer/lede and exact-error fingerprint;
- choose-your-path decision support;
- Quick Check/Fix and explicit verification;
- diagnostic flow plus a distinct next step;
- What not to do safety guidance;
- unresolved-case evidence checklist;
- authoritative references;
- related internal links and inbound discovery surfaces;
- canonical, Open Graph, Article + Breadcrumb structured data;
- unique title and meta description.

A legacy page that fails this contract must be upgraded before it is treated as SEO-v2 compliant.
