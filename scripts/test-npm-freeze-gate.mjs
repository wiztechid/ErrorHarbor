import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const sourceRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const tempRoot=fs.mkdtempSync(path.join(os.tmpdir(),"errorharbor-freeze-"));
const copyRoot=path.join(tempRoot,"repo");
const skip=source=>!source.split(path.sep).some(part=>part===".git"||part==="node_modules");
try {
  fs.cpSync(sourceRoot,copyRoot,{recursive:true,filter:skip});
  const article="errors/dev/node-npm/err-ossl-evp-unsupported/index.html";
  const homepage="index.html";
  const hub="errors/dev/index.html";
  const run=(args=[])=>{
    const result=spawnSync(process.execPath,["scripts/npm-freeze-gate.mjs",...args],{cwd:copyRoot,encoding:"utf8"});
    if(result.error)throw result.error;
    return {status:result.status,output:result.stdout+result.stderr};
  };
  const replace=(file,from,to)=>{
    const absolute=path.join(copyRoot,file);
    const text=fs.readFileSync(absolute,"utf8");
    assert.ok(text.includes(from),`expected mutation target in ${file}: ${from}`);
    fs.writeFileSync(absolute,text.replace(from,to));
  };
  const check=(name,file,from,to,shouldPass)=>{
    const absolute=path.join(copyRoot,file);
    const original=fs.readFileSync(absolute,"utf8");
    replace(file,from,to);
    const result=run();
    fs.writeFileSync(absolute,original);
    assert.equal(result.status===0,shouldPass,`${name} unexpected gate result:\n${result.output}`);
    console.log(`PASS ${name}`);
  };

  const baseline=run();
  assert.equal(baseline.status,0,"unmodified repository must pass the freeze gate:\n"+baseline.output);
  console.log("PASS baseline");
  check("share markup is frozen",article,'class="social-share"','class="social-share altered"',false);
  check("sidebar markup is frozen",article,'class="toc"','class="toc altered"',false);
  check("article body markup is frozen",article,'<section id="quick-fix"','<div id="quick-fix"',false);
  check("article body copy remains editable",article,"Then rerun the ","Then rerun the revised ",true);
  check("article command content remains editable",article,'data-copy="node -p','data-copy="npm -v',true);
  check("homepage section chrome is frozen",homepage,'class="section latest-guides"','class="section latest-guides altered"',false);
  check("hub card structure is frozen",hub,'<span class="arrow">→</span>','<strong class="arrow">→</strong>',false);
  const section=fs.readFileSync(path.join(copyRoot,homepage),"utf8").match(/<section class="section latest-guides" id="latest-guides">[\s\S]*?<\/section>/)?.[0];
  assert.ok(section,"homepage latest guides section must exist");
  const title=section.match(/<h3>([^<]+)<\/h3>/)?.[1];
  assert.ok(title,"homepage latest card title must exist");
  check("homepage article title remains editable",homepage,title,title+" (test)",true);
  const card=fs.readFileSync(path.join(copyRoot,hub),"utf8").match(/<a class="error-card"[^>]*>[\s\S]*?<\/a>/)?.[0];
  const cardTitle=card?.match(/<h3>([^<]+)<\/h3>/)?.[1];
  assert.ok(cardTitle,"hub card title must exist");
  check("hub article title remains editable",hub,cardTitle,cardTitle+" (test)",true);

  const registryPath=path.join(copyRoot,"data/search-index.json");
  const registry=JSON.parse(fs.readFileSync(registryPath,"utf8"));
  const articleRecord=registry.find(item=>item.kind==="article");
  assert.ok(articleRecord,"an article record must exist for registration test");
  const newUrl="errors/dev/freeze-test/master-shell-probe/";
  const newFile=path.join(copyRoot,newUrl,"index.html");
  fs.mkdirSync(path.dirname(newFile),{recursive:true});
  fs.copyFileSync(path.join(copyRoot,article),newFile);
  registry.push({...articleRecord,url:newUrl});
  fs.writeFileSync(registryPath,JSON.stringify(registry,null,2)+"\n");
  const missingLock=run();
  assert.notEqual(missingLock.status,0,"new articles must be locked before passing");
  assert.match(missingLock.output,/BODY_LOCK_MISSING/);
  const registration=run(["--register-new-articles"]);
  assert.equal(registration.status,0,"new article registration must add a lock without refreshing existing locks:\n"+registration.output);
  const manifest=JSON.parse(fs.readFileSync(path.join(copyRoot,"templates/npm-shell.freeze.json"),"utf8"));
  assert.ok(manifest.articleMarkup[newUrl+"index.html"],"new article lock must be saved");
  assert.equal(run().status,0,"registered article must pass the freeze gate");
  console.log("PASS explicit new-article lock registration");
} finally {
  fs.rmSync(tempRoot,{recursive:true,force:true});
}
