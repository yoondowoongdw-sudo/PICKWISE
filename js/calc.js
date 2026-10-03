// 점수 계산 (DESIGN.md 화면 3 '계산 규칙'). AI가 아니라 코드가 계산해요.
//   반영 비율 weight_i = importance_i ÷ Σimportance × 100 (%)
//   총점 = Σ(weight_i × 기준 점수) ÷ 100
window.Pickwise = window.Pickwise || {};

Pickwise.calc = {
  // importance: { id: 0~100 } → { id: 반영 비율 % }. 모두 0이면 null
  weights(importance) {
    const ids = Object.keys(importance);
    const sum = ids.reduce((s, id) => s + (Number(importance[id]) || 0), 0);
    if (sum <= 0) return null;
    const out = {};
    ids.forEach((id) => { out[id] = ((Number(importance[id]) || 0) / sum) * 100; });
    return out;
  },

  // 선택지 하나의 총점. 점수가 null 인 기준은 빼고 남은 기준으로 다시 비율을 맞춰요.
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

  // 모든 선택지 총점과 순위
  ranking(options, scores, importance) {
    return options
      .map((o) => ({ optionId: o.id, label: o.label, total: Pickwise.calc.total(scores[o.id] || {}, importance) }))
      .sort((a, b) => (b.total ?? -1) - (a.total ?? -1))
      .map((r, i) => ({ ...r, display: r.total == null ? null : Math.round(r.total), rank: i + 1 }));
  },
};
