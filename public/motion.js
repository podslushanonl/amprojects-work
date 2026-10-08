// AM Projects — cinematic motion layer.
// Native scroll only: nothing here locks, hijacks or smooths the page scroll.
// All work happens in one rAF loop that runs only while the page is scrolling or resizing.
const root=document.documentElement;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];

// Split a heading into word masks, keeping <br>, highlighted spans and other inline markup intact.
function splitWords(el){
 if(!el||el.dataset.split)return 0;el.dataset.split='1';let n=0;
 const walk=node=>{[...node.childNodes].forEach(child=>{
  if(child.nodeType===3){
   const parts=child.textContent.split(/(\s+)/);if(!parts.some(p=>p.trim()))return;
   const frag=document.createDocumentFragment();
   parts.forEach(p=>{if(!p)return;if(!p.trim()){frag.append(document.createTextNode(p));return}
    const outer=document.createElement('span'),inner=document.createElement('span');
    outer.className='mw';inner.className='mw-i';inner.style.setProperty('--i',n++);inner.textContent=p;outer.append(inner);frag.append(outer)});
   child.replaceWith(frag);
  }else if(child.nodeType===1&&child.tagName!=='BR'&&!child.matches('svg,img'))walk(child);
 })};
 walk(el);el.classList.add('split');
 // Let the marker under the highlighted words start once the words before it have landed.
 el.style.setProperty('--accent-delay',`${Math.min(n,8)*70+380}ms`);
 return n;
}

// Count a stat up to its printed value ("77.2K", "3.86M", "132", "10 дней", "3,898").
function countUp(el){
 const final=el.textContent.trim(),m=final.match(/^([^\d]*)(\d[\d.,]*)(.*)$/);if(!m)return;
 const [,pre,num,post]=m,commas=/,\d{3}/.test(num),clean=num.replace(/,/g,''),target=parseFloat(clean);if(!isFinite(target))return;
 const decimals=(clean.split('.')[1]||'').length,dur=1600,start=performance.now();
 el.classList.add('count-up');el.setAttribute('aria-label',final);
 const fmt=v=>{let s=v.toFixed(decimals);if(commas)s=Math.round(v).toLocaleString('en-US');return pre+s+post};
 const tick=now=>{const t=clamp((now-start)/dur),e=1-Math.pow(1-t,4);el.textContent=t<1?fmt(target*e):final;if(t<1)requestAnimationFrame(tick)};
 el.textContent=fmt(0);requestAnimationFrame(tick);
}

