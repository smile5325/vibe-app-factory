# VIBE APP FACTORY — LATEST
## 현재 버전: v1.4.2
- 최종 업데이트: 2026-04-22
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
- 현재 커밋: a0c7023
- 상태: 크레딧 활성화 대기 중

## XLSX 4탭 구조 (v1.4.0 MetaNomad 표준)
① 📋스토리요약 (테라코타 #C0392B)
② 📖전체스토리텔링대본 (올리브 #6B7A1E)
③ 🎬스토리보드 (딥네이비 #1A237E)
④ 📤Gmini프롬프트출력 (다크그린 #1B5E20)

## 주요 파일 위치
- exportXLSX: App.jsx L585~770
- parseVisualBlocks: App.jsx L320~357
- STEP4 프롬프트: App.jsx L247~265
- max_tokens: App.jsx L1206 (6000)

## 핵심 변경 이력 (최근 5건)
| 날짜 | 커밋 | 내용 |
|------|------|------|
| 2026-04-22 | 로컬 | 파일명 URL슬러그→영상제목, Sheet1 제목/주제 수정, 폴더중복 방지 |
| 2026-04-21 | a0c7023 | 저장 경로 캐시 완전 제거 - 일반모드 에러 수정 |
| 2026-04-21 | b2b3fbf | 스토리보드 썸네일 추가 + STEP4 씬잘림 방지 |
| 2026-04-21 | 25f25ed | XLSX 4탭 품질 개선 - SyncGap/NarrationENG/Gmini탭 |
| 2026-04-21 | 9b0770a | MetaNomad 4탭 XLSX 표준 + 5요소 이미지 프롬프트 통일 |

## 다음 세션 할 일
- [ ] 크레딧 활성화 확인 후 최종 테스트
- [ ] XLSX 4탭 검증 체크리스트 전체 확인
- [ ] MindLens git push origin main

## Vercel 환경변수
- ANTHROPIC_API_KEY: sk-ant-api03-mZa... (VIBE APP FACTORY 키)
- 위치: Vercel → vibe-app-factory → Settings → Environment Variables → Projects 탭

## 다음 세션 시작 프롬프트
```
D:\projects\vibe-app-factory\Keep_Going\LATEST.md 읽어줘.
미완료 항목 확인 후 이어서 작업해줘.
```
