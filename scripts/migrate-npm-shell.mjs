// npm Command Not Found is the canonical frozen article chrome.
// Dry-run by default. --write updates registered articles without changing article main contents.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
const root=process.cwd();
const write=process.argv.includes("--write");
const reference="errors/dev/node-npm/npm-command-not-found/index.html";
const list=JSON.parse(fs.readFileSync(path.join(root,"data/search-index.json"),"utf8")).filter(x=>x.kind==="article");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const sha=s=>crypto.createHash("sha256").update(s).digest("hex");
const tag=(text,name)=>text.match(new RegExp("<"+name+"\\b[^>]*>[\\s\\S]*?<\\/"+name+">","i"))?.[0];
const exact=(text,re,label)=>{const m=text.match(re);if(!m)throw Error("MISSING "+label);return m[0]};
const npm=read(reference);
const headerSource=exact(npm,/<header\b[\s\S]*?<\/header>/i,"npm header");
const footerSource=exact(npm,/<footer\b[\s\S]*?<\/footer>/i,"npm footer");
const base="https://errorharbor.com/";
function normalise(h,url){
 return h.replace(/(href|src)=(["'])(.*?)\2/gi,(full,attribute,q,target)=>{
  if(target.startsWith("#")||target.startsWith("mailto:"))return full;
  const dest=new URL(target,url);
  if(dest.origin!=="https://errorharbor.com")return full;
  return attribute+"="+q+dest.pathname+dest.search+dest.hash+q;
 });
}
const header=normalise(headerSource,new URL(reference,base)).replace(/header-search-npm/g,"header-search-article");
const footer=normalise(footerSource,new URL(reference,base));
const referenceHeader=normalise(header,new URL(reference,base));
const referenceFooter=normalise(footer,new URL(reference,base));
function textOnly(s){return s.replace(/<[^>]*>/g,"").replace(/&amp;/g,"&").replace(/&quot;/g,'"').trim()}
function shareBar(title,link){
 const enc=encodeURIComponent;
 const targets=[
  ["whatsapp", "WhatsApp","W", "https://wa.me/?text="+enc(title+"\n"+link)],
  ["facebook", "Facebook","f","https://www.facebook.com/sharer/sharer.php?u="+enc(link)],
  ["x", "X","X","https://twitter.com/intent/tweet?text="+enc(title)+"&url="+enc(link)],
  ["telegram","Telegram","↗","https://t.me/share/url?url="+enc(link)+"&text="+enc(title)]
 ];
 const esc=s=>String(s).replace(/&/g,"&amp;").replace(/"/g,"&quot;");
 return '<section class="social-share" aria-label="Share this page"><strong>Share</strong><div class="social-share-actions">'+
 targets.map(([network,label,icon,url])=>'<a data-network="'+network+'" href="'+esc(url)+'" target="_blank" rel="noopener noreferrer" aria-label="Share on '+label+' (opens a new tab)"><span class="share-icon" aria-hidden="true">'+icon+'</span><span>'+label+'</span></a>').join("")+
 '</div></section>';
}
function upgradeAside(html){
 const old=exact(html,/<aside\b[\s\S]*?<\/aside>/i,"article aside");
 const links=[...old.matchAll(/<a\b[^>]*href=["'](#[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)].map(m=>({href:m[1],label:m[2]}));
 if(!links.length)throw Error("MISSING TOC links");
 const ids=new Set([...html.matchAll(/\bid=["']([^"']+)["']/gi)].map(m=>m[1]));
 for(const l of links)if(!ids.has(l.href.slice(1)))throw Error("BROKEN TOC "+l.href);
 const details=old.match(/<div class="guide-details">[\s\S]*?<\/div>/i)?.[0]||
  '<div class="guide-details"><span><b>Article</b>Technical troubleshooting guide</span></div>';
 const toc='<div class="side-block"><h3>On this page</h3><nav class="toc" aria-label="Article table of contents">'+
  links.map((l,i)=>'<a href="'+l.href+'"'+(i===0?' class="active"':'')+'>'+l.label+'</a>').join("")+
  '</nav></div>';
 return '<aside class="sidebar">'+toc+'<div class="side-block"><h3>Guide details</h3>'+details+
 '</div><div class="side-block ad-placeholder" style="margin:0">ADSENSE · desktop side rail</div></aside>';
}
function transform(page,filename){
 const url=new URL(filename.replace(/index\.html$/,""),base);
 const oldHeader=exact(page,/<header\b[\s\S]*?<\/header>/i,"header");
 const oldFooter=exact(page,/<footer\b[\s\S]*?<\/footer>/i,"footer");
 const aside=exact(page,/<aside\b[\s\S]*?<\/aside>/i,"sidebar");
 const article=exact(page,/<article\s+class="article">[\s\S]*?<\/article>/i,"article content");
 const title=textOnly(exact(article,/<h1\b[^>]*>[\s\S]*?<\/h1>/i,"h1"));
 const oldShare=exact(article,/<section\s+class="social-share"[\s\S]*?<\/section>/i,"share bar");
 // All editorial contents before and after the existing share bar stay byte-identical.
 const nextArticle=article.replace(oldShare,shareBar(title,url.href));
 let changed=page.replace(oldHeader,header).replace(oldFooter,footer).replace(aside,upgradeAside(page)).replace(article,nextArticle);
 if((changed.match(/<h1\b/gi)||[]).length!==1)throw Error("H1_COUNT");
 if((changed.match(/<script\b[^>]*src=[^>]*app\.js/gi)||[]).length!==1)throw Error("SHARED_JS_COUNT");
 if(!changed.includes('<aside class="sidebar">')||!changed.includes('class="header-search"'))throw Error("SHELL_DRIFT");
 return {changed,bodyBefore:article.replace(oldShare,"__SHARE__"),bodyAfter:nextArticle.replace(shareBar(title,url.href),"__SHARE__")};
}
const modified=[],skipped=[];
for(const item of list){
 const file=path.join(item.url,"index.html");
 const source=read(file);
 const res=transform(source,file);
 if(res.bodyBefore!==res.bodyAfter)throw Error("BODY_DRIFT "+file);
 if(source===res.changed){skipped.push(file);continue}
 modified.push(file);
 if(write)fs.writeFileSync(file,res.changed);
}
console.log(JSON.stringify({reference,mode:write?"WRITE":"DRY_RUN",registered:list.length,changed:modified.length,unchanged:skipped.length,modified},null,2));
