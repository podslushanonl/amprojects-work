(()=>{
  const list=document.querySelector('.project-list');
  if(!list)return;

  list.innerHTML=`
    <article class="project real-case case-pod reveal visible" data-real-case="podslushano" tabindex="0">
      <div class="case-media">
        <div class="pod-stage">
          <div class="v8-shot v8-pod-profile pod-profile"></div>
          <div class="v8-shot v8-pod-reel3561 pod-reel"></div>
          <div class="v8-shot v8-pod-reel3864 pod-insight"></div>
          <div class="v8-shot v8-pod-contact pod-contact"></div>
        </div>
        <span class="case-open">↗</span>
      </div>
      <div class="case-copy">
        <div><h3>Podslushano.nl</h3><p>Медиа-проект, который вырос в экосистему: соцсети, сайт, Telegram-бот, каталог специалистов и собственные digital-продукты.</p></div>
        <div class="case-kpis"><div class="case-kpi"><b>77.2K</b><span>Instagram</span></div><div class="case-kpi"><b>3.86M</b><span>просмотров Reels</span></div><div class="case-kpi"><b>1.7M</b><span>views за 30 дней</span></div></div>
      </div>
    </article>

    <article class="project real-case case-allo reveal visible" data-real-case="allo" tabindex="0">
      <div class="case-media"><div class="allo-stage"><div class="v8-shot v8-allo-profile allo-profile"></div><div class="v8-shot v8-allo-logo allo-logo"></div></div><span class="case-open">↗</span></div>
      <div class="case-copy"><div><h3>AlloWalks</h3><p>Прогулки и офлайн-встречи: продукт, форматы, маршруты, запись и контент. Web-часть готовится.</p><span class="case-state">сайт в разработке</span></div></div>
    </article>

    <article class="project real-case case-remont reveal visible" data-real-case="remont" tabindex="0">
      <div class="case-media"><div class="remont-stage"><div class="v8-shot v8-remont-profile remont-profile"></div><div class="browser-card"><div class="browser-bar"><i></i><i></i><i></i><span class="browser-url">remonthaarlem.nl</span></div><div class="browser-body"><small>website</small><strong>Remont Haarlem</strong><span>услуги · кейсы · контакты</span></div></div></div><span class="case-open">↗</span></div>
      <div class="case-copy"><div><h3>Remont Haarlem</h3><p>Сайт и digital-представление строительной компании с понятной структурой услуг и мобильной версией.</p></div><div class="case-kpis"><div class="case-kpi"><b>2,334</b><span>Instagram</span></div><div class="case-kpi"><b>live</b><span>remonthaarlem.nl</span></div></div></div>
    </article>

    <article class="project real-case case-map reveal visible" data-real-case="grayscale" tabindex="0">
      <div class="case-media"><div class="map-stage"><div class="map-grid"></div><div class="map-water"></div><i class="map-road r1"></i><i class="map-road r2"></i><i class="map-road r3"></i><div class="google-pin"></div><div class="map-label"><b>Grayscale Studios</b><span>Google Business Profile</span></div><div class="google-maps-badge">Google Maps · точка опубликована</div></div><span class="case-open">↗</span></div>
      <div class="case-copy"><div><h3>Grayscale Studios</h3><p>Точечная задача: создать и оформить присутствие бизнеса в Google Maps.</p><span class="case-state">Google Business Profile</span></div></div>
    </article>

    <article class="project real-case case-guide reveal visible" data-real-case="guide" tabindex="0">
      <div class="case-media"><div class="guide-stage"><div class="v8-shot v8-pod-contact guide-web"></div><div class="v8-shot v8-pod-bot guide-bot"></div></div><span class="case-open">↗</span></div>
      <div class="case-copy"><div><h3>ContactGuide</h3><p>Каталог + Telegram-бот: пользователь формулирует запрос и получает путь к подходящему специалисту.</p></div><div class="case-kpis"><div class="case-kpi"><b>web</b><span>каталог</span></div><div class="case-kpi"><b>bot</b><span>поиск и контакт</span></div></div></div>
    </article>`;

  const cases={
    podslushano:{
      title:'Podslushano.nl',
      summary:'Русскоязычный медиа-проект и digital-экосистема в Нидерландах.',
      task:'По мере роста аудитории одной социальной сети стало недостаточно. Нужно было связать контент, рекламные продукты, сайт, Telegram, каталог специалистов и внутренние процессы в одну рабочую систему.',
      solution:'Развиты основные площадки, запущены сайт, Telegram-бот и ContactGuide, собраны рекламные форматы и автоматизирована часть регулярных процессов.',
      result:'На присланных Instagram Insights отдельные Reels достигали 3,864,699; 3,561,795 и 2,802,088 просмотров. Один из Reels охватил 2,235,493 аккаунта. Instagram-профиль — 77.2K подписчиков.',
      metrics:[['77.2K','Instagram followers'],['3.86M','просмотров Reels'],['2.24M','accounts reached'],['1.7M','views / 30 дней'],['3.9K','Telegram'],['27K','Facebook']],
      shots:['v8-pod-profile','v8-pod-reel3561','v8-pod-reel3864','v8-pod-content','v8-pod-contact','v8-pod-bot','v8-pod-telegram','v8-pod-facebook'],
      links:[['Instagram','https://www.instagram.com/podslushano.nl/'],['Сайт','https://podslushano.nl/'],['Telegram','https://t.me/podslushanovnl']]
    },
    allo:{
      title:'AlloWalks',summary:'Проект прогулок и небольших офлайн-встреч.',
      task:'Превратить идею живых встреч в понятный продукт: формат, стоимость, маршруты, запись и коммуникацию с участниками.',
      solution:'Собраны форматы прогулок, pricing, первые маршруты и контент. Проект работает в Instagram; отдельная web-часть сейчас готовится.',
      result:'Проект прошёл первые реальные тесты и продолжает развиваться. Здесь используются только собственные материалы Allo — статистика совместных публикаций Podslushano не переносится в результаты этого проекта.',
      metrics:[['72','публикации'],['225','followers на скриншоте'],['web','в разработке']],
      shots:['v8-allo-profile','v8-allo-logo'],
      links:[['Instagram-публикация','https://www.instagram.com/p/Da--d8sjmwJ/?stkn=NG1zbmxjYWs1ZmRt']]
    },
    remont:{
      title:'Remont Haarlem',summary:'Сайт и digital-представление строительной компании.',
      task:'Собрать отдельную понятную площадку для услуг строительной компании и привести digital-представление бизнеса к единой структуре.',
      solution:'Собраны структура сайта, услуги, кейсы, контакты и мобильная версия. Подготовлена площадка, на которую можно вести клиента из Instagram и других каналов.',
      result:'Сайт remonthaarlem.nl опубликован и работает. На присланном Instagram-профиле — 2,334 подписчика.',
      metrics:[['2,334','Instagram followers'],['138','публикаций'],['live','сайт опубликован']],
      shots:['v8-remont-profile'],
      remote:['https://thb.tildacdn.net/tild3833-6534-4161-b934-646531633466/-/empty/WhatsApp_Image_2025-.jpeg','https://thb.tildacdn.net/tild3735-3264-4732-b133-396138313531/-/empty/6C1E5B58-5BB9-4168-9.jpg'],
      links:[['Открыть сайт','https://remonthaarlem.nl/']]
    },
    grayscale:{
      title:'Grayscale Studios',summary:'Google Business Profile для отдельного направления бизнеса.',
      task:'Добавить Grayscale Studios в Google Maps и создать нормальную точку входа для людей, которые ищут бизнес через карты.',
      solution:'Создан и оформлен Google Business Profile с основной информацией и присутствием на карте.',
      result:'У Grayscale Studios появилась отдельная опубликованная точка в Google Maps. Других работ этому кейсу не приписываю.',
      metrics:[['Google Maps','точка опубликована']],shots:[],map:true,
      links:[['Открыть точку в Google Maps','https://maps.app.goo.gl/ywojc9xkTjEJmr5t9']]
    },
    guide:{
      title:'ContactGuide',summary:'Каталог специалистов и Telegram-помощник Podslushano.',
      task:'Сократить путь от вопроса пользователя до нужного специалиста и убрать ручной поиск контактов по старым публикациям и чатам.',
      solution:'Собран web-каталог ContactGuide и сценарий Telegram-бота: запрос → категория/специалист → прямой контакт.',
      result:'Поиск специалиста превращён в отдельный пользовательский сценарий, а не в ручной ответ администратора.',
      metrics:[['web','каталог специалистов'],['bot','поиск и выдача контакта']],shots:['v8-pod-contact','v8-pod-bot'],
      links:[['Podslushano.nl','https://podslushano.nl/']]
    }
  };

  const drawer=document.getElementById('caseDrawer');
  const dTitle=document.getElementById('drawerTitle'),dSummary=document.getElementById('drawerSummary'),dTask=document.getElementById('drawerTask'),dSolution=document.getElementById('drawerSolution'),dResult=document.getElementById('drawerResult'),dResults=document.getElementById('drawerResults'),dSource=document.getElementById('drawerSource');
  if(!drawer||!dTitle)return;
  const panel=drawer.querySelector('.drawer-panel');
  let gallerySlot=document.getElementById('v8GallerySlot');
  if(!gallerySlot){
    gallerySlot=document.createElement('div');gallerySlot.id='v8GallerySlot';
    const firstBlock=panel.querySelector('.drawer-block');panel.insertBefore(gallerySlot,firstBlock);
  }
  if(!panel.querySelector('.case-structure')){
    const blocks=[...panel.querySelectorAll('.drawer-block')].slice(0,3);
    const structure=document.createElement('div');structure.className='case-structure';
    panel.insertBefore(structure,blocks[0]);blocks.forEach(b=>structure.appendChild(b));
    panel.appendChild(dResults);panel.appendChild(dSource);
  }

  function mapVisual(){return `<div class="map-stage" style="position:relative;inset:auto;height:330px;margin-top:4px"><div class="map-grid"></div><div class="map-water"></div><i class="map-road r1"></i><i class="map-road r2"></i><i class="map-road r3"></i><div class="google-pin"></div><div class="map-label"><b>Grayscale Studios</b><span>Google Business Profile</span></div><div class="google-maps-badge">Google Maps · открыть точку ниже</div></div>`}
  function openReal(key){
    const c=cases[key];if(!c)return;
    dTitle.textContent=c.title;dSummary.textContent=c.summary;dTask.textContent=c.task;dSolution.textContent=c.solution;dResult.textContent=c.result;
    dResults.style.display=c.metrics.length?'grid':'none';dResults.innerHTML=c.metrics.map(m=>`<div class="drawer-result"><b>${m[0]}</b><span>${m[1]}</span></div>`).join('');
    let gallery='';
    if(c.shots?.length)gallery+=`<div class="v8-drawer-gallery">${c.shots.map(s=>`<div class="v8-drawer-shot ${s}"></div>`).join('')}</div>`;
    if(c.remote?.length)gallery+=`<div class="v8-remote-grid">${c.remote.map(src=>`<img class="v8-remote-shot" src="${src}" alt="${c.title}" loading="lazy">`).join('')}</div>`;
    if(c.map)gallery+=mapVisual();
    gallerySlot.innerHTML=gallery;
    dSource.innerHTML=`<div class="drawer-links">${c.links.map(l=>`<a href="${l[1]}" target="_blank" rel="noopener">${l[0]} ↗</a>`).join('')}</div>`;
    drawer.classList.add('open');drawer.setAttribute('aria-hidden','false');document.body.classList.add('no-scroll');
  }

  list.querySelectorAll('[data-real-case]').forEach(card=>{
    card.addEventListener('click',()=>openReal(card.dataset.realCase));
    card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openReal(card.dataset.realCase)}});
  });
})();