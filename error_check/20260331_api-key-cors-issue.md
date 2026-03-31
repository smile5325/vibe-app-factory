# [vibe-app-factory] 브라우저 직접 Anthropic API 호출 (API키 노출·CORS)

- 날짜: 2026-03-31
- 파일: src/App.jsx : 361
- 상태: ✅ 해결

## 증상
- 원본 `vibe-app-factory.jsx`가 브라우저에서 `https://api.anthropic.com/v1/messages` 직접 호출
- API 키가 코드에 없어 인증 실패
- 브라우저 → Anthropic API 직접 호출 시 CORS 차단 가능

## 원인
```javascript
// 문제 코드 (원본)
const res = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: { "Content-Type": "application/json" }, // x-api-key 없음
  ...
});
```

## 수정
```javascript
// 수정 코드 (src/App.jsx)
const res = await fetch("/api/claude", {   // ✏️ 프록시 경유
  method: "POST",
  headers: { "Content-Type": "application/json" },
  ...
});
```

```javascript
// api/claude.js (신규 생성)
export default async function handler(req, res) {
  const apiKey = process.env.ANTHROPIC_API_KEY; // Vercel 환경변수
  const upstream = await fetch("https://api.anthropic.com/v1/messages", {
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      ...
    },
    body: JSON.stringify(req.body),
  });
  // SSE 스트림 그대로 전달
}
```

## 확인 방법
1. Vercel → Settings → Environment Variables → `ANTHROPIC_API_KEY` 등록
2. Redeploy 후 앱에서 주제 입력 → 7스텝 실행 → 결과 출력 확인
