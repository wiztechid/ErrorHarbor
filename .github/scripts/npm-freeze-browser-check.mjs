import fs from "node:fs";
import {chromium} from "playwright";
const inventory=JSON.parse(fs.readFileSync("data/search-index.json","utf8")).filter(x=>x.kind==="article");
const browser=await chromium.launch({headless:true});
fs.mkdirSync("npm-freeze-proof",{recursive:true});
const results=[],errors=[];
try {
 for (const vp of [{name:"mobile",width:390,height:844},{name:"desktop",width:1366,height:768}]) {
  const ctx=await browser.newContext({viewport:{width:vp.width,height:vp.height}});
  const page=await ctx.newPage();
  for(const item of inventory){
   const response=await page.goto("http://127.0.0.1:8765/"+item.url,{waitUntil:"domcontentloaded",timeout:20000});
   if(!response||response.status()!==200){errors.push(vp.name+" "+item.url+" HTTP "+response?.status());continue}
   const a=await page.evaluate(()=>{
    const links=["/about/","/editorial-methodology/","/contact/","/privacy/","/terms/","/disclaimer/","/affiliate-disclosure/"];
    const footer=document.querySelector("footer.site-footer");
    const paths=new Set([...footer?.querySelectorAll("a[href]")||[]].map(e=>new URL(e.getAttribute("href"),location.href).pathname));
    const toc=[...document.querySelectorAll("aside.sidebar nav.toc a[href^='#']")];
    return {docWidth:document.documentElement.scrollWidth,windowWidth:innerWidth,search:document.querySelectorAll("header .header-search").length,sidebar:document.querySelectorAll("aside.sidebar").length,toc:toc.length,brokenToc:toc.filter(e=>!document.getElementById(e.getAttribute("href").slice(1))).length,footer:!!footer,missing:links.filter(e=>!paths.has(e)),share:document.querySelectorAll("section.social-share a[data-network]").length,h1:document.querySelectorAll("h1").length};
   });
   results.push({viewport:vp.name,path:item.url,...a});
   if(a.docWidth>vp.width+3||a.search!==1||a.sidebar!==1||a.toc<1||a.brokenToc||!a.footer||a.missing.length||a.share!==4||a.h1!==1)errors.push(JSON.stringify({viewport:vp.name,path:item.url,...a}));
   if(["npm-command-not-found","failed-to-compute-cache-key-not-found","kex-exchange-identification-connection-closed"].some(s=>item.url.includes(s)))await page.screenshot({path:"npm-freeze-proof/"+vp.name+"-"+item.url.split("/").filter(Boolean).at(-1)+".png",fullPage:true});
  }
  await ctx.close();
 }
 fs.writeFileSync("npm-freeze-proof/results.json",JSON.stringify({total:results.length,failures:errors.length,errors,results},null,2));
 console.log(JSON.stringify({total:results.length,failures:errors.length,errors:errors.slice(0,12)}));
 if(errors.length)process.exitCode=1;
}finally{await browser.close();}
