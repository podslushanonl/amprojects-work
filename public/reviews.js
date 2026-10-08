const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const star='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m12 2.8 2.85 5.77 6.37.93-4.61 4.49 1.09 6.35L12 17.34l-5.7 3 1.09-6.35L2.78 9.5l6.37-.93Z"/></svg>';
export function ratingStats(entries){
 const reviews=entries.filter(r=>r&&r.published===true&&typeof r.name==='string'&&r.name.trim()&&typeof r.text==='string'&&r.text.trim()&&Number.isInteger(r.rating)&&r.rating>=1&&r.rating<=5);
 return {reviews,count:reviews.length,average:reviews.length?reviews.reduce((sum,r)=>sum+r.rating,0)/reviews.length:null};
}
const plural=n=>n%100>=11&&n%100<=14?'отзывов':n%10===1?'отзыв':n%10>=2&&n%10<=4?'отзыва':'отзывов';
function stars(value){return `<div class="rating-stars" role="img" aria-label="${value===null?'Оценок пока нет':escape(value.toLocaleString('ru-RU',{maximumFractionDigits:1}))+' из 5'}">${Array.from({length:5},(_,i)=>`<span class="rating-star"><span class="star-outline">${star}</span><span class="star-fill" style="width:${value===null?0:Math.max(0,Math.min(1,value-i))*100}%">${star}</span></span>`).join('')}</div>`}
export function renderReviews(root,entries){
 const {reviews,count,average}=ratingStats(entries),summary=root.querySelector('#ratingSummary'),list=root.querySelector('#reviewsList');
 summary.innerHTML=`<span class="rating-caption">Оценка клиентов</span><div class="rating-number">${average===null?'<span class="rating-unrated">Пока нет оценок</span>':`<b>${average.toLocaleString('ru-RU',{minimumFractionDigits:1,maximumFractionDigits:1})}</b><span>/ 5</span>`}</div>${stars(average)}<p>${count} ${plural(count)}</p>`;
 if(!count){list.innerHTML='<div class="reviews-empty"><span class="review-quote" aria-hidden="true">“</span><h3>Работали со мной?</h3><p>Оставьте отзыв — это займёт около минуты: оценка, пара отметок и имя.</p><button type="button" class="button dark" data-open-review>Оставить отзыв</button></div>';return}
 list.innerHTML=reviews.map(r=>`<figure class="client-review">${stars(r.rating)}<blockquote>${escape(r.text)}</blockquote><figcaption><b>${escape(r.name)}</b>${r.project?`<span>${escape(r.project)}</span>`:''}</figcaption></figure>`).join('');
}

