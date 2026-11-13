(()=>{
  "use strict";
  const CONSENT_KEY="errorharbor-advertising-consent-v1";
  const NATIVE_ID="container-60d326ef78a8f2c059c1b746c17e07f0";
  const NATIVE_SRC="https://bauval.org/21/60d326ef78a8f2c059c1b746c17e07f0";
  const bannerUnits={
    desktop:{key:"a9e5ac8cea9497e3419c06354aae716e",width:300,height:250},
    mobile:{key:"9466888790ad6a8c040a2d263ebc631f",width:320,height:50}
  };
  const readChoice=()=>{try{return localStorage.getItem(CONSENT_KEY)}catch(_){return null}};
  const saveChoice=value=>{try{localStorage.setItem(CONSENT_KEY,value)}catch(_){}};
  const article=document.querySelector("article.article");
  const isGuide=location.pathname.startsWith("/errors/")&&article&&article.querySelector("#quick-fix, #quick");
  const policyButton=document.querySelector("[data-advertising-choices]");
  let panel=null;

  function hidePanel(){if(panel){panel.remove();panel=null}}
  function createScript(src,async=true){const s=document.createElement("script");s.src=src;s.async=async;s.dataset.cfasync="false";return s}
  function bannerCode(slot){
    const unit=window.matchMedia("(max-width: 650px)").matches?bannerUnits.mobile:bannerUnits.desktop;
    slot.style.width=unit.width+"px";slot.style.minHeight=(unit.height+22)+"px";slot.classList.add("adsterra-banner-stack");
    const label=document.createElement("span");label.className="adsterra-label";label.textContent="Advertisement";slot.appendChild(label);
    const config=document.createElement("script");
    config.text=`window.atOptions={key:"${unit.key}",format:"iframe",height:${unit.height},width:${unit.width},params:{}};`;
    slot.appendChild(config);
    const network=createScript("https://bauval.org/22/"+unit.key,false);
    slot.appendChild(network);
  }
  function clearAdSlots(){document.querySelectorAll(".adsterra-slot").forEach(slot=>slot.remove())}
  function mountAds(){
    if(!isGuide||document.querySelector(".adsterra-slot"))return;
    const quick=article.querySelector("#quick-fix, #quick");
    if(!quick)return;
    const nativeSlot=document.createElement("div");nativeSlot.className="adsterra-slot adsterra-native";nativeSlot.setAttribute("aria-label","Advertisement");
    const nativeLabel=document.createElement("span");nativeLabel.className="adsterra-label";nativeLabel.textContent="Advertisement";nativeSlot.appendChild(nativeLabel);
    const nativeMount=document.createElement("div");nativeMount.id=NATIVE_ID;nativeSlot.appendChild(nativeMount);
    const afterFix=article.querySelector("#fix2, #fix1, #diagnose")||quick;
    afterFix.after(nativeSlot);
    const bannerSlot=document.createElement("div");bannerSlot.className="adsterra-slot adsterra-banner";bannerSlot.setAttribute("aria-label","Advertisement");
    if(window.matchMedia("(max-width: 920px)").matches){
      quick.after(bannerSlot);
    }else{
      const sidebar=article.parentElement?.querySelector("aside.sidebar");
      if(sidebar){bannerSlot.classList.add("adsterra-rail");sidebar.appendChild(bannerSlot)}
      else afterFix.after(bannerSlot);
    }
    document.head.appendChild(createScript(NATIVE_SRC,true));
    bannerCode(bannerSlot);
  }
  function choose(allowed){
    saveChoice(allowed?"allowed":"denied");
    hidePanel();
    if(allowed)mountAds();else clearAdSlots();
  }
  function showPanel(){
    if(panel)return;
    panel=document.createElement("section");panel.className="ad-consent-panel";panel.setAttribute("role","region");panel.setAttribute("aria-label","Advertising choices");
    const copy=document.createElement("div");copy.className="ad-consent-copy";
    const title=document.createElement("strong");title.textContent="Advertising choices";
    const message=document.createElement("p");message.textContent="ErrorHarbor can load Adsterra ads on troubleshooting guides. If you allow them, Adsterra may use cookies or similar technologies for ad delivery, measurement and fraud prevention. You can change this choice later in Privacy.";
    const more=document.createElement("a");more.href="https://adsterra.com/privacy-policy-managed/";more.target="_blank";more.rel="noopener noreferrer";more.textContent="Adsterra privacy policy";
    copy.append(title,message,more);
    const actions=document.createElement("div");actions.className="ad-consent-actions";
    const allow=document.createElement("button");allow.type="button";allow.className="primary-btn";allow.textContent="Allow ads";allow.addEventListener("click",()=>choose(true));
    const deny=document.createElement("button");deny.type="button";deny.className="secondary-btn";deny.textContent="Keep ads off";deny.addEventListener("click",()=>choose(false));
    actions.append(allow,deny);panel.append(copy,actions);document.body.appendChild(panel);
    allow.focus({preventScroll:true});
  }

  if(policyButton)policyButton.addEventListener("click",event=>{event.preventDefault();showPanel()});
  if(isGuide){
    if(readChoice()==="allowed")mountAds();
    else if(readChoice()!=="denied")showPanel();
  }
})();
