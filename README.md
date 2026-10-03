# Pickwise

> 내 기준으로 비교하고, 내가 결정한다.

삼일 연수 A-4조 웹앱. 바닐라 HTML·CSS·JS로 만든 정적 사이트이고, GitHub main에 올리면 Vercel이 자동으로 배포해요.

> **체험판(예시 데이터 버전)** — 외부 AI를 호출하지 않아요. 사용자는 예시 고민 3가지(여행·자취방·노트북) 중 하나를 골라 비교해요.
> 점수는 콘텐츠팀 예시 데이터 값이고, 예시에 없는 기준은 지어내지 않고 '정보 부족'으로 표시해요.
> 총점·민감도·What-if 는 모두 코드가 계산해요(`js/calc.js`).

## 실행 방법
- **가장 간단하게:** `index.html`을 더블클릭해서 브라우저로 열어요.
- **미리보기 서버:** `node tools/serve.js` 실행 후 http://localhost:5173 접속

## 폴더 구조
```
index.html          앱의 첫 화면 (Vercel이 이 파일을 열어요)
css/tokens.css      디자인 토큰 — DESIGN.md 3장을 그대로 복사 (직접 고치지 않기)
css/common.css      공통 레이아웃·버튼·카드·입력창·칩·하단 시트
css/screen1~6.css   화면별 스타일 — 담당자는 자기 파일만 고쳐요
js/copy.js          화면 문구 (DESIGN.md 12장, 체험판에 맞게 바꾼 줄은 [체험판] 표시)  →  Pickwise.t('screen1.title')
js/store.js         화면끼리 주고받는 데이터(state), 브라우저 임시 저장
js/calc.js          반영 비율·총점·민감도·What-if 계산 (AI 아님, 코드 계산)
js/sample-data.js   예시 데이터를 화면에서 쓰기 좋게 꺼내 주는 함수 (외부 AI·API 키 사용 안 함)
js/ui.js            작은 도우미 함수 (escape, icon, heading, footer, loading)
js/app.js           화면 전환(#/1 ~ #/6), 헤더, 뒤로가기, 아이콘 그리기
screens/screen1~6.js  화면별 파일 — 담당자는 자기 파일만 고쳐요
data/*.json         유정님 샘플 데이터 원본
data/samples.js     위 JSON을 묶은 파일 (node tools/build-samples.js 로 다시 생성)
docs/DESIGN.md      디자인 설계 문서 v1.1 (하준님)
docs/design_mockup.pdf  화면 디자인 목업
```

## 화면 담당
| 화면 | 파일 | 담당 |
|---|---|---|
| 1. 결정 입력 | `screens/screen1.js` | |
| 2. 기준 선택 | `screens/screen2.js` | |
| 3. 중요도 설정 | `screens/screen3.js` | |
| 4. 정보 입력 | `screens/screen4.js` | |
| 5. 분석 결과 | `screens/screen5.js` | |
| 6. 다음 결정 | `screens/screen6.js` | |
| 공통 뼈대 | `js/`, `css/common.css`, `index.html` | 윤도웅 |

## 작업 규칙
1. 작업 전 톡방에 **"지금 화면 ○ 작업 중"** 한 줄 남기기
2. **자기 화면 파일만** 고치기. 공통 파일(`js/`, `css/common.css`, `index.html`)을 고쳐야 하면 톡방에 먼저 말하기
3. 작업 시작 전 Claude Code에 → "GitHub에서 최신 내용 받아와줘."
4. 잘 동작하면 → "지금까지 수정한 내용을 main에 올려줘. 무엇을 바꿨는지 한 줄로 기록해줘."
5. 화면 전용 CSS 는 `css/screenN.css` 에, 클래스 이름은 `s1-`, `s2-` … 처럼 화면 번호로 시작하기 (다른 화면과 겹치지 않게)
6. 색·글꼴·간격은 `css/tokens.css`의 `--color-*` 변수만 쓰기, 문구는 `js/copy.js`에서 가져오기
7. **API 키·비밀번호·개인정보·사내 자료는 절대 올리지 않기** (Public 저장소)

## 화면 파일 만드는 법 (예시)
```js
Pickwise.screens[3] = {
  render(el, ctx) {
    el.innerHTML = Pickwise.ui.heading(Pickwise.t('screen3.title')) + Pickwise.ui.footer();
    el.querySelector('#next-btn').addEventListener('click', ctx.next);
  },
};
```
`ctx.state`로 앞 화면이 넘긴 값을 읽고, 값을 바꾼 뒤 `ctx.save()` → `ctx.next()`로 다음 화면에 넘겨요.
