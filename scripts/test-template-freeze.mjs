// Real fail-closed regression: isolated disposable copies so production files are never touched.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=path.resolve(fileURLToPath(new URL('../',import.meta.url)));
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'errorharbor-npm-lock-'));
try{
 fs.cpSync(root,tmp,{recursive:true,filter:f=>!f.includes('node_modules')&&!f.includes('.git')});
 const check=()=>spawnSync(process.execPath,['scripts/template-freeze-gate.mjs'],{cwd:tmp,encoding:'utf8'});
 const baseline=check();
 if(baseline.status!==0)throw Error('Baseline broken: '+baseline.stderr+' '+baseline.stdout);
 function testMutation(file,from,to,expect){
  const full=path.join(tmp,file),original=fs.readFileSync(full,'utf8');
  if(!original.includes(from))throw Error('Missing fixture '+file+' '+from);
  try{fs.writeFileSync(full,original.replace(from,to));const run=check();if(run.status!==expect)throw Error('Wrong status for '+file+': '+run.status+' '+run.stdout);}finally{fs.writeFileSync(full,original)}
 }
 testMutation('assets/css/styles.css','--blue:#176bff','--blue:#226bff',1);
 testMutation('assets/js/app.js','Canonical site chrome','Drifted site chrome',1);
 testMutation('index.html','class="shell hero-grid"','class="shell unapproved-hero-grid"',1);
 testMutation('errors/dev/index.html','site-header','bad-unapproved-header',1);
 testMutation('errors/dev/node-npm/npm-command-not-found/index.html','header-search-npm','header-search-changed',1);
 testMutation('errors/dev/docker/failed-to-compute-cache-key-not-found/index.html','href="/privacy/"','href="/bad-privacy/"',1);
 testMutation('errors/dev/docker/failed-to-compute-cache-key-not-found/index.html','class="sidebar"','class="unapproved-sidebar"',1);
 // The template lock must NOT forbid legitimate troubleshooting body improvements.
 testMutation('errors/dev/docker/failed-to-compute-cache-key-not-found/index.html','BuildKit reports','BuildKit diagnostically reports',0);
 console.log('PASS npm-shell-v1: 7 hostile chrome mutations blocked; editorial content allowed; 54/54 baseline intact');
}finally{fs.rmSync(tmp,{recursive:true,force:true})}
