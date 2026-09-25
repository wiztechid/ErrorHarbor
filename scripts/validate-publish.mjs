import fs from "node:fs";
import path from "node:path";

const ROOT=process.cwd();
const fail=[];
const read=p=>fs.readFileSync(path.join(ROOT,p),"utf8");
const exists=p=>fs.existsSync(path.join(ROOT,p));
const registry=JSON.parse(read("data/search-index.json"));
const sitemap=read("sitemap.xml");
const home=read("index.html");

const articles=registry.filter(x=>x.kind==="article");
const latest=[...articles].sort((a,b)=>(b.publish_order||0)-(a.publish_order||0)).slice(0,8);

for(const item of articles){
  for(const key of ["published","publish_order","cluster","hub","summary"]){
    if(item[key]===undefined||item[key]===null||item[key]==="") fail.push(`${item.url}: missing registry field ${key}`);
  }

  const file=path.join(item.url,"index.html");
  if(!exists(file)){ fail.push(`${item.url}: missing article file`); continue; }
  const html=read(file);
  const absolute="https://errorharbor.com/"+item.url;

  if(!html.includes(`rel="canonical" href="${absolute}"`)) fail.push(`${item.url}: canonical mismatch`);
  if(/<meta\s+name=["']robots["'][^>]*noindex/i.test(html)) fail.push(`${item.url}: article is noindex`);
  if(!sitemap.includes(`<loc>${absolute}</loc>`)) fail.push(`${item.url}: missing from sitemap`);
  if(!html.includes('id="related"')) fail.push(`${item.url}: missing Related Troubleshooting section`);

  const related=(html.match(/<section id="related"[\s\S]*?<\/section>/)||[""])[0];
  const internal=(related.match(/href=["']\/(?!\/)[^"']+["']/g)||[]).length +
                 (related.match(/href=["']\.\.\/[^"']+["']/g)||[]).length;
  if(internal<2) fail.push(`${item.url}: related section needs 2 useful internal links`);

  if(!item.hub || !exists(path.join(item.hub,"index.html"))){
    fail.push(`${item.url}: declared hub missing`);
  } else {
    const hub=read(path.join(item.hub,"index.html"));
    const slug=item.url.split("/").filter(Boolean).at(-1);
    if(!hub.includes(slug)) fail.push(`${item.url}: parent hub does not link to article`);
  }
}

for(const item of latest){
  if(!home.includes(`href="${item.url}"`)) fail.push(`${item.url}: latest-8 article missing from homepage`);
}

const allHtml=[];
function walk(dir){
  for(const ent of fs.readdirSync(dir,{withFileTypes:true})){
    if([".git","node_modules"].includes(ent.name)) continue;
    const p=path.join(dir,ent.name);
    if(ent.isDirectory()) walk(p);
    else if(ent.isFile()&&ent.name.endsWith(".html")) allHtml.push(path.relative(ROOT,p));
  }
}
walk(ROOT);

for(const item of articles){
  const slug=item.url.split("/").filter(Boolean).at(-1);
  let inbound=0;
  for(const p of allHtml){
    if(p===path.join(item.url,"index.html")) continue;
    const html=read(p);
    if(html.includes(slug+"/")||html.includes("/"+item.url)||html.includes(item.url)) inbound++;
  }
  if(inbound<2) fail.push(`${item.url}: fewer than 2 inbound internal-link surfaces`);
}

if(!home.includes('id="latest-guides"')) fail.push("homepage: Latest Guides section missing");

if(fail.length){
  console.error("\nSEO publish gate FAILED:\n- "+fail.join("\n- "));
  process.exit(1);
}
console.log(`SEO publish gate passed for ${articles.length} indexable articles; homepage latest links: ${latest.length}.`);
