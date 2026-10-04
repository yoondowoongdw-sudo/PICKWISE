// 화면 4. 정보 입력 (DESIGN.md 8장 screen4_info)
// 받는 값: 선택지, 선택된 기준, 중요도  →  넘기는 값: state.context, state.info, state.files, state.scores
// '더 정확한 비교를 위해 알려 주세요': AI(/api/questions)가 고른 기준·중요도를 보고 필요한 사용자 정보를 0~3개 물어봐요 (필수 아님).
Pickwise.screens[4] = {
  render(el, ctx) {
    const { escape: e, icon } = Pickwise.ui;
    const s = ctx.state;
    const criteria = Pickwise.store.selectedCriteria();
    if (criteria.length === 0) return ctx.go(2);
    s.context = s.context || {};
    s.questions = s.questions || [];

    // 기준·중요도가 바뀌었으면 질문을 다시 만들어요
    const qKey = JSON.stringify([s.decision.topic, s.decision.options.map((o) => o.label), criteria.map((c) => [c.id, c.label, s.importance[c.id]])]);
    let qState = s.questions_key === qKey ? 'ready' : 'loading'; // loading | ready | error
    const labelOf = (id) => (criteria.find((c) => c.id === id) || {}).label || '';
    const iconOf = (id) => (criteria.find((c) => c.id === id) || {}).icon || 'circle';
    const missingQs = () => s.questions.filter((q) => !(s.context[q.id] || '').trim());

    const OK_TYPES = ['application/pdf', 'text/plain'];
    const OK_EXT = /\.(pdf|txt)$/i;
    let fileError = '';
    let analyzeError = ''; // AI 분석 실패 안내

    // 질문 상자만 따로 그려요 (질문을 불러오는 동안에도 메모 칸은 바로 쓸 수 있게)
    const contextBox = () => {
      if (qState === 'ready' && !s.questions.length) return ''; // 물어볼 게 없으면 상자를 안 보여요
      const head = `<h3 class="s4-context-title">${icon('user-round', 20)} ${e(Pickwise.t('screen4.context_title'))}
        <span class="badge s4-context-badge">${e(Pickwise.t('screen4.context_badge'))}</span></h3>`;
      if (qState === 'loading') return `<section class="s4-context">${head}${Pickwise.ui.loading(Pickwise.t('screen4.context_loading'))}</section>`;
      if (qState === 'error') {
        return `<section class="s4-context">${head}<p class="caption">${e(Pickwise.t('screen4.context_error'))}</p>
          <button type="button" class="btn btn-secondary" id="s4-q-retry">${e(Pickwise.t('common.retry'))}</button></section>`;
      }
      return `<section class="s4-context">${head}
        <p class="caption s4-context-desc">${e(Pickwise.t('screen4.context_desc'))}</p>
        ${s.questions.map((q) => `
          <div class="s4-context-row">
            <label class="s4-context-label" for="s4-ctx-${e(q.id)}">${icon(iconOf(q.criterion_id), 18)} <b>${e(labelOf(q.criterion_id))}</b> · ${e(q.question)}</label>
            <input class="input" id="s4-ctx-${e(q.id)}" data-ctx="${e(q.id)}" maxlength="100"
              value="${e(s.context[q.id] || '')}" placeholder="${e(q.placeholder || '')}">
          </div>`).join('')}
        <p class="caption">${e(Pickwise.t('screen4.context_privacy'))}</p>
      </section>`;
    };

    const loadQuestions = async () => {
      qState = 'loading';
      refreshBox();
      const res = await Pickwise.ai.questions(s.decision, criteria, s.importance);
      if (!ctx.alive()) return;
      if (!res.ok) { qState = 'error'; refreshBox(); return; }
      // 같은 질문이 다시 나오면 이전 답을 그대로 살려요
      const prev = {};
      s.questions.forEach((q) => { if (s.context[q.id]) prev[q.criterion_id + '|' + q.question] = s.context[q.id]; });
      s.questions = res.questions;
      s.context = {};
      s.questions.forEach((q) => { const old = prev[q.criterion_id + '|' + q.question]; if (old) s.context[q.id] = old; });
      s.questions_key = qKey;
      qState = 'ready';
      ctx.save();
      refreshBox();
    };

    // 권장 정보를 비워 두면 버튼 위에 부드럽게 알려 줘요 (입력하지 않아도 분석은 가능)
    const refreshMissing = () => {
      const box = el.querySelector('#s4-context-missing');
      if (!box) return;
      const list = qState === 'ready' ? missingQs().map((q) => labelOf(q.criterion_id)).filter((v, i, a) => a.indexOf(v) === i).join(', ') : '';
      box.textContent = list ? Pickwise.t('screen4.context_missing', { list }) : '';
      box.hidden = !list;
    };
    const bindBox = () => {
      el.querySelectorAll('[data-ctx]').forEach((inp) => inp.addEventListener('input', () => {
        s.context[inp.dataset.ctx] = inp.value;
        ctx.save();
        refreshMissing();
      }));
      el.querySelector('#s4-q-retry')?.addEventListener('click', loadQuestions);
    };
    const refreshBox = () => {
      const holder = el.querySelector('#s4-context-holder');
      if (!holder) return;
      holder.innerHTML = contextBox();
      bindBox();
      refreshMissing();
    };

    const draw = (focusSelector) => {
      el.innerHTML = `
        ${Pickwise.ui.heading(Pickwise.t('screen4.title'), Pickwise.t('screen4.subtitle'))}

        <div id="s4-context-holder">${contextBox()}</div>

        ${s.decision.options.map((o, i) => `
          <div class="s4-field opt-${i}">
            <label class="s4-label" for="s4-info-${e(o.id)}">
              ${Pickwise.ui.optCircle(i, i + 1)} ${e(Pickwise.t('screen4.label_option_info', { option: o.label }))}
            </label>
            <textarea class="textarea s4-textarea" id="s4-info-${e(o.id)}" data-id="${e(o.id)}" maxlength="500"
              placeholder="${e(Pickwise.t('screen4.placeholder_option_info', { option: o.label }))}">${e(s.info[o.id] || '')}</textarea>
          </div>`).join('')}

        <section class="s4-attach">
          <div class="s4-attach-head">
            <h3 class="s4-attach-title">${e(Pickwise.t('screen4.attach_title'))}</h3>
            <button type="button" class="s4-help" id="s4-help" aria-label="${e(Pickwise.t('screen4.attach_help_aria'))}">${icon('info', 28)}</button>
          </div>
          <p class="caption s4-guide">${e(Pickwise.t('screen4.attach_guide'))}</p>
          <div class="s4-drop">
            <div class="s4-drop-row">
              <label class="s4-drop-btn">
                <input type="file" id="s4-file" accept=".pdf,.txt,application/pdf,text/plain" multiple class="sr-only">
                ${e(Pickwise.t('screen4.attach_button'))}
              </label>
              <span class="s4-hint">${e(Pickwise.t('screen4.attach_hint'))}</span>
            </div>
            ${fileError ? `<p class="error-text" role="alert">${icon('circle-alert', 14)} ${e(fileError)}</p>` : ''}
            ${s.files.length ? `<ul class="s4-files">${s.files.map((f, i) => `
              <li><span class="badge badge-outline">${e(Pickwise.t('screen4.file_badge'))}</span> <span class="s4-fname">${e(f.name)}</span>
                <button type="button" class="s4-remove" data-i="${i}" aria-label="${e(Pickwise.t('screen4.remove_file_aria', { name: f.name }))}">${icon('x', 16)}</button></li>`).join('')}</ul>` : ''}
          </div>
        </section>

        <p class="notice">${e(Pickwise.t('common.privacy_notice'))}<br>${e(Pickwise.t('screen4.ai_info_notice'))}</p>
        ${Pickwise.ui.footer({
          label: analyzeError ? Pickwise.t('common.retry') : Pickwise.t('screen4.analyze'),
          extra: (analyzeError ? `<p class="error-text s4-analyze-error" role="alert">${icon('circle-alert', 14)} ${e(analyzeError)}</p>` : '')
            + `<p class="caption s4-context-missing" id="s4-context-missing" aria-live="polite"></p>`,
        })}
      `;

      bindBox();
      refreshMissing();

      el.querySelectorAll('textarea[data-id]').forEach((ta) => ta.addEventListener('input', () => {
        s.info[ta.dataset.id] = ta.value;
        ctx.save();
      }));

      el.querySelector('#s4-file').addEventListener('change', (ev) => {
        const picked = [...ev.target.files];
        const bad = picked.filter((f) => !(OK_TYPES.includes(f.type) || OK_EXT.test(f.name)));
        picked.filter((f) => !bad.includes(f)).forEach((f) => s.files.push({ name: f.name, type: f.type, size: f.size }));
        fileError = bad.length ? Pickwise.t('screen4.error_file_type') : '';
        ctx.save();
        draw('#s4-file');
      });
      el.querySelectorAll('.s4-remove').forEach((btn) => btn.addEventListener('click', () => {
        s.files.splice(Number(btn.dataset.i), 1);
        ctx.save();
        draw('#s4-file');
      }));

      el.querySelector('#s4-help').addEventListener('click', openHelp);
      el.querySelector('#next-btn').addEventListener('click', analyze);
      if (focusSelector) el.querySelector(focusSelector)?.focus();
    };

    // 'PDF로 저장하는 방법' 하단 시트
    const openHelp = () => {
      const opener = document.activeElement;
      const wrap = document.createElement('div');
      wrap.className = 'sheet-backdrop';
      wrap.innerHTML = `
        <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="s4-sheet-title">
          <h3 id="s4-sheet-title">${e(Pickwise.t('screen4.pdf_help_title'))}</h3>
          <p class="caption">${e(Pickwise.t('screen4.pdf_help_sub'))}</p>
          <ol>${[1, 2, 3, 4, 5].map((n) => `<li>${e(Pickwise.t('screen4.pdf_help_step' + n))}</li>`).join('')}</ol>
          <p class="notice">${e(Pickwise.t('screen4.pdf_help_after'))}</p>
          <button type="button" class="btn btn-primary btn-block" id="s4-sheet-close">${e(Pickwise.t('screen4.pdf_help_close'))}</button>
        </div>`;
      const close = () => { wrap.remove(); document.removeEventListener('keydown', onKey); opener?.focus(); };
      const onKey = (ev) => { if (ev.key === 'Escape') close(); };
      wrap.addEventListener('click', (ev) => { if (ev.target === wrap) close(); });
      wrap.querySelector('#s4-sheet-close').addEventListener('click', close);
      document.addEventListener('keydown', onKey);
      document.body.appendChild(wrap);
      wrap.querySelector('#s4-sheet-close').focus();
    };

    // 분석하기: 웹 검색 + AI 점수 (실패하면 입력값은 그대로 두고 이유와 '다시 시도'를 보여 줘요)
    const analyze = async () => {
      el.innerHTML = Pickwise.ui.heading(Pickwise.t('screen4.title')) + Pickwise.ui.loading(Pickwise.t('common.loading_analysis'));
      const res = await Pickwise.ai.analyze(s.decision, criteria, s.info, qState === 'ready' ? s.questions : [], s.context);
      if (!ctx.alive()) return;
      if (!res.ok) {
        fileError = '';
        analyzeError = Pickwise.ai.errorText(res.reason);
        draw('#next-btn');
        return;
      }
      s.scores = res.scores;
      s.selected_option = null;
      ctx.save();
      ctx.next();
    };

    draw();
    if (qState === 'loading') loadQuestions();
  },
};
