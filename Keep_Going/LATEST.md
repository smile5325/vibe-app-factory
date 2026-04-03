# VIBE APP FACTORY — LATEST
- 최종 업데이트: 2026-04-03
- 작업 폴더: D:\projects\vibe-app-factory

## 앱 실행
```powershell
cd D:\projects\vibe-app-factory
npm run dev
# → localhost:5178
```
※ 로컬 실행 시 `.env` 파일에 `ANTHROPIC_API_KEY=sk-ant-...` 필요
※ 서버 재시작 필수 (vite.config.js 변경 후 Ctrl+C → npm run dev)

## 배포 정보
- GitHub: https://github.com/smile5325/vibe-app-factory
- Vercel: https://vibe-app-factory.vercel.app
- 브랜치: main / 자동 배포

## 프로젝트 구조
```
vibe-app-factory/
├── api/
│   └── claude.js          ← Vercel 서버리스 프록시 (프로덕션용)
├── src/
│   ├── main.jsx
│   └── App.jsx            ← 메인 앱 (비주얼 고도화 포함)
├── Keep_Going/
├── .env                   ← ANTHROPIC_API_KEY (로컬 전용, gitignore)
├── vite.config.js         ← localApiPlugin() 로컬 프록시 내장
└── vercel.json
```

## 스택
- Vite + React 19
- Claude API (claude-sonnet-4-20250514) — 스트리밍 + JSON 응답
- 로컬: vite.config.js 인라인 미들웨어 플러그인 → Anthropic API 직접 프록시
- 프로덕션: Vercel Serverless (api/claude.js)
- 포트: 5178

## 현재 구현된 기능

### 7-Step 파이프라인
| STEP | 이름 | 내용 |
|------|------|------|
| 1 | 🔍 역설계 | 주제/URL 분석 — 훅·구조·타겟심리 |
| 2 | 📋 기획서 | 컨셉·차별화·제목 3안 |
| 3 | 🌋 대본 | 원본대본 + TTS버전 |
| 4 | 🎨 비주얼 | 씬별 영어프롬프트·B-roll 테이블 (캐릭터 레퍼런스+복잡도+앵글 고도화) |
| 5 | 🖼️ 썸네일 | 2안 영어프롬프트·색상·텍스트 |
| 6 | 📊 SEO | 제목3안·설명문·태그20·해시태그10 |
| 7 | 📱 배포 | 체크리스트·커뮤니티글·업로드시간 |

### 비주얼 이미지 프롬프트 고도화 (2026-04-03 추가)
- **캐릭터 성별 선택**: [👨 남성] / [👩 여성] 버튼 (콘텐츠 설정 — 타겟 독자 아래)
- **CHARACTER REFERENCE 블록**: STEP4 프롬프트 최상단에 전 씬 공통 캐릭터 정보 자동 삽입
- **Complexity 산출**: 씬 길이+유형(GENERAL/CORE) 기반 권장이미지수 자동 계산 (최대 7장)
- **앵글 변주 지시**: 권장이미지수 2장+ 씬에 _01~_07 앵글 시퀀스 자동 적용
- **XLSX 9열 확장**: G열=Grok 파일명, H열=복잡도, I열=권장이미지수
- **시퀀스 세부 행**: 권장이미지수 N장인 씬에 N개 서브 행 자동 생성 (각 앵글별)
- **비주얼 탭 뱃지**: 씬 카드에 [GENERAL | 🖼️ 3장] 뱃지 표시

### AI 주제 생성
- [🔄 AI 주제 생성] 버튼 → 카테고리+타겟 기반 주제 6개 생성 (web_search 트렌드 반영)
- 에러 발생 시 빨간 박스에 구체적 오류 메시지 표시

## 핵심 변경 이력 (최근 5건)
| 날짜 | 내용 |
|------|------|
| 2026-04-03 | vite.config.js — loadEnv로 .env 파일 ANTHROPIC_API_KEY 정상 로드 수정 |
| 2026-04-03 | vite.config.js — localApiPlugin() 추가 (로컬 /api/claude 404 해결) |
| 2026-04-03 | generateTopics() — 방어적 파싱 + topicError 상태 에러 UI 추가 |
| 2026-04-03 | 비주얼 고도화 — 캐릭터 레퍼런스+Complexity+앵글 변주+XLSX 9열+시퀀스 세부 행 |
| 2026-04-02 | 대본 끊김 fix — STEP별 max_tokens 차등 (대본 최대 8000) |

## 다음 세션 할 일
- [ ] **서버 재시작 후 AI 주제 생성 버튼 작동 확인** (loadEnv 수정 최종 검증)
- [ ] 캐릭터 성별 선택 UI — 실제 동작 확인
- [ ] STEP4 비주얼 생성 — Grok 파일명/복잡도/권장이미지수 출력 확인
- [ ] XLSX 비주얼 시트 — 9열 + 시퀀스 세부 행 육안 확인
- [ ] 비주얼 탭 뱃지 — GENERAL/CORE 색상 표시 확인
- [ ] 테스트 완료 후 GitHub push → Vercel 자동 배포

## 에러 히스토리 (이번 세션)
| 에러 | 원인 | 해결 |
|------|------|------|
| AI 버튼 무반응 | console.error 묵살 | topicError 상태 + 에러 UI |
| JSON 파싱 크래시 | res.json() 직접 호출 | res.text() → JSON.parse() 방어 |
| /api/claude 404 | Vite가 Vercel 서버리스 미인식 | vite.config.js 인라인 플러그인 |
| ANTHROPIC_API_KEY undefined | process.env ≠ .env | loadEnv(mode, cwd, "") 사용 |

## 다음 세션 시작 프롬프트
```
D:\projects\vibe-app-factory\Keep_Going\LATEST.md 읽어줘.
미완료 항목 확인 후 이어서 작업해줘.
```
