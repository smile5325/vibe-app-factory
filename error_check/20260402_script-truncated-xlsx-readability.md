# [Vibe App Factory] 대본 끊김 + XLSX 시트 가독성 2건

- 날짜: 2026-04-02
- 파일: src/App.jsx
- 상태: ✅ 해결
- 커밋: 1c06714

---

## 에러 1: 대본(STEP 3) 텍스트 끊김 ("둘째" 에서 중단)

### 증상
7-Step 파이프라인 실행 후 대본 탭에서
내용이 "둘째" 등 중간 문장에서 갑자기 끊겨서 완성되지 않음

### 원인
모든 STEP에 `max_tokens: 1500` 고정 적용
대본(STEP 3)은 미드폼 ~10분 기준 2500~3500자 필요 → 1500 토큰으로 부족

### 수정
```js
// ✏️ STEP별 max_tokens 차등 — 대본(STEP 3)은 길이에 따라 최대 8000
const scriptTokens = { short: 2000, mid: 6000, long30: 8000, long60: 8000 };
const stepMaxTokens = step.id === 3
  ? (scriptTokens[length] || 6000)
  : step.id === 4 ? 3000
  : 2000;
```

| STEP | 이름 | max_tokens |
|------|------|-----------|
| 1 | 역설계 | 2000 |
| 2 | 기획서 | 2000 |
| 3 | 대본 | 숏폼 2000 / 미드폼 6000 / 롱폼 8000 |
| 4 | 비주얼 | 3000 |
| 5~7 | 나머지 | 2000 |

---

## 에러 2: XLSX 역설계·기획서·대본·SEO·배포 시트 가독성 없음

### 증상
XLSX 다운로드 후 역설계/기획서/대본/SEO/배포 시트를 열면
- 1행: STEP 헤더
- 2행: 빈 행
- 3행: 전체 내용이 한 셀에 몽땅 들어가 있음

스크롤 없이는 내용 확인 불가, 셀 내 줄바꿈만 수십 개

### 원인
```js
// 기존: 전체 content를 하나의 배열 원소로
const wsData = [[`STEP...`], [""], [content || ""]];
```

### 수정
```js
// ✏️ 줄별 행 분리 + 마크다운 기호 제거
const cleanLine = (line) =>
  line.replace(/^#{1,3}\s*/g, "").replace(/\*\*/g, "").replace(/`/g, "").trimEnd();

const contentRows = (content || "")
  .split("\n")
  .map((line) => [cleanLine(line)]);

const wsData = [
  [`STEP ${step.id} ${step.emoji} ${step.label}`],
  [""],
  ...contentRows,  // 줄마다 별도 행
];
ws["!cols"] = [{ wch: 100 }];
```

### 확인 방법
XLSX 다운로드 → 역설계/기획서/대본 시트 열기 →
각 문장/항목이 별도 행에 표시되고 마크다운 기호(###, **) 없어야 함
