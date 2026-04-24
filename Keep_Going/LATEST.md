# VIBE APP FACTORY — LATEST
## 현재 버전: v1.6.0
- 최종 업데이트: 2026-04-24
- 작업 폴더: D:\projects\vibe-app-factory

## 앱 실행
```powershell
cd D:\projects\vibe-app-factory
npm run dev
# → localhost:5178
```
※ 로컬 실행 시 `.env` 파일에 `ANTHROPIC_API_KEY=sk-ant-...` 필요

## 배포 정보
- GitHub: https://github.com/smile5325/vibe-app-factory
- Vercel: https://vibe-app-factory.vercel.app
- 브랜치: main / 자동 배포
- 현재 커밋: 2179bb9
- 상태: ✅ 정상

## XLSX 4탭 구조 (v1.4.0 MetaNomad 표준)
① 📋스토리요약 (테라코타 #C0392B)
② 📖전체스토리텔링대본 (올리브 #6B7A1E)
③ 🎬스토리보드 (딥네이비 #1A237E)
④ 📤Gmini프롬프트출력 (다크그린 #1B5E20)

## 카테고리 → 저장 폴더 매핑 (현재)
| 카테고리 | 폴더 |
|---------|------|
| finance | routine_money |
| tech | AI_silmuja |
| selfdev | silhaeng_note |
| selfdev + 심리학·뇌과학 | **Mind-Lens** (니치 오버라이드) |
| health | 100se_comfort |
| story | PhiloNomad |
| travel | MetaNomad |
| education | **DocuNomad** |
| business/entertainment/other | LinkedM |

## 핵심 변경 이력 (최근 5건)
| 날짜 | 커밋 | 내용 |
|------|------|------|
| 2026-04-23 | 2179bb9 | URL 자동매칭 + education→DocuNomad + selfdev심리학→MindLens ✅ |
| 2026-04-22 | e79fad0 | 파일명 URL슬러그→영상제목, Sheet1 제목/주제 수정, 폴더중복 방지 ✅ |
| 2026-04-21 | a0c7023 | 저장 경로 캐시 완전 제거 - 일반모드 에러 수정 |
| 2026-04-21 | b2b3fbf | 스토리보드 썸네일 추가 + STEP4 씬잘림 방지 |
| 2026-04-21 | 25f25ed | XLSX 4탭 품질 개선 - SyncGap/NarrationENG/Gmini탭 |

## 다음 세션 할 일
- [ ] URL 역설계 자동매칭 실제 테스트 (심리학 영상으로 Mind-Lens 폴더 확인)
- [ ] XLSX 4탭 검증 체크리스트 전체 확인
- [ ] 크레딧 활성화 확인 후 최종 테스트

## Vercel 환경변수
- ANTHROPIC_API_KEY: sk-ant-api03-mZa... (VIBE APP FACTORY 키)
- 위치: Vercel → vibe-app-factory → Settings → Environment Variables → Projects 탭

## 다음 세션 시작 프롬프트
```
D:\projects\vibe-app-factory\Keep_Going\LATEST.md 읽어줘.
미완료 항목 확인 후 이어서 작업해줘.
```
