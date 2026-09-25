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
