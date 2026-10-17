// ErrorHarbor template freeze: layout locks, per-article chrome parity and SEO/content guards.
// No external dependencies or network. This is the mandatory light check on every PR.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {SHA,extractChrome,normalizeUrl,canonicalHeader,canonicalFooter,canonicalShare,referenceSignature,tocLinks,REFERENCE,REQUIRED_TRUST,homepageChrome,hubChrome} from './npm-shell-lib.mjs';
const ROOT=path.resolve(fileURLToPath(new URL('../',import.meta.url)));
const text=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const lock=JSON.parse(text('templates/npm-v1.freeze.json'));
const inventory=JSON.parse(text('data/search-index.json')).filter(x=>x.kind==='article');
const errors=[];
function assert(flag,detail){if(!flag)errors.push(detail);}
function digest(file){return SHA(text(file));}
for(const [file,hash] of Object.entries(lock.immutableFiles)){
  assert(digest(file)===hash,`SHARED_DESIGN_CHANGED ${file}: use separate approved template migration`);
}
let home;
try{
 home=homepageChrome(text('index.html'));
 assert(SHA(home.signature)===lock.homepageShellSha256,'HOMEPAGE_DESIGN_DRIFT: change only latest-six card data and list schema');
 const registryUrls=new Set(inventory.map(x=>'https://errorharbor.com/'+x.url));
 for(const url of home.urls)assert(registryUrls.has(url),`HOMEPAGE_UNKNOWN_ARTICLE ${url}`);
}catch(e){errors.push('HOMEPAGE_'+e.message)}
for(const [file,expected] of Object.entries(lock.hubChromeHashes||{})){
 try{assert(SHA(hubChrome(text(file)))===expected,`HUB_CHROME_DRIFT ${file}`)}catch(e){errors.push(`HUB_${file}: ${e.message}`)}
}
const ref=referenceSignature(ROOT);
for(const key of ['header','footer','shareSkeleton','asideClass'])
  assert(ref[key]===lock.referenceSignature[key],`REFERENCE_DRIFT ${key}: npm baseline modified`);
const refChrome=extractChrome(text(REFERENCE));
const expectedHeader=canonicalHeader(ROOT),expectedFooter=canonicalFooter(ROOT);
assert(/class="sidebar"/.test(refChrome.sidebar),'REFERENCE_SIDEBAR_MISSING');
const registry=new Set(inventory.map(x=>path.join(x.url,'index.html')));
const counted=new Set();
function visit(dir){for(const ent of fs.readdirSync(dir,{withFileTypes:true})){
 const f=path.join(dir,ent.name);
 if(ent.isDirectory())visit(f);
 else if(ent.name==='index.html'){
  const local=path.relative(ROOT,f).split(path.sep).join('/');
  if(!registry.has(local)&&/<article\s+class="article">/i.test(fs.readFileSync(f,'utf8')))errors.push('ORPHAN_ARTICLE '+local);
 }
}}
visit(path.join(ROOT,'errors'));
for(const item of inventory){
 const file=path.join(item.url,'index.html');
 assert(fs.existsSync(path.join(ROOT,file)),`ARTICLE_MISSING ${file}`);
 if(!fs.existsSync(path.join(ROOT,file)))continue;
 counted.add(file);
 const html=text(file);
 let chrome;
 try{chrome=extractChrome(html)}catch(e){errors.push(`${file}: ${e.message}`);continue}
 const title=html.match(/<article class="article">[\s\S]*?<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g,'').replaceAll('&amp;','&').replaceAll('&quot;','"');
 const url='https://errorharbor.com/'+item.url;
 assert(normalizeUrl(chrome.header).replaceAll('header-search-npm','header-search-article')===expectedHeader,`${file}: HEADER_DRIFT`);
 assert(normalizeUrl(chrome.footer)===expectedFooter,`${file}: FOOTER_DRIFT`);
 assert(chrome.share===canonicalShare(title,url,ROOT),`${file}: SHARE_DRIFT`);
 assert((html.match(/<section class="social-share"/g)||[]).length===1,`${file}: DUPLICATE_SHARE`);
 assert(/<aside class="sidebar">/.test(chrome.sidebar),`${file}: SIDEBAR_TYPE`);
 assert((chrome.sidebar.match(/<div class="side-block(?:[" ])/g)||[]).length===3,`${file}: SIDEBAR_BLOCKS`);
 assert(/<nav class="toc" aria-label="Article table of contents">/.test(chrome.sidebar),`${file}: SIDEBAR_TOC`);
 assert(/<div class="guide-details">/.test(chrome.sidebar),`${file}: SIDEBAR_GUIDE_DETAILS`);
 assert(/class="side-block ad-placeholder"/.test(chrome.sidebar),`${file}: SIDEBAR_RESERVED_ADS`);
 const ids=new Set([...html.matchAll(/\bid=["']([^"']+)["']/g)].map(x=>x[1]));
 const toc=tocLinks(chrome.sidebar);assert(toc.length>0,`${file}: TOC_MISSING`);
 for(const {id} of toc)assert(ids.has(id),`${file}: BAD_TOC_TARGET #${id}`);
 const tr=[...chrome.footer.matchAll(/<a\b[^>]*href=["']([^"']+)["']/g)].map(x=>{
   try{const u=new URL(x[1],url);return u.origin==='https://errorharbor.com'?u.pathname:null}catch{return null}
 });
 for(const urlPath of REQUIRED_TRUST)assert(tr.includes(urlPath),`${file}: MISSING_TRUST_LINK ${urlPath}`);
 assert(html.includes(`<link rel="canonical" href="${url}"`)||html.includes(`href="${url}"`),`${file}: CANONICAL`);
 assert((html.match(/<h1\b/gi)||[]).length===1,`${file}: MULTIPLE_H1`);
 assert((html.match(/<form class="header-search"/g)||[]).length===1,`${file}: HEADER_SEARCH`);
}
const stats={template:lock.version,reference:REFERENCE,checked:counted.size,registered:inventory.length,failed:errors.length,errors:errors.slice(0,50)};
console.log(JSON.stringify(stats,null,2));
if(errors.length)process.exit(1);
