(()=>{
  const css=`
  .case-pod{background:#f2eee8!important;color:#10110f!important;padding:0!important;overflow:hidden!important}
  .case-pod .pod-prod{display:grid;grid-template-columns:minmax(0,.82fr) minmax(0,1.18fr);gap:28px;padding:36px;align-items:center}
  .case-pod .pod-prod-copy{display:flex;flex-direction:column;align-items:flex-start}
  .case-pod .pod-prod-kicker{font-size:11px;font-weight:850;letter-spacing:.08em;text-transform:uppercase;opacity:.5;margin-bottom:16px}
  .case-pod .pod-prod h3{font-size:clamp(48px,5.6vw,82px);line-height:.92;letter-spacing:-.065em;margin:0 0 18px}
  .case-pod .pod-prod-lead{font-size:17px;line-height:1.48;margin:0;color:#4e504a;max-width:590px}
  .case-pod .pod-prod-metrics{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;width:100%;margin:26px 0 20px}
  .case-pod .pod-prod-metric{border:1px solid rgba(16,17,15,.12);border-radius:20px;padding:17px 18px;background:rgba(255,255,255,.68)}
  .case-pod .pod-prod-metric:first-child{background:#10110f;color:#fff}
  .case-pod .pod-prod-metric:nth-child(2){background:#c8ff00}
  .case-pod .pod-prod-metric b{display:block;font-size:32px;line-height:.95;letter-spacing:-.045em}
  .case-pod .pod-prod-metric span{display:block;margin-top:7px;font-size:12px;line-height:1.3;font-weight:750;opacity:.68}
  .case-pod .pod-prod-note{font-size:13px;line-height:1.5;color:#64655f;margin:0 0 18px}
  .case-pod .pod-prod .case-open{margin-top:0}
  .case-pod .pod-prod-media{background:#f8f5ef;border:1px solid rgba(16,17,15,.09);border-radius:28px;padding:14px;box-shadow:0 22px 60px rgba(16,17,15,.10);overflow:hidden}
  .case-pod .pod-prod-media img{display:block;width:100%;height:auto!important;max-height:none!important;object-fit:contain!important;object-position:center!important;border-radius:18px;background:#f8f5ef}
  .pod-prod-drawer{margin:24px 0;border:1px solid rgba(16,17,15,.1);border-radius:22px;padding:10px;background:#f8f5ef;overflow:hidden}
  .pod-prod-drawer img{display:block;width:100%;height:auto!important;object-fit:contain!important;border-radius:15px}
  @media(max-width:900px){.case-pod .pod-prod{grid-template-columns:1fr;padding:26px}.case-pod .pod-prod-media{order:2}.case-pod .pod-prod-copy{order:1}}
  @media(max-width:620px){.case-pod .pod-prod{padding:20px;gap:20px}.case-pod .pod-prod h3{font-size:45px}.case-pod .pod-prod-lead{font-size:15px}.case-pod .pod-prod-metrics{grid-template-columns:1fr 1fr}.case-pod .pod-prod-metric{padding:14px}.case-pod .pod-prod-metric b{font-size:27px}.case-pod .pod-prod-media{padding:8px;border-radius:22px}.case-pod .pod-prod-media img{border-radius:15px}}
  `;
  if(!document.getElementById('pod-production-fix-style')){const s=document.createElement('style');s.id='pod-production-fix-style';s.textContent=css;document.head.appendChild(s)}

  function renderCard(){
    const card=document.querySelector('.case-pod');
    if(!card||card.dataset.podProductionFixed==='1')return;
    card.dataset.podProductionFixed='1';
    card.innerHTML=`<div class="pod-prod">
      <div class="pod-prod-copy">
        <div class="pod-prod-kicker">Podslushano.nl</div>
        <h3>Медиа, сообщество и собственные digital‑продукты.</h3>
        <p class="pod-prod-lead">Проект развивается больше двух лет: контент и соцсети, сайт, Telegram, ContactGuide, бот, рекламные продукты и внутренние процессы.</p>
        <div class="pod-prod-metrics">
          <div class="pod-prod-metric"><b>77.2K</b><span>подписчиков в Instagram</span></div>
          <div class="pod-prod-metric"><b>3.86M</b><span>просмотров у одного Reels</span></div>
          <div class="pod-prod-metric"><b>1.7M</b><span>просмотров за последние 30 дней</span></div>
          <div class="pod-prod-metric"><b>3,898</b><span>подписчиков в Telegram</span></div>
        </div>
        <p class="pod-prod-note">Также: Facebook — 27K подписчиков · ContactGuide · Telegram‑бот.</p>
        <button class="case-open" type="button">Открыть кейс →</button>
      </div>
      <div class="pod-prod-media"><img data-pod-hero alt="Реальные экраны Podslushano.nl: Instagram, Reels Insights, ContactGuide и Telegram"></div>
    </div>`;
  }

  function fixDrawer(){
    const drawer=document.getElementById('caseDrawer');
    const title=document.getElementById('drawerTitle');
    if(!drawer?.classList.contains('open')||title?.textContent.trim()!=='Podslushano.nl')return;
    const source=document.getElementById('drawerSource');
    if(!source||source.querySelector('.pod-prod-drawer'))return;
    source.querySelector('.drawer-gallery')?.remove();
    source.querySelector('.pod-drawer-proof')?.remove();
    source.insertAdjacentHTML('afterbegin','<div class="pod-prod-drawer"><img data-pod-hero alt="Реальные экраны кейса Podslushano.nl"></div>');
  }

  const run=()=>{renderCard();fixDrawer()};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
  new MutationObserver(run).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
})();