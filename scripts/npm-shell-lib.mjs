// ErrorHarbor npm-first article chrome v1. Never edit this to customize a single article.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export const REFERENCE = 'errors/dev/node-npm/npm-command-not-found/index.html';
export const REQUIRED_TRUST = ['/about/','/editorial-methodology/','/contact/','/privacy/','/terms/','/disclaimer/','/affiliate-disclosure/'];
export const SHA = x => crypto.createHash('sha256').update(x).digest('hex');
export const escapeHtml = x => String(x ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
export const getBlock = (html, tag, startingRegex) => {
  const match = startingRegex.exec(html);
  if(!match) throw Error(`NPM_SHELL_MISSING ${tag}: ${startingRegex}`);
  const start=match.index;
  const close=`</${tag}>`;
  const end=html.indexOf(close,start);
  if(end<0)throw Error(`NPM_SHELL_UNCLOSED ${tag}`);
  return html.slice(start,end+close.length);
};
// Article chrome has no nested header/footer/aside; the social-share has no nested section.
export const extractChrome = html => ({
  header:getBlock(html,'header',/<header\s+class="site-header">/i),
  share:getBlock(html,'section',/<section\s+class="social-share"/i),
  sidebar:getBlock(html,'aside',/<aside\s+class="(?:sidebar|toc)"/i),
  footer:getBlock(html,'footer',/<footer\s+class="site-footer">/i),
});
export const normalizeUrl = html => html
  .replaceAll('href="../../../../','href="/')
  .replaceAll('src="../../../../','src="/');
export const getArticle = html => getBlock(html,'article',/<article\s+class="article">/i);
export const tocLinks = (html) => [...html.matchAll(/<a\b[^>]*href=["']#([^"']+)["'][^>]*>[\s\S]*?<\/a>/gi)]
  .map(m=>({id:m[1], html:m[0]}));
export const getReferenceChrome = repo => {
  const canonical=fs.readFileSync(path.join(repo,REFERENCE),'utf8');
  const {header,share,sidebar,footer}=extractChrome(canonical);
  return {header:normalizeUrl(header),share,sidebar,footer:normalizeUrl(footer)};
};
export const allowedAnchor = (s,id) => new RegExp(`\\bid=["']${id.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}["']`).test(s);

export function canonicalHeader(repo){
 const {header}=getReferenceChrome(repo);
 return header.replace('for="header-search-npm"','for="header-search-article"')
  .replace('id="header-search-npm"','id="header-search-article"');
}
export function canonicalFooter(repo){return getReferenceChrome(repo).footer;}
export function canonicalShare(title,url,repo){
  const reference=getReferenceChrome(repo).share;
  const refTitle='npm Command Not Found: Check Node.js, npm and PATH';
  const refUrl='https://errorharbor.com/errors/dev/node-npm/npm-command-not-found/';
  // This reproduces npm's original social controls including accessibility labels.
  return reference
    .replaceAll(encodeURIComponent(refTitle),encodeURIComponent(title))
    .replaceAll(encodeURIComponent(refUrl),encodeURIComponent(url));
}
export function canonicalSidebar(originalSidebar,articleHtml,registryEntry){
 const links=tocLinks(originalSidebar);
 if(!links.length)throw Error(`NPM_SHELL_NO_TOC ${registryEntry.url}`);
 const ids=new Set([...articleHtml.matchAll(/\bid=["']([^"']+)["']/g)].map(x=>x[1]));
 const invalid=links.filter(x=>!ids.has(x.id));
 if(invalid.length)throw Error(`NPM_SHELL_BROKEN_TOC ${registryEntry.url}: ${invalid.map(x=>x.id).join(', ')}`);
 const linksHtml=links.map(x=>x.html.replace(/\s+class=["'][^"']*["']/g,'')).join('');
 const originalGuide=originalSidebar.match(/<div class="guide-details">[\s\S]*?<\/div>/i)?.[0];
 const iso = articleHtml.match(/"dateModified"\s*:\s*"(\d{4}-\d{2}-\d{2})"/)?.[1];
 // Old article-side metadata stays unchanged; these fallback fields are true registry fields.
 const guide=originalGuide||`<div class="guide-details"><span><b>Product</b>${escapeHtml(registryEntry.product)}</span><span><b>Category</b>${escapeHtml(registryEntry.type)}</span>${iso?`<span><b>Last reviewed</b>${escapeHtml(iso)}</span>`:''}<span><b>Scope</b>Exact-error troubleshooting</span></div>`;
 return `<aside class="sidebar"><div class="side-block"><h3>On this page</h3><nav class="toc" aria-label="Article table of contents">${linksHtml}</nav></div><div class="side-block"><h3>Guide details</h3>${guide}</div><div class="side-block ad-placeholder" style="margin:0">ADSENSE · desktop side rail</div></aside>`;
}
export function migrateOne(html,entry,repo){
 const chrome=extractChrome(html);
 const article=getArticle(html);
 const title=article.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g,'').replaceAll('&amp;','&').replaceAll('&quot;','"');
 if(!title)throw Error('Missing article title '+entry.url);
 const url='https://errorharbor.com/'+entry.url;
 const share=canonicalShare(title,url,repo);
 if(!share.includes(encodeURIComponent(url)))throw Error('Share URL not changed: '+entry.url);
 const sidebar=canonicalSidebar(chrome.sidebar,article,entry);
 let result=html.replace(chrome.header,canonicalHeader(repo))
   .replace(chrome.share,share)
   .replace(chrome.sidebar,sidebar)
   .replace(chrome.footer,canonicalFooter(repo));
 // Never rewrite editorial sections, H1, meta, JSON-LD, or article body: share is the only permitted inner-article substitution.
 if(getArticle(result).replace(share,'__SHARE__')!==article.replace(chrome.share,'__SHARE__'))throw Error('Editorial body mutation '+entry.url);
 if(!result.includes(`<link rel="canonical" href="${url}"`) && !result.includes(`href="${url}"`))throw Error('Canonical changed '+entry.url);
 return result;
}

