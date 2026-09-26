# Changelog

## 2026-09-23 — Foundation Build

- initialized ErrorHarbor repository
- implemented bright utility-first homepage
- added client-side error search
- added Error Library and initial topical hubs
- published three initial troubleshooting templates/guides
- added per-fix feedback UI
- staged Giscus/community area
- added legal and editorial trust pages
- added favicon, manifest and GitHub Pages static config
- added master SOP and third-party setup documentation


## 2026-09-23 — Giscus comments activated

- connected article community sections to GitHub Discussions via Giscus
- mapped discussions by pathname
- configured Announcements category
- enabled reactions and lazy-loaded comments


## 2026-09-23 — Giscus visual integration

- styled community section to match ErrorHarbor
- switched Giscus to noborder light theme
- added near-viewport script loading and iframe fallback
- added GitHub sign-in disclosure for commenters


## 2026-09-23 — Final Regression QC v2.1

- removed residual Coming Soon items from exposed hubs
- hid empty Windows hub from navigation/search until content exists
- corrected staging crawler policy for noindex handling


## 2026-09-25 — Production SEO cutover

- moved canonical host to https://errorharbor.com/
- removed staging noindex from indexable pages
- added canonical and Open Graph URL metadata
- normalized structured data and article breadcrumbs
- added production sitemap.xml and robots.txt
- updated manifest scope/start URL for the apex domain


## 2026-09-25 — HPK content scaling batch #1

- published five new developer-error guides grounded in Microsoft, MySQL, Apache Hadoop, Android and Gradle documentation
- expanded Developer Errors hub from 2 to 7 live guides
- added all new guides to client-side search and sitemap
- strengthened contextual internal links between command, database and build-error guides


## 2026-09-25 — Soft-404 guard for thin virtualization hub

- noindexed the one-article virtualization category page
- removed it from sitemap and search results
- preserved followable navigation and the indexable VMware article


## 2026-09-25 — HPK content scaling batch #2

- published five exact-error guides across JavaScript, Android, Hyper-V and TeamViewer
- expanded Developer Errors with three additional guides
- added Hyper-V content while retaining the virtualization hub noindex soft-404 guard
- activated the Windows & Network hub with a real TeamViewer guide while keeping the thin hub noindex
- added all five article URLs to search and sitemap
- strengthened contextual links between Android and virtualization guides


## 2026-09-25 — Reader-first trust QC for Batch #2

- expanded all five Batch #2 guides with decision paths, per-fix verification, safety boundaries and escalation evidence
- fixed unsafe/unescaped JavaScript script-tag example rendering
- added Android SDK environment/path guidance
- updated Hyper-V/VMware nuance for modern WHP coexistence
- added TeamViewer service-status and outbound-security guidance


## 2026-09-25 — SEO Architecture v2 + mandatory publication graph

- upgraded Master SOP from v1.3 to v2.0
- added mandatory homepage Latest Guides linkage for every new article
- added structured publication metadata to the search registry
- added homepage ItemList structured data for latest guides
- formalized hub + sibling + backlink internal-link rules
- added repository SEO publish validator and GitHub Actions link guard
- documented Search Console-driven SERP iteration and thin-hub indexability gates


## 2026-09-25 — Corpus-wide SEO Architecture v2 QC

- audited the full live article corpus against SEO Architecture v2
- upgraded eight legacy/Batch #1 pages to reader-first v2 parity
- added official-source trust layers to VMware, npm and SQL Server launch guides
- refreshed substantive review dates
- expanded SEO Link Guard to validate reader-path, safety, escalation, sources, OG/schema and metadata uniqueness


## 2026-09-25 — P0 MySQL intent rescope

- rescoped `mysql-failed-to-open-file-error-2` from broad MySQL Errcode 2 coverage to LOAD DATA / LOAD XML file-not-found troubleshooting
- retained the production URL/canonical while narrowing title, H1, snippet copy, environment scope and search-registry aliases
- reduced future cannibalization risk for unrelated MySQL Errcode 2 contexts


## 2026-09-26 — Windows SDK / SignTool cluster expansion — 2026-09-26

- published deep supporting guide: `'signtool' Is Not Recognized`
- separated command-resolution/PATH intent from the anchor `SignTool.exe Not Found` installation/discovery intent
- added shell vs exact-path vs session-PATH vs CI/CD decision flow with explicit verification
- reinforced two-way internal linking between the SignTool anchor and supporting guide
- added the new URL to Developer hub, homepage latest-8, search registry and sitemap
- grounded the guide in current Microsoft SignTool, Developer shell and MSIX CI/CD documentation


## 2026-09-26 — Article #38: LNK1104 C++ linker anchor

- published LNK1104 cannot-open-file as the second C++ guide
- built the article around filename-first diagnosis rather than a generic fix list
- added branches for locked EXE/PDB outputs, Microsoft and third-party libraries, project dependencies, quoted paths and file-access issues
- updated Developer hub, homepage latest-8 + ItemList, search registry, sitemap and C++ sibling backlink


## 2026-09-26 — Article #39: SQL Server Error 18456 authentication anchor

- published Error 18456 Login Failed for User around server-side Reason/State diagnosis
- separated credential, database, authentication-mode, Windows access, and Kerberos/ANONYMOUS LOGON branches
- added security-sensitive guardrails and escalation evidence
- updated Developer hub, homepage latest-8 + ItemList, search registry, sitemap, and SQL Server sibling backlink


## 2026-09-26 — Deep Reader-First QC #39

- added direct ERRORLOG and DBA-handoff paths for readers locked out of SQL Server
- separated database-related 18456 state evidence from client-facing Error 4064 intent
- hardened Mixed Mode, sa, restart, sysadmin and least-privilege guidance
- expanded Microsoft references for ERRORLOG, 4064 and authentication-mode security
