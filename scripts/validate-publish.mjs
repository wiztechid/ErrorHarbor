import fs from "node:fs";
import path from "node:path";

const ROOT=process.cwd();
const fail=[];
const read=p=>fs.readFileSync(path.join(ROOT,p),"utf8");
const exists=p=>fs.existsSync(path.join(ROOT,p));
const registry=JSON.parse(read("data/search-index.json"));
const sitemap=read("sitemap.xml");
const home=read("index.html");

// Sitemap must remain parseable XML; literal escaped newlines have previously leaked into production.
if(sitemap.includes("\\n")) fail.push("sitemap.xml: contains literal \\n artifact; use real newlines");
if(!sitemap.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')||!sitemap.trim().endsWith("</urlset>")) fail.push("sitemap.xml: malformed urlset envelope");

const requiredSearchHubs = [
  "errors/dev/",
  "errors/windows-network/",
  "errors/virtualization/",
  "errors/hardware/"
];
for (const url of requiredSearchHubs) {
  const hub = registry.find(x => x.kind === "hub" && x.url === url);
  if (!hub) fail.push(`${url}: pillar missing from internal search registry`);
  else if (!hub.title || !hub.summary || !Array.isArray(hub.keywords) || hub.keywords.length < 2) fail.push(`${url}: internal-search hub metadata incomplete`);
}

// AdSense UX guard: reserved inventory stays hidden until production ad code is intentionally enabled.
// Never treat feedback/navigation-adjacent placeholders as approved production placements.
const css=read("assets/css/styles.css");
if(!/\.ad-placeholder\s*\{[^}]*display\s*:\s*none\s*!important/i.test(css)) fail.push("ads: reserved .ad-placeholder inventory must remain hidden before production monetization");

// AdSense implementation-readiness contract.
const privacy=read("privacy/index.html");
const adsTxt=read("ads.txt");
const publisherId="pub-4750547049813961";
if(!adsTxt.includes(`google.com, ${publisherId}, DIRECT, f08c47fec0942fa0`)) fail.push("ads.txt: canonical Google AdSense publisher record missing or mismatched");
for(const signal of ["Google AdSense","cookies","web beacons","IP addresses","Google AdSense Privacy &amp; messaging","European Economic Area","United Kingdom","Switzerland","Google Ads Settings"]){
  if(!privacy.includes(signal)) fail.push(`privacy: missing AdSense disclosure signal: ${signal}`);
}
// Until production consent/ad configuration is intentionally activated, publisher ad tags must not leak into site templates.
for(const p of ["index.html","assets/js/app.js"]){
  const source=read(p);
  if(source.includes("pagead2.googlesyndication.com")||source.includes("adsbygoogle")) fail.push(`${p}: production AdSense tag detected before consent/ad activation gate is enabled`);
}

const articles=registry.filter(x=>x.kind==="article");
const latest=[...articles].sort((a,b)=>(b.publish_order||0)-(a.publish_order||0)).slice(0,6);

for(const item of articles){
  for(const key of ["published","publish_order","cluster","hub","summary"]){
    if(item[key]===undefined||item[key]===null||item[key]==="") fail.push(`${item.url}: missing registry field ${key}`);
  }

  const file=path.join(item.url,"index.html");
  if(!exists(file)){ fail.push(`${item.url}: missing article file`); continue; }
  const html=read(file);
  const absolute="https://errorharbor.com/"+item.url;

  // Public-content hygiene: block internal assistant/tool artifacts from shipping.
  const toolArtifactPatterns = [
    ["cite", "raw assistant citation marker"],
    ["filecite", "raw file citation marker"],
    ["sandbox:/mnt/data/", "sandbox path artifact"]
  ];
  for (const [needle,label] of toolArtifactPatterns) {
    if (html.includes(needle)) fail.push(`${item.url}: ${label}`);
  }
  if (/turn\d+(?:search|view|fetch|open)\d+/i.test(html)) fail.push(`${item.url}: internal tool reference leaked into public content`);

  if(!html.includes(`rel="canonical" href="${absolute}"`)) fail.push(`${item.url}: canonical mismatch`);
  if(/<meta\s+name=["']robots["'][^>]*noindex/i.test(html)) fail.push(`${item.url}: article is noindex`);
  if(!sitemap.includes(`<loc>${absolute}</loc>`)) fail.push(`${item.url}: missing from sitemap`);
  const dateModified=(html.match(/"dateModified"\s*:\s*"([^"]+)"/)||[])[1];
  if(dateModified && !sitemap.includes(`<loc>${absolute}</loc><lastmod>${dateModified}</lastmod>`)) fail.push(`${item.url}: sitemap lastmod must match Article dateModified`);

  if(!html.includes('id="related"')) fail.push(`${item.url}: missing Related Troubleshooting section`);

  // SEO Architecture v2 content contract
  const requiredSignals = [
    ['class="lede"', 'missing concise answer/lede'],
    ['class="fingerprint"', 'missing exact-error fingerprint'],
    ['class="reader-path"', 'missing choose-your-path decision block'],
    ['id="quick-fix"', 'missing Quick Check/Fix'],
    ['id="diagnose"', 'missing diagnostic flow'],
    ['id="fix2"', 'missing distinct second troubleshooting step'],
    ['class="avoid-box"', 'missing What not to do safety block'],
    ['id="still"', 'missing unresolved-error branch'],
    ['class="evidence-box"', 'missing escalation evidence checklist'],
    ['id="sources"', 'missing authoritative references'],
    ['class="giscus-shell"', 'missing community layer']
  ];
  for (const [needle,label] of requiredSignals) if(!html.includes(needle)) fail.push(`${item.url}: ${label}`);

  const verifySignals=(html.match(/<b>Verify:<\/b>/g)||[]).length+(html.match(/class="verify-step"/g)||[]).length;
  if(verifySignals<2) fail.push(`${item.url}: needs explicit verification beyond the first check/fix`);
  if((html.match(/<h1>/g)||[]).length!==1) fail.push(`${item.url}: must contain exactly one H1`);
  if(!html.includes('property="og:url"')||!html.includes('property="og:title"')||!html.includes('property="og:description"')) fail.push(`${item.url}: incomplete Open Graph metadata`);
  if(!html.includes('"@type":"Article"')||!html.includes('BreadcrumbList')) fail.push(`${item.url}: incomplete Article/Breadcrumb structured data`);

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

const seenTitles=new Map(), seenDescriptions=new Map();
for(const item of articles){
  const html=read(path.join(item.url,"index.html"));
  const title=(html.match(/<title>([\s\S]*?)<\/title>/i)||[])[1]?.trim();
  const desc=(html.match(/<meta name="description" content="([^"]*)"/i)||[])[1]?.trim();
  if(title){ if(seenTitles.has(title)) fail.push(`${item.url}: duplicate title with ${seenTitles.get(title)}`); else seenTitles.set(title,item.url); }
  if(desc){ if(seenDescriptions.has(desc)) fail.push(`${item.url}: duplicate meta description with ${seenDescriptions.get(desc)}`); else seenDescriptions.set(desc,item.url); }
}

for(const item of latest){
  if(!home.includes(`href="${item.url}"`)) fail.push(`${item.url}: latest-6 article missing from homepage`);
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