export function mountReviewForm(){
 // Three quick steps: rating (one tap) → what was done and what you liked (chips) → name and consent.
 const projects=['Сайт','Соцсети','Google Maps','Учёт клиентов','Автоматизация','Консультация','Digital-менеджер','Другое'];
 const likes=['Результат','Скорость','Общение','Внимание к деталям','Цена и качество','Идеи и предложения'];
 const words=['','Плохо','Так себе','Нормально','Хорошо','Отлично'];
 const dialog=document.createElement('dialog');dialog.className='review-dialog';dialog.id='reviewDialog';dialog.setAttribute('aria-labelledby','reviewFormTitle');
 dialog.innerHTML=`<button type="button" class="review-close" aria-label="Закрыть форму отзыва">×</button><div class="review-dialog-body"><h2 id="reviewFormTitle">Оставить отзыв</h2><p class="review-form-intro">Это займёт около минуты.</p>
 <form id="reviewForm" novalidate><div class="rw-progress" aria-hidden="true"><i class="on"></i><i></i><i></i></div>
 <section class="rw-step" data-step="1"><h3>Как вам результат?</h3><p class="rw-hint">Нажмите на звезду.</p><div class="rw-stars" role="radiogroup" aria-label="Оценка от 1 до 5">${[1,2,3,4,5].map(n=>`<button type="button" role="radio" aria-checked="false" aria-label="${n} из 5 — ${words[n]}" data-rate="${n}">${star}</button>`).join('')}</div><p class="rw-score-label" id="scoreLabel" aria-live="polite"></p></section>
 <section class="rw-step" data-step="2" hidden><h3>Что мы делали?</h3><div class="rw-chips" data-single="project">${projects.map(p=>`<button type="button" aria-pressed="false">${p}</button>`).join('')}</div><span class="rw-label">Что понравилось? <small>можно несколько</small></span><div class="rw-chips" data-multi="likes">${likes.map(p=>`<button type="button" aria-pressed="false">${p}</button>`).join('')}</div><label class="rw-label" for="reviewText">Пара слов своими словами <small>по желанию, если выбрали пункты выше</small></label><textarea id="reviewText" name="text" maxlength="1800" rows="3" placeholder="Например: сайт сделали быстро, заявки начали приходить в первую неделю"></textarea></section>
 <section class="rw-step" data-step="3" hidden><h3>Как вас представить?</h3><label class="rw-label" for="reviewName">Имя</label><input id="reviewName" name="name" minlength="2" maxlength="80" autocomplete="given-name" placeholder="Например, Анна"><label class="rw-label" for="reviewContact">Контакт для уточнений <small>необязательно, не публикуется</small></label><input id="reviewContact" name="contact" maxlength="200" placeholder="Telegram или email"><div class="honeypot" aria-hidden="true"><label>Ваш сайт<input name="website" tabindex="-1" autocomplete="off"></label></div><label class="review-consent"><input type="checkbox" name="consent"><span>Согласен на публикацию имени, оценки и текста отзыва на этом сайте.</span></label></section>
 <p id="reviewStatus" role="status" aria-live="polite"></p>
 <div class="rw-nav"><button type="button" class="rw-back" hidden>← Назад</button><button type="button" class="button dark" id="rwNext">Дальше</button><button type="submit" class="button dark" id="submitReview" hidden>Отправить отзыв</button></div>
 <p class="review-moderation">Отзыв появится на сайте после проверки.</p></form>
 <div id="reviewSuccess" hidden tabindex="-1"><h3>Спасибо за отзыв!</h3><p>Отзыв отправлен на проверку. После публикации ваша оценка войдёт в общий рейтинг.</p><button type="button" class="button dark" id="reviewDone">Готово</button></div></div>`;
 document.body.append(dialog);
 const $=s=>dialog.querySelector(s),form=$('form'),status=$('#reviewStatus'),success=$('#reviewSuccess'),submit=$('#submitReview'),next=$('#rwNext'),back=$('.rw-back');
 let busy=false,step=1,rating=0,project='';const liked=new Set();
 const show=n=>{step=n;form.querySelectorAll('.rw-step').forEach(s=>s.hidden=Number(s.dataset.step)!==n);form.querySelectorAll('.rw-progress i').forEach((i,k)=>i.classList.toggle('on',k<n));back.hidden=n===1;next.hidden=n===3;submit.hidden=n!==3;status.textContent='';const f=form.querySelector(`.rw-step[data-step="${n}"] button,.rw-step[data-step="${n}"] input:not([type=checkbox])`);if(n>1)f?.focus({preventScroll:true})};
 const setRating=n=>{rating=n;form.querySelectorAll('[data-rate]').forEach(b=>{const on=Number(b.dataset.rate)<=n;b.classList.toggle('on',on);b.setAttribute('aria-checked',String(Number(b.dataset.rate)===n))});$('#scoreLabel').textContent=`${n} из 5 — ${words[n]}`};
 form.querySelectorAll('[data-rate]').forEach(b=>{b.addEventListener('click',()=>{setRating(Number(b.dataset.rate));setTimeout(()=>{if(step===1)show(2)},380)});b.addEventListener('pointerenter',()=>form.querySelectorAll('[data-rate]').forEach(x=>x.classList.toggle('on',Number(x.dataset.rate)<=Number(b.dataset.rate))));b.addEventListener('pointerleave',()=>setRating(rating))});
 form.querySelectorAll('[data-single] button').forEach(b=>b.addEventListener('click',()=>{const on=b.getAttribute('aria-pressed')!=='true';form.querySelectorAll('[data-single] button').forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed',String(on));project=on?b.textContent:''}));
 form.querySelectorAll('[data-multi] button').forEach(b=>b.addEventListener('click',()=>{const on=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',String(on));on?liked.add(b.textContent):liked.delete(b.textContent)}));
 const composeText=()=>{const own=form.elements.text.value.trim();const l=[...liked].map(x=>x.toLowerCase());return (own+(l.length?(own?'\n\n':'')+'Понравилось: '+l.join(', ')+'.':'')).trim()};
 next.addEventListener('click',()=>{if(step===1){if(!rating){status.textContent='Выберите оценку.';return}show(2)}else if(step===2){if(composeText().length<10){status.textContent='Выберите, что понравилось, или напишите пару слов.';return}show(3)}});
 back.addEventListener('click',()=>show(step-1));
 const open=()=>{dialog.showModal();document.body.classList.add('locked')};
 document.getElementById('openReview').addEventListener('click',open);
 document.addEventListener('click',e=>{if(e.target.closest('[data-open-review]'))open()});
 // A direct link for clients: …/#review opens the form.
 if(location.hash==='#review')setTimeout(()=>{document.getElementById('reviews')?.scrollIntoView();open()},600);
 const reset=()=>{form.reset();rating=0;project='';liked.clear();setRating(0);$('#scoreLabel').textContent='';form.querySelectorAll('[aria-pressed]').forEach(b=>b.setAttribute('aria-pressed','false'));show(1)};
 const close=()=>{if(!busy)dialog.close()};$('.review-close').addEventListener('click',close);$('#reviewDone').addEventListener('click',close);
 dialog.addEventListener('cancel',e=>{if(busy)e.preventDefault()});dialog.addEventListener('close',()=>{document.body.classList.toggle('locked',!!document.querySelector('#caseDialog[open],.ecosystem.expanded'));if(!success.hidden){form.hidden=false;success.hidden=true;reset()}document.getElementById('openReview').focus({preventScroll:true})});
 form.addEventListener('submit',async e=>{e.preventDefault();if(busy)return;
  const name=form.elements.name.value.trim(),text=composeText();
  if(name.length<2){status.textContent='Укажите имя.';form.elements.name.focus();return}
  if(!form.elements.consent.checked){status.textContent='Отметьте согласие на публикацию.';return}
  const data={name,text,rating,project,contact:form.elements.contact.value.trim(),website:form.elements.website.value,consent:true};
  busy=true;submit.disabled=true;submit.textContent='Отправляю…';status.textContent='';$('.review-close').disabled=true;
  try{const response=await fetch('/api/review',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal:AbortSignal.timeout(15000)});const result=await response.json().catch(()=>({}));if(!response.ok||!result.ok)throw Error(result.error||'Не удалось отправить отзыв. Попробуйте ещё раз.');form.hidden=true;success.hidden=false;success.focus();}
  catch(err){status.textContent=err.name==='TimeoutError'?'Ответ задерживается. Попробуйте ещё раз.':err.message;}
  finally{busy=false;submit.disabled=false;submit.textContent='Отправить отзыв';$('.review-close').disabled=false;}
 });
}

// Refresh when returning from Telegram and periodically while the page is visible.
export function liveReviews(root){
 let busy=false;
 const refresh=async()=>{
  if(busy||document.hidden)return;
  busy=true;
  try{
   const response=await fetch('/api/reviews',{cache:'no-store',signal:AbortSignal.timeout(10000)});
   if(!response.ok)return;
   const data=await response.json();
   if(Array.isArray(data.reviews))renderReviews(root,data.reviews);
  }catch{}finally{busy=false}
 };
 refresh();
 window.addEventListener('focus',refresh);
 document.addEventListener('visibilitychange',refresh);
 setInterval(refresh,15000);
}
