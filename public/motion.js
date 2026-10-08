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
 $$('.pod-case-summary b,.map-stat b,.allo-bottom b').forEach(b=>{b.classList.add('count-target');once.observe(b)});

 // ---- Scroll-linked scenes ----
 const heroSection=$('.hero'),heroCopy=$('.hero-copy'),heroArt=$('.hero-art');
 const scenes=$$('.projects-section,.contact-section');
 const showcase=$('.website-showcase'),browser=showcase?.querySelector('.desktop-browser'),phone=showcase?.querySelector('.phone-preview');
 const portraitImg=$('.about-portrait>img'),map=$('.live-map');
 const strip=$('.discipline-strip>div');let marquee=null,lastY=scrollY,velocity=0;

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

  // Remont: the phone moves faster than the desktop screen, giving the showcase depth.
  if(showcase){const p=progressIn(showcase,vh)-.5;browser.style.translate=`0 ${(p*-30).toFixed(1)}px`;phone.style.translate=`0 ${(p*(mobile?-40:-110)).toFixed(1)}px`}
  if(portraitImg){const p=progressIn(portraitImg,vh)-.5;portraitImg.style.translate=`0 ${(p*-40).toFixed(1)}px`}
  if(map&&!mobile){const p=progressIn(map,vh)-.5;map.style.translate=`0 ${(p*-36).toFixed(1)}px`}

  // Marquee speeds up with scroll velocity and eases back to its idle pace.
  velocity=velocity*.85+Math.abs(y-lastY)*.15;lastY=y;
  if(!marquee&&strip)marquee=strip.getAnimations?.()[0]||null;
  if(marquee)marquee.playbackRate=1+Math.min(velocity*.35,7);
  if(velocity>.3)schedule();
 }
 function schedule(){if(!queued){queued=true;requestAnimationFrame(frame)}}
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});schedule();

 // If the visitor switches reduced motion on mid-visit, drop every inline motion style.
 reduced.addEventListener('change',()=>{if(!reduced.matches)return;removeEventListener('scroll',schedule);root.classList.remove('motion');
  [heroCopy,heroArt,browser,phone,portraitImg,map].forEach(el=>el?.removeAttribute('style'));scenes.forEach(s=>s.style.removeProperty('--r'));if(marquee)marquee.playbackRate=1});
}
