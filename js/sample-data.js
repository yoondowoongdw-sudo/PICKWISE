// 예시 데이터 (data/samples.js) 를 화면에서 쓰기 좋게 꺼내 주는 함수들.
// 이 버전은 외부 AI를 부르지 않아요. 점수는 모두 콘텐츠팀이 만든 예시 데이터 값이고,
// 예시에 없는 값은 지어내지 않고 null(정보 부족)로 둬요.
window.Pickwise = window.Pickwise || {};

(function () {
  const SAMPLES = window.PICKWISE_SAMPLES || [];

  // 화면 1 '결정 주제 입력'에 채울 문장, 결정 기록에 쓸 짧은 제목, 예시 고르기 버튼 이름
  const TOPICS = {
    decision_travel: '그리스 vs 이집트 어디로 갈지',
    decision_housing: '자취방 3곳 중 어디로 이사할지',
    decision_laptop: '업무용 노트북 3대 중 무엇을 살지',
  };
  const SHORT = {
    decision_travel: { title: '여행지 결정', chip: '여행지' },
    decision_housing: { title: '자취방 결정', chip: '자취방' },
    decision_laptop: { title: '노트북 결정', chip: '노트북' },
  };

  // 기준 이름 → Lucide 라인 아이콘 이름
  const ICONS = {
    cost: 'won', weather: 'sun', sightseeing: 'landmark', food: 'utensils', mobility: 'bus-front',
    commute: 'clock', space: 'house', quiet: 'volume-x', amenities: 'store',
    portability: 'feather', battery: 'battery', performance: 'cpu', screen: 'monitor',
    safety: 'shield-check', experience: 'sparkles', culture: 'scroll', rest: 'palmtree', shopping: 'shopping-bag',
    light: 'sun', fee: 'receipt', parking: 'car', security: 'lock',
    service: 'wrench', design: 'palette', keyboard: 'keyboard', heat: 'thermometer', charger: 'plug',
  };
  const won = (n) => (n >= 10000 ? `${Math.round(n / 10000).toLocaleString('ko-KR')}만 원` : `${n.toLocaleString('ko-KR')}원`);

  // 예시 데이터에 점수가 없는 기준 후보. 고르면 결과에서 '정보 부족'으로 표시돼요.
  //  - 앞의 2개: 화면 2 기준 카드 목록에 '선택 안 됨'으로 함께 보여 줘요 (목업의 치안·새로운 경험)
  //  - 나머지: '이런 기준도 고려해보세요' 칩
  const EXTRA = {
    decision_travel: [
      { id: 'safety', label: '치안' }, { id: 'experience', label: '새로운 경험' },
      { id: 'culture', label: '문화·역사' }, { id: 'rest', label: '휴양' }, { id: 'shopping', label: '쇼핑' },
    ],
    decision_housing: [
      { id: 'safety', label: '치안' }, { id: 'light', label: '채광' },
      { id: 'fee', label: '관리비' }, { id: 'parking', label: '주차' }, { id: 'security', label: '보안 시설' },
    ],
    decision_laptop: [
      { id: 'service', label: 'A/S' }, { id: 'design', label: '디자인' },
      { id: 'keyboard', label: '키보드' }, { id: 'heat', label: '발열' }, { id: 'charger', label: '충전기 무게' },
    ],
  };

  // 예시 데이터의 facts(실제 숫자)를 근거 문장으로
  const FACTS = {
    cost: (f) => f.monthlyHousingCostKRW != null ? `월 주거비 ${won(f.monthlyHousingCostKRW)}` : f.priceKRW != null ? `가격 ${won(f.priceKRW)}` : null,
    commute: (f) => f.oneWayCommuteMinutes != null ? `편도 출퇴근 ${f.oneWayCommuteMinutes}분` : null,
    space: (f) => f.areaSquareMeters != null ? `면적 ${f.areaSquareMeters}㎡` : null,
    portability: (f) => f.weightKg != null ? `무게 ${f.weightKg}kg` : null,
    battery: (f) => f.assumedBatteryHours != null ? `배터리 약 ${f.assumedBatteryHours}시간` : null,
    performance: (f) => f.ramGB != null ? `메모리 ${f.ramGB}GB` : null,
    screen: (f) => f.screenInches != null ? `화면 ${f.screenInches}인치` : null,
  };

  // 화면 6 후속 고민 (예시 카테고리별로 미리 작성). 선택 결과에 따라 달라지는 항목은 BY_SELECTED 에.
  const BY_SELECTED = {
    그리스: { title: '산토리니 vs 미코노스', reason: '그리스 안에서 어떤 섬을 갈지 비교해 볼 수 있어요.' },
    이집트: { title: '카이로 vs 룩소르', reason: '이집트 안에서 어느 도시에 머물지 비교해 볼 수 있어요.' },
  };
  const NEXT = {
    여행: [
      { title: '패키지 vs 자유여행', reason: '여행 방식에 따라 일정과 비용이 크게 달라져요.' },
      { bySelected: true },
      { title: '숙소 위치 비교', reason: '일정 동선에 맞는 숙소 위치를 정해 볼 수 있어요.' },
    ],
    주거: [
      { title: '계약 기간 1년 vs 2년', reason: '이사 계획에 따라 유리한 조건이 달라요.' },
      { title: '가구 새로 사기 vs 중고', reason: '초기 비용을 줄일 수 있어요.' },
      { title: '인터넷 통신사 고르기', reason: '매달 나가는 고정비예요.' },
    ],
    전자기기: [
      { title: '공식몰 vs 오픈마켓 구매', reason: '같은 제품도 가격과 혜택이 달라요.' },
      { title: '보증 연장 여부', reason: '수리비 부담을 줄일 수 있어요.' },
      { title: '함께 살 주변기기 고르기', reason: '업무 환경에 맞춰 필요한 것이 달라요.' },
    ],
  };

  function get(id) {
    return SAMPLES.find((s) => s.id === id) || null;
  }

  Pickwise.samples = {
    // 화면 1: 고를 수 있는 예시 목록
    list() {
      return SAMPLES.map((s) => ({
        id: s.id,
        topic: TOPICS[s.id] || s.title,
        title: (SHORT[s.id] || {}).title || s.title,
        chip: (SHORT[s.id] || {}).chip || s.category,
        category: s.category,
        options: s.options.map((o) => ({ id: o.id, label: o.label })),
      }));
    },

    // 화면 2: 기준 후보. 예시 기준은 처음부터 선택, 점수 없는 후보 2개는 선택 안 됨으로 함께 보여 줘요
    criteria(id) {
      const s = get(id);
      if (!s) return [];
      const sample = s.criteria.map((c) => ({ id: c.id, label: c.label, icon: ICONS[c.id] || 'circle', source: 'sample', selected: true }));
      const candidates = (EXTRA[id] || []).slice(0, 2).map((c) => ({ ...c, icon: ICONS[c.id] || 'circle', source: 'candidate', selected: false }));
      return sample.concat(candidates);
    },
    // '이런 기준도 고려해보세요' 칩
    extraCriteria(id) {
      return (EXTRA[id] || []).slice(2).map((c) => ({ ...c, icon: ICONS[c.id] || 'circle', source: 'extra' }));
    },
    iconFor(criteriaId) {
      return ICONS[criteriaId] || 'circle';
    },

    // 화면 4 → 5: 선택지 x 기준 점수. 예시에 없는 기준(직접 추가·추천 칩)은 null
    scores(id, criteria) {
      const s = get(id);
      const out = {};
      if (!s) return out;
      s.options.forEach((o) => {
        out[o.id] = {};
        criteria.forEach((c) => {
          const score = o.scores[c.id];
          if (score == null) {
            out[o.id][c.id] = { score: null, evidence_type: 'none', evidence: null };
            return;
          }
          const fact = FACTS[c.id] && o.facts ? FACTS[c.id](o.facts) : null;
          out[o.id][c.id] = {
            score,
            evidence_type: 'sample',
            evidence: fact || '예시 데이터에 정해 둔 점수',
          };
        });
      });
      return out;
    },

    // 화면 6: 후속 고민
    nextDecisions(id, selectedLabel) {
      const s = get(id);
      return (NEXT[s ? s.category : ''] || [])
        .map((n) => (n.bySelected ? BY_SELECTED[selectedLabel] : n))
        .filter(Boolean);
    },
  };
})();
