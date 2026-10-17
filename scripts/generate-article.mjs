import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {escapeHtml as esc, canonicalHeader, canonicalFooter, canonicalShare, canonicalSidebar} from './npm-shell-lib.mjs';

const [input, flag] = process.argv.slice(2);
if (flag && flag !== '--write') throw Error('Unknown option: '+flag);
if (!input) { console.error('Usage: node scripts/generate-article.mjs templates/article.json [--write]'); process.exit(2); }
const d = JSON.parse(fs.readFileSync(input, 'utf8'));
const required = ['slug','category','product','categoryName','categoryUrl','productName','title','description','published','reviewed','appliesTo','risk','quickAnswer','fingerprint','diagnosis','avoid','stillFailing'];
for (const key of required) if (typeof d[key] !== 'string' || !d[key].trim()) throw Error('Missing '+key);
if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(d.slug) || !/^[a-z0-9-]+$/.test(d.category) || !/^[a-z0-9-]+$/.test(d.product)) throw Error('Invalid path components');
if (!/^\d{4}-\d{2}-\d{2}$/.test(d.published) || !/^\d{4}-\d{2}-\d{2}$/.test(d.reviewed)) throw Error('Dates must be YYYY-MM-DD');
for (const date of [d.published,d.reviewed]) if (Number.isNaN(Date.parse(date)) || new Date(date).toISOString().slice(0,10)!==date) throw Error('Invalid calendar date: '+date);
if (d.reviewed < d.published) throw Error('Review date cannot precede publication');
if (!Array.isArray(d.fixes) || !d.fixes.length || !Array.isArray(d.references) || !d.references.length || !Array.isArray(d.related) || !d.related.length) throw Error('Fixes, references and related links required');
for (const fix of d.fixes) if (!fix.heading?.trim() || !fix.body?.trim() || !fix.verify?.trim()) throw Error('Each fix needs heading, body and verification');
for (const link of [...d.references,...d.related]) if (!link.label?.trim() || !link.url?.trim()) throw Error('Each link needs label and URL');
if (d.references.some(x => !x.url.startsWith('https://'))) throw Error('Authoritative references must use HTTPS');
// A leading slash followed by backslash may be interpreted as an external //host by URL parsers.
const relatedIsUnsafe=x => {
 try {
  if (typeof x.url!=='string' || !x.url.startsWith('/') || x.url.startsWith('//') || x.url.includes('\\')) return true;
  const u=new URL(x.url,'https://errorharbor.com/');
  return u.origin!=='https://errorharbor.com' || u.protocol!=='https:';
 } catch { return true; }
};
if (d.related.some(relatedIsUnsafe)) throw Error('Related links must be internal site-relative paths');
if (d.references.some(x => { try { const u=new URL(x.url); return u.protocol!=='https:' || !u.hostname; } catch { return true; } })) throw Error('Invalid reference URL');
if (!/^\/(?!\/)[a-z0-9\/-]+\/$/.test(d.categoryUrl)) throw Error('categoryUrl must be a safe site-relative directory');
const sourceRepo=path.resolve(fileURLToPath(new URL('../',import.meta.url)));
const articleUrl = 'https://errorharbor.com/errors/'+d.category+'/'+d.product+'/'+d.slug+'/';
const safeUrl = x => {
  if(typeof x!=='string' || /[\x00-\x1f\\]/.test(x))throw Error('Invalid URL');
  const u=new URL(x,articleUrl);
  if(!['https:','http:'].includes(u.protocol))throw Error('Unsafe URL');
  return esc(x);
};
const linkCards = (arr) => arr.map(x=>`<a href="${safeUrl(x.url)}" rel="${x.url.startsWith('http')?'noopener noreferrer':''}"><b>${esc(x.label)}</b><span>Open referenced guidance →</span></a>`).join('');
const sections = [];
function sec(id,label,markup){sections.push({id,label,markup});}
sec('fingerprint','Confirm the error fingerprint',`<section id="fingerprint" class="fingerprint"><div class="fingerprint-head">🎯 You’re likely in the right place if:</div><div class="checks"><span>${esc(d.fingerprint)}</span></div></section>`);
sec('quick-fix','First check',`<section id="quick-fix" class="quick"><div class="quick-title">🔎 First check — ${esc(d.fixes[0].heading)}</div><p>${esc(d.fixes[0].body)}</p><p class="verify-step"><b>Verify:</b> ${esc(d.fixes[0].verify)}</p></section>`);
sec('diagnose','Diagnostic flow',`<section id="diagnose" class="reader-path"><div class="reader-path-title">Choose the path that matches what you see</div><div class="reader-path-row"><b>Diagnose before changing settings</b><span>${esc(d.diagnosis)}</span></div></section>`);
for(let i=1;i<d.fixes.length;i++){
 const fix=d.fixes[i];
 sec('fix'+(i+1),`Fix #${i+1} — ${fix.heading}`,`<section id="fix${i+1}"><h2>Fix #${i+1} — ${esc(fix.heading)}</h2><p>${esc(fix.body)}</p><p class="verify-step"><b>Verify:</b> ${esc(fix.verify)}</p><div class="fix-feedback"><b>Did Fix #${i+1} work?</b><button type="button" data-feedback="yes" data-fix="${i+1}">✅ Yes, fixed</button><button type="button" data-feedback="no" data-fix="${i+1}">❌ No, continue</button><span class="live-note" data-feedback-note aria-live="polite"></span></div></section>`);
}
sec('avoid','What not to do',`<section id="avoid" class="avoid-box"><h2>What not to do</h2><div class="checks avoid-checks"><span>${esc(d.avoid)}</span></div></section>`);
sec('still','Still failing?',`<section id="still"><h2>Still failing? Capture this evidence</h2><div class="evidence-box"><b>Before escalating, capture:</b><span>${esc(d.stillFailing)}</span></div></section>`);
sec('sources','Official references',`<section id="sources"><h2>Official references</h2><div class="related-grid">${linkCards(d.references)}</div></section>`);
sec('related','Related troubleshooting',`<section id="related" class="related-guides"><h2>Related troubleshooting</h2><div class="related-grid">${linkCards(d.related)}</div></section>`);
const community=`<section id="discussion" class="community"><h2>Still stuck? Ask the community</h2><p>Share the sanitized error text, affected software/version and checks already tried. Avoid disclosing any private configuration or credentials.</p><div class="credential-warning"><b>Keep it safe:</b> never post passwords, API keys, access tokens, recovery codes, license keys, private URLs, or confidential logs.</div><div class="giscus-shell" data-giscus-repo="wiztechid/ErrorHarbor" data-giscus-repo-id="R_kgDOUmgggA" data-giscus-category="Announcements" data-giscus-category-id="DIC_kwDOUmgggM4DGNES"><div class="community-provider-note"><span>Powered by GitHub Discussions</span><small>Sign in with GitHub to comment. Reading comments does not require sign-in.</small></div><div class="giscus"></div><p class="giscus-status" data-giscus-status>Loading community discussion…</p><p class="giscus-fallback" data-giscus-fallback hidden>Comments could not load here. <a href="https://github.com/wiztechid/ErrorHarbor/discussions">Open ErrorHarbor Discussions on GitHub →</a></p></div></section>`;
sec('discussion','Community',community);
const schema={'@context':'https://schema.org','@graph':[{'@type':'Article',headline:d.title,description:d.description,url:articleUrl,datePublished:d.published,dateModified:d.reviewed,author:{'@type':'Organization',name:'ErrorHarbor',url:'https://errorharbor.com/'},publisher:{'@type':'Organization',name:'ErrorHarbor',url:'https://errorharbor.com/'}},{'@type':'BreadcrumbList',itemListElement:[{ '@type':'ListItem',position:1,name:'Home',item:'https://errorharbor.com/'},{'@type':'ListItem',position:2,name:d.categoryName,item:new URL(d.categoryUrl,'https://errorharbor.com').href},{'@type':'ListItem',position:3,name:d.productName,item:articleUrl}]}]};
const firstFeedback=`<div id="fix-1" class="fix-feedback"><b>Did Fix #1 work?</b><button type="button" data-feedback="yes" data-fix="1">✅ Yes, fixed</button><button type="button" data-feedback="no" data-fix="1">❌ No, continue</button><span class="live-note" data-feedback-note aria-live="polite"></span></div>`;
const blocks=sections.map(x=>x.markup).join('');
const article=`<article class="article"><nav class="breadcrumb" aria-label="Breadcrumb"><a href="/errors/">Error Library</a> › <a href="${safeUrl(d.categoryUrl)}">${esc(d.categoryName)}</a> › ${esc(d.productName)}</nav><h1>${esc(d.title)}</h1>${canonicalShare(d.title,articleUrl,sourceRepo)}<p class="lede"><strong>Quick answer:</strong> ${esc(d.quickAnswer)}</p><div class="meta"><span class="chip">${esc(d.productName)}</span><span class="chip">${esc(d.appliesTo)}</span><span class="reviewed">Last reviewed ${esc(d.reviewed)}</span></div><div class="fix-meta"><span class="badge difficulty">Troubleshooting guide</span><span class="badge safe">Risk: ${esc(d.risk)}</span></div>${blocks.replace('</section><section id="diagnose"',`</section>${firstFeedback}<section id="diagnose"`)}</article>`;
const toc=`<aside class="toc"><div class="toc-card">${sections.map(s=>`<a href="#${s.id}">${esc(s.label)}</a>`).join('')}</div></aside>`;
const sidebar=canonicalSidebar(toc,article,{url:articleUrl,product:d.productName,type:d.categoryName});
const title=esc(d.title),desc=esc(d.description);
const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${title} | ErrorHarbor</title><meta name="description" content="${desc}"><link rel="canonical" href="${articleUrl}"><meta property="og:type" content="article"><meta property="og:title" content="${title}"><meta property="og:description" content="${desc}"><meta property="og:url" content="${articleUrl}"><meta name="twitter:card" content="summary"><link rel="icon" href="/assets/favicon.svg"><link rel="manifest" href="/site.webmanifest"><link rel="stylesheet" href="/assets/css/styles.css?v=20261014-share4"><script type="application/ld+json">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script></head><body data-root="/"><a class="skip-link" href="#main">Skip to content</a>${canonicalHeader(sourceRepo)}<main id="main"><section class="article-shell"><div class="shell article-grid">${article}${sidebar}</div></section></main>${canonicalFooter(sourceRepo)}<script src="/assets/js/app.js?v=20261014-share4" defer></script></body></html>\n`;
const output=path.join('errors',d.category,d.product,d.slug,'index.html');
if(fs.existsSync(output))throw Error('Refusing to overwrite existing article: '+output);
if(flag==='--write'){fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,html);console.log('CREATED '+output+' — npm-shell-v1 design locked; editorial and publish gates still required');}
else console.log('DRY RUN '+output+' ('+html.length+' bytes); use --write after review');
