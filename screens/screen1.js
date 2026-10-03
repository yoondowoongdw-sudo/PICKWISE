// 화면 1. 결정 입력 (DESIGN.md 8장 screen1_decision)
// 담당: (이름을 적어 주세요)
// 받는 값: 없음  →  넘기는 값: state.decision.{ topic, category, options[] }
Pickwise.screens[1] = {
  render(el, ctx) {
    const { escape: e } = Pickwise.ui;
    const d = ctx.state.decision;

    el.innerHTML = `
      ${Pickwise.ui.heading(Pickwise.t('screen1.title'), Pickwise.t('screen1.subtitle'))}

      <div class="todo-box">
        <h3>뼈대 상태 — 담당자가 채울 부분</h3>
        <ul>
          <li>결정 주제 입력창</li>
          <li>선택지 입력 목록 (A, B, …) + 선택지 추가 + 삭제(X), 최대 5개</li>
          <li>자연어 입력 → <code>Pickwise.ai.extract_decision()</code> 로 주제·선택지 채우기</li>
          <li>선택지 2개 미만이면 다음 비활성 + 이유 안내</li>
        </ul>
        <p class="caption">지금 저장된 값: ${e(d.topic || '(없음)')} / ${e(d.options.map((o) => o.label).join(', ') || '(없음)')}</p>
      </div>

      <button type="button" class="btn btn-secondary" id="fill-sample">샘플(그리스 vs 이집트)로 채우기</button>
      <p class="notice">${e(Pickwise.t('common.privacy_notice'))}</p>

      ${Pickwise.ui.footer({ disabled: d.options.length < 2, reason: Pickwise.t('screen1.error_min_options') })}
    `;

    el.querySelector('#fill-sample').addEventListener('click', async () => {
      const result = await Pickwise.ai.extract_decision('그리스 vs 이집트 어디로 갈지');
      Object.assign(d, { topic: result.topic, category: result.category, options: result.options });
      ctx.state.criteria = []; // 선택지가 바뀌면 화면 2에서 기준을 다시 추천받아요
      ctx.save();
      this.render(el, ctx);
    });
    el.querySelector('#next-btn').addEventListener('click', ctx.next);
  },
};
