const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const REVIEWS_URL = "https://worker-production-ad76.up.railway.app/api/am-reviews";

const PORT = Number(process.env.PORT || 3000);
const PUBLIC_DIR = path.join(__dirname, "public");
const MAX_BODY_BYTES = 24 * 1024;
const attempts = new Map();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function json(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "Cache-Control": "no-store"
  });
  res.end(body);
}

function clean(value, max = 1500) {
  return String(value ?? "").replace(/\u0000/g, "").trim().slice(0, max);
}

function escapeHtml(value) {
  return clean(value, 3500)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function clientIp(req) {
  return req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket.remoteAddress || "unknown";
}

function allowedByRateLimit(req) {
  const ip = clientIp(req);
  const now = Date.now();
  const record = attempts.get(ip);
  if (!record || now - record.startedAt > WINDOW_MS) {
    attempts.set(ip, { startedAt: now, count: 1 });
    return true;
  }
  record.count += 1;
  return record.count <= MAX_ATTEMPTS;
}

async function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    let size = 0;
    req.on("data", chunk => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(Object.assign(new Error("BODY_TOO_LARGE"), { code: "BODY_TOO_LARGE" }));
        req.destroy();
        return;
      }
      body += chunk.toString("utf8");
    });
    req.on("end", () => {
      try { resolve(body ? JSON.parse(body) : {}); }
      catch { reject(Object.assign(new Error("INVALID_JSON"), { code: "INVALID_JSON" })); }
    });
    req.on("error", reject);
  });
}

async function handleLead(req, res) {
  if (!allowedByRateLimit(req)) return json(res, 429, { ok: false, error: "Слишком много заявок. Попробуйте немного позже." });

  let data;
  try { data = await readJsonBody(req); }
  catch (error) {
    if (error.code === "BODY_TOO_LARGE") return json(res, 413, { ok: false, error: "Заявка слишком большая." });
    return json(res, 400, { ok: false, error: "Некорректный формат заявки." });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) return json(res, 503, { ok: false, error: "Форма ещё не подключена к Telegram. Попробуйте позже." });

  if (clean(data.website, 200)) return json(res, 200, { ok: true });

  const name = clean(data.name, 120) || "Не указано";
  const contact = clean(data.contact, 200);
  const service = clean(data.service, 250) || "Обсудить проект";
  const task = clean(data.task, 2500) || "Уточнить при первом контакте";
  if (contact.length < 3) return json(res, 400, { ok: false, error: "Укажите Telegram, WhatsApp или email для ответа." });

  const business = clean(data.business, 200) || "—";
  const budget = clean(data.budget, 120) || "—";
  const start = clean(data.start, 120) || "—";
  const reply = clean(data.reply, 80) || "—";

  const message = [
    "<b>Новая заявка — AM Projects</b>", "",
    `<b>Имя:</b> ${escapeHtml(name)}`,
    `<b>Контакт:</b> ${escapeHtml(contact)}`,
    `<b>Бизнес / проект:</b> ${escapeHtml(business)}`,
    `<b>Услуга:</b> ${escapeHtml(service)}`,
    `<b>Бюджет:</b> ${escapeHtml(budget)}`,
    `<b>Старт:</b> ${escapeHtml(start)}`,
    `<b>Предпочтительный ответ:</b> ${escapeHtml(reply)}`,
    "", "<b>Задача:</b>", escapeHtml(task)
  ].join("\n").slice(0, 4000);

  try {
    const tg = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "HTML", disable_web_page_preview: true }),
      signal: AbortSignal.timeout(10000)
    });
    const result = await tg.json().catch(() => null);
    if (!tg.ok || !result?.ok) {
      console.error("Telegram API error:", tg.status, result?.description || "Unknown");
      return json(res, 502, { ok: false, error: "Не удалось доставить заявку. Попробуйте ещё раз." });
    }
    return json(res, 200, { ok: true });
  } catch (error) {
    console.error("Telegram request failed:", error.message);
    return json(res, 502, { ok: false, error: "Не удалось связаться с Telegram. Попробуйте ещё раз." });
  }
}

