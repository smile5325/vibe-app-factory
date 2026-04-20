#### v1.2.0 | 2026-04-10
**변경 유형:** Major
**수정 파일:** src/App.jsx
**수정 내용:**
  - Before: XLSX만 브라우저 다운로드, Grok 파일명에 한국어 씬명 사용
  - After:  전체저장(XLSX+TTS+대본) File System API 폴더 저장, 영어 키워드 자동 생성
**관련 에러:** 없음
**배포 상태:** 배포 완료
#### v1.3.2 | 2026-04-20
**변경 유형:** Patch
**수정 파일:** src/App.jsx
**수정 내용:**
  - Before: URL 입력 시 채널 카테고리 내용만 출력 (URL 텍스트만 전달)
  - After:  YouTube oEmbed API로 영상 제목·채널명 추출 → 프롬프트에 주입, 파이프라인 시작 전 메타데이터 fetch
**관련 에러:** URL 역설계 모드 — 채널 카테고리 내용만 출력되는 버그
**배포 상태:** ✅ 배포 완료

#### v1.2.1 | 2026-04-10
**변경 유형:** Patch (버그 픽스)
**수정 파일:** src/App.jsx
**수정 내용:**
  - Before: 카테고리별 폴더 직접 선택 → 잘못된 경로(philonomad 앱 폴더) 선택 오류
  - After:  Whisk Downloads 루트 1회 선택 → 카테고리+날짜 서브폴더 자동 생성
  - 저장 경로: D:\projects\PROJECT_mp4\Whisk Downloads\{category}\{날짜_주제}  - 저장 완료 메시지에 전체 절대 경로 표시
**관련 에러:** 잘못된 저장 경로 (philonomad 앱 폴더에 저장되던 문제)
**배포 상태:** 배포 완료
