// 화면 문구 (DESIGN.md 12장 부록 A 기반).
// 체험판(예시 데이터) 버전이라 'AI가 추천' 같은 표현은 실제 동작에 맞게 바꿨어요. 바꾼 줄에는 [체험판] 표시를 했어요.
// 사용법: Pickwise.t('screen1.title')  /  Pickwise.t('screen5.headline_template', { winner: '그리스' })
window.Pickwise = window.Pickwise || {};

Pickwise.copy = {
  common: {
    logo: 'Pickwise',
    next: '다음',
    back: '이전',
    loading_criteria: '기준을 정리하고 있어요…', // [체험판]
    loading_analysis: '점수를 계산하고 있어요…',
    error_generic: '잠시 문제가 생겼어요. 다시 시도해 주세요.',
    empty_history: '아직 저장된 결정이 없어요.',
    privacy_notice: '실제 개인정보나 사내 정보는 입력하지 마세요.',
    demo_notice: '체험판이에요. 외부 AI 없이 미리 준비한 예시 데이터로 계산해요.', // [체험판]
    status_done: '결정 완료',
    status_pending: '결정 중',
    status_recheck: '다시 확인 필요',
    back_aria: '이전 단계',
  },
  screen1: {
    header: '결정 입력',
    title: '어떤 결정이 고민되세요?',
    title_lead: '어떤 결정이',
    title_em: '고민되세요?',
    subtitle: '비교하고 싶은 주제와 선택지를 입력하면 더 나은 선택을 도와드려요.', // [체험판] 'AI가' 삭제
    label_topic: '결정 주제 입력',
    label_options: '선택지 입력',
    placeholder_topic: '예) 그리스 vs 이집트 어디로 갈지',
    placeholder_option: '선택지 {letter}',
    add_option: '+ 선택지 추가',
    remove_option_aria: '{option} 삭제',
    error_min_options: '비교하려면 선택지가 2개 이상 필요해요.',
    error_empty_option: '선택지 이름을 입력해 주세요.',
    error_empty_topic: '결정 주제를 입력해 주세요.',
    sample_label: '예시로 시작하기', // [체험판]
    demo_scope: '체험판은 예시 3가지만 비교할 수 있어요. 주제와 선택지 이름은 바꿀 수 있어요.', // [체험판]
    add_option_disabled: '체험판에서는 예시에 있는 선택지만 다시 추가할 수 있어요.', // [체험판]
    continue_notice: "이어서 고민 중인 '{topic}'{eun} 결정 기록에 저장해 뒀어요. 체험판에서는 아래 예시로 비교를 이어가요.", // [체험판] {eun}: 은/는
  },
  screen2: {
    header: '기준 선택',
    title: '어떤 기준으로 비교할까요?',
    subtitle: '추천 기준을 고르거나 직접 추가해 보세요.', // [체험판] 'AI가 추천한' → '추천'
    ai_extra_title: '이런 기준도 고려해보세요',
    extra_notice: '예시 데이터에 점수가 없는 기준은 결과에서 정보 부족으로 표시돼요.', // [체험판]
    add_criteria: '+ 직접 추가',
    add_confirm: '추가',
    cancel: '취소',
    error_min: '기준을 1개 이상 선택해 주세요.',
    error_max: '기준은 8개까지 고를 수 있어요.',
    error_empty_name: '기준 이름을 입력해 주세요.',
    warn_many: '기준이 많으면 비교가 어려워져요. 5~6개를 추천해요.',
    missing_criteria_suggest: '{criteria}도 함께 비교해 보시겠어요?',
    add_criteria_placeholder: '기준 이름 (12자 이내)',
    error_duplicate: '이미 있는 기준이에요.',
    add_criteria_chip_aria: '{criteria} 기준 추가',
    delete_aria: '{criteria} 기준 삭제',
    user_added: '직접 추가',
  },
  screen3: {
    header: '중요도 설정',
    title: '무엇이 더 중요한가요?',
    subtitle: '기준별 중요도를 0~100으로 조절해 주세요.',
    zero_weight_notice: '이 기준은 결과에 반영되지 않아요.',
    ratio_hint: '슬라이더 값은 기준끼리 비교하는 상대적 중요도예요.',
    all_zero_error: '중요도를 하나 이상 0보다 크게 설정해 주세요.',
    importance_aria: '{criteria} 중요도',
  },
  screen4: {
    header: '정보 입력',
    title: '선택지에 대해 알고 있는 내용을 입력해 주세요.',
    subtitle: '적어 둔 메모는 결정 기록과 함께 저장돼요.', // [체험판]
    demo_info_notice: '체험판에서는 입력한 내용과 첨부 자료가 점수에 반영되지 않아요. 점수는 예시 데이터 값을 써요.', // [체험판]
    label_option_info: '{option}에 대해 알고 있는 내용',
    placeholder_option_info: '예) {option}에 대해 알고 있는 점이나 마음에 드는 이유를 적어 주세요.',
    attach_title: '자료 첨부 (선택사항)',
    attach_button: '+ 파일 추가',
    attach_hint: 'PDF / 텍스트',
    file_badge: '첨부 자료',
    attach_guide: '분석할 때 참고가 필요한 정보를 입력해주세요. 특정 URL의 정보를 활용하고 싶다면, 웹페이지를 PDF로 저장해서 입력해주세요.',
    attach_help_aria: '웹페이지를 PDF로 저장하는 방법 보기',
    remove_file_aria: '{name} 첨부 삭제',
    pdf_help_title: '웹페이지를 PDF로 저장하는 방법',
    pdf_help_sub: '브라우저 기본 기능으로 저장해요 (크롬, 엣지 등)',
    pdf_help_step1: '저장하려는 웹 페이지를 열어요.',
    pdf_help_step2: '키보드 Ctrl + P (맥은 Cmd + P)를 누르거나, 오른쪽 위 점 3개 메뉴에서 [인쇄]를 선택해요.',
    pdf_help_step3: "'프린터' 또는 '대상'을 [PDF로 저장(Save as PDF)]으로 바꿔요.",
    pdf_help_step4: '용지 방향, 여백 등 필요한 레이아웃을 조정해요.',
    pdf_help_step5: '[저장]을 눌러 원하는 위치에 파일을 저장해요.',
    pdf_help_after: "저장한 PDF는 아래 '+ 파일 추가'로 올려 주세요.",
    pdf_help_close: '닫기',
    analyze: '분석하기',
    error_file_type: '이 형식은 아직 지원하지 않아요. PDF 또는 텍스트 파일을 올려 주세요.',
  },
  screen5: {
    header: '분석 결과',
    title: '분석 결과',
    subtitle: '입력한 기준을 바탕으로 선택지를 비교했어요.',
    score_unit: '점',
    top_badge: '추천',
    select_hint: '카드를 눌러 결정할 선택지를 바꿀 수 있어요.',
    explain_lead: '{winner}{eun} {list} 기준에서 {loser}보다 크게 앞서 총점이 더 높게 계산되었어요.',
    explain_item: '{criteria}({a}점 vs {b}점)',
    explain_reverse: '{criteria}{eun} {loser}{ga} 더 높아요.',
    explain_missing: '{criteria}{eun} 예시 데이터에 점수가 없어 계산에서 빠졌어요.',
    section_compare: '기준별 비교',
    section_ai: '결과 설명', // [체험판]
    ai_explain_label: '결과 설명 · {winner}가 앞선 이유', // [체험판]
    section_evidence: '기준별 근거',
    section_sensitivity: '민감도 분석',
    section_whatif: 'What-if 분석',
    headline_template: '현재 설정한 중요도와 입력한 정보를 기준으로는 {winner}의 총점이 더 높게 계산되었어요.',
    gap_template: "가장 큰 차이를 만든 기준은 '{criteria}'{ieyo}.", // {ieyo}: 받침에 따라 이에요/예요
    second_template: '{option}은(는) {score}점이에요.',
    change_notice: '중요도를 바꾸면 결과가 달라질 수 있어요.',
    badge_sample: '예시 데이터', // [체험판]
    badge_user: '사용자 입력',
    badge_file: '첨부 자료',
    disclaimer: '이 결과는 입력한 정보와 중요도를 기준으로 한 계산이며, 최종 결정은 사용자가 내려요.',
    tie_notice: '두 선택지의 점수 차이가 거의 없어요. 중요도를 다시 확인해 보세요.',
    evidence_label: '근거',
    no_info_label: '정보 부족',
    excluded_notice: "'{criteria}'은(는) 예시 데이터에 점수가 없어 총점에서 제외했어요. 정보를 입력해도 체험판에서는 반영되지 않아요.", // [체험판]
    sensitivity_flip_template: "'{criteria}'의 중요도를 현재 {from}%에서 {to}% 이상으로 높이면 {option}의 총점이 더 높아져요.",
    sensitivity_flip_down_template: "'{criteria}'의 중요도를 현재 {from}%에서 {to}% 이하로 낮추면 {option}의 총점이 더 높아져요.",
    sensitivity_close_template: "'{criteria}'의 중요도를 {from}%에서 {to}%로 높이면 두 선택지의 차이가 거의 없어져요.",
    sensitivity_close_down_template: "'{criteria}'의 중요도를 {from}%에서 {to}%로 낮추면 두 선택지의 차이가 거의 없어져요.",
    sensitivity_stable_template: "'{criteria}'의 중요도를 바꿔도 순위는 바뀌지 않아요.",
    sensitivity_hint: '%는 전체 중요도 중에서 그 기준이 차지하는 비율이에요.',
    whatif_double: '{criteria}{eul} 지금보다 두 배 중요하게 생각한다면?', // {eul}: 을/를
    whatif_condition: '{criteria}{eul} 두 배 중요하게 생각한다면',
    whatif_result_template: "'{condition}' 조건에서는 {winner}의 총점이 더 높게 계산돼요.",
    whatif_same: '순위는 그대로예요.',
    whatif_changed: '순위가 바뀌어요!',
    select_label: '어떤 선택지로 결정할까요?',
    select_option_cta: '이 선택지로 결정',
  },
  screen6: {
    header: '다음 결정',
    title: '이 결정 다음에도 고민할 게 있나요?',
    ai_recommend: '추천', // [체험판] 'AI 추천' → '추천'
    custom_input: '+ 새로운 고민 직접 입력',
    placeholder_custom: '예) 어떤 숙소가 좋을까?',
    start_new: '새 결정 시작하기',
    context_greeting_template: "결정하신 '{selected}' 다음으로 이런 고민을 이어서 비교할 수 있어요.",
    continue_button: '다음 고민 이어가기',
    continue_disabled: '이어갈 고민을 하나 골라 주세요.',
  },
  history: {
    title: '나의 결정',
    node_result_template: '→ {selected}',
    recheck_notice: '앞선 결정이 바뀌어서 다시 확인이 필요해요.',
    empty: '아직 저장된 결정이 없어요.',
  },
};

// 한글 받침이 있으면 withBatchim, 없으면 without 을 돌려줘요. 예) josa('날씨', '이에요', '예요') → '예요'
Pickwise.josa = function (word, withBatchim, without) {
  const last = String(word).trim().slice(-1);
  // 영문·숫자는 읽는 소리로 판단해요. 예) 원룸 B(비)는, 노트북 A(에이)는, 원룸 L(엘)은, 3(삼)은
  if (/[a-z]/i.test(last)) return /[lmnr]/i.test(last) ? withBatchim : without;
  if (/[0-9]/.test(last)) return /[013678]/.test(last) ? withBatchim : without;
  const code = last.charCodeAt(0) - 0xac00;
  if (code < 0 || code > 11171) return withBatchim; // 그 밖의 글자는 기본값
  return code % 28 ? withBatchim : without;
};

Pickwise.t = function (key, values) {
  const [group, name] = key.split('.');
  let text = (Pickwise.copy[group] || {})[name];
  if (text == null) return key;
  if (values) text = text.replace(/\{(\w+)\}/g, (m, k) => (values[k] != null ? values[k] : m));
  return text;
};