async function handleReview(req, res) {
  if (!allowedByRateLimit(req)) return json(res, 429, { ok:false, error:'Слишком много отправок. Попробуйте позже.' });
  let data;
  try { data = await readJsonBody(req); }
  catch { return json(res, 400, { ok:false, error:'Не удалось прочитать отзыв.' }); }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return json(res,400,{ok:false,error:'Некорректный формат отзыва.'});
  if (clean(data.website,200)) return json(res,200,{ok:true});
  const validString=(v,min,max)=>typeof v==='string'&&v.trim().length>=min&&v.length<=max;
  if (!validString(data.name,2,80)||!validString(data.text,10,2000)||!Number.isInteger(data.rating)||data.rating<1||data.rating>5||data.consent!==true)
    return json(res,400,{ok:false,error:'Укажите имя, оценку от 1 до 5, отзыв от 10 символов и согласие на публикацию.'});
  if ((data.contact!==undefined&&!validString(data.contact,0,200))||(data.project!==undefined&&!validString(data.project,0,120)))
    return json(res,400,{ok:false,error:'Проверьте длину полей контакта и проекта.'});
  const secret=process.env.AM_REVIEWS_SECRET;
  if(!secret)return json(res,503,{ok:false,error:'Отправка временно недоступна. Попробуйте позже.'});
  const review={name:data.name.trim(),text:data.text.trim(),rating:data.rating,project:(data.project||'').trim(),contact:(data.contact||'').trim(),consent:true};
  review.submissionId=crypto.createHmac('sha256',secret).update(JSON.stringify(review)).digest('hex');
  try {
    const response=await fetch(REVIEWS_URL,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${secret}`},body:JSON.stringify(review),signal:AbortSignal.timeout(12000)});
    const result=await response.json().catch(()=>null);
    if(!response.ok||!result?.ok)return json(res,502,{ok:false,error:'Не удалось отправить отзыв. Попробуйте ещё раз.'});
    return json(res,200,{ok:true});
  }catch{return json(res,502,{ok:false,error:'Не удалось отправить отзыв. Попробуйте ещё раз.'});}
}

async function listReviews(req,res){
  try {
    const response=await fetch(REVIEWS_URL,{signal:AbortSignal.timeout(8000)});
    const data=await response.json();
    if(!response.ok||!Array.isArray(data.reviews))throw new Error('Unavailable');
    const reviews=data.reviews.filter(r=>r.published===true).map(r=>({id:r.id,name:r.name,text:r.text,rating:r.rating,project:r.project,published:true}));
    return json(res,200,{reviews});
  }catch{return json(res,503,{error:'Отзывы временно недоступны.'});}
}

function serveStatic(req, res) {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname); }
  catch { res.writeHead(400); return res.end("Bad Request"); }

  if (pathname === "/") pathname = "/index.html";
  const normalized = path.normalize(pathname).replace(/^(\.\.[/\\])+/, "");
  const candidate = path.join(PUBLIC_DIR, normalized);
  if (!candidate.startsWith(PUBLIC_DIR)) { res.writeHead(403); return res.end("Forbidden"); }

  fs.stat(candidate, (err, stat) => {
    let filePath = candidate;
    if (err || !stat.isFile()) filePath = path.join(PUBLIC_DIR, "index.html");

    fs.readFile(filePath, (readErr, rawContent) => {
      if (readErr) { res.writeHead(500); return res.end("Internal Server Error"); }
      const ext = path.extname(filePath).toLowerCase();
      const types = {
        ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
        ".js": "application/javascript; charset=utf-8", ".json": "application/json; charset=utf-8",
        ".otf": "font/otf", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg", ".webp": "image/webp", ".ico": "image/x-icon"
      };
      const content = rawContent;
      res.writeHead(200, {
        "Content-Type": types[ext] || "application/octet-stream",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Cache-Control": ext === ".html" ? "no-store" : "public, max-age=300"
      });
      if (req.method === "HEAD") return res.end();
      res.end(content);
    });
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (req.method === "GET" && url.pathname === "/health") return json(res, 200, { ok: true, service: "amprojects-leads" });
  if (req.method === "GET" && url.pathname === "/api/reviews") return listReviews(req,res);
  if (req.method === "POST" && url.pathname === "/api/review") return handleReview(req, res);
  if (req.method === "POST" && url.pathname === "/api/lead") return handleLead(req, res);
  if (req.method === "GET" || req.method === "HEAD") return serveStatic(req, res);
  return json(res, 405, { ok: false, error: "Method not allowed." });
});

server.listen(PORT, "0.0.0.0", () => console.log(`AM Projects listening on port ${PORT}`));
