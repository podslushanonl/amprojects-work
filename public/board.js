import { reels } from './site-data.js?v=29';
// Podslushano.nl case board: real screenshots on a canvas, linked by animated flows.
// Drag / wheel+Ctrl / pinch to explore; chapter buttons fly the camera; works the same on phone and desktop.
export function mountBoard(openCase){
 const host=document.getElementById('ecosystem'),viewport=document.getElementById('boardViewport'),world=document.getElementById('boardWorld');
 const W=2260,H=1180;world.style.width=W+'px';world.style.height=H+'px';world.classList.add('bd-world');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const img=(f,alt,cls='')=>`<img class="${cls}" src="/assets/cases/${f}" alt="${alt}" draggable="false" loading="lazy">`;
 const node=(id,x,y,w,cls,html,label)=>`<button type="button" class="bd-node ${cls}" data-node="${id}" style="left:${x}px;top:${y}px;width:${w}px" aria-label="${label}">${html}</button>`;
 const chrome=url=>`<span class="bd-bar"><i></i><i></i><i></i><span>${url}</span></span>`;
 const reelCards=reels.map((r,i)=>node('reel-'+r.id,60+i*168,170,152,'bd-reel',`${img(r.image,r.title)}<span class="bd-reel-meta"><b>${(parseInt(r.views.replace(/,/g,''))/1e6).toFixed(2)}M</b><small>${r.title}</small></span>`,`Reels «${r.title}»: ${r.views} просмотров`)).join('');
 // Links: from-node → to-node, drawn as curves between the given anchor points.
 const links=[
  ['content','instagram','M712 300 C760 300 770 330 820 330'],
  ['proof','instagram','M610 640 C720 640 730 420 820 400'],
  ['instagram','site','M1250 300 C1360 300 1380 250 1500 250'],
  ['instagram','guide','M1250 380 C1380 380 1370 560 1500 560'],
  ['telegram','bot','M1250 860 C1370 860 1370 930 1500 930'],
  ['facebook','site','M1030 700 C1130 640 1300 300 1500 270'],
  ['guide','bot','M1620 760 L1620 820'],
  ['site','ads','M2030 250 C2120 250 2120 820 2030 860']
 ];
 world.innerHTML=`<svg class="bd-links" viewBox="0 0 ${W} ${H}" aria-hidden="true">${links.map(([a,b,d],i)=>`<g class="bd-link" data-from="${a}" data-to="${b}"><path d="${d}"/><circle r="4"><animateMotion dur="${2.6+i%3*.5}s" repeatCount="indefinite" path="${d}" begin="${-i*.4}s"/></circle></g>`).join('')}</svg>
 <div class="bd-chapter" style="left:60px;top:60px"><span>01 · Контент</span><b>Привлекаю внимание</b><p>Reels о жизни в Нидерландах, которые смотрят миллионы.</p></div>
 <div class="bd-chapter" style="left:820px;top:60px"><span>02 · Аудитория</span><b>Собираю сообщество</b><p>Три площадки одного медиа.</p></div>
 <div class="bd-chapter" style="left:1500px;top:60px"><span>03 · Сервисы</span><b>Превращаю аудиторию в продукт</b><p>Сайт, каталог специалистов, бот и реклама.</p></div>
 ${reelCards}
 ${node('reel-boat',60,500,230,'bd-phone',`<span class="bd-screen">${img('ph-reel-boat.webp','Статистика Reels в Instagram: 3,561,795 просмотров')}</span>`,'Статистика ролика: 3,561,795 просмотров')}
 ${node('reel-boat',320,560,330,'bd-note bd-proof',`<span class="bd-kicker">Статистика одного ролика</span><b>3,561,795</b><small>просмотров</small><span class="bd-row"><span><b>2.2M</b>охват</span><span><b>3,694</b>подписки</span><span><b>17.4K</b>сохранений</span></span>`,'Статистика ролика «Только в Нидерландах»')}
 ${node('instagram',820,170,430,'bd-shot',`<span class="bd-tag">Instagram</span>${img('card-instagram.webp','Профиль Podslushano.nl в Instagram: 77.2K подписчиков')}`,'Instagram: 77.2K подписчиков')}
 ${node('audience',820,560,430,'bd-shot bd-dash',`${img('ig-dashboard.webp','Панель Instagram: 1.7M просмотров за 30 дней')}`,'1.7M просмотров за 30 дней')}
 ${node('facebook',820,670,205,'bd-shot',`<span class="bd-tag">Facebook</span>${img('card-facebook.webp','Страница Podslushano.nl в Facebook: 27 тысяч подписчиков')}`,'Facebook: 27 тысяч подписчиков')}
 ${node('telegram',1045,670,205,'bd-shot',`<span class="bd-tag">Telegram</span>${img('card-telegram.webp','Telegram-канал: 3,898 подписчиков')}`,'Telegram: 3,898 подписчиков')}
 ${node('pnlsite',1500,170,530,'bd-browser',`${chrome('podslushano.nl')}${img('guide-home.webp','Главная страница podslushano.nl')}`,'Сайт podslushano.nl')}
 ${node('guide',1500,450,530,'bd-browser',`${chrome('podslushano.nl / ContactGuide')}${img('guide-catalog.webp','Каталог ContactGuide: провинции и специалисты')}`,'Каталог специалистов ContactGuide')}
 ${node('bot',1500,820,240,'bd-shot bd-dark',`<span class="bd-tag">Telegram-бот</span>${img('card-bot.webp','Профиль Telegram-бота podslushano.nl')}`,'Telegram-бот Podslushano.nl')}
 ${node('automation',1770,860,260,'bd-note',`<span class="bd-kicker">Монетизация</span><b class="bd-sm">Реклама для бизнеса</b><small>Размещения, заявки рекламодателей и выпуск материалов — на одной системе.</small>`,'Реклама и процессы')}`;

 // Caption + step controls inside the viewport (same on phone and desktop).
 const views={
  all:{box:[30,30,W-30,H-40],text:'Вся система: контент приводит аудиторию, аудитория приходит в сервисы.'},
  content:{box:[40,40,720,1000],text:'Reels о Нидерландах: до 3.86M просмотров у одного ролика.'},
  audience:{box:[800,40,1270,1000],text:'Instagram, Facebook и Telegram — одно сообщество на трёх площадках.'},
  products:{box:[1480,40,2050,1150],text:'Сайт, каталог ContactGuide и бот — сюда аудитория приходит за пользой.'}
 };
 const order=()=>viewport.clientWidth<700?['content','audience','products','all']:['all','content','audience','products'];
 const cap=document.createElement('div');cap.className='bd-caption';cap.innerHTML='<p aria-live="polite"></p><button type="button" class="bd-next">Дальше <span aria-hidden="true">→</span></button>';viewport.append(cap);

 let scale=1,tx=0,ty=0,drag=null,lastDrag=0,pinch=null,current='all';const pointers=new Map();
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
 function render(){const vw=viewport.clientWidth,vh=viewport.clientHeight;tx=clamp(tx,vw*.5-W*scale,vw*.5);ty=clamp(ty,vh*.5-H*scale,vh*.5);world.style.transform=`translate3d(${tx}px,${ty}px,0) scale(${scale})`;document.getElementById('zoomValue').value=Math.round(scale*100)+'%'}
 function fly(on){world.classList.toggle('bd-flying',on&&!reduced.matches)}
 function fit([x1,y1,x2,y2],animate=true){const vw=viewport.clientWidth,vh=viewport.clientHeight-(vw<700?64:0);const s=clamp(Math.min((vw-32)/(x2-x1),(vh-32)/(y2-y1)),.12,1.2);if(animate)fly(true);scale=s;tx=vw/2-(x1+x2)/2*s;ty=vh/2-(y1+y2)/2*s-(vw<700?24:0);render();if(animate)setTimeout(()=>fly(false),950)}
 function goView(key,animate=true){current=key;host.querySelectorAll('[data-board-view]').forEach(b=>{const on=b.dataset.boardView===key;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on))});cap.querySelector('p').textContent=views[key].text;cap.querySelector('.bd-next').innerHTML=key===order().at(-1)?'Сначала <span aria-hidden="true">↺</span>':'Дальше <span aria-hidden="true">→</span>';world.dataset.focus=key;fit(views[key].box,animate)}
 function changeZoom(f,cx=viewport.clientWidth/2,cy=viewport.clientHeight/2){const next=clamp(scale*f,.12,1.6),k=next/scale;tx=cx-(cx-tx)*k;ty=cy-(cy-ty)*k;scale=next;render()}
 host.querySelectorAll('[data-board-view]').forEach(b=>b.addEventListener('click',()=>goView(b.dataset.boardView)));
 cap.querySelector('.bd-next').addEventListener('click',e=>{e.stopPropagation();{const o=order();goView(o[(o.indexOf(current)+1)%o.length])}});
 document.getElementById('zoomIn').addEventListener('click',()=>changeZoom(1.25));document.getElementById('zoomOut').addEventListener('click',()=>changeZoom(1/1.25));document.getElementById('zoomReset').addEventListener('click',()=>goView('all'));

 // Hover/focus a node: light up its flows, dim the rest.
 const lit=id=>{world.querySelectorAll('.bd-link').forEach(g=>g.classList.toggle('lit',!!id&&(g.dataset.from===id||g.dataset.to===id||(id.startsWith('reel')&&(g.dataset.from==='content'||g.dataset.from==='proof')))));world.classList.toggle('bd-hovering',!!id)};
 world.addEventListener('pointerover',e=>{const n=e.target.closest('[data-node]');if(n&&e.pointerType==='mouse')lit(n.dataset.node)});
 world.addEventListener('pointerout',e=>{if(!e.relatedTarget||!e.relatedTarget.closest?.('[data-node]'))lit(null)});

 const local=e=>{const r=viewport.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}};
 viewport.addEventListener('pointerdown',e=>{if(e.button!==0||e.target.closest('.bd-caption'))return;fly(false);const p=local(e);pointers.set(e.pointerId,p);viewport.setPointerCapture(e.pointerId);if(pointers.size===1)drag={...p,tx,ty,moved:false};if(pointers.size===2){const[a,b]=[...pointers.values()],mid={x:(a.x+b.x)/2,y:(a.y+b.y)/2};pinch={d:Math.hypot(a.x-b.x,a.y-b.y),scale,wx:(mid.x-tx)/scale,wy:(mid.y-ty)/scale};if(drag)drag.moved=true}});
 viewport.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;const p=local(e);pointers.set(e.pointerId,p);if(pointers.size===2&&pinch){const[a,b]=[...pointers.values()];scale=clamp(pinch.scale*Math.hypot(a.x-b.x,a.y-b.y)/Math.max(1,pinch.d),.12,1.6);tx=(a.x+b.x)/2-pinch.wx*scale;ty=(a.y+b.y)/2-pinch.wy*scale;render()}else if(drag&&pointers.size===1){const dx=p.x-drag.x,dy=p.y-drag.y;if(Math.hypot(dx,dy)>6)drag.moved=true;if(drag.moved){tx=drag.tx+dx;ty=drag.ty+dy;render()}}});
 function end(e){if(drag?.moved||pinch)lastDrag=performance.now();pointers.delete(e.pointerId);if(viewport.hasPointerCapture(e.pointerId))viewport.releasePointerCapture(e.pointerId);pinch=null;if(pointers.size){const p=[...pointers.values()][0];drag={...p,tx,ty,moved:true}}else drag=null}
 viewport.addEventListener('pointerup',end);viewport.addEventListener('pointercancel',end);
 // Pointer capture sends the click to the viewport: resolve the real target at release, never through the caption.
 viewport.addEventListener('click',e=>{if(e.target.closest('.bd-caption'))return;if(performance.now()-lastDrag<220)return;const t=document.elementFromPoint(e.clientX,e.clientY);if(t?.closest('.bd-caption'))return;const n=t?.closest('[data-node]');if(n&&world.contains(n))openCase(n.dataset.node)});
 world.addEventListener('keydown',e=>{const n=e.target.closest('[data-node]');if(n&&(e.key==='Enter'||e.key===' ')){e.preventDefault();openCase(n.dataset.node)}});
 world.addEventListener('focusin',e=>{const n=e.target.closest('[data-node]');if(!n)return;const r=n.getBoundingClientRect(),v=viewport.getBoundingClientRect();if(r.left<v.left||r.right>v.right||r.top<v.top||r.bottom>v.bottom){const x=parseFloat(n.style.left)+n.offsetWidth/2,y=parseFloat(n.style.top)+n.offsetHeight/2;scale=Math.max(scale,.6);tx=v.width/2-x*scale;ty=v.height/2-y*scale;render()}});
 viewport.addEventListener('wheel',e=>{if(e.ctrlKey||e.metaKey){e.preventDefault();fly(false);const p=local(e);changeZoom(Math.exp(-e.deltaY*.008),p.x,p.y)}else if(e.shiftKey){e.preventDefault();tx-=e.deltaY||e.deltaX;render()}},{passive:false});
 viewport.addEventListener('keydown',e=>{if(e.target!==viewport)return;const m={ArrowLeft:[80,0],ArrowRight:[-80,0],ArrowUp:[0,80],ArrowDown:[0,-80]}[e.key];if(m){e.preventDefault();tx+=m[0];ty+=m[1];render()}if(e.key==='+'||e.key==='='){e.preventDefault();changeZoom(1.25)}if(e.key==='-'){e.preventDefault();changeZoom(1/1.25)}});
 const full=document.getElementById('boardFullscreen');
 function expand(v){host.classList.toggle('expanded',v);full.setAttribute('aria-label',v?'Свернуть доску':'Развернуть доску');full.innerHTML=v?'<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>':'<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>';document.body.classList.toggle('locked',v||document.getElementById('caseDialog').open);requestAnimationFrame(()=>goView(current,false));if(v)viewport.focus({preventScroll:true})}
 full.addEventListener('click',()=>expand(!host.classList.contains('expanded')));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!document.getElementById('caseDialog').open&&host.classList.contains('expanded')){expand(false);full.focus({preventScroll:true})}});
 let pw=viewport.clientWidth;new ResizeObserver(()=>{if(Math.abs(viewport.clientWidth-pw)>30){pw=viewport.clientWidth;goView(current,false)}}).observe(viewport);
 goView(viewport.clientWidth<700?'content':'all',false);
 document.getElementById('boardHint').textContent=matchMedia('(pointer:coarse)').matches?'Двигайте доску пальцем, приближайте двумя · нажмите на карточку':'Перетаскивайте доску · Ctrl + колесо для масштаба · нажмите на карточку';
}
