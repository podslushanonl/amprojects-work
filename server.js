const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT || 3000);
const PUBLIC_DIR = path.join(__dirname, "public");
const MAX_BODY_BYTES = 24 * 1024;

// Some image assets were originally committed as base64 text instead of binary.
// Repair them inside the Railway container on every boot before static serving starts.
function repairBase64Asset(relativePath, expectedMagic) {
  const filePath = path.join(PUBLIC_DIR, relativePath);
  try {
    if (!fs.existsSync(filePath)) return;
    const raw = fs.readFileSync(filePath);
    if (raw.subarray(0, expectedMagic.length).equals(expectedMagic)) return;

    const text = raw.toString("utf8").trim().replace(/\s+/g, "");
    if (!/^[A-Za-z0-9+/=]+$/.test(text) || text.length < 100) return;

    const decoded = Buffer.from(text, "base64");
    if (!decoded.subarray(0, expectedMagic.length).equals(expectedMagic)) return;

    fs.writeFileSync(filePath, decoded);
    console.log(`Repaired binary asset: ${relativePath}`);
  } catch (error) {
    console.error(`Asset repair failed for ${relativePath}:`, error.message);
  }
}

repairBase64Asset("assets/alex-portrait.webp", Buffer.from("RIFF"));
repairBase64Asset("assets/logo-horizontal.webp", Buffer.from("RIFF"));
repairBase64Asset("assets/favicon.png", Buffer.from([0x89, 0x50, 0x4e, 0x47]));

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
  return String(value ?? "")
    .replace(/\u0000/g, "")
    .trim()
    .slice(0, max);
}

function escapeHtml(value) {
  return clean(value, 3500)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function clientIp(req) {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket.remoteAddress ||
    "unknown"
  );
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

    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(Object.assign(new Error("BODY_TOO_LARGE"), { code: "BODY_TOO_LARGE" }));
        req.destroy();
        return;
      }
      body += chunk.toString("utf8");
    });

    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(Object.assign(new Error("INVALID_JSON"), { code: "INVALID_JSON" }));
      }
    });

    req.on("error", reject);
  });
}

async function handleLead(req, res) {
  if (!allowedByRateLimit(req)) {
    return json(res, 429, {
      ok: false,
      error: "Слишком много заявок. Попробуйте немного позже."
    });
  }

  let data;
  try {
    data = await readJsonBody(req);
  } catch (error) {
    if (error.code === "BODY_TOO_LARGE") {
      return json(res, 413, { ok: false, error: "Заявка слишком большая." });
    }
    return json(res, 400, { ok: false, error: "Некорректный формат заявки." });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
    return json(res, 503, {
      ok: false,
      error: "Форма ещё не подключена к Telegram. Попробуйте позже."
    });
  }

  if (clean(data.website, 200)) {
    return json(res, 200, { ok: true });
  }

  const name = clean(data.name, 120);
  const contact = clean(data.contact, 200);
  const service = clean(data.service, 250);
  const task = clean(data.task, 2500);

  if (!name || !contact || !service || !task) {
    return json(res, 400, {
      ok: false,
      error: "Заполните обязательные поля."
    });
  }

  const business = clean(data.business, 200) || "—";
  const budget = clean(data.budget, 120) || "—";
  const start = clean(data.start, 120) || "—";
  const reply = clean(data.reply, 80) || "—";

  const message = [
    "<b>Новая заявка — AM Projects</b>",
    "",
    `<b>Имя:</b> ${escapeHtml(name)}`,
    `<b>Контакт:</b> ${escapeHtml(contact)}`,
    `<b>Бизнес / проект:</b> ${escapeHtml(business)}`,
    `<b>Услуга:</b> ${escapeHtml(service)}`,
    `<b>Бюджет:</b> ${escapeHtml(budget)}`,
    `<b>Старт:</b> ${escapeHtml(start)}`,
    `<b>Предпочтительный ответ:</b> ${escapeHtml(reply)}`,
    "",
    "<b>Задача:</b>",
    escapeHtml(task)
  ].join("\n").slice(0, 4000);

  try {
    const tg = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
        disable_web_page_preview: true
      }),
      signal: AbortSignal.timeout(10000)
    });

    const result = await tg.json().catch(() => null);

    if (!tg.ok || !result?.ok) {
      console.error("Telegram API error:", {
        status: tg.status,
        description: result?.description || "Unknown"
      });
      return json(res, 502, {
        ok: false,
        error: "Не удалось доставить заявку. Попробуйте ещё раз."
      });
    }

    return json(res, 200, { ok: true });
  } catch (error) {
    console.error("Telegram request failed:", error.message);
    return json(res, 502, {
      ok: false,
      error: "Не удалось связаться с Telegram. Попробуйте ещё раз."
    });
  }
}

