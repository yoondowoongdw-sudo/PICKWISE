// 화면 2. 기준 선택 (DESIGN.md 8장 screen2_criteria)
// 받는 값: state.decision  →  넘기는 값: state.criteria[] (selected: true 인 것이 선택된 기준)
// 처음 들어오면 AI(/api/criteria)가 주제에 맞는 기준을 추천해요.
Pickwise.screens[2] = {
  async render(el, ctx) {
    const { escape: e, icon } = Pickwise.ui;
    const s = ctx.state;
    const MAX = 8;
    const MAX_NAME = 12;
    if (!s.decision.topic || s.decision.options.filter((o) => o.label).length < 2) return ctx.go(1);

    // 처음 들어오면 AI 기준 추천을 받아요. 실패하면 이유와 '다시 시도' 버튼 (직접 추가는 언제든 가능)
    let aiError = '';
    const loadCriteria = async () => {
      el.innerHTML = Pickwise.ui.heading(Pickwise.t('screen2.title')) + Pickwise.ui.loading(Pickwise.t('common.loading_criteria'));
      const res = await Pickwise.ai.criteria(s.decision);
      if (!ctx.alive()) return false;
      if (res.ok) {
        s.criteria = res.criteria.map((c) => ({ id: c.id, label: c.label, icon: c.icon, source: 'ai', selected: c.default_selected }));
        s.criteria_extra = res.extra.map((c) => ({ id: c.id, label: c.label, icon: c.icon }));
        aiError = '';
        ctx.save();
      } else {
        aiError = Pickwise.ai.errorText(res.reason);
      }
      return true;
    };
    if (s.criteria.length === 0 && !(await loadCriteria())) return;

    let adding = false;   // '+ 직접 추가' 입력창이 열려 있는지
    let message = '';     // 추가·선택 오류 안내
    let bannerClosed = false;

    const selectedCount = () => s.criteria.filter((c) => c.selected).length;
    const exists = (label) => s.criteria.some((c) => c.label.replace(/\s/g, '') === label.replace(/\s/g, ''));

    const addCriteria = (c) => {
      if (exists(c.label)) { message = Pickwise.t('screen2.error_duplicate'); return false; }
      if (selectedCount() >= MAX) { message = Pickwise.t('screen2.error_max'); return false; }
      s.criteria.push({ id: c.id, label: c.label, icon: c.icon, source: c.source, selected: true });
      message = '';
      ctx.save();
      return true;
    };

    const draw = (focusSelector) => {
      const selected = selectedCount();
      const extras = (s.criteria_extra || []).filter((x) => !exists(x.label));
      const unselectedSample = s.criteria.filter((c) => !c.selected && c.source === 'ai');
      const showBanner = !bannerClosed && selected > 0 && selected <= 2 && unselectedSample.length > 0;

      el.innerHTML = `
        ${Pickwise.ui.heading(Pickwise.t('screen2.title'), Pickwise.t('screen2.subtitle'))}
        ${aiError ? `<div class="s2-ai-error" role="alert"><p class="error-text">${icon('circle-alert', 14)} ${e(aiError)}</p>
          <button type="button" class="btn btn-secondary" id="s2-retry">${e(Pickwise.t('common.retry'))}</button></div>` : ''}

        <div class="s2-grid">
          ${s.criteria.map((c) => `
            <div class="s2-cell">
              <button type="button" class="select-card s2-card" data-id="${e(c.id)}" aria-pressed="${c.selected}">
                <span class="s2-icon">${icon(c.icon, 24)}</span>
                <span class="s2-label">${e(c.label)}${c.source === 'user' ? `<span class="caption s2-user">${e(Pickwise.t('screen2.user_added'))}</span>` : ''}</span>
                ${Pickwise.ui.check()}
              </button>
              ${c.source === 'user' || c.source === 'extra' ? `<button type="button" class="s2-delete" data-id="${e(c.id)}" aria-label="${e(Pickwise.t('screen2.delete_aria', { criteria: c.label }))}">${icon('x', 16)}</button>` : ''}
            </div>`).join('')}

          ${adding ? `
            <form class="s2-add-form" id="s2-add-form">
              <input class="input" id="s2-add-input" maxlength="${MAX_NAME}" placeholder="${e(Pickwise.t('screen2.add_criteria_placeholder'))}" aria-label="${e(Pickwise.t('screen2.add_criteria_placeholder'))}">
              <div class="s2-add-actions">
                <button type="button" class="btn btn-secondary" id="s2-add-cancel">${e(Pickwise.t('screen2.cancel'))}</button>
                <button type="submit" class="btn btn-primary">${e(Pickwise.t('screen2.add_confirm'))}</button>
              </div>
            </form>` : `
            <button type="button" class="s2-add-card" id="s2-add-open">${e(Pickwise.t('screen2.add_criteria'))}</button>`}
        </div>

        ${message ? `<p class="error-text" role="alert">${icon('circle-alert', 14)} ${e(message)}</p>` : ''}
        ${selected >= 7 ? `<p class="notice s2-warn" role="status">${e(Pickwise.t('screen2.warn_many'))}</p>` : ''}

        ${showBanner ? `
          <div class="ai-box s2-banner">
            <p>${e(Pickwise.t('screen2.missing_criteria_suggest', { criteria: unselectedSample.slice(0, 2).map((c) => c.label).join(', ') }))}</p>
            <div class="s2-chips">
              ${unselectedSample.slice(0, 2).map((c) => `<button type="button" class="chip" data-select="${e(c.id)}" aria-label="${e(Pickwise.t('screen2.add_criteria_chip_aria', { criteria: c.label }))}"><span class="chip-plus">+</span> ${e(c.label)}</button>`).join('')}
              <button type="button" class="s2-banner-close" id="s2-banner-close" aria-label="닫기">${icon('x', 16)}</button>
            </div>
          </div>` : ''}

        ${extras.length ? `
          <section class="s2-extra">
            <h3 class="s2-extra-title">${icon('lightbulb', 22)} ${e(Pickwise.t('screen2.ai_extra_title'))}</h3>
            <div class="s2-chips">
              ${extras.map((x) => `<button type="button" class="chip" data-extra="${e(x.id)}" aria-label="${e(Pickwise.t('screen2.add_criteria_chip_aria', { criteria: x.label }))}"><span class="chip-plus">+</span> ${e(x.label)}</button>`).join('')}
            </div>
          </section>` : ''}

        ${Pickwise.ui.footer({ disabled: selected < 1, reason: Pickwise.t('screen2.error_min') })}
      `;

      // 카드 선택·해제
      el.querySelectorAll('.s2-card').forEach((btn) => btn.addEventListener('click', () => {
        const c = s.criteria.find((x) => x.id === btn.dataset.id);
        if (!c.selected && selectedCount() >= MAX) { message = Pickwise.t('screen2.error_max'); return draw(); }
        c.selected = !c.selected;
        message = '';
        ctx.save();
        draw(`.s2-card[data-id="${c.id}"]`);
      }));

      // 직접 추가·추천 칩으로 넣은 기준 삭제
      el.querySelectorAll('.s2-delete').forEach((btn) => btn.addEventListener('click', () => {
        s.criteria = s.criteria.filter((x) => x.id !== btn.dataset.id);
        delete s.importance[btn.dataset.id];
        message = '';
        ctx.save();
        draw('#s2-add-open');
      }));

      // 빠진 기준 배너
      el.querySelectorAll('[data-select]').forEach((btn) => btn.addEventListener('click', () => {
        s.criteria.find((x) => x.id === btn.dataset.select).selected = true;
        ctx.save();
        draw();
      }));
      el.querySelector('#s2-banner-close')?.addEventListener('click', () => { bannerClosed = true; draw(); });

      // '이런 기준도 고려해보세요' 칩
      el.querySelectorAll('[data-extra]').forEach((btn) => btn.addEventListener('click', () => {
        const x = s.criteria_extra.find((v) => v.id === btn.dataset.extra);
        addCriteria({ ...x, source: 'extra' });
        draw();
      }));

      // AI 추천 다시 시도
      el.querySelector('#s2-retry')?.addEventListener('click', async () => {
        if (await loadCriteria()) draw();
      });

      // '+ 직접 추가'
      el.querySelector('#s2-add-open')?.addEventListener('click', () => { adding = true; message = ''; draw('#s2-add-input'); });
      el.querySelector('#s2-add-cancel')?.addEventListener('click', () => { adding = false; message = ''; draw('#s2-add-open'); });
      el.querySelector('#s2-add-form')?.addEventListener('submit', (ev) => {
        ev.preventDefault();
        const label = el.querySelector('#s2-add-input').value.trim().slice(0, MAX_NAME);
        if (!label) { message = Pickwise.t('screen2.error_empty_name'); return draw('#s2-add-input'); }
        if (addCriteria({ id: 'user_' + Date.now(), label, icon: 'circle', source: 'user' })) adding = false;
        draw(adding ? '#s2-add-input' : '#s2-add-open');
      });

      el.querySelector('#next-btn').addEventListener('click', ctx.next);
      if (focusSelector) el.querySelector(focusSelector)?.focus();
    };

    draw();
  },
};
