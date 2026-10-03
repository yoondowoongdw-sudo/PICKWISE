// 화면 4. 정보 입력 (DESIGN.md 8장 screen4_info)
// 받는 값: 선택지, 선택된 기준  →  넘기는 값: state.info, state.files, state.scores
// 체험판: 입력한 메모·첨부는 저장만 하고, 점수는 예시 데이터 값을 써요.
Pickwise.screens[4] = {
  render(el, ctx) {
    const { escape: e, icon } = Pickwise.ui;
    const s = ctx.state;
    const criteria = Pickwise.store.selectedCriteria();
    if (criteria.length === 0) return ctx.go(s.decision.sample_id ? 2 : 1);

    const OK_TYPES = ['application/pdf', 'text/plain'];
    const OK_EXT = /\.(pdf|txt)$/i;
    let fileError = '';

    const draw = (focusSelector) => {
      el.innerHTML = `
        ${Pickwise.ui.heading(Pickwise.t('screen4.title'), Pickwise.t('screen4.subtitle'))}

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

        <p class="notice">${e(Pickwise.t('common.privacy_notice'))}<br>${e(Pickwise.t('screen4.demo_info_notice'))}</p>
        ${Pickwise.ui.footer({ label: Pickwise.t('screen4.analyze') })}
      `;

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

    const analyze = async () => {
      el.innerHTML = Pickwise.ui.heading(Pickwise.t('screen4.title')) + Pickwise.ui.loading(Pickwise.t('common.loading_analysis'));
      await Pickwise.ui.wait(600);
      if (!ctx.alive()) return;
      s.scores = Pickwise.samples.scores(s.decision.sample_id, criteria);
      s.selected_option = null;
      ctx.save();
      ctx.next();
    };

    draw();
  },
};
