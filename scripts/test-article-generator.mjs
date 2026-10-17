import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const root=process.cwd();
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'errorharbor-template-'));
try {
 const input=JSON.parse(fs.readFileSync('templates/article.example.json','utf8'));
 const json=path.join(tmp,'article.json');
 fs.writeFileSync(json,JSON.stringify(input));
 const run=(args,expected=0)=>{
  const p=spawnSync(process.execPath,args,{cwd:tmp,encoding:'utf8'});
  if(p.status!==expected) throw Error('Unexpected exit '+p.status+' for '+args.join(' ')+'\n'+p.stdout+'\n'+p.stderr);
  return p;
 };
 const generator=path.join(root,'scripts/generate-article.mjs');
 const checker=path.join(root,'scripts/check-article-template.mjs');
 const target=path.join('errors',input.category,input.product,input.slug,'index.html');
 const preview=run([generator,json]);
 if(!preview.stdout.includes('DRY RUN')||fs.existsSync(path.join(tmp,target)))throw Error('Dry run wrote a file');
 run([generator,json,'--write']);
 const output=path.join(tmp,target);
 if(!fs.existsSync(output))throw Error('No output created');
 const html=fs.readFileSync(output,'utf8');
 if(!html.includes('footer-grid')||!html.includes('article-header-actions'))throw Error('Canonical shell missing');
 run([checker,target]);
 const duplicate=run([generator,json,'--write'],1);
 if(!duplicate.stderr.includes('Refusing to overwrite'))throw Error('Overwrite protection missing');
 const broken=html.replace('href="#sources"','href="#missing-test-anchor"');
 fs.writeFileSync(output,broken);
 const invalid=run([checker,target],1);
 if(!invalid.stderr.includes('broken anchor'))throw Error('Broken anchor not detected');
 const badDate={...input,reviewed:'2026-02-30',slug:'invalid-date'};
 fs.writeFileSync(json,JSON.stringify(badDate));
 const dateFail=run([generator,json],1);
 if(!dateFail.stderr.includes('Invalid calendar date'))throw Error('Invalid calendar date accepted');
 const unsafe={...input,slug:'unsafe-url',categoryUrl:'//evil.example/path/'};
 fs.writeFileSync(json,JSON.stringify(unsafe));
 const urlFail=run([generator,json],1);
 if(!urlFail.stderr.includes('categoryUrl must be'))throw Error('Protocol-relative category URL accepted');
 console.log('PASS: dry-run, generation, master shell, template validation, overwrite protection, broken-anchor rejection, invalid dates and unsafe URL rejection');
} finally { fs.rmSync(tmp,{recursive:true,force:true}); }
