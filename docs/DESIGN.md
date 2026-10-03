Pickwise — DESIGN.md (v1.1)
빌드팀(코딩 에이전트 포함)이 그대로 참고하는 개발 가이드예요. 토큰(색·간격·글꼴)뿐 아니라 6개 화면의 구성·적용 토큰·상태·동작까지 담았어요.
이 문서 하나로 구현할 수 있도록 토큰(3장)과 화면별 문구(12장 부록)를 모두 안에 담았어요.
> 표기: **[PwC]** PwC 가이드 값 그대로 / **[파생]** 접근성·구현을 위해 계산해 만든 값 / **[기능]** PwC 팔레트에 없는 기능색 / **[제안]** 기획·디자인 확정 전의 기본값(확정되면 표기 제거)
> 이미지·폰트·아이콘은 상업적 이용이 가능한 자료만 사용해요 (폰트: Pretendard / SIL OFL).
0. 문서 사용법
색·간격·글꼴 값은 3장 코드블록을 그대로 CSS 변수 파일로 복사해 써요. 화면에 보이는 문구와 키는 12장(부록 A)에 있어요.
데이터 구조·AI 출력 형식은 이 문서에 없어요. 데이터 담당자가 전달하는 자료를 따르고, 이 문서에 나온 필드 이름(`importance`, `weight` 등)이 다르면 데이터 담당자 자료가 우선이에요.
확정된 항목은 본문에 그대로 적었고, 아직 정해지지 않은 항목만 11장에 모았어요.
8장 각 화면의 "예외 및 세부 정책" 은 아직 확정되지 않은 부분이에요. 적힌 [제안] 기본값대로 먼저 구현하고, 확정되면 체크해 주세요. 확정이 필요한 항목은 11장에 모았어요.
1. 브랜드 & 로고
"내 기준으로 비교하고, 내가 결정한다." AI는 대신 결정하지 않고, 사용자가 납득할 수 있게 돕는 파트너예요.
표기: `Pickwise` — Pick은 `--color-text`, wise는 `--color-primary`. 헤더 장식 슬래시(`//`) 유지
PwC·삼일회계법인 로고와 이름은 쓰지 않아요(Pickwise 자체 워드마크). 사용 여부는 11장에서 확정해요.
2. 컬러 구조와 출처
2-1. 두 층 구조
층	접두사	역할	화면 코드에서
A. 참고 팔레트	`--ref-pwc-*`	PwC 가이드에서 가져온 값 그대로	직접 쓰지 않아요
B. 프로젝트 적용 토큰	`--color-*`, `--chart-*`	Pickwise 화면에 실제로 적용하는 값	여기만 써요
브랜드 값이 바뀌면 A층만 고치고 2-3장 대비 표를 다시 확인해요.
2-2. 팔레트 출처
`--ref-pwc-*`는 PwC Visual Identity Guidance(© 2019 PwC)의 HEX 값이에요. 주황·탠저린·노랑·로즈·레드 5색은 다른 공개 자료와도 일치해요.
회색 4종(`#2D2D2D` `#464646` `#7D7D7D` `#DEDEDE`)은 이 가이드가 유일한 출처예요.
삼일(PwC Korea) 공식 값을 받으면 A층(`--ref-pwc-*`)만 바꾸고 대비를 다시 확인해요.
2-3. 대비 검증 결과 (기준: 글씨 4.5:1 / UI 경계·그래픽 3:1)
조합	대비	판정
흰 글씨 on `--color-primary`	4.504 : 1	통과 — 여유가 거의 없어요. 버튼 글씨는 굵게(600↑)
흰 글씨 on `--color-primary-hover`	5.977 : 1	통과
주황 글씨(`primary-ink`) on 흰 / 크림	5.977 / 5.560 : 1	통과
본문 `--color-text` on 흰 / 앱 배경	13.772 / 12.427 : 1	통과
보조 글씨·placeholder on 흰 / 앱 배경	5.742 / 5.181 : 1	통과
비활성 글씨 on 비활성 배경	4.949 : 1	통과
오류 문구(`error-ink`) on 흰 / 앱 배경	5.139 / 4.637 : 1	통과
입력창 경계(`border-control`) on 흰 / 앱 배경	4.116 / 3.714 : 1	통과
포커스 링 on 흰 / 앱 배경 / 크림	4.504 / 4.064 / 4.190 : 1	통과
그래프 A vs B 나란히	3.058 : 1	통과 (기준 3.0에 근접)
[금지] PwC Grey `#7D7D7D` 글씨 on 흰	4.116 : 1	작은 글씨 미달
[금지] 흰 글씨 on Tangerine	2.535 : 1	미달 → 어두운 글씨
[주의] 포커스 링을 offset 없이 주황 버튼에 붙이면	1.000 : 1	안 보임 → offset 필수
[주의] 선택 배경색(`FFF5ED`)만으로 선택 구분	1.075 : 1	불가 → 테두리+체크 병행
[주의] 장식용 `--color-line`을 입력창 경계로 쓰면	1.345 : 1	미달 → `border-control`
[주의] 그래프 C(Tangerine) on 흰 / A와 나란히	2.535 / 1.777 : 1	구분 어려움 → 이름·점수 직접 표기
비교 대상이 2개일 때는 A(Orange)·B(Dark grey)를 쓰고, 3개 이상이면 막대 사이에 틈을 두고 이름·점수를 막대에 직접 써요(세로 막대: 점수는 막대 위, 이름은 막대 안 세로 글씨).
앱 배경은 #F5F3EF(약간 베이지 기운이 도는 웜 그레이)이고, 앱 배경 기준 대비(위 표의 앱 배경 값)를 모두 다시 계산했어요. 흰 카드·헤더·입력창 위의 대비는 그대로예요.
3. 디자인 토큰 (자동 동기화 구간 — 직접 수정하지 마세요)
<!-- tokens:start -->
```css
/* Pickwise design tokens v1.0
 *
 * 구조: [A] 참고 팔레트(PwC 가이드 값 그대로)  →  [B] 프로젝트 적용 토큰(화면에서는 B만 쓴다)
 * 화면 코드는 --ref-pwc-* 를 직접 쓰지 말고 --color-* 를 쓴다. 브랜드 값이 바뀌면 [A]만 고치면 된다.
 *
 * 표기: [PwC] 가이드 값 / [파생] 접근성·구현을 위해 만든 값 / [기능] PwC 팔레트에 없는 기능색
 * 대비 검증 결과는 design.md 2-3장 참고
 */
:root {
  /* ===== [A] 참고 팔레트 — PwC Visual Identity Guidance (© 2019 PwC) =====
   * HEX는 가이드 원문에 직접 적힌 값. 색상 5종은 제3자 사이트(BrandColorCode)와도 일치.
   * 회색 4종은 가이드 단일 출처. 삼일(한국) 공식 값은 미확인. */
  --ref-pwc-orange:       #D04A02;
  --ref-pwc-tangerine:    #EB8C00;
  --ref-pwc-yellow:       #FFB600;
  --ref-pwc-rose:         #DB536A;
  --ref-pwc-red:          #E0301E;
  --ref-pwc-black:        #000000;
  --ref-pwc-grey-dark:    #2D2D2D;
  --ref-pwc-grey-medium:  #464646;
  --ref-pwc-grey:         #7D7D7D;  /* 작은 글씨 금지(흰 배경 4.12:1) */
  --ref-pwc-grey-light:   #DEDEDE;

  /* ===== [B] 프로젝트 적용 토큰 ===== */

  /* -- Brand / Action -- */
  --color-primary:         var(--ref-pwc-orange);   /* 주요 버튼 배경, 슬라이더 채움, 그래프 선택지 A */
  --color-primary-hover:   #B03D00;                 /* [파생] 버튼 hover·pressed */
  --color-primary-ink:     #B03D00;                 /* [파생] 흰/크림 배경 위 주황 글씨 */
  --color-primary-soft:    #FFF5ED;                 /* [파생] AI 추천 박스 배경 */
  --color-primary-tint:    #FFE4CC;                 /* [파생] 눈에 띄는 AI 추천 박스 배경. primary-ink 글씨 4.901:1, text 11.294:1 [v0.8] */
  --color-accent:          var(--ref-pwc-tangerine);/* 강조·하이라이트 (위에는 --color-on-accent) */
  --color-accent-soft:     #FFF1DB;                 /* [파생] */
  --color-on-primary:      #FFFFFF;                 /* 주황 배경 위 글씨 */
  --color-on-accent:       var(--ref-pwc-grey-dark);/* Tangerine·Yellow 배경 위 글씨 */

  /* -- Text -- */
  --color-text:            var(--ref-pwc-grey-dark);/* 제목·본문·점수 숫자 (기본 글씨) */
  --color-text-sub:        #666666;                 /* [파생] 보조 글씨·placeholder */
  --color-placeholder:     var(--color-text-sub);

  /* -- Surface / Border -- */
  --color-bg:              #F5F3EF;                 /* [파생] 앱 배경 — 웜 그레이 */
  --color-surface:         #FFFFFF;                 /* 카드·입력창 배경 */
  --color-line:            var(--ref-pwc-grey-light);/* 카드 테두리·구분선 (장식용) */
  --color-border-control:  var(--ref-pwc-grey);     /* 입력창·체크박스·슬라이더 트랙 경계 (3:1 필요) */

  /* -- Interaction states -- */
  --color-focus-ring:      var(--ref-pwc-orange);   /* 키보드 포커스. 반드시 offset과 함께 */
  --focus-ring-width:      2px;
  --focus-ring-offset:     2px;                     /* 주황 버튼 위에서도 보이게 하는 필수 값 */
  --color-selected-border: var(--ref-pwc-orange);   /* 선택된 카드·기준 */
  --color-selected-bg:     var(--color-primary-soft);/* 배경만으로는 구분 불가 → 테두리+체크 아이콘 병행 */
  --color-disabled-bg:     #EEEEEE;                 /* [파생] */
  --color-disabled-text:   #666666;                 /* [파생] 4.95:1 (#7D7D7D는 3.55:1이라 제외) */

  /* -- Feedback -- */
  --color-error:           var(--ref-pwc-red);      /* 오류 테두리·아이콘, 흰 글씨 배경 */
  --color-error-ink:       #D12C1A;                 /* [파생] 오류 문구(글씨). PwC Red는 앱 배경 위 4.25:1이라 미달 */
  --color-success:         #1B7F55;                 /* [기능] 충분한 정보·완료 */
  --color-warn-bg:         #FFF1CC;                 /* [파생] AI 추정·정보 부족 배지 배경 */
  --color-warn-text:       #7A4B00;                 /* [파생] */

  /* -- Chart (색만으로 구분 금지: 이름·점수 숫자를 막대에 직접 표기) -- */
  --chart-option-a:        var(--ref-pwc-orange);
  --chart-option-b:        var(--ref-pwc-grey-dark);
  --chart-option-c:        var(--ref-pwc-tangerine);
  --chart-option-d:        var(--ref-pwc-rose);
  --chart-option-e:        var(--ref-pwc-grey);

  /* -- Elevation -- */
  --shadow-card:           0 2px 8px rgba(0, 0, 0, 0.08);

  /* -- Shape / Spacing -- */
  --radius-card:           12px;
  --radius-control:        8px;
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px;  --space-4: 16px;  --space-6: 24px;
  --control-height:        48px;
  --touch-min:             44px;

  /* -- Typography -- */
  --font-sans:             'Pretendard', system-ui, -apple-system, 'Noto Sans KR', sans-serif;
  --fs-title:   20px;   --fs-section: 16px;   --fs-body: 14px;   --fs-caption: 12px;
  --fs-score:   40px;   /* 결과 총점. 모바일 카드(약 165px 폭)에 맞는지 목업에서 확인 */
  --fw-regular: 400;    --fw-medium: 500;     --fw-semibold: 600;   --fw-bold: 700;   --fw-extrabold: 800;
  --lh-title:   1.3;    --lh-body: 1.5;       --lh-caption: 1.4;
}
```
<!-- tokens:end -->
4. 토큰 사용 규칙 (어떤 상황에 무엇을 쓰나)
상황	토큰	비고
제목·본문·점수 숫자	`--color-text`	한 가지 기본 글씨색. 별도 강조색은 만들지 않아요
보조 설명·placeholder	`--color-text-sub`	작은 글씨에 `--ref-pwc-grey` 금지
주요 버튼	배경 `--color-primary` + 글씨 `--color-on-primary`	hover/pressed는 `--color-primary-hover`
주황 글씨(AI 추천 라벨 등)	`--color-primary-ink`	`--color-primary` 글씨는 큰 글씨만
Tangerine·Yellow 배경 위 글씨	`--color-on-accent`	흰 글씨 금지
카드 배경 / 앱 배경	`--color-surface` / `--color-bg`	카드 테두리는 `--color-line`, 그림자는 `--shadow-card`
입력창·체크박스·슬라이더 트랙 경계	`--color-border-control`	`--color-line`은 장식용이라 사용 금지
선택된 카드·기준	`--color-selected-border` + `--color-selected-bg` + 체크 아이콘	색만으로 구분하지 않아요
키보드 포커스	`--color-focus-ring`, 두께 `--focus-ring-width`, 간격 `--focus-ring-offset`	offset 0 금지
비활성	`--color-disabled-bg` + `--color-disabled-text`	이유를 문구로 안내
오류	문구 `--color-error-ink`, 테두리·아이콘 `--color-error`	아이콘+문구 병행
정보 부족·AI 추정 배지	`--color-warn-bg` + `--color-warn-text`	문구 `AI 추정 · 추가 확인 권장`
완료·충분한 정보	`--color-success`	글씨는 흰 배경에서만
그래프 선택지	`--chart-option-a`~`e`	이름·점수 숫자 직접 표기
5. 타이포그래피
글꼴: Pretendard (SIL Open Font License 1.1 — 상업적 이용·웹 임베딩 가능). `--font-sans`를 모든 텍스트에 쓰고, 별도 영문 전용 글꼴은 두지 않아요.
적용: Pretendard Variable 또는 정적 파일(400·500·600·700·800)을 직접 호스팅하는 것을 권장해요(npm `pretendard` 패키지 또는 공식 저장소 배포본). `font-display: swap`
대체 글꼴: `system-ui` → `-apple-system` → `Noto Sans KR` → `sans-serif` (`--font-sans`에 이미 지정)
한글 줄바꿈: `word-break: keep-all`, `overflow-wrap: break-word`
점수·퍼센트·합계 숫자: `font-variant-numeric: tabular-nums` (슬라이더 값이 바뀔 때 자리가 흔들리지 않게)
사용하는 굵기는 400·500·600·700·800 다섯 가지뿐이에요.
용도	크기	굵기	줄 간격
화면 타이틀	`--fs-title` 20px	`--fw-bold` 700	`--lh-title` 1.3
섹션 제목	`--fs-section` 16px	`--fw-semibold` 600	`--lh-title` 1.3
본문	`--fs-body` 14px	`--fw-regular` 400	`--lh-body` 1.5
버튼 글씨	14~16px	`--fw-semibold` 600↑	1
캡션·배지	`--fs-caption` 12px	`--fw-medium` 500	`--lh-caption` 1.4
결과 총점 숫자	`--fs-score` 40px	`--fw-extrabold` 800	1.1
총점 카드 2개가 한 줄에 놓이는 모바일(375px 화면, 좌우 여백 16px, 카드 간격 12px)에서 카드 폭은 약 165px이에요. 두 자리 숫자 + "점"이 들어갈 여유는 있어 보이지만, 실제 목업으로 확인이 필요해요.
폰트: Pretendard, 대체 `system-ui, -apple-system, 'Noto Sans KR', sans-serif`
6. 인터랙션 상태
상태	표현
Default	`--color-surface`, 경계 `--color-border-control`(입력) / `--color-line`(카드)
Hover(웹)	주 버튼은 `--color-primary-hover`. 카드는 `--shadow-card` 강화
Focus	2px 링 + 2px offset, `--color-focus-ring`. 마우스 클릭 시에는 숨기고 키보드 이동 때만 보이게(`:focus-visible`)
Selected	주황 테두리 + 크림 배경 + 체크 아이콘
Disabled	회색 배경 + `--color-disabled-text`, 왜 비활성인지 문구로 안내 (예: "비교하려면 선택지가 2개 이상 필요해요.")
Error	빨간 테두리 + 아이콘 + `--color-error-ink` 문구
Loading	"AI가 기준을 정리하고 있어요…" 등 문구 + 진행 표시 (문구는 12장)
키보드 규칙 [제안]: 모든 조작 요소는 Tab으로 이동되고 포커스가 보여야 해요. 슬라이더는 화살표 키로 1씩, PageUp/PageDown으로 10씩 조절을 권해요(WAI-ARIA 슬라이더 패턴, 구현 때 문서로 확인해 주세요).
7. 공통 컴포넌트
레이아웃: 모바일 우선(375~430px), 데스크톱은 중앙 정렬 최대폭 480px, 좌우 여백 `--space-4`
헤더: 좌측 뒤로가기 버튼(`←`, 화면 2~6) + 단계 번호(원형 `--color-primary` 배지 1~6) + 타이틀, 우측 로고. 다크 헤더를 쓰면 `--ref-pwc-grey-dark` 위 흰 글씨(13.77:1) 타이틀 22px 굵게, 단계 번호 배지 30px, 로고 21px, 헤더 높이 64px, 위쪽 4px `--color-primary` 띠.
뒤로가기 버튼: 터치 영역 `--touch-min`(44px) 이상, 접근성 이름 `common.back_aria`("이전 단계"), 화면 1에서는 표시하지 않음. 누르면 직전 화면으로 이동하고 그 화면에 입력했던 값이 모두 그대로 보임. 브라우저 뒤로가기도 같은 동작
카드: 반경 `--radius-card`, 배경 `--color-surface`, 1px `--color-line`, `--shadow-card`
버튼: 높이 `--control-height` 48px, 반경 `--radius-control`, Primary(주황) / Secondary(흰 + `--color-border-control` 테두리)
입력창: 높이 44px 이상, 경계 `--color-border-control`, 포커스 시 `--color-focus-ring`
기준 선택 카드: 이름 앞에 기준 아이콘(단색 라인 픽토그램 22px, 선 1.75px, 색 채움·그림자·명암 없음, 기본 `--color-text-sub`·선택되면 `--color-primary-ink`, 장식이라 aria-hidden)을 붙이고, 오른쪽에 선택 체크 아이콘. 색이 들어간 이모지는 쓰지 않는다. AI 추천 안내 라벨 앞에도 같은 스타일의 전구 라인 아이콘을 쓴다
중요도 행: 한 줄 높이 `--touch-min`에 이름 / 슬라이더 / 입력값(오른쪽). 핸들은 보이는 크기 20px(흰 원 + 2px `--color-primary` 테두리), 터치 영역은 투명 테두리로 44px 유지. 반영 비율(%)은 보여 주지 않음 기준마다 흰 셀(테두리 `--color-line`, 그림자 `--shadow-card`)로 구분하고, 이름 앞 기준 라인 픽토그램 + 이름은 `--fs-section` 굵게. 숫자는 박스 없이 `--fs-section` 굵게, 오른쪽 정렬
결정 기록(Decision Chain) 컴포넌트 [추가 구현]: 세로 타임라인. 각 노드 = 번호 원 + 결정 제목(예: 여행지 결정) + 선택지 요약("그리스 vs 이집트") + 결과("→ 그리스") + 상태 라벨(`결정 완료` / `결정 중` / `다시 확인 필요`). 상태는 색만이 아니라 글자로 구분하고, 현재 노드는 `--color-primary` 테두리 + 체크 아이콘. 노드 사이는 `--color-border-control` 세로선. 화면 6 상단에 접힌 미니 체인으로, "나의 결정" 목록에서는 펼친 형태로 사용 (기획서 15·17절). 이전 결정을 바꾸면 이후 노드는 `다시 확인 필요`로 표시하고 지우지 않음
단계 이동: 6단계(위저드 권장 3~7단계 안), 진행 표시, 입력 자동 보존
8. 화면별 규칙
기획 와이어프레임 6개 화면 기준이에요. 각 화면은 목적 → 주요 UI 요소 → 주요 동작 → 데이터 입출력 → 상태·토큰 → 예외 및 세부 정책(개발팀과 협의) 순서로 적었어요.
문구 키는 12장 부록 A에 있어요. AI 호출 이름(`extract_decision`, `suggest_criteria`, `score_options`, `explain_result`, `next_decisions`)은 데이터 담당자 자료의 프롬프트 이름이에요.
예외 및 세부 정책은 아직 확정되지 않은 부분이에요. 각 항목에 [제안] 기본값을 적었으니, 개발팀·기획팀과 정한 뒤 체크해 주세요.
화면 · Flow · MVP 대응표 (기획서 22·24절 기준)
화면	기획서 Flow 단계	코드명	MVP
1	Decision + Options	`screen1_decision`	필수 (주제 입력, 선택지 2~5개)
2	Criteria	`screen2_criteria`	필수 (AI 기준 추천, 추가·삭제)
3	Weight	`screen3_weight`	필수 (중요도 슬라이더)
4	Information + Analysis	`screen4_info`	필수 (직접 입력, 파일 첨부) / 추가 구현 (항목별 입력, 정보 신뢰도 표시)
5	Insight + What-if	`screen5_result`	필수 (가중치 비교, AI 설명) / 추가 구현 (민감도, What-if)
6	Next Decision + Decision Chain	`screen6_next`	필수 (후속 고민 생성) / 추가 구현 (Decision Chain, 결정 기록 저장)
> 목업에는 민감도·What-if가 결과 화면 안에 있지만, 기획 문서는 이를 **추가 구현**으로 분류해요. 시간이 부족하면 해당 영역을 가리거나 뺄 수 있게 구현해 주세요.
화면 공통 정책 (개발팀과 협의)
[ ] 뒤로가기(화면 2~6): 입력값은 모두 유지한다. 앞 단계 값을 바꾸고 다시 진행하면 — 선택지가 바뀌면 기준 추천을 다시 요청, 기준이 바뀌면 남은 기준의 중요도는 유지하고 새 기준은 기본값 50으로 시작, 입력 정보가 바뀌면 분석을 다시 실행, 입력이 그대로면 AI를 다시 부르지 않고 이전 결과를 사용한다. 다시 만들어진 결과가 있으면 사용자에게 알려 준다.
[ ] AI 응답이 늦거나 실패했을 때 — 제안: 로딩 문구 → 일정 시간 후 `error_generic` + 다시 시도 버튼, 입력값은 보존
[ ] 입력 글자 수 제한(주제·선택지·기준 이름·자유 입력) — 제안: 스키마 기준 주제 40자, 선택지 30자, 기준 이름 12자 (자유 입력은 미정)
[ ] 개인정보 안내를 어느 화면에 둘지 — 제안: 화면 1과 화면 4에 "실제 개인정보·사내 정보는 입력하지 마세요" 한 줄
[ ] 진행 중인 입력의 저장 방식(새로고침 시) — 제안: 1차는 브라우저 임시 저장, 결정 기록 저장(Decision History)은 2차
[ ] 점수 표기 척도 — 제안: 내부 값과 표기 모두 0~100. 10점 단위 표기를 원하면 화면 표기만 바꾸고 내부 값은 유지
화면 1. 결정 입력 (`screen1_decision`)
목적
사용자가 고민하는 주제와 비교할 선택지를 정하게 한다. 기획서 STEP 1에 따라 자연어 입력에서 AI가 주제·선택지를 뽑아 주고, 사용자가 고친다.
주요 UI 요소
결정 주제 입력창, 선택지 입력 목록(A, B, …) + `+ 선택지 추가` + 삭제(X)
`다음 →` 버튼
주요 동작
사용자가 고민을 문장이나 주제로 입력한다.
AI가 결정 주제와 선택지를 추출해 입력창에 채운다(`extract_decision`).
사용자가 주제·선택지를 수정하거나 선택지를 추가·삭제한다.
선택지가 2개 이상이면 `다음`이 활성화된다.
`topic`, `category`, `options`가 기준 선택 화면으로 전달된다.
데이터 입출력: 입력 `raw_input`(사용자 문장) → 전달 `decision.{topic, category, options[]}`
상태·토큰: 입력창 경계 `--color-border-control`, 포커스 `--color-focus-ring`, 주 버튼 `--color-primary`. 선택지 2개 미만이면 `다음` 비활성(`--color-disabled-*`) + `error_min_options`
예외 및 세부 정책 — 개발팀과 협의
[ ] 선택지 최대 개수 — 제안: 5개 (기획서 MVP "2~5개", 스키마와 동일)
[ ] 같은 이름의 선택지를 중복 입력할 수 있는지 — 제안: 막고 안내
[ ] AI가 선택지를 못 찾았을 때(`needs_clarification`) 되묻기 UI 형태 — 제안: 입력창 아래에 질문 한 줄 + 직접 입력
[ ] 선택지가 아직 없을 때 AI 후보 추천 제공 여부(`ai_suggest_options`) — 제안: 제공
[ ] 문장 입력과 필드 입력 중 무엇을 첫 입력으로 둘지 — 와이어프레임은 필드 입력, 기획서는 자연어 입력
화면 2. 기준 선택 (`screen2_criteria`)
목적
AI가 추천한 판단 기준 중 사용자가 원하는 기준을 선택하고, 필요한 경우 새로운 기준을 직접 추가할 수 있도록 한다.
주요 UI 요소
AI 추천 판단 기준 카드 목록(2열, 후보 4~8개, 기준 이름 앞에 기준 라인 픽토그램)
기준별 선택·해제 표시(주황 테두리 + 체크 아이콘)
"이런 기준도 고려해보세요"(앞에 전구 라인 아이콘) 칩 3개(`ai_extra_title`, 칩은 `+ 기준 이름` 형태, 접근성 이름 `add_criteria_chip_aria`)
빠진 기준 제안 배너(`missing_criteria_suggest`) — 선택한 기준이 한쪽에 치우쳤을 때만 표시. 예: 비용만 골랐으면 "치안과 이동 편의성도 함께 비교해 보시겠어요?" (기획서 AI③) · 칩의 `+`를 누르면 선택에 반영
카드 목록 맨 끝의 점선 `+ 직접 추가` 카드(`add_criteria`) — 기준 추가는 이 화면에서만 한다(탭 아님)
선택한 기준을 다음 단계로 전달하는 `다음 →` 버튼
주요 동작
화면에 들어오면 AI가 기준을 추천한다(`suggest_criteria`). 추천 중 `default_selected`인 기준(5개 안팎)이 처음부터 선택돼 있다.
사용자는 AI 추천 기준을 선택하거나 해제할 수 있다.
사용자는 `+ 직접 추가` 카드를 눌러 기준 이름을 입력(`add_criteria_placeholder`, 12자 이내)하거나 추천 칩을 눌러 새로운 판단 기준을 추가할 수 있다. 추가된 기준은 바로 선택 상태가 된다. 선택이 한쪽으로 치우치면 AI가 빠진 기준을 제안한다(`suggest_criteria`의 `extra_suggestions`·`missing_criteria_hint`).
추가된 기준은 기존 기준 목록에 표시되며, 사용자가 선택·해제할 수 있다. 같은 이름은 `error_duplicate`로 막는다.
최종 선택한 기준은 중요도 설정 화면에 전달된다.
데이터 입출력: 입력 `decision.{topic, category, options}` → 전달 `criteria[]`(선택된 것만, `source`: AI 추천/사용자 추가)
상태·토큰: 선택 카드 `--color-selected-border` + `--color-selected-bg` + 체크 아이콘, 기준 라인 픽토그램(`icon`, 장식이라 `aria-hidden`), AI 추천 박스 `--color-primary-soft` + 라벨 `--color-primary-ink`, 로딩 `loading_criteria`
예외 및 세부 정책 — 개발팀과 협의
[ ] 동일하거나 유사한 기준을 중복 추가할 수 있는지 — 제안: 같은 이름은 막고, 유사한 이름(예: "예산"과 "비용")은 알려주되 사용자가 허용
[ ] 기준을 추가한 뒤 수정·삭제할 수 있는지 — 제안: 직접 추가한 기준은 수정·삭제 가능, AI 추천 기준은 선택·해제만
[ ] 선택 가능한 기준의 최대 개수 — 제안: 최대 8개로 막고, 7개부터 `warn_many`로 5~6개를 권장 (와이어프레임 슬라이더 화면에 5개가 들어가는 것을 근거로 한 제안)
[ ] 기준을 하나도 선택하지 않았을 때 — 제안: `다음` 비활성 + `error_min` 안내. 최소 개수는 1개로 할지 2개로 할지 협의
[ ] 직접 추가한 기준의 점수를 AI가 어떻게 다룰지 — 제안: 다른 기준과 똑같이 점수 제안(정보가 없으면 `null`)
[ ] 선택지를 바꾸고 돌아왔을 때 기준을 다시 추천할지 — 공통 정책과 함께 결정
[ ] 빠진 기준 배너를 띄우는 조건 — 제안: 선택 기준이 2개 이하이거나, 후보 중 안전·편의성처럼 핵심 기준이 하나도 선택되지 않았을 때 한 번만 표시(닫으면 다시 안 띄움)
[ ] 기준 아이콘(`icon`) 출처 — 제안: 미리 만든 라인 픽토그램 세트(비용·날씨·관광·음식·이동·치안·새로운 경험 등)에서 AI가 `suggest_criteria`로 기준마다 아이콘 키 하나를 고르고, 맞는 것이 없거나 직접 추가한 기준은 기본 라인 아이콘. 라이브러리는 Lucide 같은 둥근 선형 세트를 권장. `icon` 필드는 데이터 담당자 자료가 우선
화면 3. 중요도 설정 (`screen3_weight`)
목적
선택한 기준마다 사용자가 중요도를 직접 정한다. 기준 개수가 달라져도 쓸 수 있도록 기준마다 0~100 점수로 중요도를 입력하고, 합계는 따로 맞추지 않는다. 서버가 입력값을 비율(%)로 환산해 계산에만 쓰고, 이 화면에는 비율을 보여 주지 않는다. 중요도는 사용자의 가치 판단이라 AI는 값을 정하거나 바꾸지 않는다.
계산 규칙 (코드로 처리, AI 아님)
사용자 입력 `importance_i` = 0~100 정수
반영 비율 `weight_i` = `importance_i` ÷ Σ`importance` × 100 (%)
총점 = Σ(`weight_i` × 기준 점수) ÷ 100
예: 예산 90 / 날씨 75 / 관광 60 / 음식 45 / 이동 30 → 합 300 → 반영 비율 30 / 25 / 20 / 15 / 10 %
모든 값이 0이면 비율을 만들 수 없으므로 계산하지 않는다
주요 UI 요소
기준별 셀 한 줄: 라인 픽토그램+이름 / 슬라이더(0~100) / 입력값(숫자, `%` 기호 없이, 박스 없음, 슬라이더 오른쪽). 셀 높이 60px. "낮음·높음" 눈금 문구는 쓰지 않음(직관적이므로)
안내 문구 `ratio_hint`: 슬라이더 값은 기준끼리 비교하는 상대적 중요도라는 한 줄 설명(합계 환산 설명은 뺌)
`다음 →`, 뒤로가기 `←`(7장). 초기값으로 되돌리기 버튼은 두지 않음(슬라이더를 0으로 옮기면 되므로)
기준 추가·삭제는 이 화면에 없다 → 기준 변경은 `←`로 화면 2에서 한다
목업의 행 왼쪽 드래그 핸들(⋮⋮)은 쓰지 않는다(순서 변경 기능 없음)
주요 동작
처음에는 모든 기준이 기본값 50으로 보인다.
사용자가 각 슬라이더(또는 숫자 입력)를 0~100 사이에서 자유롭게 조절한다. 다른 기준의 값은 바뀌지 않는다.
반영 비율은 입력이 바뀔 때마다 내부에서 다시 계산한다(화면에는 보여 주지 않는다).
모든 기준이 0이면 `다음`을 비활성화하고 `all_zero_error`로 이유를 알린다. 하나라도 0보다 크면 활성화된다.
확정된 `weights[]`(`importance` + 환산된 `weight`)가 정보 입력 화면으로 전달된다.
데이터 입출력: 입력 `criteria[]` → 전달 `weights[]`(`id`, `importance` 0~100, `weight` 반영 비율 %, 합 100)
상태·토큰: 슬라이더 채움 `--color-primary`, 트랙 경계 `--color-border-control`. 핸들은 보이는 크기를 20px로 줄이고(흰 원 + 2px `--color-primary` 테두리) 터치 영역은 투명 테두리로 `--touch-min`(44px)을 유지한다. 입력값은 슬라이더 오른쪽에 `--color-text`로 표시한다(반영 비율을 보여 주지 않아 `--color-primary-ink` 숫자는 이 화면에서 쓰지 않음). 입력창과 슬라이더 값은 항상 같아야 하고, 접근성 이름은 "{기준} 중요도"
예외 및 세부 정책 — 개발팀과 협의
[ ] 0을 허용할지 — 제안: 허용하고 `zero_weight_notice`("이 기준은 결과에 반영되지 않아요.") 안내. 단 모두 0은 불가
[ ] 조절 단위 — 제안: 슬라이더 5 단위, 숫자 입력은 1 단위
[ ] 기본값 — 제안: 50(균등). 기준 수가 많아도 같은 값으로 시작
[ ] 뒤로 갔다가 기준이 바뀌어 돌아왔을 때 — 제안: 남은 기준의 입력값은 유지, 새 기준은 기본값 50, 삭제된 기준의 값은 사라짐. 비율은 자동 재계산
[ ] 키보드 조작(화살표 1, PageUp/PageDown 10) — WAI-ARIA 슬라이더 패턴으로 구현
화면 4. 정보 입력 (`screen4_info`)
목적
사용자가 선택지에 대해 이미 아는 정보를 알려 주게 해서, AI가 점수를 만들 때의 근거로 쓴다. 정보가 없는 항목을 AI가 억지로 점수화하지 않도록 부족한 정보를 먼저 확인한다.
주요 UI 요소
선택지별 자유 입력창(`label_option_info`) — 기획서 7절 "직접 입력". 라벨 앞에 `--color-primary` 번호 원(1, 2 … 선택지 순서, 글씨 `--color-on-primary`)을 붙인다
자료 첨부 영역(`attach_button`, `attach_hint`) — 기획서 7절 "파일 첨부". 제목 아래 회색 안내 문구(`attach_guide`, `--color-text-sub` 12px — 대비 5.742:1이라 "희미하게" 보이되 읽을 수 있는 최소 기준 유지), 제목 오른쪽에 회색 `i` 원형 버튼(터치 영역 44px, `attach_help_aria`). 누르면 "웹페이지를 PDF로 저장하는 방법" 도움말(`pdf_help_*`: 크롬·엣지 기준 5단계)이 하단 시트로 열리고 `닫기`로 닫는다. 목적은 AI가 외부 URL을 읽지 못하는 경우를 미리 막는 것(URL을 직접 입력받지 않고 PDF 첨부로 유도)
항목별 입력(`tab_items`, 추가 구현 [제안]) — 기획서 7절 예시처럼 선택지별로 `항공권 약 110만 원`, `장점`, `단점` 칸. 와이어프레임에는 없어서 1차는 생략
`정보가 따로 없어요`, `분석하기` 버튼
AI 정리 결과 확인(`structured_preview_title`) — 분석 전, 입력이 기준별로 어떻게 정리됐는지(예: 음식 만족도 높음 / 새로움 낮음)를 보여 주고 사용자가 고칠 수 있게 함 (기획서 8절, 추가 구현)
주요 동작
사용자가 선택지별로 알고 있는 내용을 입력한다(필수 아님).
필요하면 PDF·텍스트 파일을 첨부한다.
`분석하기`를 누르면 AI가 입력을 기준별 정보로 정리하고 점수를 제안한다(`score_options`).
(분석 전 확인 없음) 사용자가 모든 기준의 정보를 입력할 필요는 없다. 입력이 없는 기준은 AI가 검색해 점수를 매기고 `AI 추정 · 추가 확인 권장` 배지를 붙인다. 정보 부족 안내 단계와 `정보 추가하기` 버튼은 두지 않는다. 화면 4는 선택지 입력 2개 + 자료 첨부 + `분석하기` 버튼 하나로 끝난다.
`user_info`와 점수 결과가 분석 결과 화면으로 전달된다.
데이터 입출력: 입력 `weights[]`, `options[]` → 전달 `user_info`, `scores`, `structured_info`, `missing_info`
상태·토큰: 입력창은 화면 1과 같음, 첨부 영역은 점선 `--color-border-control`, 파일 오류 `error_file_type`(`--color-error-ink`), 분석 중 `loading_analysis`
예외 및 세부 정책 — 개발팀과 협의
[ ] 첨부 파일 형식·크기·개수 제한 — 제안: 1차 PDF·텍스트만, 크기·개수는 개발팀이 정함(기획서는 PDF·이미지·문서 3종, 이미지는 2차 제안)
[ ] 첨부 파일의 보관·삭제와 개인정보 안내 — 사내 연수 규정 확인 필요
[ ] 일부 선택지만 정보가 있을 때 처리 — 제안: 입력이 없는 선택지는 `ai_estimate` 점수에 배지를 붙이고 `missing_info`로 안내
[ ] 정보가 전혀 없을 때(`정보가 따로 없어요`) 점수를 AI가 모두 추정할지, `null`로 둘지 — 제안: AI 추정 + 배지 (샘플 데이터 기준)
[ ] 분석 시간이 길어질 때 취소·재시도 방식 — 공통 정책과 함께 결정
[ ] 항목별 입력(항공권·숙박비 같은 숫자 입력)을 1차에 넣을지 — 숫자가 들어오면 What-if의 "값 변경"(화면 5)을 코드로 다시 계산할 수 있어서 연결해 결정
화면 5. 분석 결과 (`screen5_result`)
목적
계산된 비교 결과를 근거와 함께 보여 주고, 사용자가 중요도를 바꿔 보며 결과가 어떻게 달라지는지 탐색하게 한다. 결과를 단정하지 않고 "현재 기준으로는 이렇게 계산됐다"로 전달한다.
주요 UI 요소
선택지별 총점 카드 2개
기준별 비교 세로 막대 그래프: 가로축에 기준, 기준마다 선택지별 막대를 묶어 표시. 점수는 막대 위 숫자, 선택지 이름은 막대 안에 쓰지 않고 그래프 위 범례(선택지 색)로 구분. 기준별 근거 배지는 그래프 아래 목록으로 표시
AI 설명(그리스가 앞선 이유와 가장 큰 차이를 3문장 이내로 통합, 그래프 위), 근거 배지(`사용자 입력` / `첨부 자료` / `AI 추정 · 추가 확인 권장`)
근거 표시: 기준별 막대(또는 근거 목록의 줄)를 누르면 `근거: …` 한 줄이 펼쳐진다. 예) "치안 6/10 — 근거: 사용자가 '치안이 걱정된다'고 입력 — 유형: 사용자 입력" (기획서 8절). 색이 아니라 글자 배지로 구분
민감도 분석, What-if 분석(둘 다 추가 구현 항목), 면책 문구(`disclaimer`)
결과 읽는 순서: 총점 → AI 설명(차이를 만든 기준 포함) → 기준별 비교 → 민감도 → What-if (기획서 25절 "이렇게 계산되고 → 차이를 만든 요인 → 기준을 다르게 보면 이렇게 바뀐다"). "가장 큰 차이" 별도 영역은 두지 않는다
주요 동작
서버가 가중합으로 총점을 코드로 계산한다(AI는 계산하지 않는다).
총점, 기준별 점수를 보여 주고 AI가 이유와 가장 큰 차이를 설명한다(`explain_result`).
점수마다 근거 유형 배지를 보여 준다.
민감도 분석은 "어떤 기준의 중요도가 얼마가 되면 순위가 바뀌는지"를 보여 준다. 문구의 %는 슬라이더 입력값이 아니라 반영 비율이다(화면 3에서 반영 비율을 보여 주지 않으므로 문구에서 비율을 어떻게 풀어 쓸지는 11장에서 확정)(다른 기준의 입력값은 그대로 두고 그 기준만 바꿨을 때의 비율). 문구는 3유형이다(코드가 숫자를 계산하고, 문장은 `ui_copy`의 템플릿에 채운다).
순위 역전: "'새로운 경험'의 중요도를 현재 10%에서 25% 이상으로 높이면 이집트의 총점이 더 높아져요." (`sensitivity_flip_template`)
근접: "'비용'의 중요도를 15%에서 30%로 높이면 두 선택지의 차이가 거의 없어져요." (`sensitivity_close_template`) — 현재 샘플 데이터에는 없는 유형
안정: "'날씨'의 중요도를 바꿔도 순위는 바뀌지 않아요." (`sensitivity_stable_template`)
What-if는 3유형이다(기획서 13절). 1차는 가중치 변경만 코드로 재계산하고, 나머지는 2차다.
가중치 변경: "치안을 지금보다 두 배 중요하게 생각한다면?" → 코드로 즉시 재계산 (1차)
값 변경: "항공권이 30만 원 더 비싸진다면?" → 해당 기준의 점수 규칙(숫자→점수)이 필요해서 항목별 입력(화면 4)과 함께 2차
조건 변경: "여행 기간이 10일이라면?" → 점수가 달라질 수 있어 AI 재평가가 필요. AI가 다시 정하는 점수는 `AI 추정` 배지를 붙여 보여 주고, 총점은 여전히 코드가 계산
사용자가 결과를 확인하면 다음 결정 화면으로 이동한다.
데이터 입출력: 입력 `weights`, `scores` → 전달 `result.{totals, top_gap_criteria, sensitivity, whatif}`, 사용자가 확정한 선택 결과(`selected_option`)
상태·토큰: 선택지 색 `--chart-option-a`/`b`, 총점 `--fs-score`, 설명 박스 `--color-primary-soft`, AI 추정 배지 `--color-warn-*`. 높은 쪽 점수 카드는 `--chart-option-a`(주황), 다른 쪽은 `--chart-option-b`(진회색) 배경에 흰 글씨로 그래프 막대와 색을 맞춘다. 높은 쪽 카드에 왕관 아이콘 + "추천" 배지(기획서의 "단정하지 않는다" 원칙과 충돌 여부는 11장에서 확정). 그래프 막대 안에는 선택지 이름을 쓰지 않고 위 범례로 구분한다. 점수가 `null`이면 "정보 부족" 표시(막대 없음). 점수 차이가 거의 없으면 `tie_notice`
예외 및 세부 정책 — 개발팀과 협의
[ ] 사용자가 AI 점수를 직접 고칠 수 있는지 — 제안: 가능, 고치면 `evidence_type`이 `user_input`으로 바뀜 (AI가 대신 결정하지 않는 철학과 일치)
[ ] 점수가 `null`인 항목(AI도 근거를 찾지 못한 예외)의 총점 처리 — 제안: 총점에서 빼고 `excluded_notice`로 알림. 사용자가 정보를 입력하지 않은 기준은 AI가 검색해 추정하고 `AI 추정 · 추가 확인 권장` 배지를 붙여 점수에 포함
[ ] 동점·근소한 차이의 기준(`tie_notice`를 띄울 점수 차이) — 개발·기획 협의
[ ] What-if 입력 방식 — 제안: 1차는 미리 만든 질문 버튼(`result.whatif`), 자연어 입력은 2차
[ ] 가중치를 바꿔 다시 계산할 때 AI를 다시 부르는지 — 제안: 부르지 않고 코드로만 재계산(AI는 설명 문구가 필요할 때만)
[ ] 와이어프레임에 없는 "이 선택지로 결정"(`select_option_cta`) 동작을 둘지 — 화면 6의 맥락 인사("결정하신 ~")와 Decision Chain 기록에 `selected_option`이 필요
[ ] 민감도·What-if를 1차에서 뺄 때의 화면 처리 — 제안: 영역을 숨기고 총점·기준별 비교·AI 설명만 표시 (기획서 24절 MVP 기준)
[ ] What-if 값·조건 변경을 어디까지 지원할지 — 제안: 1차는 가중치 변경 버튼만. 값·조건 변경은 숫자 입력 구조가 정해진 뒤 결정
[ ] 민감도 문구의 "근접" 기준(두 선택지 점수 차이 몇 점 이하) — `tie_notice` 기준과 같이 결정
[ ] 세로 막대 그래프에서 기준이 6개 이상이거나 선택지가 3개 이상일 때 — 제안: 막대 폭 24px 유지, 그래프 가로 스크롤, 막대 안 이름은 줄임말 허용
화면 6. 다음 결정 (`screen6_next`)
목적
한 번의 선택으로 끝나지 않고, 결정 뒤에 이어지는 고민을 제안해 연속된 결정(Decision Chain)으로 이어 준다. 기획서의 "다음 고민 연결"에 해당한다.
주요 UI 요소
맥락 인사 문구(`context_greeting_template`) — "결정하신 '그리스' 다음으로 이런 고민을 이어서 비교할 수 있어요." (기획서 14절)
AI 추천 후속 고민 카드 3~4개(제목 + 한 줄 이유). 예: 패키지 vs 자유여행 / 산토리니 vs 미코노스 / 숙소 위치 비교
카드를 고른 뒤의 `다음 고민 이어가기`(`continue_button`) 버튼
`+ 새로운 고민 직접 입력`(`placeholder_custom`)
`새 결정 시작하기` 버튼
주요 동작
방금 선택한 결과와 이전 결정 내용을 바탕으로 AI가 후속 고민을 제안한다(`next_decisions`).
사용자가 카드를 누르고 `다음 고민 이어가기`를 누르면 화면 1로 이동하고, 제안된 `option_labels`가 선택지로 미리 채워진다. (이어가기: 이전 결정과 연결 / 새 결정 시작하기: 연결 없이 새로 시작)
원하는 후속 고민이 없으면 직접 입력할 수 있다.
새 결정은 이전 결정과 연결 정보를 가진다(`parent_decision_id`).
데이터 입출력: 입력 `selected_option`, `chain_history` → 전달 `next_decisions[]`, 새 결정의 `parent_decision_id`
상태·토큰: 추천 박스 `--color-primary-soft`, 카드는 공통 카드 규칙, 주 버튼 `--color-primary`. 이미 결정한 내용은 다시 제안하지 않아요(프롬프트 규칙)
예외 및 세부 정책 — 개발팀과 협의
[ ] Decision History 저장 위치 — 제안: 1차는 브라우저 저장, DB 저장·로그인은 2차 (기획서 "결정 기록 저장"은 추가 구현 항목)
[ ] 이전 결정을 되돌아가 바꾸면 이후 결정을 어떻게 처리할지 — 기획서 17절 예시(여행지를 이집트로 바꾸면) 기준, 제안: 이후 결정을 "다시 확인 필요"로 표시하고 자동으로 지우지 않음
[ ] 연결 길이(단계 수) 제한과 목록 화면 — 개발·기획 협의
[ ] 후속 고민이 AI 추천이 아닌 직접 입력일 때도 같은 연결 구조로 저장할지
[ ] 화면 6 제목 문구 — 와이어프레임은 "이 결정 다음에도 고민할 게 있나요?", 기획서 14절은 "이 선택과 이어지는 고민이 있나요?" — 제안: 와이어프레임 문구 사용(`screen6_next.title`)
[ ] 후속 결정을 이어갈 때 이전 결정의 기준·가중치를 재사용할지 — 제안: 재사용하지 않음(기준이 달라서). 대신 `parent_decision_id`로 맥락만 AI에 전달
9. 아이콘·이미지·톤&매너
아이콘: 둥근 선형(outline) 1.5~2px, Lucide(MIT) 권장. 일러스트는 직접 제작·AI 생성만, 기존 서비스 이미지·캐릭터 복제 금지
서비스 포지션: 추천(Recommendation)이 아니라 Decision Support + Decision Journey (기획서 25절). 문구는 "당신에게 A를 추천해요"가 아니라 "당신이 중요하게 생각하는 기준에서는 A가 이렇게 계산돼요"의 방향
단정하지 않기: "그리스가 더 좋은 여행지입니다" ❌ → "현재 설정한 중요도와 입력한 정보를 기준으로는 그리스의 총점이 더 높게 계산되었어요" ✅ (기획서 11절, 계산 결과와 가치 판단을 구분하기 위함)
AI의 위치: AI는 기준을 제안하고 정보를 정리하고 이유를 설명할 뿐, 중요도(가치 판단)와 최종 결정은 사용자 몫. 중요도는 AI가 정하거나 바꾸지 않음
색이 들어간 이모지는 쓰지 않고 단색 라인 아이콘만 쓴다. 버튼은 동사 + 짧게
말투
모든 문장은 해요체(~요) 로 통일해요(제목·안내·버튼·오류·결과 설명·면책 문구 모두). 반말·명령조 금지
쓰지 말 것 / 쓸 것
❌ 쓰지 말 것	✅ 쓸 것
그리스를 추천해요 / 그리스가 정답이에요	현재 기준으로는 그리스의 총점이 더 높게 계산되었어요
이집트는 위험한 나라입니다	치안 항목은 사용자가 입력한 '치안이 걱정된다'는 내용을 바탕으로 낮게 계산되었어요
점수를 알 수 없어 총점에서 제외했어요	'날씨' 근거를 AI도 찾지 못했어요. 정보를 입력하면 반영돼요
이게 최선의 선택이에요	중요도를 바꾸면 결과가 달라질 수 있어요
AI 추정에는 항상 `AI 추정 · 추가 확인 권장` 배지. 근거가 없는 항목을 사실처럼 쓰지 않아요
오류: "잠시 문제가 생겼어요. 다시 시도해 주세요"
10. 접근성 체크리스트
[ ] 글씨 대비 4.5:1, UI 경계·그래픽 3:1 (2-3장 표 기준)
[ ] 모든 조작 요소가 키보드로 이동되고 포커스가 보임 (offset 포함)
[ ] 색만으로 정보를 전달하지 않음 (선택=체크 아이콘, 근거=글자 배지, 그래프=이름·숫자)
[ ] 슬라이더: 값 숫자 표시(오른쪽), 숫자 입력 병행, 키보드 조작, 핸들 보이는 크기는 작아도 터치 영역 44px 유지
[ ] 비활성·오류에는 이유를 문구로 안내
11. 아직 확정되지 않은 항목
아래는 기획·디자인 담당자 확정 전이에요. 정해지기 전에는 각 화면의 [제안] 기본값으로 구현해요.
화면 5의 `추천`(왕관) 배지를 그대로 쓸지, "계산상 높음"으로 되돌릴지(현재 목업은 `추천`), 민감도·What-if를 1차에 넣을지
점수 표기(0~100 / 10점 단위)
항목별 입력을 1차에 넣을지(분석 확인 4-2 단계는 폐기됨)
브랜드 색(PwC 팔레트 적용 중)과 로고 사용 가능 여부
앱 배경 #F5F3EF(웜 그레이) 확정 여부
화면 3에서 반영 비율을 보여 주지 않으므로, 화면 5 민감도 문구(`{from}%` → `{to}%`)의 표현 방식
기준 아이콘(`icon`) 데이터 필드와 라인 픽토그램 세트 출처(라이브러리 또는 자체 제작)
8장 각 화면의 "개발팀과 협의" 체크리스트
구현 후 실제 렌더링 색으로 대비를 다시 측정 (이 문서의 대비는 토큰 값 계산이라 안티앨리어싱·투명도는 반영되지 않아요), 총점 40px·버튼 글씨 대비(4.504 : 1, 여유 거의 없음)·3개 이상 비교 시 그래프 가독성 확인
12. 부록 A. 화면별 문구
화면에 보이는 문구와 키예요. `{...}`는 값이 들어가는 자리이고, 말투는 모두 해요체예요.
<!-- copy:start -->
공통
키	문구
`logo`	Pickwise
`next`	다음
`back`	이전
`loading_criteria`	AI가 기준을 정리하고 있어요…
`loading_analysis`	점수를 계산하고 있어요…
`error_generic`	잠시 문제가 생겼어요. 다시 시도해 주세요.
`empty_history`	아직 저장된 결정이 없어요.
`privacy_notice`	실제 개인정보나 사내 정보는 입력하지 마세요.
`status_done`	결정 완료
`status_pending`	결정 중
`status_recheck`	다시 확인 필요
`back_aria`	이전 단계
화면 1. 결정 입력
키	문구
`title`	어떤 결정이 고민되세요?
`subtitle`	비교하고 싶은 주제와 선택지를 입력하면 AI가 더 나은 선택을 도와드려요.
`label_topic`	결정 주제 입력
`label_options`	선택지 입력
`placeholder_topic`	예) 그리스 vs 이집트 어디로 갈지
`add_option`	+ 선택지 추가
`error_min_options`	비교하려면 선택지가 2개 이상 필요해요.
`error_extract_fail`	주제와 선택지를 찾지 못했어요. 직접 입력해 주세요.
`no_options_yet`	아직 선택지가 없나요?
`ai_suggest_options`	AI에게 후보 추천받기
화면 2. 기준 선택
키	문구
`title`	어떤 기준으로 비교할까요?
`subtitle`	AI가 추천한 기준을 고르거나 직접 추가해 보세요.
`ai_extra_title`	이런 기준도 고려해보세요 (앞에 전구 라인 아이콘)
`add_criteria`	+ 직접 추가
`error_min`	기준을 1개 이상 선택해 주세요.
`warn_many`	기준이 많으면 비교가 어려워져요. 5~6개를 추천해요.
`missing_criteria_suggest`	{criteria}도 함께 비교해 보시겠어요?
`add_criteria_placeholder`	기준 이름 (12자 이내)
`error_duplicate`	이미 있는 기준이에요.
`add_criteria_chip_aria`	{criteria} 기준 추가
화면 3. 중요도 설정
키	문구
`title`	무엇이 더 중요한가요?
`subtitle`	기준별 중요도를 0~100으로 조절해 주세요.
`zero_weight_notice`	이 기준은 결과에 반영되지 않아요.
`ratio_hint`	슬라이더 값은 기준끼리 비교하는 상대적 중요도예요.
`all_zero_error`	중요도를 하나 이상 0보다 크게 설정해 주세요.
화면 4. 정보 입력
키	문구
`title`	선택지에 대해 알고 있는 내용을 입력해 주세요.
`subtitle`	정보가 많을수록 더 정확하게 비교할 수 있어요.
`label_option_info`	{option}에 대해 알고 있는 내용
`placeholder_option_info`	예) {option}에 대해 알고 있는 점이나 가고 싶은 이유를 적어 주세요. (선택지 이름이 들어가는 템플릿 — 다른 선택지의 예시가 보이면 안 됨)
`attach_title`	자료 첨부 (선택사항)
`attach_button`	+ 파일 추가
`attach_hint`	PDF / 이미지 / 문서
`attach_guide`	분석할 때 참고가 필요한 정보를 입력해주세요. 특정 URL의 정보를 활용하고 싶다면, 웹페이지를 PDF로 저장해서 입력해주세요.
`attach_help_aria`	웹페이지를 PDF로 저장하는 방법 보기
`pdf_help_title`	웹페이지를 PDF로 저장하는 방법
`pdf_help_sub`	브라우저 기본 기능으로 저장해요 (크롬, 엣지 등)
`pdf_help_step1`	저장하려는 웹 페이지를 열어요.
`pdf_help_step2`	키보드 Ctrl + P (맥은 Cmd + P)를 누르거나, 오른쪽 위 점 3개 메뉴에서 [인쇄]를 선택해요.
`pdf_help_step3`	'프린터' 또는 '대상'을 [PDF로 저장(Save as PDF)]으로 바꿔요.
`pdf_help_step4`	용지 방향, 여백 등 필요한 레이아웃을 조정해요.
`pdf_help_step5`	[저장]을 눌러 원하는 위치에 파일을 저장해요.
`pdf_help_after`	저장한 PDF는 아래 '+ 파일 추가'로 올려 주세요.
`pdf_help_close`	닫기
`no_info`	정보가 따로 없어요
`analyze`	분석하기
`analyze_cta`	분석하기
`error_file_type`	이 형식은 아직 지원하지 않아요. PDF 또는 텍스트 파일을 올려 주세요.
`tab_free`	자유롭게 입력
`tab_items`	항목별로 입력
`tab_file`	자료 첨부
`structured_preview_title`	AI가 이렇게 이해했어요
`structured_preview_hint`	틀린 부분이 있으면 직접 고쳐 주세요.
화면 5. 분석 결과
키	문구
`title`	분석 결과
`subtitle`	입력한 기준을 바탕으로 두 선택지를 비교했어요.
`score_unit`	점
`section_compare`	기준별 비교
`section_ai`	AI 설명
`ai_explain_label`	AI 설명 · {winner}가 앞선 이유
`section_sensitivity`	민감도 분석
`section_whatif`	What-if 분석
`headline_template`	현재 설정한 중요도와 입력한 정보를 기준으로는 {winner}의 총점이 더 높게 계산되었어요.
`badge_user`	사용자 입력
`badge_file`	첨부 자료
`badge_ai`	AI 추정 · 추가 확인 권장
`disclaimer`	이 결과는 입력한 정보와 중요도를 기준으로 한 계산이며, 최종 결정은 사용자가 내려요.
`tie_notice`	두 선택지의 점수 차이가 거의 없어요. 중요도를 다시 확인해 보세요.
`evidence_label`	근거
`no_info_label`	정보 부족
`excluded_notice`	(예외용) AI도 근거를 찾지 못한 기준 {n}개({criteria})는 총점에서 제외했어요. — 평소에는 표시하지 않음
`sensitivity_flip_template`	'{criteria}'의 중요도를 현재 {from}%에서 {to}% 이상으로 높이면 {option}의 총점이 더 높아져요.
`sensitivity_close_template`	'{criteria}'의 중요도를 {from}%에서 {to}%로 높이면 두 선택지의 차이가 거의 없어져요.
`sensitivity_stable_template`	'{criteria}'의 중요도를 바꿔도 순위는 바뀌지 않아요.
`whatif_result_template`	'{condition}' 조건에서는 {winner}의 총점이 더 높게 계산돼요.
`select_option_cta`	이 선택지로 결정
화면 6. 다음 결정
키	문구
`title`	이 결정 다음에도 고민할 게 있나요?
`ai_recommend`	AI 추천
`custom_input`	+ 새로운 고민 직접 입력

`placeholder_custom`	예) 어떤 숙소가 좋을까?
`start_new`	새 결정 시작하기
`context_greeting_template`	결정하신 '{selected}' 다음으로 이런 고민을 이어서 비교할 수 있어요.
`continue_button`	다음 고민 이어가기
결정 기록
키	문구
`title`	나의 결정
`node_result_template`	→ {selected}
`recheck_notice`	앞선 결정이 바뀌어서 다시 확인이 필요해요.
`empty`	아직 저장된 결정이 없어요.
<!-- copy:end -->