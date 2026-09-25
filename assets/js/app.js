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

// Responsive article navigation: physically move the TOC before the article on tablet/mobile.
const articleGrid=document.querySelector(".article-grid");
const articleEl=articleGrid?.querySelector(":scope > article.article");
const tocEl=articleGrid?.querySelector(":scope > aside.toc");
if(articleGrid&&articleEl&&tocEl){
  const mobileToc=window.matchMedia("(max-width: 1100px)");
  const placeToc=()=>{if(mobileToc.matches){if(articleGrid.firstElementChild!==tocEl)articleGrid.insertBefore(tocEl,articleEl)}else if(articleEl.nextElementSibling!==tocEl){articleGrid.insertBefore(tocEl,articleEl.nextSibling)}};
  placeToc();
  if(mobileToc.addEventListener)mobileToc.addEventListener("change",placeToc);else mobileToc.addListener(placeToc);
}

const toc=[...document.querySelectorAll(".toc a")],sections=[...document.querySelectorAll(".article section[id]")];
if(toc.length&&sections.length&&"IntersectionObserver"in window){
  const o=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting)toc.forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+en.target.id))}),{rootMargin:"-25% 0px -62% 0px"});
  sections.forEach(s=>o.observe(s));
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