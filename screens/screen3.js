// 화면 3. 중요도 설정 (DESIGN.md 8장 screen3_weight)
// 담당: (이름을 적어 주세요)
// 받는 값: 선택된 기준 (Pickwise.store.selectedCriteria())  →  넘기는 값: state.importance { 기준id: 0~100 }
Pickwise.screens[3] = {
  render(el, ctx) {
    const { escape: e } = Pickwise.ui;
    const s = ctx.state;
    const criteria = Pickwise.store.selectedCriteria();

    // 새 기준은 기본값 50, 빠진 기준의 값은 지워요 (DESIGN.md 공통 정책)
    const importance = {};
    criteria.forEach((c) => { importance[c.id] = s.importance[c.id] ?? 50; });
    s.importance = importance;
    ctx.save();

    const allZero = Pickwise.calc.weights(importance) === null;
    el.innerHTML = `
      ${Pickwise.ui.heading(Pickwise.t('screen3.title'), Pickwise.t('screen3.subtitle'))}

      <div class="todo-box">
        <h3>뼈대 상태 — 담당자가 채울 부분</h3>
        <ul>
          <li>기준마다 한 줄: 아이콘+이름 / 슬라이더(0~100) / 숫자</li>
          <li>슬라이더 핸들 20px, 터치 영역 44px, 키보드 조작</li>
          <li>0이면 '결과에 반영되지 않아요' 안내, 전부 0이면 다음 비활성</li>
        </ul>
        <p class="caption">현재 중요도: ${e(criteria.map((c) => c.label + ' ' + importance[c.id]).join(' / '))}</p>
      </div>
      <p class="notice">${e(Pickwise.t('screen3.ratio_hint'))}</p>

      ${Pickwise.ui.footer({ disabled: allZero, reason: Pickwise.t('screen3.all_zero_error') })}
    `;
    el.querySelector('#next-btn').addEventListener('click', ctx.next);
  },
};
