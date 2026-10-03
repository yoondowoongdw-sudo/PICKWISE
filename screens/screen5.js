// 화면 5. 분석 결과 (DESIGN.md 8장 screen5_result)
// 담당: (이름을 적어 주세요)
// 받는 값: state.importance, state.scores  →  넘기는 값: state.selected_option
Pickwise.screens[5] = {
  async render(el, ctx) {
    const { escape: e } = Pickwise.ui;
    const s = ctx.state;
    const criteria = Pickwise.store.selectedCriteria();

    // 총점은 코드가 계산해요 (AI 아님)
    const ranking = Pickwise.calc.ranking(s.decision.options, s.scores, s.importance);
    const winner = ranking[0];
    const explain = await Pickwise.ai.explain_result(ranking, criteria, s.scores, s.importance);

    el.innerHTML = `
      ${Pickwise.ui.heading(Pickwise.t('screen5.title'), Pickwise.t('screen5.subtitle'))}

      <div class="todo-box">
        <h3>뼈대 상태 — 담당자가 채울 부분</h3>
        <ul>
          <li>선택지별 총점 카드 (높은 쪽 주황, 다른 쪽 진회색)</li>
          <li>AI 설명 박스 (3문장 이내)</li>
          <li>기준별 세로 막대 그래프 + 범례, 근거 배지 목록</li>
          <li>(추가 구현) 민감도 · What-if</li>
        </ul>
        <p class="caption">총점: ${e(ranking.map((r) => `${r.label} ${r.display}${Pickwise.t('screen5.score_unit')}`).join(' / '))}</p>
      </div>

      <div class="ai-box">
        <div class="ai-label">${e(Pickwise.t('screen5.ai_explain_label', { winner: winner ? winner.label : '' }))}</div>
        <p>${e(explain.text)}</p>
      </div>
      <p class="notice">${e(Pickwise.t('screen5.disclaimer'))}</p>

      ${Pickwise.ui.footer({ label: Pickwise.t('screen5.select_option_cta') + ` (${winner ? winner.label : ''})`, disabled: !winner })}
    `;

    el.querySelector('#next-btn').addEventListener('click', () => {
      s.selected_option = winner.optionId;
      ctx.save();
      ctx.next();
    });
  },
};
