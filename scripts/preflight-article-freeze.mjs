import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const repo=process.cwd();
const scripts=[
 ['Generator smoke + negative cases',['scripts/test-article-generator.mjs']],
 ['Legacy article parity',['scripts/audit-article-parity.mjs','--strict']]
];
const index=JSON.parse(fs.readFileSync('data/search-index.json','utf8'));
const articles=index.filter(x=>x.kind==='article');
const missing=articles.filter(x=>!fs.existsSync(path.join(repo,x.url,'index.html')));
if(missing.length) throw Error('Missing indexed articles: '+missing.map(x=>x.url).join(', '));
// Legacy pages may use older but valid markup. Enforce their parity separately;
// the strict canonical template gate is exercised by the generated sample test.
// Do not mislabel legacy markup differences as publishing failures.
let failed=0;
for(const [label,args] of scripts) {
 const p=spawnSync(process.execPath,args,{cwd:repo,encoding:'utf8',maxBuffer:8*1024*1024});
 console.log('\n## '+label+' — '+(p.status===0?'PASS':'FAIL'));
 if(p.stdout)process.stdout.write(p.stdout);
 if(p.stderr)process.stderr.write(p.stderr);
 if(p.status!==0)failed++;
}
console.log('\nPreflight: '+(failed?'FAIL '+failed+' gate(s)':'PASS generator and legacy parity gates')+'; '+articles.length+' indexed articles');
if(failed)process.exit(1);
