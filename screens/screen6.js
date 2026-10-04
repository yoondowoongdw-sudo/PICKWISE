// 화면 6. 다음 결정 (DESIGN.md 8장 screen6_next, 목업 6페이지)
// 받는 값: state.selected_option, state.chain  →  넘기는 값: 새 결정(parent_decision_id 연결) 또는 새로 시작
// AI(/api/next)가 방금 결정에 이어지는 고민을 추천해요. 고르면 화면 1에 주제·선택지가 미리 채워져요.
Pickwise.screens[6] = {
  async render(el, ctx) {
    const { escape: e, icon } = Pickwise.ui;
    const t = Pickwise.t;
    const s = ctx.state;
    const selected = s.decision.options.find((o) => o.id === s.selected_option);
    if (!selected) return ctx.go(5);

    let suggestions = [];
    let aiError = '';
    let choice = null;      // 고른 카드 index, 또는 'custom'
    let customText = '';
    const loadNext = async () => {
      el.innerHTML = Pickwise.ui.heading(t('screen6.title')) + Pickwise.ui.loading(t('common.loading_next'));
      const res = await Pickwise.ai.next(s.decision, selected.label, s.chain);
      if (!ctx.alive()) return false;
      suggestions = res.ok ? res.next_decisions : [];
      aiError = res.ok ? '' : t('screen6.ai_failed');
      if (choice === null || typeof choice === 'number') choice = suggestions.length ? 0 : null; // 목업처럼 첫 추천을 미리 선택
      return true;
    };
    if (!(await loadNext())) return;

    const statusKey = { done: 'common.status_done', pending: 'common.status_pending', recheck: 'common.status_recheck' };

    const draw = (focusSelector) => {
      const canContinue = choice !== null && (choice !== 'custom' || customText.trim());
      el.innerHTML = `
        <!-- 나의 결정 (Decision Chain) -->
        <section class="card s6-chain">
          <h3 class="s6-chain-title">${e(t('history.title'))}</h3>
          ${s.chain.length ? `<ol class="s6-nodes">
            ${s.chain.map((n, i) => `
              <li class="s6-node ${n.decision_id === s.decision.id ? 'is-current' : ''}">
                <span class="s6-num">${i + 1}</span>
                <div class="s6-node-body">
                  <span class="s6-node-title">${e(n.title || n.topic)}</span>
                  ${n.options?.length ? `<span class="s6-node-opts">${e(n.options.join(' vs '))}</span>` : ''}
                  ${n.selected ? `<span class="s6-result">${e(t('history.node_result_template', { selected: n.selected }))}</span>` : ''}
                  <span class="s6-status s6-status-${e(n.status)}">${e(t(statusKey[n.status]))}</span>
                </div>
              </li>`).join('')}
          </ol>` : `<p class="notice">${e(t('history.empty'))}</p>`}
        </section>

        ${Pickwise.ui.heading(t('screen6.title'))}
        <p class="screen-subtitle">${e(t('screen6.context_greeting_template', { selected: selected.label }))}</p>

        ${aiError ? `<div class="s6-ai-error" role="alert"><p class="error-text">${icon('circle-alert', 14)} ${e(aiError)}</p>
          <button type="button" class="btn btn-secondary" id="s6-retry">${e(t('common.retry'))}</button></div>` : ''}
        <div class="s6-list" role="radiogroup" aria-label="${e(t('screen6.title'))}">
          ${suggestions.map((n, i) => `
            <button type="button" class="select-card s6-card" role="radio" data-i="${i}" aria-checked="${choice === i}">
              <span class="s6-card-body">
                <span class="s6-tag">${e(t('screen6.ai_recommend'))}</span>
                <span class="s6-card-title">${e(n.title)}</span>
                <span class="s6-reason">${e(n.reason)}</span>
              </span>
              ${Pickwise.ui.check()}
            </button>`).join('')}
          ${choice === 'custom' ? `
            <input class="input" id="s6-custom" maxlength="40" value="${e(customText)}" placeholder="${e(t('screen6.placeholder_custom'))}" aria-label="${e(t('screen6.custom_input'))}">`
            : `<button type="button" class="s6-custom-btn" id="s6-custom-open">${e(t('screen6.custom_input'))}</button>`}
        </div>

        <div class="screen-footer">
          ${!canContinue ? `<p class="disabled-reason" id="s6-continue-reason">${e(t('screen6.continue_disabled'))}</p>` : ''}
          <button type="button" class="btn btn-primary btn-block" id="s6-continue" ${canContinue ? '' : 'disabled aria-describedby="s6-continue-reason"'}>${e(t('screen6.continue_button'))}</button>
          <button type="button" class="btn btn-secondary btn-block" id="s6-new">${e(t('screen6.start_new'))}</button>
        </div>
      `;

      el.querySelectorAll('.s6-card').forEach((btn) => btn.addEventListener('click', () => {
        choice = Number(btn.dataset.i);
        draw(`.s6-card[data-i="${choice}"]`);
      }));
      el.querySelector('#s6-custom-open')?.addEventListener('click', () => { choice = 'custom'; draw('#s6-custom'); });
      const custom = el.querySelector('#s6-custom');
      custom?.addEventListener('input', () => {
        const had = !!customText.trim();
        customText = custom.value;
        if (had !== !!customText.trim()) {
          const pos = custom.selectionStart;
          draw('#s6-custom');
          el.querySelector('#s6-custom').setSelectionRange(pos, pos);
        }
      });

      el.querySelector('#s6-retry')?.addEventListener('click', async () => { if (await loadNext()) draw(); });

      // 다음 고민 이어가기: 기록에 '결정 중'으로 남기고, 화면 1에 주제·선택지를 미리 채워요
      el.querySelector('#s6-continue').addEventListener('click', () => {
        const picked = choice === 'custom' ? { title: customText.trim(), option_labels: [] } : suggestions[choice];
        const parentId = s.decision.id;
        const newId = 'decision_' + Date.now();
        s.chain.push({ decision_id: newId, parent_decision_id: parentId, title: picked.title, topic: picked.title, options: [], selected: null, status: 'pending' });
        Pickwise.store.reset(true);
        const st = Pickwise.store.state;
        st.decision.id = newId; // 이 결정을 마치면 위 '결정 중' 기록이 '결정 완료'로 바뀌어요 (화면 5)
        st.decision.parent_decision_id = parentId;
        st.decision.topic = picked.title;
        const labels = (picked.option_labels || []).slice(0, 5);
        if (labels.length >= 2) st.decision.options = labels.map((label, i) => ({ id: 'opt_' + (i + 1), label }));
        st.pending_followup = { topic: picked.title, parent_decision_id: parentId, ai_filled: labels.length >= 2 };
        Pickwise.store.save();
        ctx.go(1);
      });

      // 새 결정 시작하기: 연결 없이 새로 시작 (결정 기록은 남겨요)
      el.querySelector('#s6-new').addEventListener('click', () => {
        Pickwise.store.reset(true);
        ctx.go(1);
      });

      if (focusSelector) el.querySelector(focusSelector)?.focus();
    };

    draw();
  },
};
