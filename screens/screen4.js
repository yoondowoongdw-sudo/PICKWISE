// 화면 4. 정보 입력 (DESIGN.md 8장 screen4_info)
// 담당: (이름을 적어 주세요)
// 받는 값: state.decision.options, 선택된 기준  →  넘기는 값: state.info, state.files, state.scores
Pickwise.screens[4] = {
  render(el, ctx) {
    const { escape: e } = Pickwise.ui;
    const s = ctx.state;

    el.innerHTML = `
      ${Pickwise.ui.heading(Pickwise.t('screen4.title'), Pickwise.t('screen4.subtitle'))}

      <div class="todo-box">
        <h3>뼈대 상태 — 담당자가 채울 부분</h3>
        <ul>
          <li>선택지별 자유 입력창 (번호 원 + 라벨)</li>
          <li>자료 첨부 영역 + 회색 i 버튼 → 'PDF로 저장하는 방법' 하단 시트</li>
          <li>'분석하기' 누르면 로딩 문구 후 결과 화면으로</li>
        </ul>
        <p class="caption">선택지: ${e(s.decision.options.map((o) => o.label).join(', '))}</p>
      </div>
      <p class="notice">${e(Pickwise.t('common.privacy_notice'))}</p>

      ${Pickwise.ui.footer({ label: Pickwise.t('screen4.analyze') })}
    `;

    el.querySelector('#next-btn').addEventListener('click', async () => {
      el.innerHTML = Pickwise.ui.loading(Pickwise.t('common.loading_analysis'));
      const res = await Pickwise.ai.score_options(s.decision, Pickwise.store.selectedCriteria(), s.info);
      s.scores = res.scores;
      ctx.save();
      ctx.next();
    });
  },
};
