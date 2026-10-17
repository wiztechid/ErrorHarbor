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
  const run=()=>{
    const result=spawnSync(process.execPath,["scripts/npm-freeze-gate.mjs"],{cwd:copyRoot,encoding:"utf8"});
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

  assert.equal(run().status,0,"unmodified repository must pass the freeze gate");
  console.log("PASS baseline");
  check("share markup is frozen",article,'class="social-share"','class="social-share altered"',false);
  check("sidebar markup is frozen",article,'class="toc"','class="toc altered"',false);
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
} finally {
  fs.rmSync(tempRoot,{recursive:true,force:true});
}