const MOBILE_FIXES = `
<style id="am-mobile-fixes">
.allo-circle strong{white-space:nowrap;text-align:center;font-size:clamp(34px,4vw,62px);letter-spacing:-.055em}
@media(max-width:700px){
  .nav{gap:12px}.logo img{height:23px;max-width:132px}.top-cta{padding:10px 12px}
  .hero-panel{padding:20px;min-height:330px}.panel-top{gap:10px}.panel-mark{width:46px;height:46px}
  .project{min-height:0;padding:22px;grid-template-columns:1fr;gap:28px}
  .project-copy{min-width:0}.project-copy h3{font-size:42px;line-height:.96}.project-copy p{max-width:none;font-size:14px}
  .metrics{display:grid;grid-template-columns:1fr;gap:8px;margin-top:22px}
  .metric{min-width:0;width:100%;padding:12px 14px;border-radius:15px;display:grid;grid-template-columns:110px 1fr;align-items:center;gap:12px}
  .metric b{font-size:22px}.metric span{margin-top:0;font-size:11px;line-height:1.35}
  .project-visual{min-height:260px;width:100%;overflow:hidden}
  .media-stack{inset:4% 0 0}.media-card{padding:15px;border-radius:17px}.media-card.a{left:0;right:12%;height:45%}.media-card.b{left:10%;right:0;height:47%}
  .media-card strong{font-size:38px;line-height:.92}.media-card span{font-size:10px}.media-connector{left:40%;top:44%;width:30%}
  .allo-circle{width:min(88%,290px)}.allo-circle strong{font-size:40px;white-space:nowrap;letter-spacing:-.055em}
  .bot-ui{inset:0;padding:14px;gap:10px}.bot-query{max-width:88%}.bot-result{padding:13px}.bot-actions{grid-template-columns:repeat(3,minmax(0,1fr))}.bot-actions span{padding:9px 4px;overflow:hidden;text-overflow:ellipsis}
  .about-panel{padding:22px;min-height:0}.about-monogram{min-height:360px;border-radius:20px}.about-monogram img{object-position:center 35%}
}
</style>`;

function prepareHtml(content) {
  let html = content.toString("utf8");
  html = html.replace('<div class="allo-circle"><strong>allo<br>walks</strong></div>', '<div class="allo-circle"><strong>AlloWalks</strong></div>');
  html = html.replace("</head>", `${MOBILE_FIXES}</head>`);
  return Buffer.from(html, "utf8");
}

function serveStatic(req, res) {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  } catch {
    res.writeHead(400);
    return res.end("Bad Request");
  }

  if (pathname === "/") pathname = "/index.html";

  const normalized = path.normalize(pathname).replace(/^(\.\.[/\\])+/, "");
  const candidate = path.join(PUBLIC_DIR, normalized);

  if (!candidate.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.stat(candidate, (err, stat) => {
    let filePath = candidate;

    if (err || !stat.isFile()) {
      filePath = path.join(PUBLIC_DIR, "index.html");
    }

    fs.readFile(filePath, (readErr, rawContent) => {
      if (readErr) {
        res.writeHead(500);
        return res.end("Internal Server Error");
      }

      const ext = path.extname(filePath).toLowerCase();
      const types = {
        ".html": "text/html; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".js": "application/javascript; charset=utf-8",
        ".json": "application/json; charset=utf-8",
        ".svg": "image/svg+xml",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".webp": "image/webp",
        ".ico": "image/x-icon"
      };

      const content = ext === ".html" ? prepareHtml(rawContent) : rawContent;
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

  if (req.method === "GET" && url.pathname === "/health") {
    return json(res, 200, { ok: true, service: "amprojects-leads" });
  }

  if (req.method === "POST" && url.pathname === "/api/lead") {
    return handleLead(req, res);
  }

  if (req.method === "GET" || req.method === "HEAD") {
    return serveStatic(req, res);
  }

  return json(res, 405, { ok: false, error: "Method not allowed." });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`AM Projects listening on port ${PORT}`);
});