export function mountMotion(){
 if(reduced.matches||!('IntersectionObserver' in window)){root.classList.add('motion-ready');return}
 root.classList.add('motion');

 // ---- Headings ----
 const hero=$('.hero h1');splitWords(hero);
 const headings=$$('main h2').filter(h=>!h.closest('dialog'));headings.forEach(splitWords);

 // ---- Progress line under the header ----
 const header=$('#header');const bar=document.createElement('span');bar.className='scroll-progress';bar.setAttribute('aria-hidden','true');header.append(bar);

 // ---- Intro: reveal on the next frame so the hidden state is painted first ----
 requestAnimationFrame(()=>requestAnimationFrame(()=>{root.classList.add('motion-ready');hero?.classList.add('is-in')}));

 // ---- In-view triggers ----
 const once=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)return;const t=e.target;
  if(t.matches('h2')){t.classList.add('is-in');t.closest('.section-heading')?.classList.add('is-in')}
  else if(t.matches('.count-target'))countUp(t);
  else t.classList.add('is-in');
  once.unobserve(t)}),{threshold:.35,rootMargin:'0px 0px -8% 0px'});
 headings.forEach(h=>once.observe(h));
 $$('.section-heading').forEach(s=>{if(!s.querySelector('h2'))s.classList.add('is-in')});
 const portrait=$('.about-portrait');if(portrait)once.observe(portrait);
 $$('.cs-stats dd,.map-stat b,.allo-bottom>div>b').forEach(b=>{b.classList.add('count-target');once.observe(b)});

 // ---- Scroll-linked scenes ----
 const heroSection=$('.hero'),heroCopy=$('.hero-copy'),heroArt=$('.hero-art');
 const scenes=$$('.projects-section,.contact-section');
 const portraitImg=$('.about-portrait>img');
 const remont=$('.remont-stage'),shots=remont?[...remont.querySelectorAll('.scroll-shot')]:[];
 const guide=$('.guide-stage'),guidePhone=guide?.querySelector('.dev-phone'),guideBot=guide?.querySelector('.guide-bot');
 const mapsPhone=$('.maps-stage .dev-phone');
 // AlloWalks: the route draws itself and a walker travels it as the card scrolls through.
 const route=$('#walkRoute'),live=route?.querySelector('.route-live'),walker=route?.querySelector('.route-walker');
 const stops=route?[...route.querySelectorAll('.route-stop')]:[],labels=route?[...route.querySelectorAll('span')]:[];
 let len=0,stopAt=[];
 if(live){len=live.getTotalLength();route.style.setProperty('--len',len.toFixed(1));
  // Where along the path each stop sits (0..1), found by sampling.
  stopAt=stops.map(c=>{const cx=+c.getAttribute('cx'),cy=+c.getAttribute('cy');let best=0,bd=1e9;for(let i=0;i<=200;i++){const pt=live.getPointAtLength(len*i/200),d=(pt.x-cx)**2+(pt.y-cy)**2;if(d<bd){bd=d;best=i/200}}return best})}
 const tracks=$$('.tape-track');let marquees=null,lastY=scrollY,velocity=0;

 const progressIn=(el,vh)=>{const r=el.getBoundingClientRect();return clamp((vh-r.top)/(vh+r.height))};
 let queued=false;
 function frame(){
  queued=false;const vh=innerHeight,y=scrollY,mobile=innerWidth<700;
  const max=document.documentElement.scrollHeight-vh;bar.style.setProperty('--progress',max>0?(y/max).toFixed(4):0);

  // Hero drifts up and fades as the page moves on; the sticker travels faster for depth.
  if(heroSection){const p=clamp(y/(heroSection.offsetHeight*.9));
   heroCopy.style.translate=`0 ${(-p*(mobile?40:90)).toFixed(1)}px`;heroCopy.style.opacity=(1-p*.75).toFixed(3);
   heroArt.style.translate=`0 ${(-p*(mobile?60:170)).toFixed(1)}px`;heroArt.style.rotate=`${(p*(mobile?3:7)).toFixed(2)}deg`;heroArt.style.scale=(1-p*.08).toFixed(3)}

  // Dark and lime sections start as an inset card and open to full width as they arrive.
  scenes.forEach(s=>{const top=s.getBoundingClientRect().top;s.style.setProperty('--r',clamp((vh-top)/(vh*.75)).toFixed(3))});


  // Remont: the real site scrolls inside the browser and the phone while you scroll the page.
  if(remont){const r=remont.getBoundingClientRect();if(r.bottom>0&&r.top<vh){const p=clamp((vh*.85-r.top)/(vh*.85+r.height*.4));shots.forEach(img=>{const frame=img.parentElement.clientHeight,travel=Math.max(0,img.clientHeight-frame);img.style.setProperty('--shift',`${(-p*travel).toFixed(1)}px`)})}}
  if(guide){const p=progressIn(guide,vh)-.5;guidePhone.style.translate=`0 ${(p*(mobile?-30:-70)).toFixed(1)}px`;guideBot.style.translate=`0 ${(p*(mobile?20:50)).toFixed(1)}px`}
  if(mapsPhone){const p=progressIn(mapsPhone,vh)-.5;mapsPhone.style.translate=`0 ${(p*(mobile?-24:-50)).toFixed(1)}px`}
  if(live){const r=route.getBoundingClientRect();const p=clamp((vh*.9-r.top)/(vh*.5));route.style.setProperty('--p',p.toFixed(3));const pt=live.getPointAtLength(len*p);walker.setAttribute('transform',`translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);stops.forEach((c,i)=>{const on=p>=stopAt[i]-.01;c.classList.toggle('on',on);labels[i]?.classList.toggle('on',on)})}
  if(portraitImg){const p=progressIn(portraitImg,vh)-.5;portraitImg.style.translate=`0 ${(p*-40).toFixed(1)}px`}

  // Marquee speeds up with scroll velocity and eases back to its idle pace.
  velocity=velocity*.85+Math.abs(y-lastY)*.15;lastY=y;
  if(!marquees)marquees=tracks.map(t=>t.getAnimations?.()[0]).filter(Boolean);
  marquees.forEach(a=>a.playbackRate=1+Math.min(velocity*.25,5));
  if(velocity>.3)schedule();
 }
 function schedule(){if(!queued){queued=true;requestAnimationFrame(frame)}}
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});schedule();

 // If the visitor switches reduced motion on mid-visit, drop every inline motion style.
 reduced.addEventListener('change',()=>{if(!reduced.matches)return;removeEventListener('scroll',schedule);root.classList.remove('motion');
  [heroCopy,heroArt,portraitImg,guidePhone,guideBot,mapsPhone].forEach(el=>el?.removeAttribute('style'));shots.forEach(i=>i.style.removeProperty('--shift'));route?.style.setProperty('--p',1);scenes.forEach(s=>s.style.removeProperty('--r'));marquees?.forEach(a=>a.playbackRate=1)});
}
