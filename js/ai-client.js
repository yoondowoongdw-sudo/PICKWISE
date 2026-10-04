// 화면에서 서버 함수(/api/...)를 부르는 도우미. 실패하면 { ok:false, reason } 을 돌려줘요.
// 화면은 실패하면 "다시 시도" 안내를 보여 줘요 (입력값은 그대로 유지).
window.Pickwise = window.Pickwise || {};

Pickwise.ai = {
  TIMEOUT_MS: 45000, // 웹 검색 + AI 분석은 10~20초 걸릴 수 있어요

  async call(name, payload) {
    if (location.protocol === 'file:') return { ok: false, reason: 'no_server' }; // 파일로 직접 열면 서버가 없어요
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), Pickwise.ai.TIMEOUT_MS);
    try {
      const res = await fetch('/api/' + name, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: ctrl.signal,
      });
      const data = await res.json().catch(() => null);
      if (!data) return { ok: false, reason: 'http_' + res.status };
      if (!data.ok) console.info('[Pickwise] AI 실패:', name, data.reason);
      return data;
    } catch (err) {
      console.info('[Pickwise] AI 호출 실패:', name, err.name);
      return { ok: false, reason: err.name === 'AbortError' ? 'timeout' : 'network' };
    } finally {
      clearTimeout(timer);
    }
  },

  // 화면 2: 기준 추천
  criteria(decision) {
    return Pickwise.ai.call('criteria', {
      topic: decision.topic,
      options: decision.options.map((o) => ({ id: o.id, label: o.label })),
    });
  },

  // 화면 4: 선택지 x 기준 점수 (웹 검색으로 정보 보완)
  // 화면 4: 선택한 기준·중요도를 보고 사용자에게 물어볼 정보 (0~3개)
  questions(decision, criteria, importance) {
    return Pickwise.ai.call('questions', {
      topic: decision.topic,
      options: decision.options.map((o) => ({ id: o.id, label: o.label })),
      criteria: criteria.map((c) => ({ id: c.id, label: c.label, importance: importance[c.id] ?? 50 })),
    });
  },

  // 화면 4: 선택지 x 기준 점수 (웹 검색으로 정보 보완 + 질문 답변별 맞춤 검색)
  analyze(decision, criteria, info, questions, answers) {
    return Pickwise.ai.call('analyze', {
      topic: decision.topic,
      options: decision.options.map((o) => ({ id: o.id, label: o.label })),
      criteria: criteria.map((c) => ({ id: c.id, label: c.label })),
      info,
      // 질문과 답 (답이 비어 있어도 보내서 AI가 '일반적인 경우로 추정'이라고 밝히게 해요)
      context: (questions || []).map((q) => ({ id: q.id, criterion_id: q.criterion_id, question: q.question, search: q.search, answer: (answers && answers[q.id]) || '' })),
    });
  },

  // 화면 6: 후속 고민 추천
  next(decision, selectedLabel, chain) {
    return Pickwise.ai.call('next', {
      topic: decision.topic,
      options: decision.options.map((o) => ({ id: o.id, label: o.label })),
      selected: selectedLabel,
      history: chain.filter((n) => n.selected).map((n) => `${n.title || n.topic} → ${n.selected}`),
    });
  },

  // 실패 이유 → 사용자에게 보여 줄 문구
  errorText(reason) {
    if (reason === 'rate_limited') return Pickwise.t('common.error_busy');
    if (reason === 'no_key' || reason === 'no_server') return Pickwise.t('common.error_no_ai');
    return Pickwise.t('common.error_generic');
  },
};
