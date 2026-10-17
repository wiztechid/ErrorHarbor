import fs from 'node:fs';
import path from 'node:path';

const [input, flag] = process.argv.slice(2);
if (flag && flag !== '--write') throw Error('Unknown option: '+flag);
if (!input) { console.error('Usage: node scripts/generate-article.mjs templates/article.json [--write]'); process.exit(2); }
const d = JSON.parse(fs.readFileSync(input, 'utf8'));
const required = ['slug','category','product','categoryName','categoryUrl','productName','title','description','published','reviewed','appliesTo','risk','quickAnswer','fingerprint','diagnosis','avoid','stillFailing'];
for (const key of required) if (typeof d[key] !== 'string' || !d[key].trim()) throw Error('Missing '+key);
if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(d.slug) || !/^[a-z0-9-]+$/.test(d.category) || !/^[a-z0-9-]+$/.test(d.product)) throw Error('Invalid path components');
if (!/^\d{4}-\d{2}-\d{2}$/.test(d.published) || !/^\d{4}-\d{2}-\d{2}$/.test(d.reviewed)) throw Error('Dates must be YYYY-MM-DD');
if (!Array.isArray(d.fixes) || !d.fixes.length || !Array.isArray(d.references) || !d.references.length || !Array.isArray(d.related) || !d.related.length) throw Error('Fixes, references and related links required');
for (const fix of d.fixes) if (!fix.heading?.trim() || !fix.body?.trim() || !fix.verify?.trim()) throw Error('Each fix needs heading, body and verification');
for (const link of [...d.references,...d.related]) if (!link.label?.trim() || !link.url?.trim()) throw Error('Each link needs label and URL');
if (d.references.some(x => !x.url.startsWith('https://'))) throw Error('Authoritative references must use HTTPS');
if (!d.categoryUrl.startsWith('/')) throw Error('categoryUrl must be a site-relative path');
const esc = x => String(x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const url = 'https://errorharbor.com/errors/'+d.category+'/'+d.product+'/'+d.slug+'/';
const safeUrl = x => { const u = new URL(x, 'https://errorharbor.com'); if (!['https:','http:'].includes(u.protocol)) throw Error('Unsafe URL'); return esc(x); };
const list = arr => arr.map(x=>'<li><a href="'+safeUrl(x.url)+'">'+esc(x.label)+'</a></li>').join('');
const sections = [
 ['fingerprint','Confirm the error fingerprint','<p>'+esc(d.fingerprint)+'</p>'],
 ['quick-fix','Quick answer','<p>'+esc(d.quickAnswer)+'</p>'],
 ['diagnose','Choose your diagnostic path','<p>'+esc(d.diagnosis)+'</p>'],
 ...d.fixes.map((f,i)=>['fix-'+(i+1),'Fix #'+(i+1)+' — '+f.heading,'<p>'+esc(f.body)+'</p><p><strong>Verify:</strong> '+esc(f.verify)+'</p>']),
 ['avoid','What not to do','<p>'+esc(d.avoid)+'</p>'],
 ['still','Still failing? Capture this evidence','<p>'+esc(d.stillFailing)+'</p>'],
 ['sources','Authoritative references','<ul>'+list(d.references)+'</ul>'],
 ['related','Related troubleshooting','<ul>'+list(d.related)+'</ul>']
];
const title = esc(d.title), desc = esc(d.description);
const schema = {'@context':'https://schema.org','@graph':[{'@type':'Article',headline:d.title,description:d.description,url,datePublished:d.published,dateModified:d.reviewed,author:{'@type':'Organization',name:'ErrorHarbor',url:'https://errorharbor.com/'},publisher:{'@type':'Organization',name:'ErrorHarbor',url:'https://errorharbor.com/'}},{'@type':'BreadcrumbList',itemListElement:[{ '@type':'ListItem',position:1,name:'Home',item:'https://errorharbor.com/'},{'@type':'ListItem',position:2,name:d.categoryName,item:new URL(d.categoryUrl,'https://errorharbor.com').href},{'@type':'ListItem',position:3,name:d.productName,item:url}]}]};
const footer = '<footer class="site-footer"><div class="shell footer-grid"><div><a class="brand" href="/"><img class="brand-mark" src="/assets/favicon.svg" alt="" width="40" height="40"><span>ErrorHarbor</span></a><p>Exact-error troubleshooting. Safer fixes. Clear verification.</p></div><div><h4>About</h4><a href="/about/">About ErrorHarbor</a><a href="/editorial-methodology/">Editorial Methodology</a><a href="/contact/">Contact</a></div><div><h4>Legal</h4><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a><a href="/disclaimer/">Disclaimer</a><a href="/affiliate-disclosure/">Affiliate Disclosure</a></div></div><div class="shell footer-bottom">© '+new Date().getUTCFullYear()+' ErrorHarbor · Find the cause. Fix the error.</div></footer>';
const html = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>'+title+' | ErrorHarbor</title><meta name="description" content="'+desc+'"><link rel="canonical" href="'+url+'"><meta property="og:type" content="article"><meta property="og:title" content="'+title+'"><meta property="og:description" content="'+desc+'"><meta property="og:url" content="'+url+'"><meta name="twitter:card" content="summary"><link rel="icon" href="/assets/favicon.svg"><link rel="manifest" href="/site.webmanifest"><link rel="stylesheet" href="/assets/css/styles.css"><script type="application/ld+json">'+JSON.stringify(schema).replace(/</g,'\\u003c')+'</script></head><body data-root="/"><a class="skip-link" href="#main">Skip to content</a><header class="site-header"><div class="shell nav"><a class="brand" href="/"><img class="brand-mark" src="/assets/favicon.svg" alt="" width="40" height="40"><span>ErrorHarbor</span></a><a href="/errors/">Error Library</a></div></header><main id="main"><section class="article-shell"><div class="shell article-grid"><article class="article"><nav class="breadcrumb"><a href="/">Home</a> › <a href="'+safeUrl(d.categoryUrl)+'">'+esc(d.categoryName)+'</a> › '+esc(d.productName)+'</nav><h1>'+title+'</h1><p class="meta"><span class="chip">Applies to: '+esc(d.appliesTo)+'</span><span class="chip reviewed">Reviewed: '+esc(d.reviewed)+'</span><span class="chip">Risk: '+esc(d.risk)+'</span></p><section class="social-share" aria-label="Share this page"></section>'+sections.map(([id,h,body])=>'<section id="'+id+'"><h2>'+esc(h)+'</h2>'+body+'</section>').join('')+'</article><aside class="toc"><div class="toc-card"><b>On this page</b>'+sections.map(([id,h])=>'<a href="#'+id+'">'+esc(h)+'</a>').join('')+'</div></aside></div></section></main>'+footer+'<script src="/assets/js/app.js" defer></script></body></html>\n';
const output = path.join('errors',d.category,d.product,d.slug,'index.html');
if (fs.existsSync(output)) throw Error('Refusing to overwrite existing article: '+output);
if (flag === '--write') { fs.mkdirSync(path.dirname(output),{recursive:true}); fs.writeFileSync(output,html); console.log('CREATED '+output+' — run template check and editorial gates before publication'); }
else console.log('DRY RUN '+output+' ('+html.length+' bytes); use --write after review');
