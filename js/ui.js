// 화면에서 자주 쓰는 작은 도우미 함수들
window.Pickwise = window.Pickwise || {};
Pickwise.screens = Pickwise.screens || {}; // 화면 파일들이 여기에 자기 화면을 등록해요

Pickwise.ui = {
  // HTML 문자열 안에 사용자 입력을 넣을 때는 꼭 escape 해요 (화면 깨짐·보안 방지)
  escape(text) {
    return String(text ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  },

  // 라인 아이콘 (Lucide). 장식용이라 화면 읽기 프로그램에서는 숨겨요.
  // 화면이 그려지면 js/app.js 가 자동으로 실제 아이콘 그림으로 바꿔요.
  icon(name, size = 22) {
    // 'won': 목업의 동그라미 안 ₩ 아이콘 (Lucide 에 없어서 같은 선 굵기로 직접 그림)
    if (name === 'won') {
      return `<svg class="lucide icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M7.5 8.5l2 7 2.5-6 2.5 6 2-7M7 12h10"/></svg>`;
    }
    return `<i data-lucide="${Pickwise.ui.escape(name)}" class="icon" style="width:${size}px;height:${size}px" aria-hidden="true"></i>`;
  },

  // 선택 표시 (선택되면 주황 동그라미 체크가 보여요 — common.css .check-mark)
  check() {
    return `<span class="check-mark">${Pickwise.ui.icon('circle-check', 24)}</span>`;
  },

  // 선택지 순서별 원 (A 주황 / B 진회색 / C 탠저린)
  optCircle(index, text) {
    return `<span class="opt-circle opt-${index}" aria-hidden="true">${Pickwise.ui.escape(text)}</span>`;
  },

  // 화면 제목 + 부제
  heading(title, subtitle) {
    const e = Pickwise.ui.escape;
    return `<h2 class="screen-title">${e(title)}</h2>${subtitle ? `<p class="screen-subtitle">${e(subtitle)}</p>` : ''}`;
  },

  // 화면 맨 아래 주 버튼. disabled 면 이유(reason)를 문구로 함께 보여 줘요 (DESIGN.md 6장)
  footer({ id = 'next-btn', label = Pickwise.t('common.next') + ' →', disabled = false, reason = '', extra = '' } = {}) {
    const e = Pickwise.ui.escape;
    return `<div class="screen-footer">
      ${extra}
      ${disabled && reason ? `<p class="disabled-reason" id="${id}-reason">${e(reason)}</p>` : ''}
      <button type="button" class="btn btn-primary btn-block" id="${id}" ${disabled ? 'disabled' : ''}
        ${disabled && reason ? `aria-describedby="${id}-reason"` : ''}>${e(label)}</button>
    </div>`;
  },

  loading(text) {
    return `<div class="loading" role="status">${Pickwise.ui.escape(text)}</div>`;
  },

  // 실제 AI처럼 잠깐 기다리는 효과 (로딩 문구를 보여 주기 위함)
  wait(ms = 500) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },
};