export function referenceSignature(repo){
 const c=getReferenceChrome(repo);
 const parsed=c.sidebar;
 return {template:'npm-command-not-found',version:'1.0.0',reference:REFERENCE,
  header:SHA(canonicalHeader(repo)),footer:SHA(c.footer),
  shareSkeleton:SHA(c.share.replaceAll(encodeURIComponent('npm Command Not Found: Check Node.js, npm and PATH'),'{{TITLE}}').replaceAll(encodeURIComponent('https://errorharbor.com/errors/dev/node-npm/npm-command-not-found/'),'{{URL}}')),
  asideClass:parsed.includes('class="sidebar"')?'sidebar':'unknown'};
}

export function homepageChrome(home){
 // Only the latest-six card DATA and JSON-LD list are dynamic; all layout remains pinned.
 const schemaTag=/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i;
 const sm=schemaTag.exec(home);
 if(!sm)throw Error('Homepage structured-data block missing');
 const schema=JSON.parse(sm[1]);
 const itemList=schema['@graph']?.find(x=>x['@type']==='ItemList');
 if(!itemList || itemList.numberOfItems!==6 || itemList.itemListElement?.length!==6)throw Error('Homepage latest JSON-LD must contain six entries');
 const grid=/<div class="latest-grid">([\s\S]*?)<\/div>(?=\s*<div class="latest-more">)/.exec(home);
 if(!grid)throw Error('Homepage latest cards block missing');
 const cards=[...grid[1].matchAll(/<a class="latest-card" href="([^"]+)"><div class="latest-card-top"><span>([^<]+)<\/span><span class="new-badge">New<\/span><\/div><h3>([^<]+)<\/h3><p>([^<]+)<\/p><span class="latest-cta">Open guide →<\/span><\/a>/g)];
 if(cards.length!==6)throw Error('Homepage latest-six card chrome drift: expected six canonical cards');
 const covered=cards.map(m=>new URL(m[1],'https://errorharbor.com/').href);
 if(covered.some((v,i)=>v!==itemList.itemListElement[i].url))throw Error('Homepage latest schema/card URL mismatch');
 const modified=JSON.parse(JSON.stringify(schema));
 modified['@graph'].find(x=>x['@type']==='ItemList').itemListElement=['__LATEST_DYNAMIC__'];
 return {
  signature:home.replace(schemaTag,`<script type="application/ld+json">${JSON.stringify(modified)}</script>`)
    .replace(grid[0],'<div class="latest-grid">__LATEST_DYNAMIC__</div>'),
  urls:covered
 };
}
export function hubChrome(html){
 const m=/<main\b[^>]*>[\s\S]*?<\/main>/i.exec(html);
 if(!m)throw Error('Hub main missing');
 return html.replace(m[0],'<main>__HUB_ARTICLE_LINKS_DYNAMIC__</main>');
}
