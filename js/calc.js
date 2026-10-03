// 점수 계산 (DESIGN.md 화면 3 '계산 규칙'). AI가 아니라 코드가 계산해요.
//   반영 비율 weight_i = importance_i ÷ Σimportance × 100 (%)
//   총점 = Σ(weight_i × 기준 점수) ÷ 100
// 점수가 null(정보 부족)인 기준은 빼고, 남은 기준끼리 비율을 다시 맞춰요.
window.Pickwise = window.Pickwise || {};

Pickwise.calc = {
  TIE_GAP: 3, // 총점 차이가 이 값 미만이면 '거의 차이 없음'

  // importance: { id: 0~100 } → { id: 반영 비율 % }. 모두 0이면 null
  weights(importance) {
    const ids = Object.keys(importance);
    const sum = ids.reduce((s, id) => s + (Number(importance[id]) || 0), 0);
    if (sum <= 0) return null;
    const out = {};
    ids.forEach((id) => { out[id] = ((Number(importance[id]) || 0) / sum) * 100; });
    return out;
  },

  // 선택지 하나의 총점
  total(optionScores, importance) {
    const usable = {};
    Object.keys(importance).forEach((id) => {
      const cell = optionScores[id];
      if (cell && cell.score != null) usable[id] = importance[id];
    });
    const w = Pickwise.calc.weights(usable);
    if (!w) return null;
    return Object.keys(w).reduce((s, id) => s + (w[id] * optionScores[id].score) / 100, 0);
  },

  // 모든 선택지 총점과 순위 (높은 순)
  ranking(options, scores, importance) {
    return options
      .map((o) => ({ optionId: o.id, label: o.label, total: Pickwise.calc.total(scores[o.id] || {}, importance) }))
      .sort((a, b) => (b.total ?? -1) - (a.total ?? -1))
      .map((r, i) => ({ ...r, display: r.total == null ? null : Math.round(r.total), rank: i + 1 }));
  },

  // 1위와 2위의 차이를 가장 크게 만든 기준
  topGapCriteria(ranking, criteria, scores, importance) {
    if (ranking.length < 2) return null;
    const w = Pickwise.calc.weights(importance) || {};
    const a = scores[ranking[0].optionId] || {}, b = scores[ranking[1].optionId] || {};
    let best = null;
    criteria.forEach((c) => {
      if (a[c.id]?.score == null || b[c.id]?.score == null) return;
      const gap = ((a[c.id].score - b[c.id].score) * (w[c.id] || 0)) / 100;
      if (!best || gap > best.gap) best = { criteria: c, gap };
    });
    return best && best.gap > 0 ? best.criteria : null;
  },

  // 민감도: 기준 하나의 중요도만 0~100 사이로 바꿨을 때(다른 기준은 그대로) 1위가 바뀌는 지점을 찾아요.
  // 결과 %는 슬라이더 값이 아니라 반영 비율(%)이에요.
  sensitivity(options, criteria, scores, importance) {
    const calc = Pickwise.calc;
    const base = calc.ranking(options, scores, importance);
    const winnerId = base[0]?.optionId;
    // 점수가 있는 기준끼리의 반영 비율(%). 정보 부족 기준은 총점에 안 들어가므로 비율에서도 빼요.
    const scored = criteria.filter((c) => options.some((o) => scores[o.id]?.[c.id]?.score != null));
    const pick = (imp) => Object.fromEntries(scored.map((c) => [c.id, imp[c.id] || 0]));
    const ratioOf = (id, imp) => Math.round((calc.weights(pick(imp)) || {})[id] || 0);

    return scored
      .map((c) => {
        const current = importance[c.id];
        let flip = null, close = null;
        // 현재 값에서 가까운 순서로 찾아요 (조금만 바꿔도 바뀌는 지점이 먼저 나오게).
        // 문장은 반영 비율(%)로 말하고, 비율은 다른 기준을 낮춰서도 만들 수 있으므로 100을 넘는 값까지 살펴봐요.
        const MAX_SEARCH = 1000;
        for (let step = 1; step <= MAX_SEARCH && !flip; step++) {
          for (const v of [current + step, current - step]) {
            if (v < 0 || v > MAX_SEARCH) continue;
            const imp = { ...importance, [c.id]: v };
            if (calc.weights(imp) === null) continue;
            const r = calc.ranking(options, scores, imp);
            if (r[0].optionId !== winnerId) { flip = { value: v, option: r[0].label, up: v > current, imp }; break; }
            if (!close && r.length > 1 && r[0].total - r[1].total < calc.TIE_GAP) close = { value: v, imp, up: v > current };
          }
        }
        const from = ratioOf(c.id, importance);
        if (flip) return { criteria: c, type: 'flip', from, to: ratioOf(c.id, flip.imp), option: flip.option, up: flip.up, distance: Math.abs(flip.value - current) };
        if (close) return { criteria: c, type: 'close', from, to: ratioOf(c.id, close.imp), up: close.up, distance: Math.abs(close.value - current) };
        return { criteria: c, type: 'stable', from, distance: Infinity };
      })
      .sort((x, y) => x.distance - y.distance);
  },

  // What-if (가중치 변경): 기준 하나를 두 배 중요하게 했을 때 다시 계산
  whatIfDouble(options, scores, importance, criteriaId) {
    const imp = { ...importance, [criteriaId]: (importance[criteriaId] || 0) * 2 || 50 };
    return Pickwise.calc.ranking(options, scores, imp);
  },
};
