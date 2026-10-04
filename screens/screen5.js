// 화면 5. 분석 결과 (DESIGN.md 8장 screen5_result, 목업 5페이지)
// 받는 값: state.importance, state.scores  →  넘기는 값: state.selected_option, 결정 기록(state.chain)
// 총점·민감도·What-if 는 모두 코드가 계산해요 (js/calc.js). 설명 문장도 계산 결과로 만들어요.
Pickwise.screens[5] = {
  render(el, ctx) {
    const { escape: e, icon } = Pickwise.ui;
    const calc = Pickwise.calc;
    const t = Pickwise.t;
    const josa = Pickwise.josa;
    const s = ctx.state;
    const options = s.decision.options;
    const criteria = Pickwise.store.selectedCriteria();
    if (!options.every((o) => s.scores[o.id])) return ctx.go(4);

    const ranking = calc.ranking(options, s.scores, s.importance);
    const winner = ranking[0];
    const runner = ranking[1];
    const COLORS = ['a', 'b', 'c', 'd', 'e'];
    const colorOf = {}; // 순위 순서대로 색을 정해요 (1위 = 주황, 2위 = 진회색 …) — 카드와 그래프가 같은 색
    ranking.forEach((r, i) => { colorOf[r.optionId] = COLORS[i]; });
    const isTie = runner && winner.total - runner.total < calc.TIE_GAP;
    const excluded = criteria.filter((c) => options.every((o) => s.scores[o.id][c.id]?.score == null));
    const scored = criteria.filter((c) => !excluded.includes(c));
    const weights = calc.weights(Object.fromEntries(scored.map((c) => [c.id, s.importance[c.id] || 0]))) || {};
    const sensitivity = calc.sensitivity(options, criteria, s.scores, s.importance).slice(0, 2);
    const whatIfCriteria = [...scored].sort((a, b) => (s.importance[b.id] || 0) - (s.importance[a.id] || 0)).slice(0, 2);
    if (!s.selected_option || !options.some((o) => o.id === s.selected_option)) s.selected_option = winner.optionId;
    const unit = t('screen5.score_unit');

    // 결과 설명 (최대 3문장): 1위가 크게 앞선 기준 → 2위가 앞선 기준 → 계산에서 빠진 기준 / 안내
    const explain = (() => {
      if (!runner) return t('screen5.headline_template', { winner: winner.label });
      const sw = s.scores[winner.optionId], sr = s.scores[runner.optionId];
      const diffs = scored
        .filter((c) => sw[c.id]?.score != null && sr[c.id]?.score != null)
        .map((c) => ({ c, a: sw[c.id].score, b: sr[c.id].score, w: (sw[c.id].score - sr[c.id].score) * (weights[c.id] || 0) }));
      const ahead = diffs.filter((x) => x.a > x.b).sort((x, y) => y.w - x.w).slice(0, 2);
      const behind = diffs.filter((x) => x.b > x.a).sort((x, y) => x.w - y.w)[0];
      const out = [];
      if (ahead.length) {
        out.push(t('screen5.explain_lead', {
          winner: winner.label, eun: josa(winner.label, '은', '는'), loser: runner.label,
          list: ahead.map((x) => t('screen5.explain_item', { criteria: x.c.label, a: x.a, b: x.b })).join('과 '),
        }));
      } else {
        out.push(t('screen5.headline_template', { winner: winner.label }));
      }
      if (behind) out.push(t('screen5.explain_reverse', { criteria: behind.c.label, eun: josa(behind.c.label, '은', '는'), loser: runner.label, ga: josa(runner.label, '이', '가') }));
      // 앞선 기준 중 AI 추정이 섞여 있으면 확인이 필요하다고 알려요 (기획: 단정하지 않기)
      const estimated = ahead.filter((x) => sw[x.c.id].evidence_type === 'ai_estimate' || sr[x.c.id].evidence_type === 'ai_estimate');
      if (excluded.length) {
        const names = excluded.map((c) => c.label).join(', ');
        out.push(t('screen5.explain_missing_ai', { criteria: names, eun: josa(names, '은', '는') }));
      } else if (estimated.length) {
        const names = estimated.map((x) => x.c.label).join('과 ');
        out.push(t('screen5.explain_estimate', { criteria: names, eun: josa(names, '은', '는') }));
      } else {
        out.push(t('screen5.change_notice'));
      }
      return out.join(' ');
    })();

    const sensText = (r) => {
      const v = { criteria: r.criteria.label, from: r.from, to: r.to, option: r.option };
      if (r.type === 'flip') return t(r.up ? 'screen5.sensitivity_flip_template' : 'screen5.sensitivity_flip_down_template', v);
      if (r.type === 'close') return t(r.up ? 'screen5.sensitivity_close_template' : 'screen5.sensitivity_close_down_template', v);
      return t('screen5.sensitivity_stable_template', v);
    };

    // 기준별 근거 배지 (글자로 구분): AI 추정이 하나라도 있으면 AI 추정, 웹 검색, 사용자 입력 순
    const typesOf = (c) => options.map((o) => s.scores[o.id][c.id]?.evidence_type || 'none');
    const badgeFor = (c) => {
      const types = typesOf(c);
      if (types.every((x) => x === 'none')) return `<span class="badge badge-ai">${e(t('screen5.no_info_label'))}</span>`;
      if (types.includes('ai_estimate')) return `<span class="badge badge-ai">${e(t('screen5.badge_ai'))}</span>`;
      if (types.includes('web_search')) return `<span class="badge badge-outline">${e(t('screen5.badge_web'))}</span>`;
      return `<span class="badge badge-outline">${e(t('screen5.badge_user'))}</span>`;
    };
    const typeLabel = { user_input: 'screen5.badge_user', web_search: 'screen5.badge_web', ai_estimate: 'screen5.badge_ai' };
    // 출처 링크: 서버가 검색 결과에서 확인한 주소만 와요. 새 탭으로 열고, 사이트 이름(도메인)을 함께 보여 줘요
    const sourceLinks = (sources) => (sources && sources.length ? `<span class="s5-sources">${e(t('screen5.sources_label'))}:
      ${sources.map((src) => {
        let host = '';
        try { host = new URL(src.url).hostname.replace(/^www\.|^m\./, ''); } catch (_) { return ''; }
        return `<a href="${e(src.url)}" target="_blank" rel="noopener noreferrer">${e(src.title || host)} <span class="s5-host">(${e(host)})</span> ↗</a>`;
      }).join('')}</span>` : '');

    el.innerHTML = `
      ${Pickwise.ui.heading(t('screen5.title'), t('screen5.subtitle'))}
      <p class="s5-headline">${e(t('screen5.headline_template', { winner: winner.label }))}</p>

      <!-- 총점 카드 (눌러서 결정할 선택지를 고를 수 있어요) -->
      <div class="s5-totals" style="--cols:${Math.min(ranking.length, 3)}" role="radiogroup" aria-label="${e(t('screen5.select_label'))}">
        ${ranking.map((r) => `
          <button type="button" class="s5-total s5-color-${colorOf[r.optionId]}" role="radio" data-id="${e(r.optionId)}"
            aria-checked="${r.optionId === s.selected_option}" tabindex="${r.optionId === s.selected_option ? 0 : -1}">
            ${r.rank === 1 ? `<span class="s5-top">${icon('crown', 14)} ${e(t('screen5.top_badge'))}</span>` : `<span class="s5-top-space"></span>`}
            <span class="s5-name">${e(r.label)}</span>
            <span class="s5-score num">${r.display ?? '-'}<small>${e(unit)}</small></span>
          </button>`).join('')}
      </div>
      <p class="caption s5-select-hint">${e(t('screen5.select_hint'))}</p>
      ${isTie ? `<p class="s5-tie" role="status">${icon('scale', 16)} ${e(t('screen5.tie_notice'))}</p>` : ''}

      <!-- 결과 설명 -->
      <h3 class="block-title">${e(t('screen5.section_ai'))}</h3>
      <section class="s5-explain-box">
        <p class="s5-explain-label">${e(t('screen5.ai_explain_label', { winner: winner.label, ga: josa(winner.label, '이', '가') }))}</p>
        <p class="s5-explain">${e(explain)}</p>
      </section>

      <!-- 기준별 비교: 그래프 + 근거 -->
      <h3 class="block-title">${e(t('screen5.section_compare'))}</h3>
      <section class="card s5-compare">
        <div class="s5-legend">
          ${ranking.map((r) => `<span><i class="s5-dot s5-color-${colorOf[r.optionId]}"></i>${e(r.label)}</span>`).join('')}
        </div>
        <div class="s5-chart-scroll">
          <div class="s5-chart" role="img" aria-label="${e(criteria.map((c) => c.label + ': ' + options.map((o) => o.label + ' ' + (s.scores[o.id][c.id]?.score ?? t('screen5.no_info_label'))).join(', ')).join(' / '))}">
            ${criteria.map((c) => `
              <div class="s5-group">
                <div class="s5-bars">
                  ${ranking.map((r) => {
                    const v = s.scores[r.optionId][c.id]?.score;
                    return v == null
                      ? `<div class="s5-bar-wrap"><span class="s5-na">${e(t('screen5.no_info_label'))}</span></div>`
                      : `<div class="s5-bar-wrap"><span class="s5-bar-num num">${v}</span><div class="s5-bar s5-color-${colorOf[r.optionId]}" style="height:${v}%"></div></div>`;
                  }).join('')}
                </div>
                <span class="s5-axis">${e(c.label)}</span>
              </div>`).join('')}
          </div>
        </div>

        <p class="s5-ev-title">${e(t('screen5.evidence_label'))}</p>
        <ul class="s5-evidence">
          ${criteria.map((c) => `
            <li>
              <button type="button" class="s5-ev-btn" aria-expanded="false" aria-controls="s5-ev-${e(c.id)}">
                <span class="s5-ev-name">${e(c.label)}</span>
                ${badgeFor(c)}
              </button>
              <div class="s5-ev-body" id="s5-ev-${e(c.id)}" hidden>
                ${ranking.map((r) => {
                  const cell = s.scores[r.optionId][c.id];
                  return cell?.score == null
                    ? `<p>${e(r.label)} · ${e(t('screen5.no_info_label'))}</p>`
                    : `<p>${e(r.label)} ${cell.score}${e(unit)} — ${e(t('screen5.evidence_label'))}: ${e(cell.evidence)}
                        <span class="s5-ev-meta">(${e(t(typeLabel[cell.evidence_type] || 'screen5.badge_ai'))}${cell.confidence ? ' · ' + e(t('screen5.confidence_' + cell.confidence)) : ''})</span>
                        ${sourceLinks(cell.sources)}</p>`;
                }).join('')}
                ${weights[c.id] != null ? `<p class="caption">반영 비율 ${Math.round(weights[c.id])}%</p>` : ''}
              </div>
            </li>`).join('')}
        </ul>
      </section>

      <!-- 민감도 분석 -->
      ${sensitivity.length ? `
      <h3 class="block-title">${e(t('screen5.section_sensitivity'))}</h3>
      <section class="card s5-sens">
        ${sensitivity.map((r) => `<p>${e(sensText(r))}</p>`).join('')}
      </section>` : ''}

      <!-- What-if 분석 (중요도 2배) -->
      ${whatIfCriteria.length ? `
      <h3 class="block-title">${e(t('screen5.section_whatif'))}</h3>
      <div class="s5-whatif">
        ${whatIfCriteria.map((c) => `
          <button type="button" class="select-card s5-wi-btn" data-id="${e(c.id)}" aria-pressed="false">
            <span class="s5-wi-text">${e(t('screen5.whatif_double', { criteria: c.label, eul: josa(c.label, '을', '를') }))}</span>
            ${Pickwise.ui.check()}
          </button>`).join('')}
      </div>
      <p class="s5-wi-result" id="s5-wi-result" aria-live="polite" hidden></p>` : ''}

      <p class="notice">${e(t('screen5.disclaimer'))}<br>${e(t('screen5.ai_notice'))}</p>

      ${Pickwise.ui.footer({ label: t('screen5.select_option_cta') })}
    `;

    // 근거 펼치기
    el.querySelectorAll('.s5-ev-btn').forEach((btn) => btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      el.querySelector('#' + CSS.escape(btn.getAttribute('aria-controls'))).hidden = open;
    }));

    // What-if: 고른 질문의 결과를 아래 상자에 보여 줘요
    el.querySelectorAll('.s5-wi-btn').forEach((btn) => btn.addEventListener('click', () => {
      el.querySelectorAll('.s5-wi-btn').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      const c = criteria.find((x) => x.id === btn.dataset.id);
      const r = calc.whatIfDouble(options, s.scores, s.importance, c.id);
      const changed = r[0].optionId !== winner.optionId;
      const box = el.querySelector('#s5-wi-result');
      box.hidden = false;
      box.innerHTML =
        `${e(t('screen5.whatif_result_template', { condition: t('screen5.whatif_condition', { criteria: c.label, eul: josa(c.label, '을', '를') }), winner: r[0].label }))}
         <span class="s5-wi-detail ${changed ? 's5-changed' : ''}">${e(t(changed ? 'screen5.whatif_changed' : 'screen5.whatif_same'))}
         (${r.map((x) => `${e(x.label)} ${x.display}${e(unit)}`).join(' · ')})</span>`;
    }));

    // 총점 카드로 선택지 고르기 (라디오)
    const cards = [...el.querySelectorAll('.s5-total')];
    const pick = (id) => {
      s.selected_option = id;
      ctx.save();
      cards.forEach((b) => { const on = b.dataset.id === id; b.setAttribute('aria-checked', String(on)); b.tabIndex = on ? 0 : -1; });
    };
    cards.forEach((btn, i) => {
      btn.addEventListener('click', () => pick(btn.dataset.id));
      btn.addEventListener('keydown', (ev) => {
        const d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[ev.key];
        if (!d) return;
        ev.preventDefault();
        const next = cards[(i + d + cards.length) % cards.length];
        pick(next.dataset.id);
        next.focus();
      });
    });

    // 결정 → 결정 기록에 저장하고 다음 화면으로
    el.querySelector('#next-btn').addEventListener('click', () => {
      const selected = options.find((o) => o.id === s.selected_option);
      const node = {
        decision_id: s.decision.id,
        parent_decision_id: s.decision.parent_decision_id,
        title: s.decision.topic,
        topic: s.decision.topic,
        options: options.map((o) => o.label),
        selected: selected.label,
        status: 'done',
      };
      const idx = s.chain.findIndex((n) => n.decision_id === node.decision_id);
      if (idx >= 0) s.chain[idx] = node; else s.chain.push(node);
      ctx.save();
      ctx.next();
    });
  },
};
