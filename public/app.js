const serviceData = {
    site:{
      title:"Сайт", price:"от €250", kicker:"Для бизнеса и специалистов", color:"green",
      text:"Подходит, если нужен аккуратный одностраничный сайт, который объясняет предложение, показывает услуги и ведёт человека к заявке или записи.",
      included:["структура страницы","дизайн","адаптация под телефон","основные тексты","форма заявки","подключение домена","базовое SEO","публикация"],
      pick:"Сайт для бизнеса — от €250"
    },
    booking:{
      title:"Страница записи", price:"€100", kicker:"Для частных специалистов и услуг", color:"light",
      text:"Небольшая страница, где клиент видит услуги, цены, контакты и понятный способ записаться без лишней переписки.",
      included:["описание услуг","цены","контакты","удобный CTA","адаптация под телефон","публикация"],
      pick:"Страница онлайн-записи — €100"
    },
    automation:{
      title:"Автоматизация", price:"от €290", kicker:"Когда рутинные действия повторяются каждый день", color:"orange",
      text:"Подходит, если нужно сократить ручную работу: автоматические уведомления, передача заявок, напоминания, связки между сервисами и упрощение повторяющихся действий.",
      included:["разбор процесса","подбор сценария","настройка автоматизаций","связка сервисов","тестирование","короткая инструкция"],
      pick:"Автоматизация — от €290"
    },
    crm:{
      title:"CRM", price:"от €499", kicker:"Когда процессы уже переросли таблицы и чат", color:"blue",
      text:"Система, где в одном месте собираются заявки, клиенты, статусы, задачи и рабочие этапы. Хороший вариант, если проект уже работает и нужен порядок.",
      included:["структура CRM","этапы и статусы","карточки клиентов","рабочий pipeline","dashboard","базовые интеграции","тестирование"],
      pick:"CRM — от €499"
    },
    launch:{
      title:"Запуск проекта", price:"от €499", kicker:"Когда есть идея, но нет рабочей упаковки", color:"dark",
      text:"Помогаю собрать проект как продукт: понять формат, выстроить предложение, собрать нужные страницы и подготовить запуск так, чтобы проектом уже можно было пользоваться и продавать его.",
      included:["разбор идеи","структура предложения","pricing","сайт или лендинг","запись или заявка","базовая система процессов","подготовка к запуску"],
      pick:"Запуск проекта — от €499"
    },
    partner:{
      title:"Digital-партнёр", price:"€499 / месяц", kicker:"Если нужен человек, который ведёт digital-задачи проекта", color:"green",
      text:"Формат для бизнеса, которому нужен не разовый исполнитель, а человек, который может регулярно закрывать digital-задачи и двигать проект дальше.",
      included:["текущие digital-задачи","сайт и новые страницы","контроль заявок и процессов","небольшие доработки","исследования и поиск решений","подключение новых сценариев"],
      pick:"Digital-партнёр — €499 / месяц"
    },
    consult:{
      title:"Консультация", price:"€85", kicker:"60 минут один на один", color:"light",
      text:"Разбираем идею, проблему или следующий шаг бизнеса. После разговора у вас остаётся конкретное понимание, что делать дальше и в каком порядке.",
      included:["предварительный контекст","60 минут созвона","разбор ситуации","рекомендации","следующие шаги"],
      pick:"Стратегическая консультация — €85"
    }
  };

  const caseData = {
    podslushano:{
      title:"Podslushano.nl",
      summary:"Медиа и digital-экосистема для русскоязычной аудитории в Нидерландах.",
      task:"С ростом аудитории стало недостаточно просто публиковать контент. Нужно было выстроить рекламные продукты, процессы, сайты и автоматизацию так, чтобы проект мог работать как бизнес.",
      solution:"Собраны рекламные форматы и правила размещений, несколько digital-направлений, внутренние процессы и автоматизация публикаций. Отдельные сервисы начали работать как части одной экосистемы.",
      result:"Проект работает сразу на нескольких основных площадках и развивается больше двух лет как самостоятельный продукт.",
      metrics:[["≈106K","аудитория трёх основных площадок"],["3","основных канала"],["2+ года","развития проекта"]],
      source:"Данные проекта за 2026 год: Instagram 76K, Facebook 26K, Telegram 4K."
    },
    allo:{
      title:"Allo Walks",
      summary:"Проект прогулок и небольших офлайн-встреч по Нидерландам.",
      task:"Была идея живых встреч, но не было понятного продукта: форматов, стоимости, записи и структуры самого дня.",
      solution:"Собраны концепция, форматы, pricing, первые маршруты, запись и коммуникация с участниками. После первого теста формат был скорректирован под реальное поведение группы.",
      result:"Первая прогулка состоялась через 10 дней после запуска проекта. Сейчас формат строится вокруг небольших групп до восьми гостей.",
      metrics:[["10 дней","от запуска до первой прогулки"],["5","участников первого теста"],["до 8","гостей в текущем формате"]],
      source:"Внутренний таймлайн Allo Walks: запуск 1 июля 2026, первая прогулка 11 июля 2026."
    },
    bot:{
      title:"Поиск специалистов",
      summary:"Поиск нужного специалиста внутри Telegram вместо ручного просмотра постов и переписки с администратором.",
      task:"Пользователю нужно было быстро получить релевантный контакт по категории и городу, а проекту — убрать ручную выдачу контактов.",
      solution:"Собран сценарий поиска в Telegram: запрос пользователя, фильтрация, карточка результата и прямые способы связи со специалистом.",
      result:"Пользователь проходит путь от запроса до контакта внутри одного интерфейса, а выдача результата не требует ручного ответа администратора.",
      metrics:[["1 запрос","для начала поиска"],["3 канала","связи в карточке"],["автоматически","без ручной выдачи"]],
      source:"Измеримый пользовательский сценарий работающего Telegram-инструмента; это не маркетинговая метрика."
    }
  };

  /* header */
  const header = document.getElementById("header");
  const setHeader = () => header.classList.toggle("scrolled", scrollY > 18);
  setHeader();
  addEventListener("scroll", setHeader, {passive:true});

  /* restrained reveal */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting){ e.target.classList.add("on"); io.unobserve(e.target); }
    });
  }, {threshold:.1});
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));

  /* hero words */
  const words = [...document.querySelectorAll(".panel-word")];
  let wi = 0;
  setInterval(() => {
    words[wi].classList.remove("active");
    wi = (wi + 1) % words.length;
    words[wi].classList.add("active");
  }, 2200);

  /* services */
  const detail = document.getElementById("serviceDetail");
  const sTitle = document.getElementById("serviceTitle");
  const sPrice = document.getElementById("servicePrice");
  const sKicker = document.getElementById("serviceKicker");
  const sText = document.getElementById("serviceText");
  const sIncluded = document.getElementById("serviceIncluded");
  let currentService = "site";

  function renderService(key){
    currentService = key;
    const s = serviceData[key];
    document.querySelectorAll(".service-tab").forEach(b => b.classList.toggle("active", b.dataset.service === key));
    detail.className = "service-detail " + s.color;
    sKicker.textContent = s.kicker;
    sTitle.textContent = s.title;
    sPrice.textContent = s.price;
    sText.textContent = s.text;
    sIncluded.innerHTML = s.included.map(x => "<span>"+x+"</span>").join("");
  }
  document.querySelectorAll(".service-tab").forEach(b => {
    b.addEventListener("click", () => renderService(b.dataset.service));
  });
  document.getElementById("serviceAction").addEventListener("click", () => {
    selectContactService(serviceData[currentService].pick);
    document.getElementById("contact").scrollIntoView({behavior:"smooth"});
  });

  /* process line */
  const processWrap = document.getElementById("processWrap");
  const processFill = document.getElementById("processFill");
  function updateProcess(){
    const r = processWrap.getBoundingClientRect();
    const vh = innerHeight;
    const p = Math.max(0,Math.min(1,(vh*.72-r.top)/(r.height+vh*.16)));
    if(innerWidth <= 700){
      processFill.style.width = "3px";
      processFill.style.height = (p*100)+"%";
    } else {
      processFill.style.height = "3px";
      processFill.style.width = (p*100)+"%";
    }
  }
  addEventListener("scroll", updateProcess, {passive:true});
  addEventListener("resize", updateProcess);
  updateProcess();

  /* case drawer */
  const drawer = document.getElementById("caseDrawer");
  const dTitle = document.getElementById("drawerTitle");
  const dSummary = document.getElementById("drawerSummary");
  const dTask = document.getElementById("drawerTask");
  const dSolution = document.getElementById("drawerSolution");
  const dResult = document.getElementById("drawerResult");
  const dResults = document.getElementById("drawerResults");
  const dSource = document.getElementById("drawerSource");

  function openCase(key){
    const c = caseData[key];
    dTitle.textContent = c.title;
    dSummary.textContent = c.summary;
    dTask.textContent = c.task;
    dSolution.textContent = c.solution;
    dResult.textContent = c.result;
    dResults.innerHTML = c.metrics.map(m => '<div class="drawer-result"><b>'+m[0]+'</b><span>'+m[1]+'</span></div>').join("");
    dSource.textContent = c.source;
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden","false");
    document.body.classList.add("locked");
  }
  function closeCase(){
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden","true");
    document.body.classList.remove("locked");
  }
  document.querySelectorAll("[data-case]").forEach(card => {
    card.addEventListener("click", () => openCase(card.dataset.case));
    card.addEventListener("keydown", e => {
      if(e.key==="Enter" || e.key===" "){e.preventDefault();openCase(card.dataset.case)}
    });
  });
  document.querySelectorAll("[data-close-drawer]").forEach(x => x.addEventListener("click", closeCase));
  addEventListener("keydown", e => {if(e.key==="Escape") closeCase()});

  /* contact selection and scroll */
  const serviceInput = document.getElementById("serviceInput");
  function selectContactService(value){
    serviceInput.value = value;
    document.querySelectorAll(".contact-pick").forEach(b => b.classList.toggle("active", b.dataset.pick === value));
  }
  document.querySelectorAll(".contact-pick").forEach(b => b.addEventListener("click", () => selectContactService(b.dataset.pick)));
  document.querySelectorAll("[data-contact]").forEach(b => b.addEventListener("click", () => document.getElementById("contact").scrollIntoView({behavior:"smooth"})));

  /* form backend */
  const form = document.getElementById("leadForm");
  const submitBtn = document.getElementById("submitBtn");
  const formStatus = document.getElementById("formStatus");
  const success = document.getElementById("success");

  form.addEventListener("submit", async e => {
    e.preventDefault();
    if(!form.reportValidity()) return;

    submitBtn.disabled = true;
    submitBtn.textContent = "Отправляем…";
    formStatus.style.display = "block";
    formStatus.style.color = "var(--acid)";
    formStatus.textContent = "Отправляю заявку…";

    try{
      const payload = Object.fromEntries(new FormData(form).entries());
      const res = await fetch("/api/lead",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(payload)
      });
      const data = await res.json().catch(()=>({}));
      if(!res.ok) throw new Error(data.error || "Не удалось отправить заявку.");
      formStatus.style.display = "none";
      success.classList.add("show");
      form.reset();
      selectContactService("Не знаю — хочу обсудить задачу");
    }catch(err){
      const preview = location.protocol === "file:" || location.hostname.includes("sandbox");
      formStatus.style.color = "#ff9b9b";
      formStatus.textContent = preview
        ? "В предпросмотре серверная отправка недоступна. После публикации форма будет отправлять заявку в Telegram."
        : (err.message || "Ошибка отправки. Попробуйте ещё раз.");
    }finally{
      submitBtn.disabled = false;
      submitBtn.textContent = "Отправить заявку →";
    }
  });
