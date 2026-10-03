export function mountProjectTransition(){
 const host=document.getElementById('projectTransition');if(!host)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let queued=false,visible=false;
 const pieces=[...host.querySelectorAll('.transition-piece')],core=host.querySelector('.transition-core'),orbit=host.querySelector('.transition-orbit');
 function draw(){queued=false;const r=host.getBoundingClientRect(),p=Math.max(0,Math.min(1,(innerHeight-r.top)/(innerHeight+r.height)));const t=Math.max(0,Math.min(1,(p-.15)/.65)),spread=1-t;
 const mobile=innerWidth<600,coords=mobile?[[-100,-60],[105,-20],[-50,85]]:[[-310,-80],[310,20],[-170,100]];
 pieces.forEach((el,i)=>{el.style.transform=`translate(${coords[i][0]*spread}px,${coords[i][1]*spread}px) rotate(${[-14,12,-8][i]*spread}deg) scale(${1-.45*t})`;el.style.opacity=String(Math.max(0,1-t*1.15))});
 core.style.transform=`scale(${.65+.35*t}) rotate(${(-12+12*t)}deg)`;core.style.opacity=String(.15+.85*t);orbit.style.transform=`translate(-50%,-50%) rotate(${p*160}deg) scale(${1-.3*t})`;host.style.setProperty('--flow',String(t));}
 function schedule(){if(!reduced.matches&&visible&&!queued){queued=true;requestAnimationFrame(draw)}}
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule()},{rootMargin:'100px'}).observe(host);
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});reduced.addEventListener('change',()=>{if(reduced.matches){pieces.forEach(e=>{e.style.transform='';e.style.opacity=''});core.style.transform='';core.style.opacity='';orbit.style.transform=''}else schedule()});
}
