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
- 브랜치: main
- 배포 방식: Vite 빌드 → Vercel (자동 배포)

## 프로젝트 구조
```
vibe-app-factory/
├── api/
│   └── claude.js          ← Claude API 서버리스 프록시 (ANTHROPIC_API_KEY 사용)
├── src/
│   ├── main.jsx           ← React 진입점
│   └── App.jsx            ← 메인 앱 컴포넌트
├── Keep_Going/            ← 세션 로그
├── error_check/           ← 에러 히스토리
├── vibe-app-factory.jsx   ← 원본 소스 (참조용)
├── index.html
├── package.json           ← Vite + React 19, 포트 5178
├── vite.config.js
└── vercel.json
```

## 스택
- Vite + React 19
- Claude API (claude-sonnet-4-20250514) — 스트리밍
- Vercel Serverless (api/claude.js 프록시)
- 포트: 5178

## 앱 기능 (7-Step 파이프라인)
| STEP | 이름 | 내용 |
|------|------|------|
| 1 | 🔍 역설계 | 주제/URL 분석 — 훅·구조·타겟심리 |
| 2 | 📋 기획서 | 컨셉·차별화·제목 3안 |
| 3 | 🌋 대본 | 원본대본 + TTS버전 |
| 4 | 🎨 비주얼 | 씬별 영어프롬프트·B-roll 테이블 |
| 5 | 🖼️ 썸네일 | 2안 영어프롬프트·색상·텍스트 |
| 6 | 📊 SEO | 제목3안·설명문·태그20·해시태그10 |
| 7 | 📱 배포 | 체크리스트·커뮤니티글·업로드시간 |

## 입력 옵션
- 모드: URL 역설계 / 주제 직접 입력
- 카테고리: 철학/인문·자기계발·비즈니스·테크AI·크립토·여행·요리·교육·엔터·기타 (10개)
- 타겟: 20대 직장인·30대 부모·투자자·학생·시니어·전문가
- 톤: 차분내레이션·열정동기부여·유쾌예능·지적분석
- 영상 길이: 숏폼~1분·미드폼~10분·롱폼~30분·롱폼~60분
- 언어: 한국어·English·한영혼합

## 핵심 변경 이력 (최근 5건)
| 날짜 | 내용 |
|------|------|
| 2026-03-31 | 프로젝트 초기 생성 (vibe-app-factory.jsx → Vite 프로젝트) |
| 2026-03-31 | api/claude.js 서버리스 프록시 추가 (CORS + API키 보안) |
| 2026-03-31 | fetch URL `/api/claude` 로 변경 (직접 Anthropic 호출 제거) |
| 2026-03-31 | GitHub push → Vercel 배포 완료 |
| 2026-03-31 | ANTHROPIC_API_KEY Vercel 환경변수 등록 안내 완료 |

## 다음 세션 할 일
- [ ] Vercel 환경변수 ANTHROPIC_API_KEY 등록 + Redeploy 확인
- [ ] 실제 파이프라인 실행 테스트 (주제 입력 → 7스텝 완료)
- [ ] 필요 시 max_tokens 조정 (현재 1500 — 롱폼 시 부족할 수 있음)
- [ ] 다운로드 버튼 추가 (TXT/XLSX 출력 — 공통 규칙 적용)

## 다음 세션 시작 프롬프트
```
D:\projects\vibe-app-factory\Keep_Going\LATEST.md 읽어줘.
미완료 항목 확인 후 이어서 작업해줘.
```
