import fs from 'node:fs';
import path from 'node:path';

// Local pre-publication contract: node scripts/check-article-template.mjs path/to/index.html
// No network, external packages, or GitHub Actions are needed.
const files=process.argv.slice(2);
if(!files.length){console.error('Usage: node scripts/check-article-template.mjs errors/.../index.html [...]');process.exit(2)}
let errors=0;
for(const file of files){
  const p=path.resolve(file);
  if(!fs.existsSync(p)){console.error(file+': file not found');errors++;continue}
  const html=fs.readFileSync(p,'utf8');
  const fail=[];
  const has=(re,label)=>{if(!re.test(html))fail.push(label)};
  has(/<html[^>]*lang=/i,'HTML lang');
  has(/<meta[^>]+name=["']viewport["']/i,'viewport');
  has(/<title>[^<]+<\/title>/i,'title');
  has(/<meta[^>]+name=["']description["']/i,'meta description');
  has(/<link[^>]+rel=["']canonical["']/i,'canonical');
  has(/<meta[^>]+property=["']og:/i,'Open Graph metadata');
  has(/<h1\b/i,'H1');
  if((html.match(/<h1\b/gi)||[]).length!==1)fail.push('exactly one H1');
  has(/<header\b/i,'site header');
  has(/class=["'][^"']*article-header-actions/i,'canonical article header actions');
  has(/class=["'][^"']*header-library/i,'canonical Error Library link');
  has(/<link[^>]+href=["']\/assets\/css\/styles\.css/i,'canonical stylesheet');
  has(/<script[^>]+type=["']application\/ld\+json/i,'structured data');
  has(/class=["'][^"']*breadcrumb/i,'breadcrumb');
  has(/class=["'][^"']*article-grid/i,'article layout grid');
  has(/<footer[^>]+class=["'][^"']*site-footer/i,'site footer');
  has(/class=["'][^"']*footer-grid/i,'full footer grid');
  has(/class=["'][^"']*brand-mark/i,'brand icon');
  has(/class=["'][^"']*footer-bottom/i,'footer copyright');
  for(const url of ['/about/','/editorial-methodology/','/contact/','/privacy/','/terms/','/disclaimer/','/affiliate-disclosure/']){
    if(!html.includes('href="'+url+'"')&&!html.includes("href='"+url+"'"))fail.push('footer/trust link '+url);
  }
  has(/class=["'][^"']*toc(?:\s|["'])/i,'on-page TOC');
  has(/class=["'][^"']*social-share/i,'social-share mount');
  has(/\/assets\/js\/app\.js/i,'shared app script');
  if((html.match(/<script[^>]+src=["'][^"']*\/assets\/js\/app\.js/gi)||[]).length!==1)fail.push('exactly one shared app script');
  const ids=new Set([...html.matchAll(/\bid=["']([^"']+)["']/g)].map(m=>m[1]));
  for(const [,id] of html.matchAll(/href=["']#([^"']+)["']/g)){if(!ids.has(id))fail.push('broken anchor #'+id)}
  if(fail.length){console.error('FAIL '+file+'\n - '+[...new Set(fail)].join('\n - '));errors+=fail.length}
  else console.log('PASS '+file+' — master shell and anchors valid');
}
if(errors)process.exit(1);
