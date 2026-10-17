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
function homepageShell(s){
 const itemList=/<script type="application\/ld\+json">[\s\S]*?<\/script>/i;
 let x=s.replace(itemList,"__HOME_SCHEMA_DATA__");
 const start=x.indexOf('id="latest-guides"');
 if(start>=0) {
  const sectionStart=x.lastIndexOf("<section",start);
  const sectionEnd=x.indexOf("</section>",start);
  if(sectionStart>=0&&sectionEnd>=0)x=x.slice(0,sectionStart)+"__LATEST_ARTICLE_CONTENT__"+x.slice(sectionEnd+10);
 }
 return x;
}
function hashes(){
 return {version:"npm-article-shell-v1.0.0",reference:ref,
  header:hash(expectedHeader),footer:hash(expectedFooter),
  css:hash(read("assets/css/styles.css")),js:hash(read("assets/js/app.js")),
  homepageShell:hash(homepageShell(read("index.html"))),
  hubs:Object.fromEntries(["errors/index.html","errors/dev/index.html","errors/virtualization/index.html","errors/windows-network/index.html","errors/hardware/index.html"].map(p=>[p,hash(read(p).replace(/<main\b[\s\S]*?<\/main>/i,"__HUB_CONTENT__"))]))
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
const errors=[];
for(const k of ["header","footer","css","js","homepageShell"])if(wanted[k]!==now[k])errors.push("FROZEN_DESIGN_DRIFT "+k);
for(const [k,v] of Object.entries(wanted.hubs||{}))if(v!==now.hubs?.[k])errors.push("FROZEN_HUB_CHROME "+k);
const registry=JSON.parse(read("data/search-index.json")).filter(e=>e.kind==="article");
const templateSignature=s=>({
 header:normalize(get(s,"header"),"https://errorharbor.com/"+s.match(/<link rel="canonical" href="([^"]+)"/)?.[1]?.replace("https://errorharbor.com/","")||""),
 footer:get(s,"footer"),sidebar:get(s,"aside")
});
for(const item of registry){
 const file=path.join(item.url,"index.html");
 if(!fs.existsSync(file)){errors.push("MISSING "+file);continue}
 const source=read(file),pageURL="https://errorharbor.com/"+item.url;
 const actualHeader=normalize(get(source,"header"),pageURL).replace(/header-search-npm/g,"header-search-article");
 const actualFooter=normalize(get(source,"footer"),pageURL);
 if(actualHeader!==expectedHeader)errors.push("HEADER "+file);
 if(actualFooter!==expectedFooter)errors.push("FOOTER "+file);
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
const result={status:errors.length?"BLOCKED":"PASS",articles:registry.length,errors:errors.slice(0,60)};
console.log(JSON.stringify(result,null,2));
if(errors.length)process.exit(1);
