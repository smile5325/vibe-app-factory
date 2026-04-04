# Vibe App Factory 버전 히스토리

## 현재 버전: v1.2.0

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
