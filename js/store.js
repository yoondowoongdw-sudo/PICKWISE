// 앱 전체가 함께 쓰는 데이터(state). 화면끼리는 이 state 로 값을 주고받아요.
// 값을 바꾼 뒤 Pickwise.store.save() 를 부르면 브라우저에 임시 저장돼서 새로고침해도 남아요.
window.Pickwise = window.Pickwise || {};

(function () {
  const KEY = 'pickwise:v2'; // 저장 형식이 바뀌면 숫자를 올려요 (예전 예시 데이터 버전 기록은 무시)

  function emptyState() {
    return {
      // 화면 1 → 2: 결정 주제와 선택지
      decision: {
        id: 'decision_' + Date.now(),
        topic: '',
        category: '',
        options: [{ id: 'opt_1', label: '' }, { id: 'opt_2', label: '' }], // [{ id, label }] — 처음엔 빈칸 2개
        parent_decision_id: null,
      },
      // 화면 2 → 3: 기준 후보 전체 (selected 가 true 인 것만 다음 단계에서 사용)
      criteria: [],             // [{ id, label, icon, source: 'ai' | 'extra' | 'user', selected }]
      criteria_extra: [],       // '이런 기준도 고려해보세요' 칩 [{ id, label, icon }]
      // 화면 3 → 4: 기준별 중요도 0~100 (기본 50)
      importance: {},           // { [criteriaId]: number }
      // 화면 4 → 5: 사용자가 입력한 정보와 첨부 파일
      info: {},                 // { [optionId]: string }
      // 화면 4 '더 정확한 비교를 위해 알려 주세요': AI가 선택 기준·중요도를 보고 만든 질문과 사용자 답
      questions: [],            // [{ id, criterion_id, question, placeholder, search }]
      questions_key: '',        // 질문을 만든 기준·중요도 (바뀌면 질문을 다시 만들어요)
      context: {},              // { [questionId]: string } 사용자 답 (예: 집 지역, 예산)
      files: [],                // [{ name, type, size }]
      // 화면 4 결과 → 5: 선택지 x 기준 점수
      scores: {},               // { [optionId]: { [criteriaId]: { score, evidence_type, evidence, sources } } }
      analysis_key: '',         // 마지막 분석에 쓴 입력 (같으면 다시 분석하지 않아요)
      // 화면 5 → 6
      selected_option: null,    // optionId
      // 화면 6: 결정 기록 (Decision Chain)
      chain: [],                // [{ decision_id, parent_decision_id, topic, options, selected, status }]
      // 화면 6 → 1: 이어가기로 고른 후속 고민 (체험판에서는 기록만 해요)
      pending_followup: null,   // { topic, parent_decision_id }
    };
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return Object.assign(emptyState(), JSON.parse(raw));
    } catch (e) { /* 저장소를 못 쓰는 환경이면 새로 시작 */ }
    return emptyState();
  }

  const store = {
    state: load(),
    save() {
      try { localStorage.setItem(KEY, JSON.stringify(store.state)); } catch (e) { /* 무시 */ }
    },
    // 새 결정 시작 (결정 기록은 남겨요)
    reset(keepChain = true) {
      const chain = keepChain ? store.state.chain : [];
      store.state = emptyState();
      store.state.chain = chain;
      store.save();
    },
    // 화면 3 이후에서 쓰는 '선택된 기준' 목록
    selectedCriteria() {
      return store.state.criteria.filter((c) => c.selected);
    },
  };

  Pickwise.store = store;
})();
