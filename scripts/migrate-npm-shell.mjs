import fs from 'node:fs';
import path from 'node:path';
import {migrateOne,REFERENCE} from './npm-shell-lib.mjs';
const repo=process.cwd();
const args=process.argv.slice(2);
if(args.some(a=>!['--write','--all'].includes(a)))throw Error('Usage: node scripts/migrate-npm-shell.mjs --all [--write]');
if(!args.includes('--all'))throw Error('Explicit --all required');
const entries=JSON.parse(fs.readFileSync('data/search-index.json','utf8')).filter(x=>x.kind==='article');
let changed=0,unchanged=0;const changes=[];
for(const entry of entries){
 const file=path.join(repo,entry.url,'index.html');
 const before=fs.readFileSync(file,'utf8');
 const after=entry.url+'index.html'===REFERENCE?before:migrateOne(before,entry,repo);
 if(after!==before){changed++;changes.push(entry.url);if(args.includes('--write'))fs.writeFileSync(file,after);}else unchanged++;
}
console.log(JSON.stringify({mode:args.includes('--write')?'WRITE':'DRY_RUN',checked:entries.length,changed,unchanged,changes},null,2));
