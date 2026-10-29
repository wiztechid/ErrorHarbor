// Enforce npm template chrome and immutable shared design on every PR.
// --lock is allowed ONLY in the initial npm migration workflow on the frozen branch.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
const read=p=>fs.readFileSync(p,"utf8");
const hash=s=>crypto.createHash("sha256").update(s).digest("hex");
const ref="errors/dev/node-npm/npm-command-not-found/index.html";
const manifestPath="templates/npm-shell.freeze.json";
const urls=["/about/","/editorial-methodology/","/contact/","/privacy/","/terms/","/disclaimer/","/affiliate-disclosure/"];
const get=(s,k)=>s.match(new RegExp("<"+k+"\\b[^>]*>[\\s\\S]*?<\\/"+k+">","i"))?.[0]||"";
const normalize=(s,url)=>s.replace(/(href|src)=(["'])(.*?)\2/gi,(full,key,q,target)=>{
 try{const u=new URL(target,url);return u.origin==="https://errorharbor.com"?key+"="+q+u.pathname+u.search+u.hash+q:full}catch{return full}
});
const refHTML=read(ref);
const refURL="https://errorharbor.com/"+ref.replace(/index\.html$/,"");
const expectedHeader=normalize(get(refHTML,"header"),refURL).replace(/header-search-npm/g,"header-search-article");
const expectedFooter=normalize(get(refHTML,"footer"),refURL);
const expectedShare=shareSkeleton(refHTML);
const expectedSidebar=sidebarSkeleton(refHTML);
function shareSkeleton(s){
 return (s.match(/<section class="social-share"[^>]*>[\s\S]*?<\/section>/i)?.[0]||"")
  .replace(/(\s+href=)(["'])([\s\S]*?)\2/gi,'$1$2{{SHARE_URL}}$2');
}
function sidebarSkeleton(s){
 const aside=s.match(/<aside class="sidebar">[\s\S]*?<\/aside>/i)?.[0]||"";
 return aside
  .replace(/(<nav class="toc" aria-label="Article table of contents">)[\s\S]*?(<\/nav>)/i,'$1__TOC_LINKS__$2')
  .replace(/<div class="guide-details">[\s\S]*?<\/div>/i,'<div class="guide-details">__GUIDE_DETAILS__</div>');
}
function articleMarkupSkeleton(s){
 const main=s.match(/<main\b[\s\S]*?<\/main>/i)?.[0];
 if(!main)throw Error("Article main missing");
 return main
  .replace(/(\s+(?:href|src|aria-label|title|alt|content|datetime|id|data-copy|data-fix)=)(["'])([\s\S]*?)\2/gi,'$1$2{{DYNAMIC}}$2')
  .replace(/>([^<]+)</g,'>{{TEXT}}<');
}
function homepageShell(s){
 const schemaTag=/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i;
 const sm=schemaTag.exec(s);
 if(!sm)throw Error("Homepage structured-data block missing");
 const schema=JSON.parse(sm[1]);
 const itemList=schema["@graph"]?.find(x=>x["@type"]==="ItemList");
 if(!itemList||itemList.numberOfItems!==6||!Array.isArray(itemList.itemListElement)||itemList.itemListElement.length!==6)throw Error("Homepage latest schema must contain six entries");
 itemList.itemListElement="__LATEST_ARTICLES__";
 let x=s.replace(schemaTag,'<script type="application/ld+json">'+JSON.stringify(schema)+'</script>');
 const sectionRe=/<section class="section latest-guides" id="latest-guides">[\s\S]*?<\/section>/i;
 const section=sectionRe.exec(x);
 if(!section)throw Error("Homepage latest-guides section missing");
 const cardRe=/<a class="latest-card"[^>]*>[\s\S]*?<\/a>/gi;
 const cards=[...section[0].matchAll(cardRe)];
 if(cards.length!==6)throw Error("Homepage must contain six latest-card entries");
 const normalizeCard=card=>{
  if(!/<div class="latest-card-top"><span>[\s\S]*?<\/span><span class="new-badge">New<\/span><\/div><h3>[\s\S]*?<\/h3><p>[\s\S]*?<\/p><span class="latest-cta">Open guide →<\/span>/.test(card))throw Error("Homepage latest-card chrome changed");
  return card.replace(/href="[^"]*"/,'href="{{ARTICLE_URL}}"')
   .replace(/(<div class="latest-card-top"><span>)[\s\S]*?(<\/span><span class="new-badge">)/,'$1{{CATEGORY}}$2')
   .replace(/<h3>[\s\S]*?<\/h3>/,'<h3>{{TITLE}}</h3>')
   .replace(/<p>[\s\S]*?<\/p>/,'<p>{{SUMMARY}}</p>');
 };
 const normalizedSection=section[0].replace(cardRe,card=>normalizeCard(card));
 return x.replace(section[0],normalizedSection);
}
function hubShell(s){
 const mainRe=/<main\b[\s\S]*?<\/main>/i;
 const match=mainRe.exec(s);
 if(!match)throw Error("Hub main missing");
 let main=match[0]
  .replace(/(<a\b[^>]*class=["'][^"']*(?:hub-item|error-card|library-card)[^"']*["'][^>]*>[\s\S]*?<\/a>)/gi,card=>card.replace(/href=(["'])[^"']*\1/i,'href="{{ARTICLE_URL}}"'))
  .replace(/>([^<]+)</g,'>{{TEXT}}<');
 // Card count and card copy are data; keep one structural sample for each repeated run.
 main=main.replace(/(<a\b[^>]*class=["'][^"']*(?:hub-item|error-card|library-card)[^"']*["'][^>]*>[\s\S]*?<\/a>)(?:\s*\1)+/gi,'$1');
 return s.replace(match[0],main);
}
function hashes(){
 return {version:"npm-article-shell-v1.3.0",reference:ref,
  header:hash(expectedHeader),footer:hash(expectedFooter),
  css:hash(read("assets/css/styles.css")),js:hash(read("assets/js/app.js")),
  homepageShell:hash(homepageShell(read("index.html"))),
  hubs:Object.fromEntries(["errors/index.html","errors/dev/index.html","errors/virtualization/index.html","errors/windows-network/index.html","errors/hardware/index.html"].map(p=>[p,hash(hubShell(read(p)))])),
  articleMarkup:Object.fromEntries(JSON.parse(read("data/search-index.json")).filter(e=>e.kind==="article").map(item=>{const file=path.posix.join(item.url,"index.html");return [file,hash(articleMarkupSkeleton(read(file)))];}))
 };
}
if(process.argv.includes("--lock")){
 if(fs.existsSync(manifestPath))throw Error("Existing template freeze: requires separately approved versioned migration");
 fs.mkdirSync(path.dirname(manifestPath),{recursive:true});
 fs.writeFileSync(manifestPath,JSON.stringify(hashes(),null,2)+"\n");
 console.log("CREATED npm freeze lock"); 
}
const wanted=JSON.parse(read(manifestPath));
const now=hashes();
if(process.argv.includes("--migrate-a11y-v1.2.0")){
 if(wanted.version!=="npm-article-shell-v1.1.0")throw Error("Accessibility migration requires the v1.1.0 freeze");
 const unchanged=["header","footer","js"];
 for(const key of unchanged)if(wanted[key]!==now[key])throw Error("Refusing migration with unrelated frozen drift: "+key);
 for(const [file,hashValue] of Object.entries(wanted.hubs||{})){
  const normalized=hash(hubShell(read(file).replace(/styles\.css\?v=20261029-a11y2/g,"styles.css?v=20261029-a11y1")));
  if(hashValue!==normalized)throw Error("Refusing migration with unrelated frozen drift: "+file);
 }
 const articles=JSON.parse(read("data/search-index.json")).filter(item=>item.kind==="article");
 for(const item of articles){
  const file=path.posix.join(item.url,"index.html"),source=read(file);
  if(!source.includes("<h2>Guide details</h2>")||source.includes("<h3>Guide details</h3>"))throw Error("Article heading migration incomplete: "+file);
 }
 wanted.version="npm-article-shell-v1.2.0";
 wanted.css=now.css;
 wanted.hubs=now.hubs;
 wanted.homepageShell=now.homepageShell;
 wanted.articleMarkup=now.articleMarkup;
 fs.writeFileSync(manifestPath,JSON.stringify(wanted,null,2)+"\n");
 console.log("MIGRATED accessibility structure lock to v1.2.0");
}
if(process.argv.includes("--migrate-a11y-v1.3.0")){
 if(wanted.version!=="npm-article-shell-v1.2.0")throw Error("Accessibility migration requires the v1.2.0 freeze");
 for(const key of ["header","footer","css","js","homepageShell"])if(wanted[key]!==now[key])throw Error("Refusing migration with unrelated frozen drift: "+key);
 for(const [file,hashValue] of Object.entries(wanted.hubs||{}))if(hashValue!==now.hubs?.[file])throw Error("Refusing migration with unrelated frozen drift: "+file);
 const articles=JSON.parse(read("data/search-index.json")).filter(item=>item.kind==="article");
 for(const item of articles){
  const file=path.posix.join(item.url,"index.html"),source=read(file);
  if(!source.includes("<h2>On this page</h2>")||source.includes("<h3>On this page</h3>"))throw Error("Sidebar heading migration incomplete: "+file);
 }
 wanted.version="npm-article-shell-v1.3.0";
 wanted.articleMarkup=now.articleMarkup;
 fs.writeFileSync(manifestPath,JSON.stringify(wanted,null,2)+"\n");
 console.log("MIGRATED sidebar heading structure lock to v1.3.0");
}
const errors=[];
for(const k of ["header","footer","css","js","homepageShell"])if(wanted[k]!==now[k])errors.push("FROZEN_DESIGN_DRIFT "+k);
for(const [k,v] of Object.entries(wanted.hubs||{}))if(v!==now.hubs?.[k])errors.push("FROZEN_HUB_CHROME "+k);
const registry=JSON.parse(read("data/search-index.json")).filter(e=>e.kind==="article");
const bodyLocks=wanted.articleMarkup||{};
const currentArticleMarkup={};
const templateSignature=s=>({
 header:normalize(get(s,"header"),"https://errorharbor.com/"+s.match(/<link rel="canonical" href="([^"]+)"/)?.[1]?.replace("https://errorharbor.com/","")||""),
 footer:get(s,"footer"),sidebar:get(s,"aside")
});
for(const item of registry){
 const file=path.join(item.url,"index.html");
 if(!fs.existsSync(file)){errors.push("MISSING "+file);continue}
 const source=read(file),pageURL="https://errorharbor.com/"+item.url;
 const relativeFile=path.posix.join(item.url,"index.html");
 const bodyHash=hash(articleMarkupSkeleton(source));
 currentArticleMarkup[relativeFile]=bodyHash;
 if(!bodyLocks[relativeFile])errors.push("BODY_LOCK_MISSING "+relativeFile);
 else if(bodyLocks[relativeFile]!==bodyHash)errors.push("ARTICLE_MARKUP_DRIFT "+relativeFile);
 const actualHeader=normalize(get(source,"header"),pageURL).replace(/header-search-npm/g,"header-search-article");
 const actualFooter=normalize(get(source,"footer"),pageURL);
 if(actualHeader!==expectedHeader)errors.push("HEADER "+file);
 if(actualFooter!==expectedFooter)errors.push("FOOTER "+file);
 if(shareSkeleton(source)!==expectedShare)errors.push("SHARE_CHROME "+file);
 if(sidebarSkeleton(source)!==expectedSidebar)errors.push("SIDEBAR_CHROME "+file);
 const aside=get(source,"aside");
 if(!aside.startsWith('<aside class="sidebar">')||!aside.includes('<nav class="toc"')||!aside.includes('class="guide-details"')||!aside.includes('class="side-block ad-placeholder"'))errors.push("SIDEBAR "+file);
 const links=[...aside.matchAll(/href=["']#([^"']+)["']/g)].map(x=>x[1]);
 const ids=new Set([...source.matchAll(/\bid=["']([^"']+)["']/g)].map(x=>x[1]));
 for(const a of links)if(!ids.has(a))errors.push("BAD_TOC "+file+" #"+a);
 if(!source.includes('class="header-search"'))errors.push("NO_SEARCH "+file);
 const footerLinks=[...actualFooter.matchAll(/href=["']([^"']+)["']/g)].map(x=>x[1]);
 for(const u of urls)if(!footerLinks.includes(u))errors.push("FOOTER_LINK "+file+" "+u);
 if((source.match(/<h1\b/gi)||[]).length!==1)errors.push("H1 "+file);
 if((source.match(/<section class="social-share"/g)||[]).length!==1)errors.push("SHARE "+file);
 if((source.match(/data-network="/g)||[]).length!==4)errors.push("SHARE_BUTTONS "+file);
}
const registeredFiles=new Set(registry.map(item=>path.posix.join(item.url,"index.html")));
for(const file of Object.keys(bodyLocks))if(!registeredFiles.has(file))errors.push("BODY_LOCK_ORPHAN "+file);
if(process.argv.includes("--register-new-articles")){
 const blocking=errors.filter(e=>!e.startsWith("BODY_LOCK_MISSING "));
 const missing=errors.filter(e=>e.startsWith("BODY_LOCK_MISSING ")).map(e=>e.slice("BODY_LOCK_MISSING ".length));
 if(blocking.length)throw Error("Refusing to register article markup while existing freeze checks fail: "+blocking.slice(0,20).join(", "));
 if(!missing.length)throw Error("No new registered article markup to lock");
 for(const file of missing)bodyLocks[file]=currentArticleMarkup[file];
 wanted.articleMarkup=bodyLocks;
 fs.writeFileSync(manifestPath,JSON.stringify(wanted,null,2)+"\n");
 errors.length=0;
 console.log("REGISTERED "+missing.length+" new article markup lock(s)");
}
const result={status:errors.length?"BLOCKED":"PASS",articles:registry.length,errors:errors.slice(0,60)};
console.log(JSON.stringify(result,null,2));
if(errors.length)process.exit(1);
