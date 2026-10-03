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
 if(!count){list.innerHTML='<div class="reviews-empty"><span class="review-quote" aria-hidden="true">“</span><h3>Отзывы скоро появятся</h3><p>Здесь будут впечатления клиентов о совместной работе.</p></div>';return}
 list.innerHTML=reviews.map(r=>`<figure class="client-review">${stars(r.rating)}<blockquote>${escape(r.text)}</blockquote><figcaption><b>${escape(r.name)}</b>${r.project?`<span>${escape(r.project)}</span>`:''}</figcaption></figure>`).join('');
}
