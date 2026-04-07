# Vibe App Factory 버전 히스토리

## 현재 버전: v1.2.5

---

#### v1.2.5 | 2026-04-07
**변경 유형:** Minor
**수정 파일:** `src/App.jsx`
**수정 내용:**
  - Before: STEP 4 비주얼 생성 시 STEP 3 대본과 무관하게 임의 장면 생성 가능
  - After:  STEP 4 실행 시 STEP 3 대본(최대 3000자)을 userPrompt에 자동 주입 + buildHarnessPrompt STEP 4 섹션 앞에 [대사-이미지 연동 규칙] 블록 삽입 → 대사 기반 이미지 프롬프트 생성 강제
**관련 에러:** 없음
**배포 상태:** 🔧 로컬 (GitHub push 완료)

---

#### v1.2.4 | 2026-04-07
**변경 유형:** Minor
**수정 파일:** `src/App.jsx`
**수정 내용:**
  - Before: STEP 3 분량 지시 없음, STEP 4 카테고리 비주얼 스타일 없음
  - After:  STEP 3 앞 `[대본 분량 필수 준수]` 블록 삽입 (scriptTarget/scriptSection 변수로 길이별 타겟 자동 적용) + STEP 4 charBlock 위 `[VISUAL STYLE — 전 씬 공통 적용]` 블록 삽입 (카테고리 10종 색상/스타일 매핑)
**관련 에러:** 없음
**배포 상태:** 🔧 로컬 (GitHub push 완료)

---

#### v1.2.3 | 2026-04-07
**변경 유형:** Patch
**수정 파일:** `src/App.jsx`
**수정 내용:**
  - Before: charBlock — 단순 "same character as CHAR reference," 규칙 1줄
  - After:  STRICT RULES 4항목 추가 (민족·얼굴 고정, 서양인 금지, 프롬프트 시작 문구 명시)
**관련 에러:** 없음
**배포 상태:** 🔧 로컬 (GitHub push 완료)

---

#### v1.2.2 | 2026-04-07
**변경 유형:** Minor
**수정 파일:** `src/App.jsx`
**수정 내용:**
  - Before: STEP 4 이미지 수량 — 시간 기계 분할 (GENERAL 10초/장, CORE 5초/장), 복잡도 필드
  - After:  의미 단위 Sync v2.0 — 대사 전환점 기준 청크 분할, 씬당 2~5장, 의미태그+체류시간(초) 필드
**관련 에러:** 없음
**배포 상태:** 🔧 로컬

---

#### v1.2.1 | 2026-04-04
**변경 유형:** Patch
**수정 파일:** `src/App.jsx`
**수정 내용:**
  - Before: 콘텐츠 설정 패널 라이트 테마 (#ffffff 배경, 라이트 칩)
  - After:  전체 다크 테마 통일 (#1A1A24 패널, #1E1E2E 칩, #6C5CE7 액티브)
**관련 에러:** 없음
**배포 상태:** ✅ Vercel 배포 완료

---

#### v1.2.0 | 2026-04-04
**변경 유형:** Minor
**수정 파일:** `src/App.jsx`
**수정 내용:**
  - Before: 다크 테마 패널, 이모지 카테고리 8개, 타겟 6개, 캐릭터 2종
  - After:  라이트 테마 패널, 컬러도트 카테고리 10개(HOT 뱃지+세부니치), 타겟 7개(해외 시청자 추가), 캐릭터 4종(AI·페이스리스 추가)
**관련 에러:** 없음
**배포 상태:** 🔧 로컬

---

#### v1.1.2 | 2026-04-03
**변경 유형:** Patch
**수정 파일:** `src/App.jsx`
**수정 내용:**
  - Before: XLSX 첫 탭이 역설계 시트
  - After:  XLSX 첫 탭에 📋 주제개요 시트 추가 (콘텐츠 모드/카테고리/주제/타겟/캐릭터/톤/길이/언어/생성일시/파일명)
**관련 에러:** 없음
**배포 상태:** ✅ Vercel 배포 완료

---

#### v1.1.1 | 2026-04-03
**변경 유형:** Patch
**수정 파일:** `src/App.jsx`
**수정 내용:**
  - Before: 씬 메인행↔서브행 붙어서 출력, 씬 사이 빈 행 1개
  - After:  씬 내 빈 행 1개 삽입, 씬 사이 빈 행 2개 삽입
**관련 에러:** xlsx-visual-row-spacing
**배포 상태:** ✅ Vercel 배포 완료

---

#### v1.1.0 | 2026-04-03
**변경 유형:** Minor
**수정 파일:** `src/App.jsx`
**수정 내용:**
  - Before: 비주얼 시트 6열, 캐릭터 정보 없음
  - After:  캐릭터 성별 선택 UI + CHARACTER REFERENCE 블록 + Complexity/이미지수 계산 + 앵글 시퀀스 + XLSX 9열 + 시퀀스 세부 행 + 씬 카드 뱃지
**관련 에러:** 없음
**배포 상태:** ✅ Vercel 배포 완료

---

#### v1.0.3 | 2026-04-03
**변경 유형:** Patch
**수정 파일:** `vite.config.js`
**수정 내용:**
  - Before: `process.env.ANTHROPIC_API_KEY` → undefined (Vite 플러그인 컨텍스트)
  - After:  `loadEnv(mode, cwd, "")` 사용 → .env 파일 모든 키 정상 로드
**관련 에러:** vite-plugin-process-env-undefined
**배포 상태:** ✅ Vercel 배포 완료

---

#### v1.0.2 | 2026-04-03
**변경 유형:** Patch
**수정 파일:** `src/App.jsx` — `generateTopics()`
**수정 내용:**
  - Before: `await res.json()` 직접 호출 → 빈 응답 시 크래시
  - After:  `res.text()` → `JSON.parse()` 6단계 방어적 파싱 + topicError UI
**관련 에러:** api-response-json-parse-crash, ai-topic-button-silent-failure
**배포 상태:** ✅ Vercel 배포 완료

---

#### v1.0.1 | 2026-04-03
**변경 유형:** Patch
**수정 파일:** `vite.config.js`
**수정 내용:**
  - Before: `/api/claude` 요청 → Vite 개발 서버 404 (Vercel 서버리스 미지원)
  - After:  `localApiPlugin()` 인라인 미들웨어 추가 → Anthropic API 직접 프록시
**관련 에러:** vite-dev-404-no-api-route
**배포 상태:** ✅ Vercel 배포 완료

---

#### v1.0.0 | 2026-04-01
**변경 유형:** Major
**수정 파일:** `src/App.jsx`, `vite.config.js`, `api/claude.js`
**수정 내용:**
  - Before: 없음
  - After:  최초 빌드 — 7-Step 파이프라인 (역설계→기획→대본→비주얼→썸네일→SEO→배포) + AI 주제 생성 버튼
**관련 에러:** 없음
**배포 상태:** ✅ Vercel 배포 완료
