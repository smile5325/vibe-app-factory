# [Vibe App Factory] Mind Lens 수정사항 동기화 3건

- 날짜: 2026-04-02
- 파일: src/App.jsx
- 상태: ✅ 해결
- 커밋: 50633ab

---

## 수정 1: 기타(ETC) 카테고리 AI 주제 — 악기 Guitar 오인

### 증상
카테고리 "기타(✨)" 선택 후 AI 주제 생성 시
web_search("유튜브 기타 인기 영상 트렌드") → 악기 기타(Guitar) 관련 주제 출력 가능

### 원인
generateTopics() 함수에서 cat.label ("기타")을 검색어에 그대로 사용

### 수정
```js
// ✏️ 기타(ETC) 카테고리 web_search 오인 방지
const searchLabel = cat.id === "other"
  ? "심리학 라이프스타일 사회이슈"
  : cat.label;
// web_search 쿼리에 cat.label 대신 searchLabel 사용
```

---

## 수정 2: 전체 TXT 저장 버튼 없음

### 증상
7단계 완료 후 전체 결과를 TXT로 저장하는 버튼 없음
TTS 음성 변환용 전체 대본 파일 생성 불가

### 수정
buildPlainText(), downloadAllTxt() 함수 신규 추가

출력 구조:
```
=================================
[Vibe App Factory 전체 대본]
생성일 / 카테고리 / 주제 / 타겟 / 톤 / 영상길이 / 언어
=================================

[ STEP 1 / 7 🔍 역설계 ]
(내용...)
---
[ STEP 3 / 7 🌋 대본 ]
(대본 원문 — TTS 마커 포함)
...
=================================
[END]
=================================
```

파일명: vibeapp_대본_YYYYMMDD.txt

---

## 수정 3: XLSX 저장 없음 + 비주얼/썸네일 행간 규칙

### 증상
XLSX 내보내기 기능 미구현 (2026-04-01 LATEST.md에 '추가 검토' 표시)
비주얼/썸네일 시트 행간 규칙 적용 필요

### 수정
loadXLSX(), exportXLSX() 함수 신규 추가

비주얼(🎨) / 썸네일(🖼) 시트 행간 규칙:
```js
// 헤더 → 빈행 → 데이터1 → 빈행 → ... → 마지막데이터 → 빈행
const emptyRow = [null, null, null, null, null, null];
blocks.forEach((b) => {
  rows.push(emptyRow);   // 데이터 앞 빈행
  rows.push([...data]);
});
rows.push(emptyRow);     // 마지막 빈행
```

파일명: vibeapp_{주제명}_YYYYMMDD.xlsx

---

## 확인 방법
1. https://vibe-app-factory.vercel.app 접속
2. 카테고리 "기타" 선택 → AI 주제 생성 → 악기/음악 주제 없는지 확인
3. 7-Step 완료 후 "📄 전체 TXT 저장" 클릭 → 평문 텍스트 확인
4. "📥 XLSX 저장" 클릭 → 비주얼 시트 행간 1칸 확인
