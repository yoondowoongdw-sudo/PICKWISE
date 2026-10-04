// 로컬 미리보기 서버. 실행: node tools/serve.js → http://localhost:5173
// - 일반 파일은 그대로 보여 주고,
// - /api/이름 요청은 api/이름.js 서버 함수를 실행해요 (Vercel 서버 함수와 같은 방식).
// - .env.local 파일이 있으면 비밀 값(API 키)을 읽어 서버 함수에만 전달해요. 이 파일은 GitHub에 올라가지 않아요.
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const port = Number(process.env.PORT) || 5173;
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.pdf': 'application/pdf',
};

// .env.local 읽기 (예: GEMINI_API_KEY=AIza...)
const envFile = path.join(root, '.env.local');
if (fs.existsSync(envFile)) {
  fs.readFileSync(envFile, 'utf8').split(/\r?\n/).forEach((line) => {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  });
}

// Vercel 서버 함수와 같은 모양의 req.body / res.status().json() 을 흉내 내요
async function runApi(name, req, res) {
  const file = path.join(root, 'api', name + '.js');
  if (!/^[a-z0-9-]+$/i.test(name) || !fs.existsSync(file)) { res.writeHead(404); return res.end('Not found'); }
  // 파일을 고치면 바로 반영 (api/_lib 공용 파일 포함)
  Object.keys(require.cache).filter((k) => k.startsWith(path.join(root, 'api'))).forEach((k) => delete require.cache[k]);
  const handler = require(file);
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString('utf8');
  try { req.body = raw ? JSON.parse(raw) : {}; } catch { req.body = raw; }
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (obj) => { res.setHeader('Content-Type', 'application/json; charset=utf-8'); res.end(JSON.stringify(obj)); };
  try {
    await handler(req, res);
  } catch (err) {
    console.error(err);
    if (!res.headersSent) res.status(500).json({ ok: false, reason: 'server_error' });
  }
}

http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  const api = urlPath.match(/^\/api\/([^/]+)$/);
  if (api) return runApi(api[1], req, res);

  if (/(^|\/)\.env/.test(urlPath)) { res.writeHead(403); return res.end(); } // 비밀 파일은 절대 보여 주지 않음
  let file = path.normalize(path.join(root, urlPath));
  if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(data);
  });
}).listen(port, () => console.log('Pickwise 미리보기: http://localhost:' + port + (process.env.GEMINI_API_KEY ? ' (AI 키 있음)' : ' (AI 키 없음 → 예시 데이터)')));
