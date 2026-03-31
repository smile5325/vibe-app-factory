# VIBE APP FACTORY — LATEST
- 최종 업데이트: 2026-03-31
- 작업 폴더: D:\projects\vibe-app-factory

## 앱 실행
```powershell
cd D:\projects\vibe-app-factory
npm run dev
# → localhost:5178
```
※ 로컬 실행 시 .env 파일에 ANTHROPIC_API_KEY=sk-ant-... 필요

## 배포 정보
- GitHub: https://github.com/smile5325/vibe-app-factory
- Vercel: https://vibe-app-factory.vercel.app
- 브랜치: main / 자동 배포

## 프로젝트 구조
```
vibe-app-factory/
├── api/
│   └── claude.js          ← Claude API 서버리스 프록시
├── src/
│   ├── main.jsx
│   └── App.jsx            ← 메인 앱 (AI 주제 생성 포함)
├── Keep_Going/
├── error_check/
├── vibe-app-factory.jsx   ← 원본 소스 (참조용)
├── index.html
├── package.json           ← Vite + React 19, 포트 5178
├── vite.config.js
└── vercel.json
```

## 스택
- Vite + React 19
- Claude API (claude-sonnet-4-20250514) — 스트리밍 + JSON 응답
- Vercel Serverless (api/claude.js 프록시)
- 포트: 5178

## 현재 구현된 기능

### 7-Step 파이프라인
| STEP | 이름 | 내용 |
|------|------|------|
| 1 | 🔍 역설계 | 주제/URL 분석 — 훅·구조·타겟심리 |
| 2 | 📋 기획서 | 컨셉·차별화·제목 3안 |
| 3 | 🌋 대본 | 원본대본 + TTS버전 |
| 4 | 🎨 비주얼 | 씬별 영어프롬프트·B-roll 테이블 |
| 5 | 🖼️ 썸네일 | 2안 영어프롬프트·색상·텍스트 |
| 6 | 📊 SEO | 제목3안·설명문·태그20·해시태그10 |
| 7 | 📱 배포 | 체크리스트·커뮤니티글·업로드시간 |

### AI 주제 생성 (2026-03-31 추가)
- [🔄 AI 주제 생성] 버튼 클릭 → 카테고리+타겟 기반 주제 6개 생성
- 칩(chip) 형태로 표시 → 클릭 시 입력 필드 자동 입력
- 재클릭 시 선택 해제 + 입력 초기화
- 직접 입력 시 칩 선택 자동 해제
- 카테고리/타겟 변경 시 칩 목록 자동 리셋
- topic 모드에서만 표시 (URL 모드에서는 숨김)

## 핵심 변경 이력 (최근 5건)
| 날짜 | 내용 |
|------|------|
| 2026-03-31 | AI 주제 생성 버튼 + 칩 UI 추가 (commit: 8b3e5d6) |
| 2026-03-31 | Keep_Going · error_check 폴더 초기 생성 |
| 2026-03-31 | GitHub push → Vercel 배포 완료 |
| 2026-03-31 | api/claude.js 서버리스 프록시 추가 |
| 2026-03-31 | 프로젝트 초기 생성 (vibe-app-factory.jsx → Vite 프로젝트) |

## 다음 세션 할 일
- [ ] Vercel ANTHROPIC_API_KEY 등록 확인 + 실제 파이프라인 테스트
- [ ] AI 주제 생성 실제 동작 확인 (칩 6개 표시)
- [ ] 다운로드 버튼 추가 (TXT/XLSX 출력 — 공통 규칙 적용)
- [ ] max_tokens 조정 검토 (현재 1500 — 롱폼 시 부족 가능)

## 다음 세션 시작 프롬프트
```
D:\projects\vibe-app-factory\Keep_Going\LATEST.md 읽어줘.
미완료 항목 확인 후 이어서 작업해줘.
```
