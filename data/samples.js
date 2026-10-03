// 자동 생성 파일 — data/*.json 을 고친 뒤 tools/build-samples.js 로 다시 만들어요.
window.PICKWISE_SAMPLES = [
  {
    "id": "decision_travel",
    "title": "그리스 vs 이집트 여행지 선택",
    "category": "여행",
    "criteria": [
      {
        "id": "cost",
        "label": "비용",
        "importance": 90,
        "normalizedWeight": 0.3
      },
      {
        "id": "weather",
        "label": "날씨",
        "importance": 75,
        "normalizedWeight": 0.25
      },
      {
        "id": "sightseeing",
        "label": "관광",
        "importance": 60,
        "normalizedWeight": 0.2
      },
      {
        "id": "food",
        "label": "음식",
        "importance": 45,
        "normalizedWeight": 0.15
      },
      {
        "id": "mobility",
        "label": "이동 편의성",
        "importance": 30,
        "normalizedWeight": 0.1
      }
    ],
    "options": [
      {
        "id": "greece",
        "label": "그리스",
        "scores": {
          "cost": 70,
          "weather": 80,
          "sightseeing": 75,
          "food": 85,
          "mobility": 75
        }
      },
      {
        "id": "egypt",
        "label": "이집트",
        "scores": {
          "cost": 80,
          "weather": 60,
          "sightseeing": 72,
          "food": 62,
          "mobility": 70
        }
      }
    ],
    "analysis": {
      "scoringFormula": "sum(score * importance) / sum(importance)",
      "ranking": [
        {
          "optionId": "greece",
          "totalScore": 76.25,
          "displayScore": 76,
          "rank": 1
        },
        {
          "optionId": "egypt",
          "totalScore": 69.7,
          "displayScore": 70,
          "rank": 2
        }
      ],
      "leadingOptionId": "greece"
    }
  },
  {
    "id": "decision_housing",
    "title": "자취방 선택",
    "category": "주거",
    "criteria": [
      {
        "id": "cost",
        "label": "월 주거비",
        "importance": 90,
        "normalizedWeight": 0.3
      },
      {
        "id": "commute",
        "label": "출퇴근 시간",
        "importance": 90,
        "normalizedWeight": 0.3
      },
      {
        "id": "space",
        "label": "공간 크기",
        "importance": 60,
        "normalizedWeight": 0.2
      },
      {
        "id": "quiet",
        "label": "조용함",
        "importance": 30,
        "normalizedWeight": 0.1
      },
      {
        "id": "amenities",
        "label": "생활 편의시설",
        "importance": 30,
        "normalizedWeight": 0.1
      }
    ],
    "options": [
      {
        "id": "room_a",
        "label": "원룸 A",
        "facts": {
          "monthlyHousingCostKRW": 650000,
          "oneWayCommuteMinutes": 55,
          "areaSquareMeters": 26
        },
        "scores": {
          "cost": 90,
          "commute": 45,
          "space": 90,
          "quiet": 70,
          "amenities": 65
        }
      },
      {
        "id": "room_b",
        "label": "원룸 B",
        "facts": {
          "monthlyHousingCostKRW": 930000,
          "oneWayCommuteMinutes": 20,
          "areaSquareMeters": 23
        },
        "scores": {
          "cost": 60,
          "commute": 95,
          "space": 80,
          "quiet": 75,
          "amenities": 95
        }
      },
      {
        "id": "room_c",
        "label": "원룸 C",
        "facts": {
          "monthlyHousingCostKRW": 780000,
          "oneWayCommuteMinutes": 35,
          "areaSquareMeters": 17
        },
        "scores": {
          "cost": 75,
          "commute": 70,
          "space": 55,
          "quiet": 90,
          "amenities": 80
        }
      }
    ],
    "analysis": {
      "scoringFormula": "sum(score * importance) / sum(importance)",
      "ranking": [
        {
          "optionId": "room_b",
          "totalScore": 79.5,
          "displayScore": 80,
          "rank": 1
        },
        {
          "optionId": "room_a",
          "totalScore": 72,
          "displayScore": 72,
          "rank": 2
        },
        {
          "optionId": "room_c",
          "totalScore": 71.5,
          "displayScore": 72,
          "rank": 3
        }
      ],
      "leadingOptionId": "room_b"
    }
  },
  {
    "id": "decision_laptop",
    "title": "업무용 노트북 선택",
    "category": "전자기기",
    "criteria": [
      {
        "id": "cost",
        "label": "가격",
        "importance": 80,
        "normalizedWeight": 0.26666666666666666
      },
      {
        "id": "portability",
        "label": "휴대성",
        "importance": 90,
        "normalizedWeight": 0.3
      },
      {
        "id": "battery",
        "label": "배터리",
        "importance": 70,
        "normalizedWeight": 0.23333333333333334
      },
      {
        "id": "performance",
        "label": "성능",
        "importance": 40,
        "normalizedWeight": 0.13333333333333333
      },
      {
        "id": "screen",
        "label": "화면 크기",
        "importance": 20,
        "normalizedWeight": 0.06666666666666667
      }
    ],
    "options": [
      {
        "id": "laptop_a",
        "label": "노트북 A",
        "facts": {
          "priceKRW": 1690000,
          "weightKg": 1.18,
          "assumedBatteryHours": 17,
          "ramGB": 16,
          "screenInches": 14
        },
        "scores": {
          "cost": 80,
          "portability": 95,
          "battery": 95,
          "performance": 80,
          "screen": 75
        }
      },
      {
        "id": "laptop_b",
        "label": "노트북 B",
        "facts": {
          "priceKRW": 1990000,
          "weightKg": 1.42,
          "assumedBatteryHours": 14,
          "ramGB": 32,
          "screenInches": 14
        },
        "scores": {
          "cost": 60,
          "portability": 75,
          "battery": 80,
          "performance": 95,
          "screen": 75
        }
      },
      {
        "id": "laptop_c",
        "label": "노트북 C",
        "facts": {
          "priceKRW": 1490000,
          "weightKg": 1.65,
          "assumedBatteryHours": 11,
          "ramGB": 16,
          "screenInches": 15.6
        },
        "scores": {
          "cost": 95,
          "portability": 55,
          "battery": 60,
          "performance": 75,
          "screen": 95
        }
      }
    ],
    "analysis": {
      "scoringFormula": "sum(score * importance) / sum(importance)",
      "ranking": [
        {
          "optionId": "laptop_a",
          "totalScore": 87.6667,
          "displayScore": 88,
          "rank": 1
        },
        {
          "optionId": "laptop_b",
          "totalScore": 74.8333,
          "displayScore": 75,
          "rank": 2
        },
        {
          "optionId": "laptop_c",
          "totalScore": 72.1667,
          "displayScore": 72,
          "rank": 3
        }
      ],
      "leadingOptionId": "laptop_a"
    }
  }
];
