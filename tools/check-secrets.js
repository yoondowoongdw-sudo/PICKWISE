// API 키 유출 방지 검사기 — 커밋·푸시 직전에 자동으로 실행돼요 (tools/hooks/ 참고)
// 키(또는 키처럼 생긴 문자열)나 .env 파일이 올라가려 하면 중단해요. 키 값은 화면에 출력하지 않아요.
//   node tools/check-secrets.js staged   ← 이번에 커밋할 파일 검사 (pre-commit)
//   node tools/check-secrets.js all      ← 저장소에 올라갈 전체 파일 검사 (pre-push)
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = execSync('git rev-parse --show-toplevel').toString().trim();
const mode = process.argv[2] === 'all' ? 'all' : 'staged';
const git = (cmd) => execSync('git ' + cmd, { cwd: root, maxBuffer: 50 * 1024 * 1024 }).toString();

// 1) 키처럼 생긴 문자열 (Gemini, Google, Tavily, Anthropic, OpenAI 등)
const PATTERNS = [
  /AIza[0-9A-Za-z_-]{30,}/,
  /\bAQ\.[0-9A-Za-z_-]{30,}/,
  /tvly-[0-9A-Za-z_-]{20,}/,
  /sk-ant-[0-9A-Za-z_-]{20,}/,
  /\bsk-[0-9A-Za-z]{32,}/,
  /(GEMINI|TAVILY|OPENAI|ANTHROPIC)_API_KEY\s*=\s*['"]?[^\s'"]{12,}/,
];

// 2) 이 PC의 .env.local 에 있는 실제 키 값 (있을 때만)
const realKeys = [];
const envFile = path.join(root, '.env.local');
if (fs.existsSync(envFile)) {
  fs.readFileSync(envFile, 'utf8').split(/\r?\n/).forEach((line) => {
    const m = line.match(/^\s*[A-Z0-9_]+\s*=\s*['"]?([^'"\s]+)/);
    if (m && m[1].length >= 12) realKeys.push(m[1]);
  });
}

const files = (mode === 'all' ? git('ls-files') : git('diff --cached --name-only --diff-filter=ACMR'))
  .split('\n').map((f) => f.trim()).filter(Boolean);

const problems = [];
for (const file of files) {
  if (/(^|\/)\.env(\.|$)/.test(file)) { problems.push(`${file} — .env 파일은 올리면 안 돼요`); continue; }
  if (file === 'tools/check-secrets.js') continue; // 이 검사기 자체의 검사 규칙은 제외
  let text;
  try { text = mode === 'all' ? fs.readFileSync(path.join(root, file), 'utf8') : git(`show ":${file}"`); } catch (_) { continue; }
  if (text.includes('\u0000')) continue; // 이미지·PDF 같은 파일은 건너뜀
  text.split('\n').forEach((line, i) => {
    const hitReal = realKeys.some((k) => line.includes(k));
    const hitPattern = PATTERNS.some((p) => p.test(line));
    if (hitReal || hitPattern) problems.push(`${file}:${i + 1} — ${hitReal ? '이 PC의 실제 API 키' : 'API 키처럼 생긴 문자열'}`);
  });
}

if (problems.length) {
  console.error('\n🚫 API 키 유출 위험이 있어서 중단했어요. (키 값은 표시하지 않아요)');
  problems.forEach((p) => console.error('   - ' + p));
  console.error('\n   해당 줄에서 키를 지우고 다시 시도해 주세요. 키는 .env.local 에만 두세요.');
  console.error('   이미 키가 노출됐다면 발급 사이트에서 그 키를 삭제하고 새로 발급하세요.\n');
  process.exit(1);
}
console.log(`🔒 API 키 검사 통과 (${mode === 'all' ? '전체' : '커밋할'} 파일 ${files.length}개)`);
