// PR #16: responsive QA against a local HTTP server serving the current PR checkout.
// Manual verification should inspect the uploaded screenshots before merging.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const base=(process.env.BASE_URL||'http://127.0.0.1:8765').replace(/\/$/,'');
const trust=['/about/','/editorial-methodology/','/contact/','/privacy/','/terms/','/disclaimer/','/affiliate-disclosure/'];
const routes=[
 '/',
 '/errors/dev/docker/failed-to-compute-cache-key-not-found/',
 '/errors/dev/sftp/bad-ownership-or-modes-for-chroot-directory/',
 '/errors/dev/sftp/subsystem-request-failed-on-channel-0/',
 '/errors/dev/ssh/kex-exchange-identification-connection-closed/',
 '/errors/dev/ssh/too-many-authentication-failures/',
 '/errors/virtualization/vmware/nested-virtualization-not-supported-module-hv-power-on-failed/',
 '/errors/dev/node-npm/npm-command-not-found/',
 '/errors/windows-network/monitoring/uptimerobot-405-method-not-allowed/'
];
const viewports=[{name:'mobile',width:390,height:844},{name:'desktop',width:1366,height:768}];
const browser=await chromium.launch({headless:true});
const reports=[];
fs.mkdirSync('qc-pr16',{recursive:true});
try {
 for(const viewport of viewports) {
  const context=await browser.newContext({viewport:{width:viewport.width,height:viewport.height}});
  const page=await context.newPage();
  for(const route of routes) {
   const response=await page.goto(base+route,{waitUntil:'domcontentloaded',timeout:20000});
   assert.equal(response?.status(),200,route+' HTTP should be 200');
   await page.waitForTimeout(120);
   const audit=await page.evaluate(({trust})=>{
    const footer=document.querySelector('footer.site-footer');
    const links=footer?[...footer.querySelectorAll('a[href]')].map(a=>{
     try {return new URL(a.getAttribute('href'),document.baseURI)} catch{return null}
    }).filter(Boolean):[];
    const valid=new Set(links.filter(u=>u.origin===location.origin).map(u=>u.pathname));
    const toc=[...document.querySelectorAll('.toc a[href^="#"]')];
    const missingAnchors=toc.filter(a=>!document.getElementById(decodeURIComponent(a.hash.slice(1)))).map(a=>a.hash);
    return {
     h1:document.querySelectorAll('h1').length,
     footerPresent:!!footer,
     footerHidden:footer?getComputedStyle(footer).display==='none':true,
     missingTrust:trust.filter(t=>!valid.has(t)),
     missingAnchors,
     tocCount:toc.length,
     shareCount:document.querySelectorAll('.social-share').length,
     documentWidth:document.documentElement.scrollWidth,
     viewportWidth:window.innerWidth,
     stylesheetCount:document.styleSheets.length,
     canonical:document.querySelector('link[rel="canonical"]')?.href||null
    };
   },{trust});
   assert.equal(audit.h1,1,route+' must have one H1');
   assert.ok(audit.footerPresent&&!audit.footerHidden,route+' footer missing/hidden');
   assert.deepEqual(audit.missingTrust,[],route+' missing trust footer links');
   assert.deepEqual(audit.missingAnchors,[],route+' broken TOC');
   assert.ok(audit.documentWidth<=audit.viewportWidth+3,route+' horizontal overflow: '+audit.documentWidth+'/'+audit.viewportWidth);
   assert.ok(audit.stylesheetCount>0,route+' CSS missing');
   if(route!=='/') {
    assert.ok(audit.tocCount>0,route+' article has no TOC');
    assert.ok(audit.shareCount>0,route+' article has no social share surface');
    assert.equal(new URL(audit.canonical).pathname,route,route+' canonical pathname mismatch');
   }
   if(['/','/errors/dev/docker/failed-to-compute-cache-key-not-found/','/errors/dev/node-npm/npm-command-not-found/'].includes(route)){
    const label=route==='/'?'home':route.includes('docker')?'docker':'legacy';
    await page.screenshot({path:path.join('qc-pr16',viewports.find(x=>x.name===viewport.name).name+'-'+label+'.png'),fullPage:true});
   }
   reports.push({viewport:viewport.name,route,documentWidth:audit.documentWidth,viewportWidth:audit.viewportWidth,trustLinks:trust.length,tocLinks:audit.tocCount,shareCount:audit.shareCount});
  }
  await context.close();
 }
 fs.writeFileSync('qc-pr16/report.json',JSON.stringify({status:'PASS',checked:reports.length,reports},null,2));
 console.log('PASS PR16 responsive footer, canonical, TOC, overflow, and share surfaces on '+reports.length+' viewport-page combinations.');
} finally {
 await browser.close();
}
