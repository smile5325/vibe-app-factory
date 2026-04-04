# VIBE APP FACTORY — LATEST
## 현재 버전: v1.2.0
- 최종 업데이트: 2026-04-04
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

### 비주얼 이미지 프롬프트 고도화 (2026-04-03)
- 캐릭터 성별 선택 UI [👨 남성] / [👩 여성]
- CHARACTER REFERENCE 블록 자동 삽입
- Complexity(GENERAL/CORE) + 권장이미지수 자동 계산
- 앵글 변주 _01~_07 시퀀스
- XLSX 비주얼 시트 9열 확장
- 비주얼 탭 씬 카드 뱃지

### XLSX 비주얼 시트 행 간격 (2026-04-03)
```
[씬 메인행]
← 빈 행 1개
[서브행 _01]
← 빈 행 1개
[서브행 _02]
← 빈 행 2개 (씬 구분)
[다음 씬 메인행]
```

## 핵심 변경 이력 (최근 5건)
| 날짜 | 내용 |
|------|------|
| 2026-04-03 | XLSX 비주얼 시트 행 간격 — 씬 내 1행, 씬 사이 2행 |
| 2026-04-03 | vite.config.js — loadEnv로 ANTHROPIC_API_KEY 정상 로드 |
| 2026-04-03 | vite.config.js — localApiPlugin() 로컬 /api/claude 프록시 |
| 2026-04-03 | generateTopics() — 방어적 파싱 + topicError 에러 UI |
| 2026-04-03 | 비주얼 고도화 — 캐릭터 레퍼런스+Complexity+앵글+XLSX 9열 |

## 다음 세션 할 일
- [ ] AI 주제 생성 버튼 작동 확인 (loadEnv 수정 최종 검증 — 서버 재시작 필요)
- [ ] STEP4 비주얼 생성 → Grok 파일명/복잡도/권장이미지수 출력 확인
- [ ] XLSX 비주얼 시트 — 9열 + 행 간격(씬 내 1행/씬 사이 2행) 육안 확인
- [ ] 비주얼 탭 뱃지 — GENERAL/CORE 색상 표시 확인

## 다음 세션 시작 프롬프트
```
D:\projects\vibe-app-factory\Keep_Going\LATEST.md 읽어줘.
미완료 항목 확인 후 이어서 작업해줘.
```
