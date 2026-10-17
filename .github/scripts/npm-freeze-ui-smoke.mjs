// npm-shell-v1: one-time release Chromium QA against an actual HTTP-served PR checkout.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const base=(process.env.BASE_URL||'http://127.0.0.1:8765').replace(/\/$/,'');
const articles=JSON.parse(fs.readFileSync('data/search-index.json','utf8')).filter(x=>x.kind==='article');
const trust=['/about/','/editorial-methodology/','/contact/','/privacy/','/terms/','/disclaimer/','/affiliate-disclosure/'];
const widths=[{name:'mobile',width:390,height:844},{name:'desktop',width:1366,height:768}];
const shots=new Set(['npm-command-not-found','failed-to-compute-cache-key-not-found','err-ossl-evp-unsupported','mysql-public-key-retrieval-not-allowed']);
const reports=[];
fs.mkdirSync('qc-npm-freeze',{recursive:true});
const browser=await chromium.launch({headless:true});
try{
 for(const viewport of widths){
  const context=await browser.newContext({viewport:{width:viewport.width,height:viewport.height}});
  await context.route('**/*',route=>new URL(route.request().url()).origin===base?route.continue():route.abort());
  const page=await context.newPage();
  for(const item of articles){
   const path='/'+item.url;
   const response=await page.goto(base+path,{waitUntil:'domcontentloaded',timeout:20000});
   assert.equal(response?.status(),200,path+' response');
   await page.locator('h1').first().waitFor({state:'visible'});
   const diagnostics=await page.evaluate(()=>({
     url:location.href,
     title:document.title,
     h1:document.querySelector('h1')?.textContent?.slice(0,100),
     footer:!!document.querySelector('footer.site-footer'),
     sidebar:!!document.querySelector('aside.sidebar'),
     bodyStart:document.body.innerHTML.slice(0,320)
   }));
   if(!diagnostics.footer||!diagnostics.sidebar)throw Error('PR_CHECKOUT_CHROME_NOT_RENDERED '+path+' HTTP '+response.status()+' '+JSON.stringify(diagnostics));
   // app.js deliberately moves the npm sidebar under <article> on mobile.
   // The template source guard separately enforces its canonical static placement.
   const a=await page.evaluate((required)=>{
    const sidebar=document.querySelector('aside.sidebar');
    const footer=document.querySelector('footer.site-footer');
    const paths=[...footer.querySelectorAll('a[href]')].map(x=>new URL(x.getAttribute('href'),document.baseURI).pathname);
    const toc=[...sidebar.querySelectorAll('.toc a[href^="#"]')];
    return {
     h1:document.querySelectorAll('h1').length,
     search:document.querySelectorAll('form.header-search').length,
     share:document.querySelectorAll('.social-share a[data-network]').length,
     blocks:sidebar.querySelectorAll(':scope>.side-block').length,
     toc:toc.length,
     missingToc:toc.filter(x=>!document.getElementById(x.hash.slice(1))).map(x=>x.hash),
     missingTrust:required.filter(x=>!paths.includes(x)),
     css:document.styleSheets.length,
     width:document.documentElement.scrollWidth,
     viewport:innerWidth,
     canonical:document.querySelector('link[rel="canonical"]')?.href
    };
   },trust);
   assert.equal(a.h1,1,path+' h1');
   assert.equal(a.search,1,path+' search');
   assert.equal(a.share,4,path+' social share');
   assert.ok(a.blocks===2 || a.blocks===3,path+' sidebar');
   assert.ok(a.toc>0,path+' toc missing');
   assert.deepEqual(a.missingToc,[],path+' toc targets');
   assert.deepEqual(a.missingTrust,[],path+' footer links');
   assert.ok(a.css>0,path+' CSS');
   if(a.width>a.viewport+3){
     const candidates=await page.evaluate(()=>{
       const elements=[...document.querySelectorAll('*')].map(el=>{
         const r=el.getBoundingClientRect(),style=getComputedStyle(el);
         return {tag:el.tagName,cls:typeof el.className==='string'?el.className.slice(0,80):'',left:+r.left.toFixed(1),right:+r.right.toFixed(1),width:+r.width.toFixed(1),overflow:style.overflowX,parent:el.parentElement?.tagName+'.'+String(el.parentElement?.className||'').slice(0,45)};
       });
       return {nearEdge:elements.filter(x=>x.right>innerWidth+3&&x.right<innerWidth+70).slice(0,35),large:elements.filter(x=>x.right>innerWidth+70).slice(0,15)};
     });
     console.error('MOBILE_OVERFLOW_EVIDENCE '+path+' '+JSON.stringify(candidates));
     await page.screenshot({path:'qc-npm-freeze/'+viewport.name+'-overflow-diagnostic.png',fullPage:true});
     throw Error(path+' horizontal overflow '+a.width+'/'+a.viewport);
   }
   assert.equal(a.canonical,'https://errorharbor.com/'+item.url,path+' canonical');
   const slug=item.url.split('/').filter(Boolean).at(-1);
   if(shots.has(slug))await page.screenshot({path:'qc-npm-freeze/'+viewport.name+'-'+slug+'.png',fullPage:true});
   reports.push({path,viewport:viewport.name,documentWidth:a.width,sidebarBlocks:a.blocks,tocLinks:a.toc});
  }
  await context.close();
 }
 fs.writeFileSync('qc-npm-freeze/report.json',JSON.stringify({result:'PASS',template:'npm-shell-v1',articles:articles.length,checks:reports.length,records:reports},null,2));
 console.log('PASS npm-shell-v1: '+reports.length+' real Chromium mobile/desktop checks across '+articles.length+' articles');
}finally{await browser.close()}
