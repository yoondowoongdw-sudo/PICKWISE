// 화면 3. 중요도 설정 (DESIGN.md 8장 screen3_weight)
// 받는 값: 선택된 기준  →  넘기는 값: state.importance { 기준id: 0~100 }
// 중요도는 사용자의 가치 판단이라 코드·데이터가 대신 정하지 않아요. 모두 50에서 시작해요.
Pickwise.screens[3] = {
  render(el, ctx) {
    const { escape: e, icon } = Pickwise.ui;
    const s = ctx.state;
    const criteria = Pickwise.store.selectedCriteria();
    if (criteria.length === 0) return ctx.go(2);

    // 남은 기준은 값 유지, 새 기준은 50, 빠진 기준은 지워요 (DESIGN.md 공통 정책)
    // 주황 채움이 핸들(20px) 가운데에서 끝나도록: 왼쪽 끝 10px ~ 오른쪽 끝 10px 사이를 값만큼
    const fillAt = (v) => `calc(10px + (100% - 20px) * ${v / 100})`;

    const importance = {};
    criteria.forEach((c) => { importance[c.id] = s.importance[c.id] ?? 50; });
    s.importance = importance;
    ctx.save();

    el.innerHTML = `
      ${Pickwise.ui.heading(Pickwise.t('screen3.title'), Pickwise.t('screen3.subtitle'))}

      <div class="s3-list">
        ${criteria.map((c) => {
          const v = importance[c.id];
          const aria = e(Pickwise.t('screen3.importance_aria', { criteria: c.label }));
          return `
          <div class="s3-row" data-id="${e(c.id)}">
            <div class="s3-line">
              <span class="s3-name">${icon(c.icon, 24)}<span>${e(c.label)}</span></span>
              <input type="range" class="s3-slider" min="0" max="100" step="1" value="${v}" aria-label="${aria}" style="--fill:${fillAt(v)}">
              <input type="number" class="s3-number num" min="0" max="100" step="1" value="${v}" aria-label="${aria}">
            </div>
            <p class="caption s3-zero" ${v === 0 ? '' : 'hidden'}>${e(Pickwise.t('screen3.zero_weight_notice'))}</p>
          </div>`;
        }).join('')}
      </div>
      <p class="notice">${e(Pickwise.t('screen3.ratio_hint'))}</p>

      ${Pickwise.ui.footer({ disabled: Pickwise.calc.weights(importance) === null })}
      <p class="error-text s3-allzero" role="alert" ${Pickwise.calc.weights(importance) === null ? '' : 'hidden'}>${e(Pickwise.t('screen3.all_zero_error'))}</p>
    `;

    const nextBtn = el.querySelector('#next-btn');
    const allZeroMsg = el.querySelector('.s3-allzero');
    // 오류 문구를 버튼 바로 위로 옮겨요
    nextBtn.before(allZeroMsg);

    const update = (row, raw) => {
      const v = Math.max(0, Math.min(100, Math.round(Number(raw) || 0)));
      const id = row.dataset.id;
      s.importance[id] = v;
      const slider = row.querySelector('.s3-slider');
      const number = row.querySelector('.s3-number');
      slider.value = v;
      slider.style.setProperty('--fill', fillAt(v));
      if (document.activeElement !== number) number.value = v;
      row.querySelector('.s3-zero').hidden = v !== 0;
      const allZero = Pickwise.calc.weights(s.importance) === null;
      nextBtn.disabled = allZero;
      allZeroMsg.hidden = !allZero;
      ctx.save();
    };

    el.querySelectorAll('.s3-row').forEach((row) => {
      const slider = row.querySelector('.s3-slider');
      const number = row.querySelector('.s3-number');
      slider.addEventListener('input', () => update(row, slider.value));
      // 키보드: 화살표 1씩, PageUp/PageDown 10씩 (WAI-ARIA 슬라이더 패턴)
      slider.addEventListener('keydown', (ev) => {
        const d = { PageUp: 10, PageDown: -10 }[ev.key];
        if (!d) return;
        ev.preventDefault();
        update(row, Number(slider.value) + d);
      });
      number.addEventListener('input', () => { if (number.value !== '') update(row, number.value); });
      number.addEventListener('blur', () => { update(row, number.value); number.value = s.importance[row.dataset.id]; });
    });

    nextBtn.addEventListener('click', ctx.next);
  },
};
