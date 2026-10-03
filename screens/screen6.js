// 화면 6. 다음 결정 (DESIGN.md 8장 screen6_next)
// 담당: (이름을 적어 주세요)
// 받는 값: state.selected_option, state.chain  →  넘기는 값: 새 결정(parent_decision_id 연결) 또는 새로 시작
Pickwise.screens[6] = {
  async render(el, ctx) {
    const { escape: e } = Pickwise.ui;
    const s = ctx.state;
    const selected = s.decision.options.find((o) => o.id === s.selected_option);
    const selectedLabel = selected ? selected.label : '';
    const res = await Pickwise.ai.next_decisions(s.decision, selectedLabel);

    el.innerHTML = `
      ${Pickwise.ui.heading(Pickwise.t('screen6.title'))}
      <p class="screen-subtitle">${e(Pickwise.t('screen6.context_greeting_template', { selected: selectedLabel }))}</p>

      <div class="todo-box">
        <h3>뼈대 상태 — 담당자가 채울 부분</h3>
        <ul>
          <li>AI 추천 후속 고민 카드 3~4개 (제목 + 한 줄 이유), 하나 선택</li>
          <li>'다음 고민 이어가기' → 화면 1로, 선택지 미리 채우기</li>
          <li>'+ 새로운 고민 직접 입력', '새 결정 시작하기'</li>
          <li>(추가 구현) Decision Chain 타임라인</li>
        </ul>
        <p class="caption">추천: ${e(res.next_decisions.map((n) => n.title).join(' / '))}</p>
      </div>

      ${Pickwise.ui.footer({ id: 'restart-btn', label: Pickwise.t('screen6.start_new') })}
    `;

    el.querySelector('#restart-btn').addEventListener('click', () => {
      s.chain.push({ decision_id: s.decision.id, topic: s.decision.topic, options: s.decision.options.map((o) => o.label), selected: selectedLabel, status: 'done' });
      Pickwise.store.reset(true);
      ctx.go(1);
    });
  },
};
