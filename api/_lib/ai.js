// 서버 함수들이 같이 쓰는 AI·검색 도우미 (파일 이름이 _ 로 시작하는 폴더는 Vercel 이 주소로 열지 않아요)
// ⚠ API 키는 환경 변수(GEMINI_API_KEY, TAVILY_API_KEY)에서만 읽어요. 코드에 키를 넣지 마세요.

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite'; // 무료 등급에서 동작 확인한 모델
const GEMINI_TIMEOUT_MS = 25000;
const TAVILY_TIMEOUT_MS = 12000;

const str = (v, n) => String(v ?? '').trim().slice(0, n);

// JSON 이 닫는 괄호를 빠뜨렸을 때를 대비한 복구 (열린 괄호만큼 닫아 줌)
function parseLoose(text) {
  const start = text.indexOf('{');
  if (start < 0) throw new Error('no json');
  const body = text.slice(start);
  try { return JSON.parse(body); } catch (_) { /* 아래에서 복구 시도 */ }
  const stack = [];
  let inStr = false;
  for (let i = 0; i < body.length; i++) {
    const ch = body[i];
    if (inStr) { if (ch === '\\') i++; else if (ch === '"') inStr = false; continue; }
    if (ch === '"') inStr = true;
    else if (ch === '{' || ch === '[') stack.push(ch === '{' ? '}' : ']');
    else if (ch === '}' || ch === ']') stack.pop();
  }
  return JSON.parse(body + stack.reverse().join(''));
}

// Gemini 호출 → { value } 또는 { error }
// schema: 응답 형식 강제 (평평한 구조일수록 실수가 적어요)
async function gemini(prompt, schema) {
  if (!process.env.GEMINI_API_KEY) return { error: 'no_key' };
  const once = async () => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), GEMINI_TIMEOUT_MS);
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json', responseSchema: schema, temperature: 0.3 },
        }),
        signal: ctrl.signal,
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) return { error: res.status === 429 ? 'rate_limited' : res.status === 503 ? 'busy' : 'ai_error', status: res.status };
      const text = ((data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) || [])
        .map((p) => p.text || '').join('');
      return { value: parseLoose(text) };
    } catch (err) {
      return { error: err.name === 'AbortError' ? 'timeout' : 'bad_output' };
    } finally {
      clearTimeout(timer);
    }
  };
  let result = await once();
  if (result.error === 'busy' || result.error === 'bad_output') result = await once(); // 한 번만 재시도
  if (result.error) console.warn('[ai] Gemini 실패:', result.error, result.status || '');
  return result;
}

// Tavily 웹 검색 → [{ title, url, content }] (키가 없거나 실패하면 빈 배열 — 검색 없이 진행)
async function webSearch(query, maxResults = 5) {
  if (!process.env.TAVILY_API_KEY) return [];
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TAVILY_TIMEOUT_MS);
  try {
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + process.env.TAVILY_API_KEY },
      body: JSON.stringify({ query: str(query, 300), search_depth: 'basic', max_results: maxResults }),
      signal: ctrl.signal,
    });
    if (!res.ok) { console.warn('[ai] Tavily 실패:', res.status); return []; }
    const data = await res.json();
    return (data.results || [])
      .filter((r) => /^https?:\/\//.test(r.url || ''))
      .map((r) => ({ title: str(r.title, 120), url: str(r.url, 500), content: str(r.content, 600) }));
  } catch (err) {
    console.warn('[ai] Tavily 실패:', err.name);
    return [];
  } finally {
    clearTimeout(timer);
  }
}

// 같은 입력은 다시 부르지 않고 재사용 (무료 한도 절약). 서버가 다시 시작되면 비워져요.
function makeCache(limit = 200) {
  const map = new Map();
  return {
    get: (k) => map.get(k),
    set: (k, v) => { if (map.size >= limit) map.clear(); map.set(k, v); },
  };
}

// 요청 본문 공통 정리
function cleanOptions(list, max = 5) {
  return (Array.isArray(list) ? list : []).slice(0, max)
    .map((o) => ({ id: str(o && o.id, 40), label: str(o && o.label, 40) })).filter((o) => o.id && o.label);
}

module.exports = { gemini, webSearch, makeCache, cleanOptions, str, GEMINI_MODEL };
