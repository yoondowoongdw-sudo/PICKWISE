// 화면 1. 결정 입력 (DESIGN.md 8장 screen1_decision, 목업 1페이지)
// 사용자가 결정 주제와 선택지(2~5개)를 직접 입력해요.
// 넘기는 값: state.decision.{ topic, options[] }
Pickwise.screens[1] = {
  render(el, ctx) {
    const { escape: e, icon, optCircle } = Pickwise.ui;
    const s = ctx.state;
    const d = s.decision;
    const LETTERS = 'ABCDE';
    const MAX = 5;
    const placeholders = Pickwise.copy.screen1.placeholder_options;
    let message = ''; // 선택지 추가·삭제를 할 수 없을 때 안내

    // 선택지가 바뀌면 뒤 단계(기준 추천·분석)는 새로 해요 (DESIGN.md 공통 정책)
    const optionsChanged = () => {
      s.criteria = [];
      s.criteria_extra = [];
      s.importance = {};
      s.context = {};
      s.questions = [];
      s.questions_key = '';
      s.scores = {};
      s.selected_option = null;
      ctx.save();
    };
    // 이름만 바뀌어도 기준 추천·분석은 다시 해요 (다음 화면으로 넘어갈 때 확인)
    const signature = () => JSON.stringify([d.topic.trim(), d.options.map((o) => o.label.trim())]);
    const before = signature();

    const problem = () => {
      if (!d.topic.trim()) return Pickwise.t('screen1.error_empty_topic');
      if (d.options.length < 2) return Pickwise.t('screen1.error_min_options');
      if (d.options.some((o) => !o.label.trim())) return Pickwise.t('screen1.error_empty_option');
      const names = d.options.map((o) => o.label.trim().replace(/\s/g, ''));
      if (new Set(names).size !== names.length) return Pickwise.t('screen1.error_duplicate_option');
      return '';
    };

    const draw = (focusSelector) => {
      const why = problem();
      el.innerHTML = `
        <section class="s1-hero">
          <span class="s1-hero-icon">${icon('lightbulb', 30)}</span>
          <div>
            <h2 class="s1-hero-title">${e(Pickwise.t('screen1.title_lead'))} <em>${e(Pickwise.t('screen1.title_em'))}</em></h2>
            <p class="s1-hero-sub">${e(Pickwise.t('screen1.subtitle'))}</p>
          </div>
        </section>
        ${s.pending_followup ? `<p class="s1-followup">${e(Pickwise.t(s.pending_followup.ai_filled === false ? 'screen1.continue_notice_custom' : 'screen1.continue_notice', { topic: s.pending_followup.topic }))}</p>` : ''}

        <section class="s1-card">
          <h3 class="s1-card-title"><span class="s1-step">1</span><label for="s1-topic">${e(Pickwise.t('screen1.label_topic'))}</label></h3>
          <input class="input" id="s1-topic" maxlength="40" value="${e(d.topic)}" placeholder="${e(Pickwise.t('screen1.placeholder_topic'))}">
        </section>

        <section class="s1-card">
          <h3 class="s1-card-title"><span class="s1-step">2</span>${e(Pickwise.t('screen1.label_options'))}</h3>
          <ul class="s1-options">
            ${d.options.map((o, i) => `
              <li class="s1-option opt-${i}">
                ${optCircle(i, LETTERS[i])}
                <input class="input s1-opt-input" data-id="${e(o.id)}" maxlength="30" value="${e(o.label)}"
                  placeholder="${e(placeholders[i] || Pickwise.t('screen1.placeholder_option', { letter: LETTERS[i] }))}"
                  aria-label="${e(Pickwise.t('screen1.placeholder_option', { letter: LETTERS[i] }))}">
                <button type="button" class="s1-remove" data-id="${e(o.id)}" ${d.options.length <= 2 ? 'aria-disabled="true"' : ''}
                  aria-label="${e(Pickwise.t('screen1.remove_option_aria', { option: o.label || LETTERS[i] }))}">${icon('x', 22)}</button>
              </li>`).join('')}
          </ul>
          <button type="button" class="btn btn-outline-primary s1-add" id="s1-add" ${d.options.length >= MAX ? 'aria-disabled="true"' : ''}>${e(Pickwise.t('screen1.add_option'))}</button>
          ${message ? `<p class="error-text" role="alert">${e(message)}</p>` : ''}
        </section>

        <p class="notice">${e(Pickwise.t('common.privacy_notice'))}</p>
        ${Pickwise.ui.footer({ disabled: !!why, reason: why })}
      `;

      const nextBtn = el.querySelector('#next-btn');
      // 입력할 때마다 화면 전체를 다시 그리지 않고 '다음' 버튼 상태만 바꿔요 (입력 중 커서 유지)
      const refreshNext = () => {
        const msg = problem();
        nextBtn.disabled = !!msg;
        let reason = el.querySelector('#next-btn-reason');
        if (msg && !reason) {
          reason = document.createElement('p');
          reason.className = 'disabled-reason';
          reason.id = 'next-btn-reason';
          nextBtn.before(reason);
          nextBtn.setAttribute('aria-describedby', 'next-btn-reason');
        }
        if (reason) reason.textContent = msg;
        if (!msg && reason) { reason.remove(); nextBtn.removeAttribute('aria-describedby'); }
      };

      el.querySelector('#s1-topic').addEventListener('input', (ev) => { d.topic = ev.target.value; ctx.save(); refreshNext(); });
      el.querySelectorAll('.s1-opt-input').forEach((inp) => inp.addEventListener('input', () => {
        d.options.find((o) => o.id === inp.dataset.id).label = inp.value;
        ctx.save();
        refreshNext();
      }));
      // 목업처럼 버튼은 늘 보이게 두고, 누를 수 없을 때는 이유를 문구로 알려 줘요
      el.querySelectorAll('.s1-remove').forEach((btn) => btn.addEventListener('click', () => {
        if (d.options.length <= 2) { message = Pickwise.t('screen1.error_min_options'); return draw(); }
        message = '';
        d.options = d.options.filter((o) => o.id !== btn.dataset.id);
        optionsChanged();
        draw('#s1-add');
      }));
      el.querySelector('#s1-add').addEventListener('click', () => {
        if (d.options.length >= MAX) { message = Pickwise.t('screen1.error_max_options'); return draw('#s1-add'); }
        message = '';
        const id = 'opt_' + Date.now();
        d.options.push({ id, label: '' });
        optionsChanged();
        draw(`.s1-opt-input[data-id="${id}"]`);
      });
      nextBtn.addEventListener('click', () => {
        d.topic = d.topic.trim();
        d.options.forEach((o) => { o.label = o.label.trim(); });
        if (signature() !== before) optionsChanged();
        s.pending_followup = null;
        ctx.save();
        ctx.next();
      });
      if (focusSelector) el.querySelector(focusSelector)?.focus();
    };

    draw();
  },
};
