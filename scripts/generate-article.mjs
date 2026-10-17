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
for (const date of [d.published,d.reviewed]) if (Number.isNaN(Date.parse(date)) || new Date(date).toISOString().slice(0,10)!==date) throw Error('Invalid calendar date: '+date);
if (d.reviewed < d.published) throw Error('Review date cannot precede publication');
if (!Array.isArray(d.fixes) || !d.fixes.length || !Array.isArray(d.references) || !d.references.length || !Array.isArray(d.related) || !d.related.length) throw Error('Fixes, references and related links required');
for (const fix of d.fixes) if (!fix.heading?.trim() || !fix.body?.trim() || !fix.verify?.trim()) throw Error('Each fix needs heading, body and verification');
for (const link of [...d.references,...d.related]) if (!link.label?.trim() || !link.url?.trim()) throw Error('Each link needs label and URL');
if (d.references.some(x => !x.url.startsWith('https://'))) throw Error('Authoritative references must use HTTPS');
// A leading slash followed by backslash may be interpreted as an external //host by URL parsers.
const relatedIsUnsafe=x => {
 try {
  if (typeof x.url!=='string' || !x.url.startsWith('/') || x.url.startsWith('//') || x.url.includes('\\')) return true;
  const u=new URL(x.url,'https://errorharbor.com/');
  return u.origin!=='https://errorharbor.com' || u.protocol!=='https:';
 } catch { return true; }
};
if (d.related.some(relatedIsUnsafe)) throw Error('Related links must be internal site-relative paths');
if (d.references.some(x => { try { const u=new URL(x.url); return u.protocol!=='https:' || !u.hostname; } catch { return true; } })) throw Error('Invalid reference URL');
if (!/^\/(?!\/)[a-z0-9\/-]+\/$/.test(d.categoryUrl)) throw Error('categoryUrl must be a safe site-relative directory');
const esc = x => String(x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const url = 'https://errorharbor.com/errors/'+d.category+'/'+d.product+'/'+d.slug+'/';
const safeUrl = x => { if (typeof x!=='string' || /[\x00-\x1f]/.test(x)) throw Error('Invalid URL'); const u = new URL(x, 'https://errorharbor.com'); if (!['https:','http:'].includes(u.protocol)) throw Error('Unsafe URL'); return esc(x); };
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
// The npm Command Not Found article is the immutable visual source for new articles.
const ref=fs.readFileSync(new URL('../errors/dev/node-npm/npm-command-not-found/index.html',import.meta.url),'utf8');
const chrometag=tag=>ref.match(new RegExp('<'+tag+'\\b[\\s\\S]*?<\\/'+tag+'>','i'))?.[0]||'';
const normalize=s=>s.replace(/(href|src)=(["'])(.*?)\2/gi,(full,k,q,d)=>{
 try{const u=new URL(d,'https://errorharbor.com/errors/dev/node-npm/npm-command-not-found/');return u.origin==='https://errorharbor.com'?k+'='+q+u.pathname+u.search+u.hash+q:full}catch{return full}
});
const frozenHeader=normalize(chrometag('header'));
const frozenFooter=normalize(chrometag('footer'));
if(!frozenHeader.includes('class="header-search"')||!frozenFooter.includes('class="footer-grid"'))throw Error('Missing approved frozen article shell');
const net=[
 ['whatsapp','WhatsApp','W','https://wa.me/?text='+encodeURIComponent(d.title+'\n'+url)],
 ['facebook','Facebook','f','https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(url)],
 ['x','X','X','https://twitter.com/intent/tweet?text='+encodeURIComponent(d.title)+'&url='+encodeURIComponent(url)],
 ['telegram','Telegram','↗','https://t.me/share/url?url='+encodeURIComponent(url)+'&text='+encodeURIComponent(d.title)]
];
const frozenShare='<section class="social-share" aria-label="Share this page"><strong>Share</strong><div class="social-share-actions">'+net.map(([n,label,icon,href])=>'<a data-network="'+n+'" href="'+esc(href)+'" target="_blank" rel="noopener noreferrer" aria-label="Share on '+label+' (opens a new tab)"><span class="share-icon" aria-hidden="true">'+icon+'</span><span>'+label+'</span></a>').join('')+'</div></section>';
const frozenSidebar='<aside class="sidebar"><div class="side-block"><h3>On this page</h3><nav class="toc" aria-label="Article table of contents">'+sections.map(([id,h],i)=>'<a href="#'+id+'"'+(i===0?' class="active"':'')+'>'+esc(h)+'</a>').join('')+'</nav></div><div class="side-block"><h3>Guide details</h3><div class="guide-details"><span><b>Applies to</b>'+esc(d.appliesTo)+'</span><span><b>Reviewed</b>'+esc(d.reviewed)+'</span><span><b>Risk level</b>'+esc(d.risk)+'</span></div></div><div class="side-block ad-placeholder" style="margin:0">ADSENSE · desktop side rail</div></aside>';
const html = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>'+title+' | ErrorHarbor</title><meta name="description" content="'+desc+'"><link rel="canonical" href="'+url+'"><meta property="og:type" content="article"><meta property="og:title" content="'+title+'"><meta property="og:description" content="'+desc+'"><meta property="og:url" content="'+url+'"><meta name="twitter:card" content="summary"><link rel="icon" href="/assets/favicon.svg"><link rel="manifest" href="/site.webmanifest"><link rel="stylesheet" href="/assets/css/styles.css"><script type="application/ld+json">'+JSON.stringify(schema).replace(/</g,'\\u003c')+'</script></head><body data-root="/"><a class="skip-link" href="#main">Skip to content</a>'+frozenHeader+'<main id="main"><section class="article-shell"><div class="shell article-grid"><article class="article"><nav class="breadcrumb"><a href="/">Home</a> › <a href="'+safeUrl(d.categoryUrl)+'">'+esc(d.categoryName)+'</a> › '+esc(d.productName)+'</nav><h1>'+title+'</h1><p class="meta"><span class="chip">Applies to: '+esc(d.appliesTo)+'</span><span class="chip reviewed">Reviewed: '+esc(d.reviewed)+'</span><span class="chip">Risk: '+esc(d.risk)+'</span></p>'+frozenShare+''+sections.map(([id,h,body])=>'<section id="'+id+'"><h2>'+esc(h)+'</h2>'+body+'</section>').join('')+'</article>'+frozenSidebar+'</div></section></main>'+frozenFooter+'<script src="/assets/js/app.js" defer></script></body></html>\n';
const output = path.join('errors',d.category,d.product,d.slug,'index.html');
if (fs.existsSync(output)) throw Error('Refusing to overwrite existing article: '+output);
if (flag === '--write') { fs.mkdirSync(path.dirname(output),{recursive:true}); fs.writeFileSync(output,html); console.log('CREATED '+output+' — run template check and editorial gates before publication'); }
else console.log('DRY RUN '+output+' ('+html.length+' bytes); use --write after review');
