(()=>{
const root=document.body.dataset.root||"";

// Canonical site chrome: keep brand/footer parity across every legacy and current page.
document.querySelectorAll(".brand-mark").forEach(mark=>{if(mark.tagName!=="IMG"){const img=document.createElement("img");img.className="brand-mark";img.src="/assets/favicon.svg";img.alt="";img.width=40;img.height=40;mark.replaceWith(img);}else{mark.src="/assets/favicon.svg";mark.alt="";mark.width=40;mark.height=40;}});
document.querySelectorAll(".site-footer .footer-grid>div:first-child>p").forEach(p=>p.textContent="Exact-error troubleshooting. Safer fixes. Clear verification.");
const toast=document.createElement("div");toast.className="toast";toast.setAttribute("role","status");toast.setAttribute("aria-live","polite");document.body.appendChild(toast);
let tt;function say(msg){toast.textContent=msg;toast.classList.add("show");clearTimeout(tt);tt=setTimeout(()=>toast.classList.remove("show"),1800)}

// Lightweight share controls: canonical URL, no third-party SDK or automatic posting.
const shareMain=document.querySelector('main');
if(shareMain){
  const canonical=document.querySelector('link[rel="canonical"]');
  let shareURL;
  try{shareURL=new URL(canonical?.href||location.href);shareURL.hash='';shareURL.search=''}catch(_){shareURL=new URL(location.href);shareURL.hash='';shareURL.search=''}
  const url=shareURL.href,title=document.querySelector('h1')?.textContent.trim()||document.title;
  const bar=document.querySelector('.social-share')||document.createElement('section');bar.replaceChildren();bar.className='social-share';bar.setAttribute('aria-label','Share this page');
  const label=document.createElement('strong');label.textContent='Share';bar.appendChild(label);
  const actions=document.createElement('div');actions.className='social-share-actions';bar.appendChild(actions);
  if(typeof navigator.share==='function'){
    const native=document.createElement('button');native.type='button';native.innerHTML='<span class="share-icon" aria-hidden="true">↗</span><span>Share…</span>';
    native.addEventListener('click',async()=>{try{await navigator.share({title,url})}catch(e){if(e.name!=='AbortError')say('Use a social button or Copy link instead')}});actions.appendChild(native);
  }
  const targets=[['WhatsApp','https://wa.me/?text='+encodeURIComponent(title+'\n'+url)],['Facebook','https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(url)],['X','https://twitter.com/intent/tweet?text='+encodeURIComponent(title)+'&url='+encodeURIComponent(url)],['Telegram','https://t.me/share/url?url='+encodeURIComponent(url)+'&text='+encodeURIComponent(title)]];
  for(const [name,href] of targets){const a=document.createElement('a');a.innerHTML='<span class="share-icon" aria-hidden="true">'+({WhatsApp:'W',Facebook:'f',X:'X',Telegram:'↗'}[name])+'</span><span>'+name+'</span>';a.dataset.network=name.toLowerCase();a.href=href;a.target='_blank';a.rel='noopener noreferrer';a.setAttribute('aria-label','Share on '+name+' (opens a new tab)');actions.appendChild(a)}
  const copy=document.createElement('button');copy.type='button';copy.innerHTML='<span class="share-icon" aria-hidden="true">⧉</span><span>Copy link</span>';copy.dataset.copy=url;actions.appendChild(copy);
  const manual=document.createElement('input');manual.type='text';manual.value=url;manual.readOnly=true;manual.hidden=true;manual.setAttribute('aria-label','Page link to copy manually');bar.appendChild(manual);
  const article=shareMain.querySelector('article.article');
  if(article){const anchor=article.querySelector('.meta')||article.querySelector('.lede')||article.querySelector('h1');if(anchor)anchor.after(bar);else article.prepend(bar)}
  else{bar.classList.add('shell');shareMain.appendChild(bar)}
}

document.querySelectorAll("[data-copy]").forEach(btn=>btn.addEventListener("click",async()=>{
  const original=btn.innerHTML, value=btn.dataset.copy||"";
  let copied=false;
  try{await navigator.clipboard.writeText(value);copied=true}catch(e){
    const ta=document.createElement("textarea");
    ta.value=value;ta.setAttribute("readonly","");ta.style.position="fixed";ta.style.opacity="0";
    document.body.appendChild(ta);ta.select();
    try{copied=document.execCommand("copy")}catch(_){}
    ta.remove();
  }
  if(copied){btn.textContent="✓ Copied";btn.classList.add("copied");say("Copied to clipboard")}
  else{const link=btn.closest(".social-share")?.querySelector("input");if(link){link.hidden=false;link.focus();link.select();say("Select and copy the link")}else say("Copy failed — select the command manually")}
  setTimeout(()=>{btn.innerHTML=original;btn.classList.remove("copied")},1600);
}));

document.querySelectorAll("[data-example]").forEach(btn=>btn.addEventListener("click",()=>{
  const input=document.querySelector("[data-site-search] input");if(input){input.value=btn.dataset.example;input.focus()}
}));

let searchIndex=null;
async function loadIndex(){if(searchIndex)return searchIndex;try{const r=await fetch(root+"data/search-index.json");searchIndex=await r.json();return searchIndex}catch(e){return[]}}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
async function search(q){
  const items=await loadIndex();const terms=q.toLowerCase().split(/\s+/).filter(Boolean);
  return items.map(x=>{const title=x.title.toLowerCase(),hay=(x.title+" "+x.keywords.join(" ")+" "+x.product).toLowerCase();let score=0;if(title===q.toLowerCase())score+=20;if(title.includes(q.toLowerCase()))score+=10;score+=terms.reduce((n,t)=>n+(hay.includes(t)?2:0),0);return{x,score}}).filter(v=>v.score>0).sort((a,b)=>b.score-a.score).slice(0,6)
}
document.querySelectorAll("[data-site-search]").forEach(form=>form.addEventListener("submit",async e=>{
  e.preventDefault();const input=form.querySelector("input");const q=input.value.trim();if(!q){say("Enter an error message first");return}
  const scored=await search(q);
  const box=form.parentElement?.querySelector("[data-search-results]")||document.querySelector("[data-search-results]");
  if(box){box.innerHTML=scored.length?scored.map(v=>'<a href="'+root+v.x.url+'"><strong>'+esc(v.x.title)+'</strong><small>'+esc(v.x.product+" · "+v.x.type)+'</small></a>').join(""):'<a href="'+root+'errors/"><strong>No exact match yet</strong><small>Browse the Error Library while we expand the index.</small></a>';box.classList.add("active")}
  else if(scored[0]) location.href=root+scored[0].x.url;
  else location.href=root+"errors/";
}));

document.querySelectorAll("[data-feedback]").forEach(btn=>btn.addEventListener("click",()=>{
  const block=btn.closest(".fix-feedback"),note=block?.querySelector("[data-feedback-note]"),detail=block?.querySelector(".feedback-detail");
  const key="eh:"+location.pathname+":fix-"+btn.dataset.fix,val=btn.dataset.feedback;
  try{localStorage.setItem(key,val)}catch(e){}
  block?.querySelectorAll("[data-feedback]").forEach(b=>b.setAttribute("aria-pressed",String(b===btn)));
  if(note)note.textContent=val==="yes"?"Thanks — this fix was marked successful on this device.":"Thanks — continue to the next troubleshooting step.";
  if(detail)detail.classList.add("active");
  if(val==="no"){
    let next=block?.nextElementSibling||null;
    while(next&&(next.matches?.(".ad-placeholder,[hidden]")||getComputedStyle(next).display==="none")) next=next.nextElementSibling;
    while(next&&next.tagName!=="SECTION") next=next.nextElementSibling;
    if(next?.scrollIntoView)setTimeout(()=>next.scrollIntoView({behavior:"smooth",block:"start"}),250);
  }
}));

// Article support navigation: guide details always follows metadata; TOC joins it on mobile/tablet.
const articleGrid=document.querySelector(".article-grid");
const articleEl=articleGrid?.querySelector(":scope > article.article");
const sidebarEl=articleGrid?.querySelector(":scope > aside.sidebar")||articleEl?.querySelector(":scope > aside.sidebar");
if(articleGrid&&articleEl&&sidebarEl){
  const articleMeta=articleEl.querySelector(".meta");
  const guideBlock=sidebarEl.querySelector(".side-block:has(.guide-details)");
  const tocBlock=sidebarEl.querySelector(".side-block:has(.toc)");
  const responsive=window.matchMedia("(max-width: 1100px)");
  const placeSupport=()=>{
    if(!articleMeta)return;
    if(guideBlock&&articleMeta.nextElementSibling!==guideBlock)articleMeta.parentNode.insertBefore(guideBlock,articleMeta.nextSibling);
    if(responsive.matches){
      if(sidebarEl.parentNode!==articleEl)articleEl.insertBefore(sidebarEl,guideBlock?.nextSibling||articleMeta.nextSibling);
      if(tocBlock&&sidebarEl.firstElementChild!==tocBlock)sidebarEl.insertBefore(tocBlock,sidebarEl.firstElementChild);
      if(guideBlock&&guideBlock.parentNode!==sidebarEl)sidebarEl.appendChild(guideBlock);
    }else{
      if(guideBlock&&guideBlock.parentNode!==articleEl)articleEl.insertBefore(guideBlock,articleMeta.nextSibling);
      if(sidebarEl.parentNode!==articleGrid)articleGrid.insertBefore(sidebarEl,articleEl.nextSibling);
    }
  };
  placeSupport();
  if(responsive.addEventListener)responsive.addEventListener("change",placeSupport);else responsive.addListener(placeSupport);
}

const toc=[...document.querySelectorAll(".toc a")];
const tocTargets=toc.map(a=>({a,id:decodeURIComponent(a.getAttribute("href")||"").replace(/^#/,""),section:null}))
  .filter(x=>x.id);
tocTargets.forEach(x=>x.section=document.getElementById(x.id));
const validTocTargets=tocTargets.filter(x=>x.section);
if(validTocTargets.length){
  let activeId="";
  const setActive=(id,ensureVisible=true)=>{
    if(!id||id===activeId)return;
    activeId=id;
    validTocTargets.forEach(x=>x.a.classList.toggle("active",x.id===id));
    const current=validTocTargets.find(x=>x.id===id)?.a;
    if(ensureVisible&&current){
      const nav=current.closest(".toc");
      if(nav){
        const left=current.offsetLeft-(nav.clientWidth-current.offsetWidth)/2;
        nav.scrollTo({left:Math.max(0,left),behavior:"smooth"});
      }
    }
  };
  const syncToc=()=>{
    const marker=Math.max(120,Math.min(window.innerHeight*.28,240));
    let current=validTocTargets[0];
    for(const item of validTocTargets){
      if(item.section.getBoundingClientRect().top<=marker)current=item;
      else break;
    }
    setActive(current.id,true);
  };
  validTocTargets.forEach(x=>x.a.addEventListener("click",()=>setActive(x.id,true)));
  let ticking=false;
  const requestSync=()=>{if(!ticking){ticking=true;requestAnimationFrame(()=>{syncToc();ticking=false})}};
  addEventListener("scroll",requestSync,{passive:true});
  addEventListener("resize",requestSync,{passive:true});
  syncToc();
}

// Giscus community discussion: load only when the reader nears the section.
document.querySelectorAll(".giscus-shell").forEach(shell=>{
  const categoryId=shell.dataset.giscusCategoryId||"";
  const status=shell.querySelector("[data-giscus-status]");
  const fallback=shell.querySelector("[data-giscus-fallback]");
  if(!categoryId){if(status)status.textContent="Community discussion is not configured yet.";return;}

  let started=false;
  function loadGiscus(){
    if(started)return;started=true;
    if(status)status.textContent="Loading community discussion…";

    const mount=shell.querySelector(".giscus")||shell;
    const observer=new MutationObserver(()=>{
      const frame=shell.querySelector("iframe.giscus-frame");
      if(frame){
        if(status)status.hidden=true;
        if(fallback)fallback.hidden=true;
        observer.disconnect();
      }
    });
    observer.observe(shell,{childList:true,subtree:true});

    const s=document.createElement("script");
    s.src="https://giscus.app/client.js";
    s.async=true;
    s.crossOrigin="anonymous";
    s.dataset.repo=shell.dataset.giscusRepo;
    s.dataset.repoId=shell.dataset.giscusRepoId;
    s.dataset.category=shell.dataset.giscusCategory;
    s.dataset.categoryId=categoryId;
    s.dataset.mapping="pathname";
    s.dataset.strict="0";
    s.dataset.reactionsEnabled="1";
    s.dataset.emitMetadata="0";
    s.dataset.inputPosition="top";
    s.dataset.theme="noborder_light";
    s.dataset.lang="en";
    s.dataset.loading="lazy";
    mount.appendChild(s);

    setTimeout(()=>{
      if(!shell.querySelector("iframe.giscus-frame")){
        if(status)status.hidden=true;
        if(fallback)fallback.hidden=false;
        observer.disconnect();
      }
    },10000);
  }

  if("IntersectionObserver"in window){
    const io=new IntersectionObserver(entries=>{
      if(entries.some(entry=>entry.isIntersecting)){loadGiscus();io.disconnect();}
    },{rootMargin:"600px 0px"});
    io.observe(shell);
  }else{
    loadGiscus();
  }
});
})();