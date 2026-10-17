import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve('errors');
const registry = JSON.parse(fs.readFileSync('data/search-index.json','utf8'));
const registered = new Set(registry.filter(x=>x.kind==='article').map(x=>path.normalize(path.join(x.url.replace(/^\\/+/,''),'index.html'))));
const files = [];
function walk(dir) { if (!fs.existsSync(dir)) return; for (const e of fs.readdirSync(dir,{withFileTypes:true})) { const p=path.join(dir,e.name); if(e.isDirectory()) walk(p); else if(e.name==='index.html' && registered.has(path.normalize(path.relative(process.cwd(),p)))) files.push(p); } }
walk(root);
const links=['/about/','/editorial-methodology/','/contact/','/privacy/','/terms/','/disclaimer/','/affiliate-disclosure/'];
const issues=[];
for(const file of files) {
 const html=fs.readFileSync(file,'utf8');
 const footer=html.match(/<footer\b[\s\S]*?<\/footer>/i)?.[0]||'';
 const missing=links.filter(x=>!footer.includes('href="'+x+'"')&&!footer.includes("href='"+x+"'"));
 const flags=[];
 if(!footer.includes('footer-grid')) flags.push('footer grid');
 if(missing.length) flags.push('footer links: '+missing.join(', '));
 if(!/class=["'][^"']*social-share/.test(html)) flags.push('share');
 if(!/class=["'][^"']*toc(?:\s|["'])/.test(html)) flags.push('TOC');
 if(!/<link[^>]+rel=["']canonical["']/.test(html)) flags.push('canonical');
 if(flags.length) issues.push({file:file.replaceAll(path.sep,'/'),flags});
}
console.log(JSON.stringify({registeredArticles:registered.size,scannedArticles:files.length,missingFiles:registered.size-files.length,articlesWithIssues:issues.length,issues},null,2));
if(files.length!==registered.size) { console.error('Article inventory incomplete'); process.exitCode=1; }
if(process.argv.includes('--strict')&&issues.length) process.exit(1);
