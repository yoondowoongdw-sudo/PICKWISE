// 화면 2. 기준 선택 (DESIGN.md 8장 screen2_criteria)
// 담당: (이름을 적어 주세요)
// 받는 값: state.decision  →  넘기는 값: state.criteria[] (selected: true 인 것이 선택된 기준)
Pickwise.screens[2] = {
  async render(el, ctx) {
    const { escape: e } = Pickwise.ui;
    const s = ctx.state;

    // 기준 후보가 아직 없으면 AI(목업)에게 추천을 받아요
    if (s.criteria.length === 0) {
      el.innerHTML = Pickwise.ui.heading(Pickwise.t('screen2.title')) + Pickwise.ui.loading(Pickwise.t('common.loading_criteria'));
      const res = await Pickwise.ai.suggest_criteria(s.decision);
      s.criteria = res.criteria.map((c) => ({ id: c.id, label: c.label, icon: c.icon, source: c.source, selected: c.default_selected }));
      this.extra = res.extra_suggestions;
      ctx.save();
    }

    const selected = Pickwise.store.selectedCriteria();
    el.innerHTML = `
      ${Pickwise.ui.heading(Pickwise.t('screen2.title'), Pickwise.t('screen2.subtitle'))}

      <div class="todo-box">
        <h3>뼈대 상태 — 담당자가 채울 부분</h3>
        <ul>
          <li>기준 카드 2열 (라인 아이콘 + 이름 + 선택 체크), 누르면 선택/해제</li>
          <li>'이런 기준도 고려해보세요' 칩 3개 (<code>extra_suggestions</code>)</li>
          <li>점선 '+ 직접 추가' 카드 (12자, 중복 막기)</li>
          <li>0개 선택 시 다음 비활성, 7개 이상이면 경고</li>
        </ul>
        <p class="caption">AI 추천 기준: ${e(s.criteria.map((c) => (c.selected ? '✔' : '') + c.label).join(', '))}</p>
      </div>

      ${Pickwise.ui.footer({ disabled: selected.length < 1, reason: Pickwise.t('screen2.error_min') })}
    `;
    el.querySelector('#next-btn').addEventListener('click', ctx.next);
  },
};
