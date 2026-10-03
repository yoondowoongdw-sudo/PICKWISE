// data/*.json 샘플을 data/samples.js 로 묶어요.
// (index.html 을 더블클릭으로 열어도 동작하도록 JSON 대신 JS 파일로 불러오기 위함)
// 실행: node tools/build-samples.js
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'data');
const samples = fs.readdirSync(dir)
  .filter((name) => name.endsWith('.json'))
  .sort()
  .map((name) => JSON.parse(fs.readFileSync(path.join(dir, name), 'utf8')).decision);

fs.writeFileSync(
  path.join(dir, 'samples.js'),
  '// 자동 생성 파일 — data/*.json 을 고친 뒤 tools/build-samples.js 로 다시 만들어요.\n' +
  'window.PICKWISE_SAMPLES = ' + JSON.stringify(samples, null, 2) + ';\n'
);
console.log('samples.js 생성 완료: ' + samples.length + '개');
