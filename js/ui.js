// 화면에서 자주 쓰는 작은 도우미 함수들
window.Pickwise = window.Pickwise || {};
Pickwise.screens = Pickwise.screens || {}; // 화면 파일들이 여기에 자기 화면을 등록해요

Pickwise.ui = {
  // HTML 문자열 안에 사용자 입력을 넣을 때는 꼭 escape 해요 (화면 깨짐·보안 방지)
  escape(text) {
    return String(text ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  },

  // 화면 제목 + 부제
  heading(title, subtitle) {
    const e = Pickwise.ui.escape;
    return `<h2 class="screen-title">${e(title)}</h2>${subtitle ? `<p class="screen-subtitle">${e(subtitle)}</p>` : ''}`;
  },

  // 화면 맨 아래 주 버튼. disabled 면 이유(reason)를 문구로 함께 보여 줘요 (DESIGN.md 6장)
  footer({ id = 'next-btn', label = Pickwise.t('common.next') + ' →', disabled = false, reason = '' } = {}) {
    const e = Pickwise.ui.escape;
    return `<div class="screen-footer">
      ${disabled && reason ? `<p class="disabled-reason" id="${id}-reason">${e(reason)}</p>` : ''}
      <button type="button" class="btn btn-primary btn-block" id="${id}" ${disabled ? 'disabled' : ''}
        ${disabled && reason ? `aria-describedby="${id}-reason"` : ''}>${e(label)}</button>
    </div>`;
  },

  loading(text) {
    return `<div class="loading" role="status">${Pickwise.ui.escape(text)}</div>`;
  },
};
