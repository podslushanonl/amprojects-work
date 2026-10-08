// Hero scene + process flow + desktop cursor. Everything pauses off-screen and respects reduced motion.
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const fine=matchMedia('(pointer: fine)');
const wait=ms=>new Promise(r=>setTimeout(r,ms));

function heroScene(){
 const s=document.getElementById('heroScene');if(!s)return;
 const browser=s.querySelector('.hs-browser'),btn=s.querySelector('.hs-btn'),count=s.querySelector('.hs-count');
 const setStep=n=>s.dataset.step=n;
 // Cursor position, relative to the browser frame, in percent so it scales with the scene.
 const cursorTo=(x,y)=>{s.style.setProperty('--cx',x+'%');s.style.setProperty('--cy',y+'%')};
 const aimButton=()=>{const b=browser.getBoundingClientRect(),r=btn.getBoundingClientRect();cursorTo(((r.left+r.width*.55-b.left)/b.width*100).toFixed(1),((r.top+r.height*.55-b.top)/b.height*100).toFixed(1))};
 let visible=true;new IntersectionObserver(e=>{visible=e[0].isIntersecting},{threshold:.1}).observe(s);
 const idle=async()=>{while(!visible||document.hidden)await wait(400)};
 const views=3860000;let counted=false;
 const countUp=()=>{if(counted)return;counted=true;const t0=performance.now(),d=2200;const f=now=>{const t=Math.min(1,(now-t0)/d),e=1-Math.pow(1-t,3),v=views*e;count.textContent=v>=1e6?(v/1e6).toFixed(2)+'M':v>=1e3?Math.round(v/1e3)+'K':Math.round(v);if(t<1)requestAnimationFrame(f)};requestAnimationFrame(f)};
 if(reduced.matches){setStep(9);count.textContent='3.86M';return}
 cursorTo(88,92);
 (async()=>{
  await wait(500);
  // Build the site once.
  for(const [n,ms] of [[1,450],[2,650],[3,700],[4,600]]){await idle();setStep(n);await wait(ms)}
  countUp();
  // Then loop: client clicks → lead arrives → it moves through the pipeline.
  for(;;){
   await idle();aimButton();await wait(900);
   setStep(5);await wait(450);          // click
   setStep(6);await wait(1300);         // lead notification
   setStep(7);await wait(1400);         // CRM: in progress
   setStep(8);await wait(2300);         // CRM: done
   cursorTo(80+Math.random()*10,80+Math.random()*12);setStep(4);await wait(1400);
  }
 })();
 // Desktop: floating cards follow the pointer at different depths.
 if(fine.matches){const hero=s.closest('.hero');let raf=0;hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect(),mx=(e.clientX-r.left)/r.width*2-1,my=(e.clientY-r.top)/r.height*2-1;cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{s.style.setProperty('--mx',mx.toFixed(3));s.style.setProperty('--my',my.toFixed(3))})});hero.addEventListener('pointerleave',()=>{s.style.setProperty('--mx',0);s.style.setProperty('--my',0)})}
}

function processFlow(){
 const flow=document.getElementById('processFlow');if(!flow)return;
 const steps=[...flow.querySelectorAll('.flow-step')];
 if(reduced.matches||!('IntersectionObserver' in window)){flow.style.setProperty('--fp',1);steps.forEach(s=>s.classList.add('is-in'));return}
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target)}}),{threshold:.35});steps.forEach(s=>io.observe(s));
 let q=false;const draw=()=>{q=false;const r=flow.getBoundingClientRect(),vh=innerHeight;flow.style.setProperty('--fp',Math.max(0,Math.min(1,(vh*.85-r.top)/(r.height*.9))).toFixed(3))};
 addEventListener('scroll',()=>{if(!q){q=true;requestAnimationFrame(draw)}},{passive:true});draw();
}

function cursorAndMagnets(){
 if(!fine.matches||reduced.matches)return;
 // Follower ring with a context label over cases and the board.
 const ring=document.createElement('div');ring.className='fx-cursor';ring.innerHTML='<span></span>';document.body.append(ring);
 let x=-100,y=-100,tx=-100,ty=-100,on=false;
 addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;if(!on){on=true;ring.classList.add('on')}
  const t=e.target.closest?.('[data-cursor],a,button,.bd-node,.dev-browser,.dev-phone');
  const label=t?.closest?.('[data-cursor]')?.dataset.cursor||'';
  ring.classList.toggle('hover',!!t);ring.classList.toggle('label',!!label);ring.firstChild.textContent=label},{passive:true});
 document.addEventListener('pointerleave',()=>{on=false;ring.classList.remove('on')});
 const loop=()=>{x+=(tx-x)*.2;y+=(ty-y)*.2;ring.style.transform=`translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;requestAnimationFrame(loop)};loop();
 // Magnetic primary buttons.
 document.querySelectorAll('.button.dark,.cs-btn,.bd-next').forEach(b=>{
  b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.translate=`${((e.clientX-r.left)/r.width-.5)*10}px ${((e.clientY-r.top)/r.height-.5)*8}px`});
  b.addEventListener('pointerleave',()=>{b.style.translate=''});
 });
}

export function mountHeroScene(){heroScene();processFlow();cursorAndMagnets()}
