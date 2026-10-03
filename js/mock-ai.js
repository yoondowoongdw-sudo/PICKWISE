// 가짜 AI (목업). 실제 AI API 대신 샘플 데이터(data/samples.js)와 규칙으로 응답을 만들어요.
// ⚠ API 키를 코드에 넣으면 공개 배포 시 그대로 노출돼요. 그래서 1차 버전은 이 파일로 AI 응답을 흉내 내요.
// 함수 이름은 DESIGN.md 8장의 AI 호출 이름과 맞췄어요. 모두 Promise 를 돌려줘요(실제 AI처럼 약간 늦게 응답).
window.Pickwise = window.Pickwise || {};

(function () {
  const SAMPLES = window.PICKWISE_SAMPLES || [];
  const DELAY = 700;
  const wait = (value) => new Promise((resolve) => setTimeout(() => resolve(value), DELAY));

  // 주제·선택지 글자에 맞는 샘플 고르기
  const SAMPLE_KEYWORDS = {
    decision_travel: ['여행', '그리스', '이집트', '해외', '휴가'],
    decision_housing: ['자취', '원룸', '방', '집', '이사', '주거', '오피스텔'],
    decision_laptop: ['노트북', '랩탑', '컴퓨터', '맥북', '그램'],
  };
  function findSample(decision) {
    const text = [decision.topic, decision.category, ...(decision.options || []).map((o) => o.label)].join(' ');
    return SAMPLES.find((s) => (SAMPLE_KEYWORDS[s.id] || []).some((k) => text.includes(k))) || null;
  }

  // 기준 이름 → 라인 아이콘 키 (Lucide 아이콘 이름 기준)
  const ICONS = {
    비용: 'wallet', 가격: 'wallet', '월 주거비': 'wallet', 예산: 'wallet',
    날씨: 'sun', 관광: 'landmark', 음식: 'utensils', '이동 편의성': 'bus', 치안: 'shield',
    '새로운 경험': 'sparkles', '출퇴근 시간': 'clock', '공간 크기': 'home', 조용함: 'volume-x',
    '생활 편의시설': 'store', 휴대성: 'feather', 배터리: 'battery', 성능: 'cpu', '화면 크기': 'monitor',
  };
  const iconFor = (label) => ICONS[label] || 'circle';

  const GENERIC_CRITERIA = ['비용', '시간', '만족도', '편의성', '위험도', '성장 가능성'];
  const EXTRA_BY_SAMPLE = {
    decision_travel: ['치안', '새로운 경험', '숙소'],
    decision_housing: ['치안', '채광', '관리비'],
    decision_laptop: ['무게', 'A/S', '디자인'],
  };

  // 글자로 만드는 고정 난수 (같은 입력이면 항상 같은 점수)
  function hashScore(text) {
    let h = 0;
    for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
    return 50 + (h % 41); // 50~90
  }

  function slug(label, i) {
    return 'c' + i + '_' + label.replace(/\s+/g, '');
  }

  Pickwise.ai = {
    // 화면 1: 사용자 문장에서 주제·선택지 추출
    extract_decision(rawInput) {
      const text = (rawInput || '').trim();
      const parts = text.split(/\s*(?:vs\.?|VS|대|또는|아니면|,|\/)\s*/).map((s) => s.replace(/(어디로 갈지|중에|중|할지|살지|고민).*$/, '').trim()).filter(Boolean);
      if (parts.length < 2) return wait({ needs_clarification: true, topic: text, options: [] });
      const options = parts.slice(0, 5).map((label, i) => ({ id: 'opt_' + (i + 1), label }));
      const sample = findSample({ topic: text, options });
      return wait({ needs_clarification: false, topic: text, category: sample ? sample.category : '기타', options });
    },

    // 화면 2: 기준 추천
    suggest_criteria(decision) {
      const sample = findSample(decision);
      const labels = sample ? sample.criteria.map((c) => c.label) : GENERIC_CRITERIA;
      const criteria = labels.map((label, i) => ({
        id: sample ? sample.criteria[i].id : slug(label, i),
        label,
        icon: iconFor(label),
        source: 'ai',
        default_selected: i < 5,
      }));
      const extra = (sample ? EXTRA_BY_SAMPLE[sample.id] : ['비용 대비 효과', '주변 평판', '장기 만족도'])
        .map((label, i) => ({ id: slug(label, 100 + i), label, icon: iconFor(label), source: 'ai' }));
      return wait({ criteria, extra_suggestions: extra });
    },

    // 화면 4: 선택지 x 기준 점수 제안 (0~100). 근거 유형: user_input | file | ai_estimate
    score_options(decision, criteria, info) {
      const sample = findSample(decision);
      const scores = {};
      decision.options.forEach((opt, oi) => {
        scores[opt.id] = {};
        const sampleOpt = sample && (sample.options.find((o) => o.label === opt.label) || sample.options[oi]);
        const userText = (info && info[opt.id]) || '';
        criteria.forEach((c) => {
          const fromSample = sampleOpt && sampleOpt.scores[c.id];
          const score = fromSample != null ? fromSample : hashScore(opt.label + c.label);
          const mentioned = userText && userText.includes(c.label);
          scores[opt.id][c.id] = {
            score,
            evidence_type: mentioned ? 'user_input' : 'ai_estimate',
            evidence: mentioned ? `사용자가 '${c.label}'에 대해 입력한 내용` : `${opt.label}의 ${c.label}에 대한 일반적인 정보를 바탕으로 추정`,
          };
        });
      });
      return wait({ scores });
    },

    // 화면 5: 결과 설명 (3문장 이내)
    explain_result(ranking, criteria, scores, importance) {
      const [first, second] = ranking;
      if (!first || !second) return wait({ text: '' });
      const w = Pickwise.calc.weights(importance) || {};
      const gaps = criteria
        .map((c) => {
          const a = scores[first.optionId][c.id]?.score, b = scores[second.optionId][c.id]?.score;
          return { label: c.label, diff: a != null && b != null ? ((a - b) * (w[c.id] || 0)) / 100 : 0 };
        })
        .sort((x, y) => y.diff - x.diff);
      const top = gaps[0];
      const text = `현재 설정한 중요도를 기준으로는 ${first.label}의 총점이 ${first.display}점으로 ${second.label}(${second.display}점)보다 높게 계산되었어요. ` +
        `가장 큰 차이를 만든 기준은 '${top.label}'이에요. 중요도를 바꾸면 결과가 달라질 수 있어요.`;
      return wait({ text, top_gap_criteria: top.label });
    },

    // 화면 6: 후속 고민 추천 3개
    next_decisions(decision, selectedLabel) {
      const sample = findSample(decision);
      const byCategory = {
        여행: [
          { title: '패키지 vs 자유여행', reason: '여행 방식에 따라 비용과 일정이 크게 달라져요.', option_labels: ['패키지', '자유여행'] },
          { title: `${selectedLabel} 안에서 도시 고르기`, reason: '같은 나라 안에서도 분위기가 달라요.', option_labels: ['도시 A', '도시 B'] },
          { title: '숙소 위치 비교', reason: '이동 시간과 비용에 영향을 줘요.', option_labels: ['중심가', '외곽'] },
        ],
        주거: [
          { title: '계약 기간 1년 vs 2년', reason: '이사 계획에 따라 유리한 조건이 달라요.', option_labels: ['1년', '2년'] },
          { title: '가구 새로 사기 vs 중고', reason: '초기 비용을 줄일 수 있어요.', option_labels: ['새 가구', '중고 가구'] },
          { title: '인터넷 통신사 고르기', reason: '매달 나가는 고정비예요.', option_labels: ['통신사 A', '통신사 B'] },
        ],
        전자기기: [
          { title: '구매처 비교', reason: '같은 제품도 가격과 혜택이 달라요.', option_labels: ['공식몰', '오픈마켓'] },
          { title: '보증 연장 여부', reason: '수리비 부담을 줄일 수 있어요.', option_labels: ['연장', '연장 안 함'] },
          { title: '주변기기 고르기', reason: '업무 환경에 맞춰 필요한 것이 달라요.', option_labels: ['마우스', '거치대'] },
        ],
      };
      const list = byCategory[sample ? sample.category : decision.category] || [
        { title: `${selectedLabel} 실행 시기`, reason: '언제 시작할지에 따라 준비할 것이 달라요.', option_labels: ['이번 달', '다음 달'] },
        { title: '예산 정하기', reason: '쓸 수 있는 범위를 먼저 정하면 선택이 쉬워져요.', option_labels: ['넉넉하게', '최소한으로'] },
        { title: '함께할 사람 정하기', reason: '누구와 하느냐에 따라 만족도가 달라져요.', option_labels: ['혼자', '함께'] },
      ];
      return wait({ next_decisions: list });
    },
  };
})();
