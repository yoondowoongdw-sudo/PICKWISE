// 화면 전환(라우터)과 헤더. 주소 끝의 #/1 ~ #/6 으로 화면을 바꿔요 → 브라우저 뒤로가기도 그대로 동작해요.
//
// 각 화면 파일은 아래 모양으로 자기 화면을 등록해요.
//   Pickwise.screens[3] = {
//     render(el, ctx) { ... el.innerHTML = '...'; ... }
//   };
// ctx 에 들어 있는 것:
//   ctx.state   앱 전체 데이터 (js/store.js 참고)
//   ctx.save()  state 를 바꾼 뒤 불러서 저장
//   ctx.go(n)   n번 화면으로 이동,  ctx.next()  다음 화면으로 이동
window.Pickwise = window.Pickwise || {};
Pickwise.screens = Pickwise.screens || {};

(function () {
  const TOTAL = 6;
  const screenEl = document.getElementById('screen');
  const backBtn = document.getElementById('back-btn');
  const badgeEl = document.getElementById('step-badge');
  const titleEl = document.getElementById('header-title');

  backBtn.setAttribute('aria-label', Pickwise.t('common.back_aria'));
  backBtn.addEventListener('click', () => history.back());

  function currentStep() {
    const n = parseInt((location.hash.match(/^#\/(\d)/) || [])[1], 10);
    return n >= 1 && n <= TOTAL ? n : 1;
  }

  function go(n) {
    location.hash = '#/' + n;
  }

  function render() {
    const step = currentStep();
    badgeEl.textContent = step;
    titleEl.textContent = Pickwise.t('screen' + step + '.header');
    backBtn.hidden = step === 1;
    document.title = Pickwise.t('screen' + step + '.header') + ' · Pickwise';

    const screen = Pickwise.screens[step];
    screenEl.innerHTML = '';
    if (!screen) {
      screenEl.innerHTML = `<p>${step}번 화면 파일이 아직 없어요.</p>`;
      return;
    }
    const ctx = {
      step,
      state: Pickwise.store.state,
      save: Pickwise.store.save,
      go,
      next: () => go(Math.min(step + 1, TOTAL)),
    };
    try {
      screen.render(screenEl, ctx);
    } catch (err) {
      console.error(err);
      screenEl.innerHTML = `<p class="error-text">${Pickwise.ui.escape(Pickwise.t('common.error_generic'))}</p>`;
    }
    window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', render);
  if (!location.hash) history.replaceState(null, '', '#/1');
  render();
})();
