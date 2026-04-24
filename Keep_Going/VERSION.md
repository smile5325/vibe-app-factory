#### v1.6.0 | 2026-04-24
**변경 유형:** Major
**수정 파일:** src/App.jsx, src/services/gemsApi.js (신규), D:\projects\gems-bridge\* (신규)
**수정 내용:**
  - Before: 파이프라인 버튼 1개 (🚀 7-Step 파이프라인 시작)
  - After:  버튼 2개 분리 — 🎨 이미지 생성 (활성) + 🎬 영상 생성 (비활성/툴팁)
  - 이미지 생성: XLSX 파일 선택 → gems-bridge 서버(localhost:8000) 전송 → Gems 분석 → 씬별 이미지 생성 → 결과 표시
  - 브릿지 서버 신규: D:\projects\gems-bridge\ (main.py, setup.ps1, test_connection.py)
**관련 에러:** 없음
**배포 상태:** 🔧 로컬 (브릿지 서버는 로컬 전용)

#### v1.5.0 | 2026-04-23
**변경 유형:** Major
**수정 파일:** src/App.jsx
**수정 내용:**
  - Before: education 폴더 = Mind-Lens, 니치 오버라이드 없음, URL 역설계 시 카테고리 수동 선택
  - After:  education 폴더 = DocuNomad, selfdev>심리학·뇌과학 → Mind-Lens 오버라이드, URL 역설계 시 autoMatchCategory()로 카테고리·니치 자동 설정
**관련 에러:** 없음
**배포 상태:** ✅ 배포 완료 (2179bb9)

#### v1.4.2 | 2026-04-22
**변경 유형:** Patch
**수정 파일:** src/App.jsx
**수정 내용:**
  - Before: URL 역설계 시 파일명에 URL 슬러그(`https___youtu_be_xxx`) 포함, Sheet1 제목/주제 셀에 URL 노출
  - After:  urlMeta 상태 추가 → 영상 제목 기반 파일명(`vibeapp_영상제목_날짜.xlsx`), Sheet1 제목/주제=영상제목, 원본 URL 별도 행 추가
  - Before: 폴더 중복(`LinkedM\LinkedM\`) 및 category 유실 시 무방어
  - After:  safeCategory 방어처리, rootHandle.name 검증으로 폴더 중복 방지, 저장 직전 console.log 추가
**관련 에러:** 파일명 URL 슬러그 버그, 저장 폴더 중복 버그
**배포 상태:** ✅ 배포 완료 (e79fad0)

#### v1.4.1 | 2026-04-21
**변경 유형:** Patch
**수정 파일:** src/App.jsx
**수정 내용:**
  - Before: _whiskRootHandle 세션 캐시 → 일반 모드에서 경로 에러 발생
  - After:  저장 시마다 showDirectoryPicker() 신규 호출 (캐시 없음)
**관련 에러:** 일반 모드 저장 경로 캐시 에러
**배포 상태:** ✅ 배포 완료 (a0c7023)

#### v1.4.0 | 2026-04-21
**변경 유형:** Major
**수정 파일:** src/App.jsx
**수정 내용:**
  - Before: 단일 시트 XLSX 출력
  - After:  MetaNomad 4탭 XLSX 표준 통일 (스토리요약/전체대본/스토리보드/Gmini출력)
**관련 에러:** 없음
**배포 상태:** ✅ 배포 완료 (a0c7023)

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
**관련 에러:** 잘못된 저장 경로 (philonomad 앱 폴더에 저장되던 문제)
**배포 상태:** ✅ 배포 완료

#### v1.2.0 | 2026-04-10
**변경 유형:** Major
**수정 파일:** src/App.jsx
**수정 내용:**
  - Before: XLSX만 브라우저 다운로드, Grok 파일명에 한국어 씬명 사용
  - After:  전체저장(XLSX+TTS+대본) File System API 폴더 저장, 영어 키워드 자동 생성
**관련 에러:** 없음
**배포 상태:** ✅ 배포 완료
