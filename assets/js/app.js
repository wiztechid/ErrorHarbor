(()=>{
const root=document.body.dataset.root||"";

// Canonical site chrome: keep brand/footer parity across every legacy and current page.
document.querySelectorAll(".brand-mark").forEach(mark=>{if(mark.tagName!=="IMG"){const img=document.createElement("img");img.className="brand-mark";img.src="/assets/favicon.svg";img.alt="";img.width=40;img.height=40;mark.replaceWith(img);}else{mark.src="/assets/favicon.svg";mark.alt="";mark.width=40;mark.height=40;}});
document.querySelectorAll(".site-footer .footer-grid>div:first-child>p").forEach(p=>p.textContent="Exact-error troubleshooting. Safer fixes. Clear verification.");
const toast=document.createElement("div");toast.className="toast";toast.setAttribute("role","status");toast.setAttribute("aria-live","polite");document.body.appendChild(toast);
let tt;function say(msg){toast.textContent=msg;toast.classList.add("show");clearTimeout(tt);tt=setTimeout(()=>toast.classList.remove("show"),1800)}

document.querySelectorAll("[data-copy]").forEach(btn=>btn.addEventListener("click",async()=>{
  const original=btn.textContent;
  try{await navigator.clipboard.writeText(btn.dataset.copy);btn.textContent="✓ Copied";btn.classList.add("copied");say("Copied to clipboard")}
  catch(e){say("Copy ready")}
  setTimeout(()=>{btn.textContent=original;btn.classList.remove("copied")},1600);
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
    const section=block.closest("section")||block;
    const next=section.nextElementSibling;
    if(next&&next.scrollIntoView)setTimeout(()=>next.scrollIntoView({behavior:"smooth",block:"start"}),250);
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