(()=>{
  const groups=[
    ['Frontend',['HTML','CSS','JavaScript','TypeScript']],
    ['Backend',['JavaScript (Node.js)','Python','PHP']],
    ['Frameworks',['Django','Flask','Laravel']]
  ];

  function ensureStyles(){
    if(document.getElementById('am-tech-stack-style')) return;
    const style=document.createElement('style');
    style.id='am-tech-stack-style';
    style.textContent=`
      .am-tech-stack{margin-top:26px;padding-top:22px;border-top:1px solid currentColor;opacity:.96}
      .am-tech-title{font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;opacity:.58;margin-bottom:13px}
      .am-tech-groups{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
      .am-tech-group{border:1px solid currentColor;border-radius:18px;padding:14px;background:rgba(255,255,255,.08)}
      .am-tech-group b{display:block;font-size:12px;margin-bottom:9px;opacity:.7}
      .am-tech-tags{display:flex;flex-wrap:wrap;gap:6px}
      .am-tech-tags span{border:1px solid currentColor;border-radius:999px;padding:7px 9px;font-size:10px;font-weight:800;line-height:1;opacity:.9}
      @media(max-width:700px){.am-tech-groups{grid-template-columns:1fr}.am-tech-group{padding:12px}}
    `;
    document.head.appendChild(style);
  }

  function build(){
    const detail=document.getElementById('serviceDetail');
    const title=document.getElementById('serviceTitle');
    if(!detail||!title) return;
    let block=detail.querySelector('.am-tech-stack');
    const isSite=title.textContent.trim()==='Сайт';
    if(!isSite){ if(block) block.remove(); return; }
    if(block) return;
    block=document.createElement('div');
    block.className='am-tech-stack';
    block.innerHTML=`<div class="am-tech-title">Технологии и языки</div><div class="am-tech-groups">${groups.map(([name,items])=>`<div class="am-tech-group"><b>${name}</b><div class="am-tech-tags">${items.map(x=>`<span>${x}</span>`).join('')}</div></div>`).join('')}</div>`;
    const included=document.getElementById('serviceIncluded');
    if(included) included.insertAdjacentElement('afterend',block); else detail.appendChild(block);
  }

  function init(){
    ensureStyles();
    build();
    document.querySelectorAll('.service-tab').forEach(btn=>btn.addEventListener('click',()=>setTimeout(build,0)));
    const title=document.getElementById('serviceTitle');
    if(title) new MutationObserver(build).observe(title,{childList:true,subtree:true,characterData:true});
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();