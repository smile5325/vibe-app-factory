import { useState, useRef, useEffect } from "react";
import { generateImages, generateImagesByPath, checkBridgeHealth } from "./services/gemsApi.js";

const CATEGORIES = [
  { id: "finance",       label: "재테크·투자",   dot: "#7F77DD", hot: true,  persona: "재테크 전문가",     niches: ["주식·ETF", "부동산", "크립토·Web3", "경제 뉴스 해설", "부업·수익화", "세금·절세"] },
  { id: "tech",          label: "AI·테크",       dot: "#378ADD", hot: true,  persona: "AI 리서처",        niches: ["AI 툴 튜토리얼", "ChatGPT 활용", "자동화·워크플로우", "앱 리뷰·비교", "미래 기술 전망"] },
  { id: "business",      label: "비즈니스·창업", dot: "#1D9E75", hot: true,  persona: "비즈니스 전략가",   niches: ["스타트업 케이스", "마케팅 전략", "퍼스널 브랜딩", "전자상거래", "B2B SaaS"] },
  { id: "selfdev",       label: "자기계발",      dot: "#BA7517", hot: false, persona: "라이프스타일 코치",  niches: ["생산성·시간관리", "독서·지식", "습관 형성", "동기부여", "심리학·뇌과학"] },
  { id: "health",        label: "건강·웰니스",   dot: "#639922", hot: false, persona: "헬스 크리에이터",   niches: ["피트니스·운동", "멘탈 헬스", "시니어 건강", "영양·다이어트", "수면·회복"] },
  { id: "story",         label: "스토리텔링",    dot: "#D85A30", hot: true,  persona: "스토리텔러",        niches: ["감동 실화", "역사 내러티브", "범죄·심리 다큐", "철학 이야기", "관계·갈등"] },
  { id: "education",     label: "교육·지식",     dot: "#378ADD", hot: false, persona: "지식 크리에이터",   niches: ["언어 학습", "역사·세계사", "과학 해설", "자격증·시험", "어린이 교육"] },
  { id: "travel",        label: "여행·라이프",   dot: "#1D9E75", hot: false, persona: "글로벌 크리에이터",  niches: ["국내 여행", "해외 브이로그", "디지털 노마드", "푸드 투어", "은퇴 라이프"] },
  { id: "entertainment", label: "엔터·컬처",     dot: "#D4537E", hot: false, persona: "예능 크리에이터",   niches: ["K-POP·K-드라마", "영화·시리즈 해설", "스포츠 분석", "게임", "밈·팝컬처"] },
  { id: "other",         label: "기타",          dot: "#888780", hot: false, persona: "콘텐츠 크리에이터", niches: ["요리·레시피", "DIY·홈케어", "패션·뷰티", "반려동물", "ASMR·힐링"] },
];

// ✏️ 카테고리 → Whisk Downloads 저장 폴더 매핑
const CATEGORY_FOLDER_MAP = {
  finance:       'routine_money',
  tech:          'AI_silmuja',
  selfdev:       'silhaeng_note',
  health:        '100se_comfort',
  story:         'PhiloNomad',
  travel:        'MetaNomad',
  education:     'DocuNomad',
  business:      'LinkedM',
  entertainment: 'LinkedM',
  other:         'LinkedM',
};

const CATEGORY_NICHE_MAP = {
  finance:       ["주식·ETF", "부동산", "크립토·Web3", "경제 뉴스 해설", "부업·수익화"],
  tech:          ["AI 툴 튜토리얼", "ChatGPT 활용", "자동화·워크플로우", "앱 리뷰·비교"],
  business:      ["스타트업 케이스", "마케팅 전략", "퍼스널 브랜딩", "전자상거래"],
  selfdev:       ["생산성·시간관리", "독서·지식", "습관 형성", "동기부여", "심리학·뇌과학"],
  health:        ["피트니스·운동", "멘탈 헬스", "시니어 건강", "영양·다이어트"],
  story:         ["감동 실화", "역사 내러티브", "범죄·심리 다큐", "철학 이야기"],
  education:     ["언어 학습", "역사·세계사", "과학 해설", "자격증·시험", "어린이 교육"],
  travel:        ["국내 여행", "해외 브이로그", "디지털 노마드", "푸드 투어"],
  entertainment: ["K-POP·K-드라마", "영화·시리즈 해설", "스포츠 분석", "게임"],
  other:         ["요리·레시피", "DIY·홈케어", "패션·뷰티", "반려동물", "ASMR·힐링"],
};

const NICHE_FOLDER_OVERRIDE = {
  selfdev: {
    "심리학·뇌과학": "Mind-Lens",
  },
};

const TARGETS = ["전체", "2030 직장인", "4050 부모", "재테크 관심자", "취준·대학생", "5060 시니어", "업계 전문가", "글로벌 한인"]; // ✏️
const TONES = [
  { id: "calm", label: "차분·내레이션", emoji: "🌙" },
  { id: "passion", label: "열정·동기부여", emoji: "🔥" },
  { id: "fun", label: "유쾌·예능", emoji: "😄" },
  { id: "analytic", label: "지적·분석", emoji: "📊" },
];
const LENGTHS = [
  { id: "short",  label: "숏폼", sub: "~1분"  },
  { id: "mid",    label: "미드폼", sub: "~10분" },
  { id: "long30", label: "롱폼", sub: "~30분" },
  { id: "long60", label: "롱폼", sub: "~60분" },
];
const LANGS = ["한국어", "English", "한영 혼합"];

const STEPS = [
  { id: 1, emoji: "🔍", label: "역설계"     },
  { id: 2, emoji: "📋", label: "기획서"     },
  { id: 3, emoji: "🌋", label: "대본"       },
  { id: 4, emoji: "🎨", label: "비주얼"     },
  { id: 5, emoji: "🖼️", label: "썸네일"     },
  { id: 6, emoji: "📊", label: "SEO"        },
  { id: 7, emoji: "📱", label: "배포"       },
];

// ✏️ URL 역설계 — YouTube oEmbed 메타데이터 fetch (CORS-free)
async function fetchYouTubeMeta(url) {
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    const res = await fetch(oembedUrl);
    if (!res.ok) return null;
    const data = await res.json();
    return {
      title:  data.title       || "",
      author: data.author_name || "",
    };
  } catch {
    return null;
  }
}

async function autoMatchCategory(title, author) {
  const categoryList = CATEGORIES.map(c =>
    `- id: "${c.id}", label: "${c.label}", niches: ${JSON.stringify(CATEGORY_NICHE_MAP[c.id] || [])}`
  ).join('\n');

  const prompt = `다음 유튜브 영상의 제목과 채널명을 보고, 아래 카테고리 목록 중 가장 적합한 카테고리와 세부 니치를 판단해줘.

영상 제목: "${title}"
채널명: "${author}"

카테고리 목록:
${categoryList}

특별 규칙: "심리학" 또는 "뇌과학" 키워드가 포함되면
categoryId는 "selfdev", nicheName은 "심리학·뇌과학" 으로 반환할 것.

반드시 JSON만 반환. 다른 텍스트, 마크다운 없음:
{"categoryId": "finance", "nicheName": "크립토·Web3"}`;

  try {
    const res = await fetch("/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 100,
        stream: false,
        messages: [{ role: "user", content: prompt }]
      })
    });
    const data = await res.json();
    const text = data.content?.[0]?.text || "";
    const clean = text.replace(/```json|```/g, "").trim();
    console.log("autoMatch 결과:", clean);
    return JSON.parse(clean);
  } catch (e) {
    console.warn("autoMatchCategory 실패:", e);
    return null;
  }
}

function buildHarnessPrompt({ mode, category, topic, url, urlMeta, target, tone, length, lang }) { // ✏️ characterGender 제거
  const cat = CATEGORIES.find((c) => c.id === category) || CATEGORIES[0];
  const toneObj = TONES.find((t) => t.id === tone) || TONES[0];
  const lengthObj = LENGTHS.find((l) => l.id === length) || LENGTHS[0];
  // ✏️ URL 역설계 — oEmbed 메타데이터 프롬프트 주입
  const urlMetaStr = urlMeta
    ? `제목: ${urlMeta.title}\n채널: ${urlMeta.author}`
    : "(메타데이터 없음 — URL만 참고)";
  const inputContext = mode === "url"
    ? `### 분석 URL ###\n${url}\n\n### URL 영상 정보 (반드시 반영) ###\n${urlMetaStr}\n\n⚠️ 위 영상 제목과 주제를 대본/기획의 핵심 소재로 사용할 것.\n채널 카테고리 스타일로 재해석하되 원본 주제에서 벗어나지 말 것.`
    : `### 주제/키워드 ###\n${topic}`;
  // ✏️ 5요소 이미지 프롬프트 + MetaNomad 표준 비주얼 블록 규칙
  const autoVisualRules = `[비주얼 블록 생성 규칙]
각 씬마다 아래 필드를 정확히 출력할 것:

씬명: {소제목}
Stage: 기(Hook) / 승(Build-up) / 전(Climax) / 결(Outro) 중 하나
NarrationDuration: {해당 씬 나레이션 글자수 ÷ 5.8, 소수점 버림, 숫자만}
ImageCount: {NarrationDuration ÷ 10, 올림, 숫자만}
ImagePrompts_KOR: 컷1 [샷크기] {5요소} | 컷2 [샷크기] {5요소} ... (ImageCount만큼)
ImagePrompts_ENG: Cut1 [ShotSize] {5elements} | Cut2 [ShotSize] {5elements} ... (ImageCount만큼)
VideoPrompts_KOR: {영상 연출 지시문 한국어, slow camera pan 등 포함}
VideoPrompts_ENG: {video direction in English, include: slow camera pan, smooth tracking shot, 60fps, subtle movement}
SFX_KOR: {효과음/배경음 한국어 설명}
SFX_ENG: {sound effect/ambient description in English}
Narration_ENG: {English translation of the Korean narration, same emotional tone, natural flow, 2-3 sentences max per scene}

[이미지 프롬프트 5요소 구성 규칙]
1. 👤 피사체 및 행동: 주피사체/의상/행동(동사형)
2. 🌍 배경 및 환경: 장소/시간대·날씨/분위기
3. 🎥 카메라 구도: Wide·Medium·Close-up·Drone / 앵글 / 렌즈
4. 💡 조명 색감: Cinematic·Golden hour·Backlighting / 색온도
5. 🎨 스타일(고정): 8k, photorealistic, cinematic film still, shot on RED Digital Cinema

[Stage 판단 기준 — 전체 씬 수 기준]
- 앞 20%: 기(Hook)
- 20~60%: 승(Build-up)
- 60~85%: 전(Climax)
- 85~100%: 결(Outro)

[씬 완전 출력 필수 규칙]
모든 씬을 빠짐없이 출력할 것.
응답이 길어지더라도 마지막 씬까지 완전히 출력.
절대 중간에 생략하거나 요약하지 말 것.
"이하 생략", "..." 등의 표현 사용 금지.`;

  // ✏️ script_length_master — 영상 길이별 분량 타겟
  const scriptTarget = {
    short:  "200~250자 (공백제외)",
    mid:    "2300~2500자 (공백제외)",
    long30: "7000~7500자 (공백제외)",
    long60: "14000~15000자 (공백제외)"
  }[length];

  const scriptSection = {
    short:  "기(50자)+승(80자)+전(80자)+결(50자)",
    mid:    "기(240자)+승(840자)+전(840자)+결(480자)",
    long30: "기(700자)+승(2450자)+전(2450자)+결(1400자)",
    long60: "기(1400자)+승(4900자)+전(4900자)+결(2800자)"
  }[length];

  // ✏️ category_design_matcher — 카테고리별 비주얼 스타일
  const visualStyle = {
    finance:       "Dark navy + gold tone, data-driven authoritative style, premium financial setting",
    tech:          "Cyber blue + neon glow, holographic futuristic style, tech environment",
    business:      "Deep green + white, clean minimal professional style, modern workspace",
    selfdev:       "Warm orange + cream, motivational emotional warmth style, personal intimate moment",
    health:        "Sage green + white, natural light healing style, clean outdoor or gym setting",
    story:         "Terracotta + beige, cinematic narrative emotional style, dramatic light contrast",
    travel:        "Sky blue + sunset orange, dynamic vibrant energy style, iconic location",
    entertainment: "Hot pink + purple, pop art energetic style, bold vivid composition",
    education:     "Royal blue + yellow, clear structured approachable style, study setting",
    other:         "Neutral warm tones, lifestyle approachable style, natural everyday setting"
  }[category] || "Cinematic clean professional style";

  return `=== VIBE APP FACTORY — HARNESS ENGINE v2.0 ===

## [LAYER 1: PERSONA]
당신은 유튜브 ${cat.label} 분야 최고 전문가이자 ${cat.persona}입니다.
10년 이상 영상 콘텐츠 제작 경험. 알고리즘 최적화와 시청자 심리를 깊이 이해합니다.

## [LAYER 2: CONTEXT]
채널 카테고리: ${cat.label} | 타겟: ${target} | 톤: ${toneObj.emoji} ${toneObj.label}
영상 길이: ${lengthObj.label} (${lengthObj.sub}) | 언어: ${lang}

${inputContext}

## [LAYER 3: VARIABLES]
페르소나: ${cat.persona} | 타겟: ${target} | 스타일: ${toneObj.label} | 길이: ${lengthObj.sub}

## [LAYER 4: INSTRUCTIONS]
- 기승전결 구조 준수. 오프닝 훅 5초 안에 시청자 사로잡기
- 클로징 CTA 포함. 팩트 기반 서술. 출력 언어: ${lang}
- 각 섹션 구분자(---)로 분리. 아래 STEP별 출력 형식 정확히 준수

## [LAYER 5: 7-STEP PIPELINE]

### STEP 1 / 7 🔍 역설계
${mode === "url" ? `URL 콘텐츠를 분석하여:` : `주제 "${topic}"를 심층 분해하여:`}

후킹 방식: [오프닝 훅 전략]
영상 구조: [전체 구조 요약]
시각 연출: [비주얼 방향]
타겟 심리: [시청자 심리 분석]
벤치마킹: [차별화 포인트]

---

### STEP 2 / 7 📋 기획서

컨셉 한 줄: [한 문장 요약]
상세 설명: [2~3문장]
타겟 페르소나: [구체적 묘사]
차별화 전략: [경쟁 콘텐츠 대비]
비주얼 방향: [색상/스타일]
제목 안 A: [숫자/충격형]
제목 안 B: [감성/공감형]
제목 안 C: [전문성/권위형]

---

### STEP 3 / 7 🌋 대본

[대본 분량 필수 준수]
목표 글자수: ${scriptTarget} — 반드시 이 분량을 채울 것
기승전결 배분: ${scriptSection}
전개 순서: 훅 → 공감 → 팩트 → 스토리 → 인사이트 → 반전 → CTA
절대 짧게 쓰지 말 것. 분량 미달 시 내용을 더 구체적으로 확장할 것.
각 씬은 충분한 서술로 채울 것 (단문 나열 금지)

[ 원본 대본 ]
(${lengthObj.sub} 분량 전체 나레이션. [SCENE 01: 소제목] 형식으로 씬 구분. 씬 번호는 01부터 2자리 zero-padding. [침묵N초][CUT] 마커 포함. 오프닝 훅 + 클로징 CTA)

[ TTS 버전 (마커 제거) ]
(마커 없는 낭독용 버전)

---

### STEP 4 / 7 🎨 비주얼

[대사-이미지 연동 규칙]
위 STEP 3 대본의 각 씬 대사를 직접 읽고
해당 대사가 묘사하는 장면을 이미지 프롬프트로 시각화할 것.
대사에 등장하는 인물/장소/행동/감정을 그대로 이미지에 반영.
대사와 무관한 임의 장면 생성 금지.

[VISUAL STYLE — 전 씬 공통 적용]
COLOR & TONE: ${visualStyle}
규칙:
- 모든 씬의 영어 프롬프트 색상 톤과 스타일을 위 기준으로 통일
- 씬 전환 시에도 동일한 색감과 분위기 유지
- 조명/배경/색조가 씬마다 달라지면 안 됨

${autoVisualRules}

[이미지 수량 계산 규칙 — 의미 단위 Sync v2.0]
❌ 시간 기계 분할 금지 (5초/10초마다 1장 방식 사용 불가)
✅ 대사 의미 전환점 기준으로 청크 분할 후 이미지 1:1 매핑

분할 기준 (우선순위 순):
① 장면 전환 신호어: "그때","갑자기","그러나","한편","그 순간"
② 감정/분위기 전환: 긴장→이완, 정적→동적, 실내→실외
③ 행동 주체 전환: 화자 시점 변경
④ 길이 제약(보조): 최소 3초 / 최대 12초 — 위 기준 없을 때만 적용

감정 태그별 체류시간:
- 경이/풍경/탐색   → 7~10초
- 행동/이동/전환   → 3~5초
- 긴장/클라이맥스  → 5~8초
- 대화/감정교류    → 4~6초
- 정보열거/설명    → 4~7초

씬당 이미지 수: 2~5장 권장 (초과 금지)
Sync 검증: Σ체류시간 ≈ 나레이션 총 길이 ±1.5초

[앵글 시퀀스 규칙 — 권장이미지수 2장 이상 씬]
이미지 순번별 앵글: _01=wide establishing shot | _02=medium shot (waist up) | _03=close-up (face/hands/detail)
_04=over-the-shoulder shot | _05=low angle shot | _06=high angle shot | _07=extreme close-up
"same CHAR reference, same setting," 을 공통 앞에 붙임

씬별로 아래 형식으로 최소 5씬 이상 작성 (각 씬 사이 반드시 빈 줄 추가):

씬명: [씬 소제목]
Stage: [기(Hook) | 승(Build-up) | 전(Climax) | 결(Outro)]
타임스탬프: [0:00-0:15]
NarrationDuration: [숫자만, 소수점 버림]
ImageCount: [숫자만]
Grok 파일명: scene{씬번호(2자리)}_{씬키워드(영문)}
의미태그: [경이/풍경/탐색 | 행동/이동/전환 | 긴장/클라이맥스 | 대화/감정교류 | 정보열거/설명 중 택1]
체류시간(초): [숫자만]
ImagePrompts_KOR: 컷1 [샷크기] {5요소} | 컷2 [샷크기] {5요소} ...
ImagePrompts_ENG: Cut1 [ShotSize] {5elements} | Cut2 [ShotSize] {5elements} ...
VideoPrompts_KOR: [영상 연출 지시문 한국어]
VideoPrompts_ENG: [video direction in English]
SFX_KOR: [효과음/배경음 한국어]
SFX_ENG: [sound effect/ambient in English]
Narration_ENG: [English translation of the narration, same tone, 2-3 sentences]
영어 프롬프트: same character as CHAR reference, cinematic 16:9, [대표 이미지 프롬프트]
한국어 설명: [한국어 설명]
B-roll: [키워드1, 키워드2, 키워드3]
자막: [화면에 표시할 핵심 자막]

---

### STEP 5 / 7 🖼️ 썸네일
아래 형식으로 안 1, 안 2 각각 작성:

안: 1
컨셉: [한 줄 컨셉]
영어 프롬프트: [Grok/Gemini용 상세 영어 프롬프트, 16:9, high contrast, eye-catching, cinematic]
한국어 설명: [프롬프트 한국어 설명]
텍스트 오버레이: [썸네일에 들어갈 텍스트]
색상 조합: [색상 조합]

안: 2
컨셉: [한 줄 컨셉]
영어 프롬프트: [Grok/Gemini용 상세 영어 프롬프트, 16:9, high contrast, eye-catching, cinematic]
한국어 설명: [프롬프트 한국어 설명]
텍스트 오버레이: [썸네일에 들어갈 텍스트]
색상 조합: [색상 조합]

---

### STEP 6 / 7 📊 SEO

[ 제목 후보 ]
제목1: [제목] | 공식: [카피라이팅 공식]
제목2: [제목] | 공식: [카피라이팅 공식]
제목3: [제목] | 공식: [카피라이팅 공식]

[ 영상 설명문 ]
(이모지 포함 300자, 챕터 타임스탬프 포함)

[ 태그 ]
(쉼표 구분 20개)

[ 해시태그 ]
(#태그 형식 10개)

---

### STEP 7 / 7 📱 배포

[ 업로드 체크리스트 ]
(번호 매긴 10항목)

[ 커뮤니티 게시글 ]
(예고 게시글 초안)

[ 최적 업로드 시간 ]
${target} 기준 추천 요일/시간대

=== END OF HARNESS PROMPT ===`;
}

// ── 파싱 유틸 ────────────────────────────────────────────────────

function parseVisualBlocks(text) {
  const blocks = [];
  const lines = text.split("\n");
  let cur = null;
  for (const line of lines) {
    const t = line.trim();
    if (t.startsWith("씬명:")) {
      if (cur) blocks.push(cur);
      cur = {
        씬명: t.slice(3).trim(), 타임스탬프: "", 영어: "", 한국어: "", broll: "", 자막: "",
        grokFilename: "", 의미태그: "", imageCount: "", 체류시간: "",
        stage: "", narrationDuration: "", sfx_kor: "", sfx_eng: "",
        videoPrompt_kor: "", videoPrompt_eng: "", imagePrompts_kor: "", imagePrompts_eng: "",
        narration_eng: "",
      };
    } else if (cur) {
      if      (t.startsWith("타임스탬프:"))        cur.타임스탬프       = t.slice(5).trim();
      else if (t.startsWith("영어 프롬프트:"))      cur.영어             = t.slice(8).trim();
      else if (t.startsWith("한국어 설명:"))        cur.한국어           = t.slice(6).trim();
      else if (t.startsWith("B-roll:"))            cur.broll            = t.slice(6).trim();
      else if (t.startsWith("자막:"))              cur.자막             = t.slice(3).trim();
      else if (t.startsWith("Grok 파일명:"))       cur.grokFilename     = t.slice(8).trim();
      else if (t.startsWith("의미태그:"))           cur.의미태그         = t.slice(4).trim();
      else if (t.startsWith("권장이미지수:"))       cur.imageCount       = t.slice(7).trim();
      else if (t.startsWith("체류시간(초):"))       cur.체류시간         = t.slice(7).trim();
      else if (t.startsWith("Stage:"))             cur.stage            = t.slice(6).trim();
      else if (t.startsWith("NarrationDuration:")) cur.narrationDuration = t.slice(18).trim();
      else if (t.startsWith("ImageCount:"))        cur.imageCount       = t.slice(11).trim();
      else if (t.startsWith("ImagePrompts_KOR:"))  cur.imagePrompts_kor = t.slice(17).trim();
      else if (t.startsWith("ImagePrompts_ENG:"))  cur.imagePrompts_eng = t.slice(17).trim();
      else if (t.startsWith("VideoPrompts_KOR:"))  cur.videoPrompt_kor  = t.slice(17).trim();
      else if (t.startsWith("VideoPrompts_ENG:"))  cur.videoPrompt_eng  = t.slice(17).trim();
      else if (t.startsWith("SFX_KOR:"))           cur.sfx_kor          = t.slice(8).trim();
      else if (t.startsWith("SFX_ENG:"))           cur.sfx_eng          = t.slice(8).trim();
      else if (t.startsWith("Narration_ENG:"))     cur.narration_eng    = t.slice(14).trim();
    }
  }
  if (cur) blocks.push(cur);
  console.log("[parseVisualBlocks]", blocks);
  return blocks;
}

function parseThumbnailBlocks(text) {
  const blocks = [];
  const lines = text.split("\n");
  let cur = null;
  for (const line of lines) {
    const t = line.trim();
    if (t.startsWith("안:")) {
      if (cur) blocks.push(cur);
      cur = { 안: t.slice(2).trim(), 컨셉: "", 영어: "", 한국어: "", 텍스트: "", 색상: "" };
    } else if (cur) {
      if (t.startsWith("컨셉:"))         cur.컨셉  = t.slice(3).trim();
      else if (t.startsWith("영어 프롬프트:")) cur.영어  = t.slice(8).trim();
      else if (t.startsWith("한국어 설명:"))  cur.한국어 = t.slice(6).trim();
      else if (t.startsWith("텍스트 오버레이:")) cur.텍스트 = t.slice(8).trim();
      else if (t.startsWith("색상 조합:"))    cur.색상  = t.slice(5).trim();
    }
  }
  if (cur) blocks.push(cur);
  return blocks;
}

// ── 테이블 공통 스타일 ───────────────────────────────────────────

const s = {
  th: (w) => ({
    padding: "8px 10px", textAlign: "left", fontSize: 10, fontWeight: 600,
    color: "#8878b0", borderBottom: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(120,80,255,0.08)", width: w, whiteSpace: "nowrap",
  }),
  td: { padding: "9px 10px", fontSize: 11, color: "#c0b8d8", lineHeight: 1.7, verticalAlign: "top" },
  gapRow: { height: 10, background: "transparent" },
};

function VisualTable({ content }) {
  const blocks = parseVisualBlocks(content);
  if (!blocks.length) return <Raw text={content} />;
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["씬 (10%)", "타임스탬프 (8%)", "영어 프롬프트 (24%)", "한국어 설명 (18%)", "B-roll (14%)", "자막 (26%)"].map((h) => {
              const [label, w] = h.split(" (");
              return <th key={label} style={s.th(w?.replace(")", ""))}>{label}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {blocks.map((b, i) => [
            <tr key={`r${i}`} style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent" }}>
              <td style={s.td}>
                <span style={{ color: "#c4a8ff", fontWeight: 600 }}>{b.씬명}</span>
                {b.의미태그 && (
                  <div style={{
                    display: "inline-flex", marginTop: 4,
                    padding: "2px 7px", borderRadius: 10, fontSize: 9, fontWeight: 600,
                    background: "rgba(120,80,255,0.15)", color: "#c4a8ff",
                    border: "1px solid rgba(120,80,255,0.3)",
                  }}>
                    {b.의미태그}{b.체류시간 ? ` | ⏱ ${b.체류시간}` : ""}{b.imageCount ? ` | 🖼️ ${b.imageCount}` : ""}
                  </div>
                )}
              </td>
              <td style={s.td}><span style={{ color: "#ffd060", fontFamily: "monospace", fontSize: 10 }}>{b.타임스탬프}</span></td>
              <td style={{ ...s.td, fontFamily: "monospace", fontSize: 10 }}>{b.영어}</td>
              <td style={s.td}>{b.한국어}</td>
              <td style={{ ...s.td, color: "#80c8a0", fontSize: 10 }}>{b.broll}</td>
              <td style={{ ...s.td, fontWeight: 600, color: "#e8e0f8" }}>{b.자막}</td>
            </tr>,
            <tr key={`g${i}`}><td colSpan={6} style={s.gapRow} /></tr>,
          ])}
        </tbody>
      </table>
    </div>
  );
}

function ThumbnailTable({ content }) {
  const blocks = parseThumbnailBlocks(content);
  if (!blocks.length) return <Raw text={content} />;
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["안 (4%)", "컨셉 (14%)", "영어 프롬프트 (26%)", "한국어 설명 (18%)", "텍스트 오버레이 (20%)", "색상 조합 (18%)"].map((h) => {
              const [label, w] = h.split(" (");
              return <th key={label} style={s.th(w?.replace(")", ""))}>{label}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {blocks.map((b, i) => [
            <tr key={`r${i}`} style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent" }}>
              <td style={s.td}><span style={{ color: "#ffd060", fontWeight: 700, fontSize: 13 }}>{b.안}</span></td>
              <td style={s.td}>{b.컨셉}</td>
              <td style={{ ...s.td, fontFamily: "monospace", fontSize: 10 }}>{b.영어}</td>
              <td style={s.td}>{b.한국어}</td>
              <td style={{ ...s.td, color: "#c4a8ff", fontWeight: 600 }}>{b.텍스트}</td>
              <td style={{ ...s.td, color: "#60e090", fontSize: 10 }}>{b.색상}</td>
            </tr>,
            <tr key={`g${i}`}><td colSpan={6} style={s.gapRow} /></tr>,
          ])}
        </tbody>
      </table>
    </div>
  );
}

function Raw({ text }) {
  return (
    <pre style={{ fontSize: 12, color: "#b0a8c8", whiteSpace: "pre-wrap", lineHeight: 1.9, margin: 0, maxHeight: 360, overflowY: "auto" }}>
      {text}
    </pre>
  );
}

// ✏️ TTS .txt 다운로드 유틸
function extractTTSText(scriptContent) {
  const marker = "[ TTS 버전 (마커 제거) ]";
  const idx = scriptContent.indexOf(marker);
  if (idx === -1) return scriptContent;
  return scriptContent.slice(idx + marker.length).trim();
}

function downloadTTSTxt(content, category, topic) {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const topicSlug = topic.slice(0, 10).replace(/\s/g, "_");
  const filename = `${category}_${topicSlug}_${date}_TTS.txt`;
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

// ✏️ 전체 TXT 저장 — 평문 포맷 (JSON 없음, TTS 사용 가능)
function buildPlainText(allOutput, config) {
  const { category, topic, url, target, tone, length, lang } = config;
  const cat       = CATEGORIES.find((c) => c.id === category) || {};
  const toneObj   = TONES.find((t) => t.id === tone) || {};
  const lengthObj = LENGTHS.find((l) => l.id === length) || {};
  const date      = new Date().toLocaleDateString("ko-KR");
  const sep       = "=================================";
  const lines     = [];

  lines.push(sep);
  lines.push("[Vibe App Factory 전체 대본]");
  lines.push(`생성일: ${date}`);
  lines.push(`채널 카테고리: ${cat.label || category}`);
  lines.push(`주제: ${topic || url || ""}`);
  lines.push(`타겟: ${target}`);
  lines.push(`톤/스타일: ${toneObj.emoji || ""} ${toneObj.label || tone}`);
  lines.push(`영상 길이: ${lengthObj.label || ""} (${lengthObj.sub || length})`);
  lines.push(`언어: ${lang}`);
  lines.push(sep);
  lines.push("");

  allOutput.forEach(({ step, content }) => {
    lines.push(`[ STEP ${step.id} / 7  ${step.emoji} ${step.label} ]`);
    lines.push(content || "");
    lines.push("");
    lines.push("---");
    lines.push("");
  });

  lines.push(sep);
  lines.push("[END]");
  lines.push(sep);
  return lines.join("\n");
}

function downloadAllTxt(allOutput, config) {
  const date     = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const topicSlug = (config.topic || "content").slice(0, 15).replace(/\s/g, "_");
  const filename = `vibeapp_대본_${date}.txt`;
  const text     = buildPlainText(allOutput, config);
  const blob     = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url      = URL.createObjectURL(blob);
  const a        = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

// ✏️ 씬 키워드 배치 생성 — Claude API 호출 (영문 2~3단어)
async function generateSceneKeywords(blocks) {
  if (!blocks.length) return {};
  const sceneList = blocks
    .map((b, i) => `${i + 1}. 씬명: ${b.씬명 || ""} | 내용: ${(b.한국어 || b.영어 || "").slice(0, 60)}`)
    .join("\n");
  const prompt = `다음 씬 목록 각각의 핵심을 영어 키워드 2~3단어로 표현하세요.\n${sceneList}\n\n규칙:\n- 영문+숫자만, 단어 사이 언더바(_), 최대 30자\n- JSON 배열로만 응답: [{"index":1,"keyword":"Hook_Smartphone"},...]`;
  try {
    const res = await fetch("/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-haiku-4-20250514",
        max_tokens: 400,
        stream: false,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await res.json();
    const text = data.content?.[0]?.text || "";
    const match = text.match(/\[[\s\S]*?\]/);
    if (!match) return {};
    const arr = JSON.parse(match[0]);
    return Object.fromEntries(arr.map(item => [String(item.index), item.keyword]));
  } catch {
    return {}; // 실패 시 기존 방식 유지
  }
}

// ✏️ XLSX 저장 — MetaNomad 4탭 표준
async function loadXLSX() {
  if (window.XLSX) return window.XLSX;
  return new Promise((resolve, reject) => {
    const sc = document.createElement("script");
    sc.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
    sc.onload = () => resolve(window.XLSX);
    sc.onerror = reject;
    document.head.appendChild(sc);
  });
}

// ✏️ STEP 3 대본에서 씬별 나레이션 추출 — [SCENE XX: ...] 구분자 기준
function parseNarrationByScene(step3Content) {
  const map = {};
  const rawMatch = step3Content.match(/\[\s*원본\s*대본\s*\]([\s\S]*?)(?:\[\s*TTS|$)/i);
  const raw = rawMatch ? rawMatch[1] : step3Content;
  const regex = /\[SCENE\s*(\d+)[^\]]*\]([\s\S]*?)(?=\[SCENE|\[TTS|$)/g;
  let m;
  while ((m = regex.exec(raw)) !== null) {
    const num = m[1].padStart(2, "0");
    map[num] = m[2].replace(/\[침묵\d+초\]|\[CUT\]/g, "").trim();
  }
  return map;
}

async function exportXLSX(allOutput, config) {
  const XLSX = await loadXLSX();
  const { category, topic, url, urlMeta, target, tone, length, mode, lang } = config;
  const cat       = CATEGORIES.find((c) => c.id === category) || {};
  const toneObj   = TONES.find((t) => t.id === tone) || {};
  const lengthObj = LENGTHS.find((l) => l.id === length) || {};
  // ✏️ URL 역설계 시 영상 제목 사용, 일반 모드는 topic 사용
  const titleForFile = (mode === "url" && urlMeta?.title) ? urlMeta.title : (topic || url || "output");
  const topicSlug = titleForFile.slice(0, 40).replace(/[/\\:*?"<>|]/g, "_").replace(/\s+/g, "_");
  const date      = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const fileName  = `vibeapp_${topicSlug}_${date}.xlsx`;
  const wb        = XLSX.utils.book_new();

  const visualStep4 = allOutput.find(o => o.step.id === 4);
  const allVisualBlocks = visualStep4 ? parseVisualBlocks(visualStep4.content) : [];
  await generateSceneKeywords(allVisualBlocks);

  const scriptStep3 = allOutput.find(o => o.step.id === 3);
  const step3Content = scriptStep3?.content || "";
  const narrationMap = parseNarrationByScene(step3Content);

  const cleanLine = (line) =>
    line.replace(/^#{1,3}\s*/g, "").replace(/\*\*/g, "").replace(/`/g, "").trimEnd();

  // ─── 공통 스타일 헬퍼 ────────────────────────────────────────
  const STAGE_COLORS  = { "기": "FFF3E0", "Hook": "FFF3E0", "승": "E8F5E9", "Build": "E8F5E9", "전": "E3F2FD", "Climax": "E3F2FD", "결": "F3E5F5", "Outro": "F3E5F5" };
  const STAGE_DARK    = { "기": "FFD699", "Hook": "FFD699", "승": "A8D5B5", "Build": "A8D5B5", "전": "90B8E8", "Climax": "90B8E8", "결": "D5A8E0", "Outro": "D5A8E0" };
  const getStageColor = (stage = "", dark = false) => {
    const map = dark ? STAGE_DARK : STAGE_COLORS;
    for (const [key, color] of Object.entries(map)) { if (stage.includes(key)) return color; }
    return dark ? "CCCCCC" : "FFFFFF";
  };
  const mgs = (rgb, bold = false) => ({ fill: { fgColor: { rgb } }, font: { name: "Malgun Gothic", bold } });

  // ─── 공통 데이터 준비 ─────────────────────────────────────────
  // 4-A: NarrationDuration → 글자수 기반 재계산 (API 값 무시)
  const getNarDur = (narKor) => {
    const chars = (narKor || "").replace(/\s/g, "").length;
    return chars > 0 ? Math.floor(chars / 5.8) : 10;
  };

  // 기승전결 그룹 빌드
  const stageGroups = { 기: [], 승: [], 전: [], 결: [] };
  allVisualBlocks.forEach((b, i) => {
    const pad    = String(i + 1).padStart(2, "0");
    const narKor = narrationMap[pad] || b.한국어 || "";
    const entry  = { ...b, sceneNum: pad, narKor, sceneIdx: i };
    const s = b.stage || "";
    if      (s.includes("기") || s.includes("Hook"))   stageGroups.기.push(entry);
    else if (s.includes("승") || s.includes("Build"))  stageGroups.승.push(entry);
    else if (s.includes("전") || s.includes("Climax")) stageGroups.전.push(entry);
    else if (s.includes("결") || s.includes("Outro"))  stageGroups.결.push(entry);
    else stageGroups.기.push(entry); // fallback
  });

  // STEP1에서 영상 스타일/나레이션 형식 추출 (없으면 기본값)
  const step1Content = allOutput.find(o => o.step.id === 1)?.content || "";
  const visualStyleStr  = (step1Content.match(/시각\s*연출[:\s]+([^\n]+)/) || [])[1]?.trim() || "Cinematic Documentary";
  const narrFormatStr   = (step1Content.match(/나레이션\s*형식[:\s]+([^\n]+)/) || [])[1]?.trim() || "1인칭 나레이션";

  // 총 예상 시간 (4-A 기준)
  const totalDurSec = allVisualBlocks.reduce((sum, b, i) => {
    const pad    = String(i + 1).padStart(2, "0");
    const narKor = narrationMap[pad] || b.한국어 || "";
    return sum + getNarDur(narKor);
  }, 0);
  const totalMins = Math.floor(totalDurSec / 60);
  const totalSecs = totalDurSec % 60;

  // 첫 2문장 (DAILY 요약)
  const firstNar       = Object.values(narrationMap)[0] || allVisualBlocks[0]?.한국어 || "";
  const dailySummary   = firstNar.split(/(?<=[.!?])\s+/).slice(0, 2).join(" ") || firstNar.slice(0, 80);

  // 각 stage 첫 씬 나레이션 1문장
  const stageSummary = {};
  ["기", "승", "전", "결"].forEach(stg => {
    const e = stageGroups[stg][0];
    if (e) stageSummary[stg] = (e.narKor.split(/(?<=[.!?])\s+/)[0] || e.narKor.slice(0, 60)).trim();
    else   stageSummary[stg] = "";
  });

  const STAGE_ORDER = [
    { key: "기", label: "기 (Hook)" },
    { key: "승", label: "승 (Build-up)" },
    { key: "전", label: "전 (Climax)" },
    { key: "결", label: "결 (Outro)" },
  ];

  // ─── Tab 1: 📋스토리요약 ─────────────────────────────────────
  const ws1Rows = [];
  // ✏️ URL 역설계 시 영상 제목 사용
  const videoTitle = (mode === "url" && urlMeta?.title) ? urlMeta.title : (topic || url || "콘텐츠");
  const titleStr = `📺 ${videoTitle} — 스토리텔링 대본 요약`;

  // 섹션 A
  ws1Rows.push([titleStr]);
  ws1Rows.push([""]);

  // 섹션 B
  ws1Rows.push(["■ 프로젝트 요약"]);
  ws1Rows.push([`주제: ${videoTitle}`]);
  if (mode === "url" && url) ws1Rows.push([`원본 URL: ${url}`]);
  ws1Rows.push([`총 씬 수: ${allVisualBlocks.length}개`]);
  ws1Rows.push([`예상 러닝타임: 약 ${totalMins}분 ${totalSecs}초`]);
  ws1Rows.push([`스토리 구조: 기(Hook) → 승(Build-up) → 전(Climax) → 결(Outro)`]);
  ws1Rows.push([`나레이션 형식: ${narrFormatStr}`]);
  ws1Rows.push([`영상 스타일: ${visualStyleStr}`]);
  ws1Rows.push([""]);

  // 섹션 C
  ws1Rows.push(["■ 전체 스토리 임팩트 요약"]);
  ws1Rows.push([`[DAILY]: ${dailySummary}`]);
  ws1Rows.push([`기(Hook): ${stageSummary.기}`]);
  ws1Rows.push([`승(Build-up): ${stageSummary.승}`]);
  ws1Rows.push([`전(Climax): ${stageSummary.전}`]);
  ws1Rows.push([`결(Outro): ${stageSummary.결}`]);
  ws1Rows.push([""]);

  // 섹션 D — 기승전결 씬별 요약 테이블
  ws1Rows.push(["■ 기승전결 씬별 요약"]);
  const tblHeaderRow = ws1Rows.length;
  ws1Rows.push(["씬", "Stage", "장소", "나레이션 요약"]);
  // 섹션 헤더행 row index 기록용
  const sectionHeaderRows = [];
  const stageDataRows = {}; // stage → [rowIdx, ...]

  STAGE_ORDER.forEach(({ key, label }) => {
    const scenes = stageGroups[key];
    if (!scenes.length) return;
    const secIdx = ws1Rows.length;
    sectionHeaderRows.push({ rowIdx: secIdx, key });
    ws1Rows.push([`${label} — ${scenes[0].씬명}`, "", "", ""]);
    stageDataRows[key] = [];
    scenes.forEach(e => {
      const narSum = (e.narKor.split(/(?<=[.!?])\s+/)[0] || e.narKor.slice(0, 70)).trim();
      stageDataRows[key].push(ws1Rows.length);
      ws1Rows.push([e.sceneNum, e.stage || key, `[SCENE ${e.sceneNum}: ${e.씬명}]`, narSum]);
    });
  });

  const ws1 = XLSX.utils.aoa_to_sheet(ws1Rows);
  ws1["!cols"] = [{ wch: 8 }, { wch: 14 }, { wch: 28 }, { wch: 70 }];
  // A1 타이틀 스타일
  if (ws1["A1"]) ws1["A1"].s = mgs("C0392B", true);
  // 섹션 헤더행 스타일 (어두운 색)
  sectionHeaderRows.forEach(({ rowIdx, key }) => {
    ["A","B","C","D"].forEach(col => {
      const ref = `${col}${rowIdx + 1}`;
      if (ws1[ref]) ws1[ref].s = mgs(getStageColor(key, true), true);
      else ws1[ref] = { v: "", t: "s", s: mgs(getStageColor(key, true), true) };
    });
  });
  // 데이터 행 스타일
  Object.entries(stageDataRows).forEach(([key, rowIdxArr]) => {
    rowIdxArr.forEach(rowIdx => {
      ["A","B","C","D"].forEach(col => {
        const ref = `${col}${rowIdx + 1}`;
        if (ws1[ref]) ws1[ref].s = mgs(getStageColor(key), false);
      });
    });
  });
  XLSX.utils.book_append_sheet(wb, ws1, "📋스토리요약");

  // ─── Tab 2: 📖전체스토리텔링대본 ────────────────────────────
  const ws2Rows = [];
  ws2Rows.push([`📖 ${topic || url || "콘텐츠"} — 전체 스토리텔링 대본`]);
  ws2Rows.push([""]);

  const ws2StageRows = {}; // stage → [rowIdx, ...]
  STAGE_ORDER.forEach(({ key, label }) => {
    const scenes = stageGroups[key];
    if (!scenes.length) return;
    const hdrIdx = ws2Rows.length;
    if (!ws2StageRows[key]) ws2StageRows[key] = { header: hdrIdx, scenes: [] };
    ws2Rows.push([`🎯 ${label} — ${scenes[0].씬명}`]);
    ws2Rows.push([""]);
    scenes.forEach(e => {
      const sceneHdrIdx = ws2Rows.length;
      ws2StageRows[key].scenes.push({ sceneHdr: sceneHdrIdx, narIdx: sceneHdrIdx + 1 });
      ws2Rows.push([`  ♟ ${e.씬명}`]);
      ws2Rows.push([`  ${e.narKor}`]);
      ws2Rows.push([""]);
    });
  });

  const ws2 = XLSX.utils.aoa_to_sheet(ws2Rows);
  ws2["!cols"] = [{ wch: 110 }];
  if (ws2["A1"]) ws2["A1"].s = mgs("6B7A1E", true);
  // 행 색상 적용
  Object.entries(ws2StageRows).forEach(([key, { header, scenes: sArr }]) => {
    const dark  = mgs(getStageColor(key, true), true);
    const light = mgs(getStageColor(key), false);
    const bold  = mgs(getStageColor(key), true);
    const ref = (r) => `A${r + 1}`;
    if (ws2[ref(header)]) ws2[ref(header)].s = dark;
    sArr.forEach(({ sceneHdr, narIdx }) => {
      if (ws2[ref(sceneHdr)]) ws2[ref(sceneHdr)].s = bold;
      if (ws2[ref(narIdx)])   ws2[ref(narIdx)].s   = light;
    });
  });
  XLSX.utils.book_append_sheet(wb, ws2, "📖전체스토리텔링대본");

  // ─── Tab 3: 🎬스토리보드 ────────────────────────────────────
  // STEP5 썸네일 "안: 1" 추출
  const thumbStep5 = allOutput.find(o => o.step.id === 5);
  const thumbBlocks = thumbStep5 ? parseThumbnailBlocks(thumbStep5.content) : [];
  const thumb1 = thumbBlocks.find(b => b.안 === "1") || thumbBlocks[0] || {};
  const thumbKor = thumb1.한국어 || "";
  const thumbEng = thumb1.영어  || "";

  const sbColCount = 15;
  const blank15 = () => Array(sbColCount).fill(null);
  const sbTitleStr = `📺 ${topic || url || "콘텐츠"} — 스토리보드`;

  // 상단 6행
  const sbTopRows = [
    [sbTitleStr, ...Array(sbColCount - 1).fill(null)],  // 행1: 제목 병합
    blank15(),                                            // 행2: 빈행
    ["■ 썸네일 프롬프트", ...Array(sbColCount - 1).fill(null)], // 행3
    ["KOR", thumbKor, ...Array(sbColCount - 2).fill(null)],     // 행4
    ["ENG", thumbEng, ...Array(sbColCount - 2).fill(null)],     // 행5
    blank15(),                                            // 행6: 빈행
  ];
  const SB_TOP = sbTopRows.length; // 6

  const sbHeader = [
    "#", "Stage", "Place",
    "NarrationDuration (sec)", "ImageCount", "ImageCover (sec)", "SyncGap (sec)",
    "Narration (KOR)", "Narration (ENG)",
    "SFX (KOR)", "SFX (ENG)",
    "ImagePrompts (KOR)", "ImagePrompts (ENG)",
    "VideoPrompts (KOR)", "VideoPrompts (ENG)",
  ];
  const sbRows = allVisualBlocks.map((b, i) => {
    const pad     = String(i + 1).padStart(2, "0");
    const place   = `[SCENE ${pad}: ${b.씬명}]`;
    const narKor  = narrationMap[pad] || b.한국어 || "";
    const narDur  = getNarDur(narKor);
    const imgCnt  = Math.ceil(narDur / 10);
    const imgCov  = imgCnt * 10;
    const syncGap = imgCov - narDur;
    return [
      i + 1, b.stage || "", place,
      narDur, imgCnt, imgCov, syncGap,
      narKor, b.narration_eng || "",
      b.sfx_kor || "", b.sfx_eng || "",
      b.imagePrompts_kor || "", b.imagePrompts_eng || b.영어 || "",
      b.videoPrompt_kor || "", b.videoPrompt_eng || "",
    ];
  });
  const ws3Data = [...sbTopRows, sbHeader, ...sbRows];
  const ws3 = XLSX.utils.aoa_to_sheet(ws3Data);
  // 제목행 병합 (행1: A1~O1)
  ws3["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: sbColCount - 1 } }];
  // 상단 행 스타일
  if (ws3["A1"]) ws3["A1"].s = mgs("1A237E", true);
  const a3ref = XLSX.utils.encode_cell({ r: 2, c: 0 });
  if (ws3[a3ref]) ws3[a3ref].s = mgs("D0D8F8", true);
  // 데이터 행 스타일 (SB_TOP + 1 = sbHeader, SB_TOP + 1 + i = data)
  sbRows.forEach((row, i) => {
    const rowIdx     = SB_TOP + 1 + i;
    const stageColor = getStageColor(allVisualBlocks[i]?.stage || "");
    row.forEach((_, colIdx) => {
      const ref = XLSX.utils.encode_cell({ r: rowIdx, c: colIdx });
      if (!ws3[ref]) return;
      if (colIdx === 6 && Math.abs(parseFloat(ws3[ref].v) || 0) > 5) {
        ws3[ref].s = mgs("FF0000");
      } else {
        ws3[ref].s = mgs(stageColor);
      }
    });
  });
  ws3["!cols"] = [
    { wch: 4 }, { wch: 13 }, { wch: 22 },
    { wch: 20 }, { wch: 11 }, { wch: 13 }, { wch: 12 },
    { wch: 44 }, { wch: 44 },
    { wch: 26 }, { wch: 26 },
    { wch: 54 }, { wch: 54 },
    { wch: 32 }, { wch: 32 },
  ];
  XLSX.utils.book_append_sheet(wb, ws3, "🎬스토리보드");

  // ─── Tab 4: 📤Gmini프롬프트출력 (1컷 1행) ──────────────────
  const gminiHeader = ["#", "씬번호", "씬명", "컷번호", "ImagePrompts (ENG)", "Grok 파일명"];
  const gminiRows = [];
  let cutRowNum = 1;
  allVisualBlocks.forEach((b, i) => {
    const pad        = String(i + 1).padStart(2, "0");
    const sceneName  = `[SCENE ${pad}: ${b.씬명}]`;
    const rawPrompts = b.imagePrompts_eng || b.영어 || "";
    // " | " 또는 "|" 기준 컷 분리
    const cuts = rawPrompts.split(/\s*\|\s*/).filter(c => c.trim());
    if (!cuts.length) cuts.push(rawPrompts);
    cuts.forEach((cut, ci) => {
      const cutLabel = `Cut${ci + 1}`;
      const grokName = `${b.grokFilename || `scene${pad}`}_cut${ci + 1}`;
      gminiRows.push([cutRowNum++, pad, sceneName, cutLabel, cut.trim(), grokName]);
    });
    gminiRows.push([null, null, null, null, null, null]); // 씬 간 빈행
  });
  const ws4Data = [gminiHeader, ...gminiRows];
  const ws4 = XLSX.utils.aoa_to_sheet(ws4Data);
  ws4["!cols"] = [{ wch: 5 }, { wch: 8 }, { wch: 22 }, { wch: 8 }, { wch: 70 }, { wch: 28 }];
  if (ws4["A1"]) ws4["A1"].s = mgs("1B5E20", true);
  XLSX.utils.book_append_sheet(wb, ws4, "📤Gmini프롬프트출력");

  // 탭 색상 설정
  wb.Workbook = {
    Sheets: [
      { name: "📋스토리요약",          TabColor: { rgb: "C0392B" } },
      { name: "📖전체스토리텔링대본",   TabColor: { rgb: "6B7A1E" } },
      { name: "🎬스토리보드",           TabColor: { rgb: "1A237E" } },
      { name: "📤Gmini프롬프트출력",    TabColor: { rgb: "1B5E20" } },
    ],
  };

  const buffer = XLSX.write(wb, { type: "array", bookType: "xlsx", cellStyles: true });
  return { buffer, fileName };
}

// ✏️ 전체 저장 — 루트(Whisk Downloads) 1회 선택 → 카테고리+날짜 서브폴더 자동 생성
// 저장 루트: D:\projects\PROJECT_mp4\Whisk Downloads\
let _whiskRootHandle = null; // 세션 내 루트 핸들 캐시 (카테고리 무관 공유)

async function saveAllFiles(allOutput, config, setSaveMsg) {
  const { category, topic, url, urlMeta, mode } = config;
  // ✏️ category 유실 방어 — undefined/null이면 CATEGORY_FOLDER_MAP 조회 스킵하고 LinkedM 폴백
  const safeCategory   = category || "";
  const _nicheOverride = NICHE_FOLDER_OVERRIDE[safeCategory]?.[config.selectedNiche];
  const categoryFolder = _nicheOverride ?? (CATEGORY_FOLDER_MAP[safeCategory] || 'LinkedM');
  const date           = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  // ✏️ URL 역설계 시 영상 제목 사용
  const titleForFile   = (mode === "url" && urlMeta?.title) ? urlMeta.title : (topic || url || "output");
  const topicSlug      = titleForFile.slice(0, 30).replace(/[/\\:*?"<>|]/g, "_").replace(/\s+/g, "_");
  const subFolder      = `${date}_${topicSlug}`;
  console.log('[SAVE] category:', safeCategory, '→ folder:', categoryFolder);
  // ✏️ 고정 루트 경로 — 성공 메시지에 표시할 전체 경로
  const WHISK_ROOT  = `D:\\projects\\PROJECT_mp4\\Whisk Downloads`;
  const fullSavePath = `${WHISK_ROOT}\\${categoryFolder}\\${subFolder}`;

  setSaveMsg("⏳ XLSX 생성 중 (씬 키워드 자동 생성)...");
  try {
    // ① XLSX blob 생성
    const { buffer, fileName } = await exportXLSX(allOutput, config);
    const xlsxBlob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const txtName  = `vibeapp_대본_${topicSlug}_${date}.txt`; // ✏️ 영상 제목 기반
    const ttsName  = `vibeapp_TTS_${topicSlug}_${date}.txt`; // ✏️ 영상 제목 기반

    // ② 대본 TXT
    const 대본Text = buildPlainText(allOutput, config);

    // ③ TTS TXT
    const scriptOutput = allOutput.find(o => o.step.id === 3);
    const ttsText = scriptOutput ? extractTTSText(scriptOutput.content) : "";

    if ('showDirectoryPicker' in window) {
      // ✏️ 루트 핸들 재사용 or 신규 선택
      let rootHandle = _whiskRootHandle;
      if (rootHandle) {
        try {
          const p = await rootHandle.queryPermission({ mode: 'readwrite' });
          if (p !== 'granted') {
            const r = await rootHandle.requestPermission({ mode: 'readwrite' });
            if (r !== 'granted') rootHandle = null;
          }
          // ✏️ 잘못된 폴더(예: 카테고리 하위폴더) 선택 방어 — Whisk Downloads가 아니면 재선택
          if (rootHandle && rootHandle.name !== "Whisk Downloads") rootHandle = null;
        } catch { rootHandle = null; }
      }
      if (!rootHandle) {
        // ✏️ 루트 폴더 선택 가이드 — Whisk Downloads 폴더 선택 요청
        setSaveMsg(`📂 폴더 선택창이 열립니다.\n아래 경로의 "Whisk Downloads" 폴더를 선택해주세요:\n${WHISK_ROOT}`);
        await new Promise(r => setTimeout(r, 400)); // React 렌더 대기
        rootHandle = await window.showDirectoryPicker({ mode: 'readwrite' });
        _whiskRootHandle = rootHandle;
      }

      setSaveMsg(`⏳ 저장 중...\n${fullSavePath}`);

      // ✏️ 카테고리 서브폴더 자동 생성 (예: PhiloNomad\)
      const catDir = await rootHandle.getDirectoryHandle(categoryFolder, { create: true });
      // ✏️ 날짜_주제 서브폴더 자동 생성
      const subDir = await catDir.getDirectoryHandle(subFolder, { create: true });

      // 🗂️ 이미지 + 썸네일 폴더 자동 생성
      const SUB_FOLDERS = ['이미지', '썸네일'];
      for (const subName of SUB_FOLDERS) {
        try {
          const createdHandle = await subDir.getDirectoryHandle(subName, { create: true });
          console.log(`✅ 폴더 핸들 획득 성공: ${subName}`, createdHandle);
        } catch (e) {
          console.error(`❌ 폴더 생성 실패: ${subName}`, e.name, e.message);
        }
      }
      console.log('📁 서브폴더 생성 루프 완료');

      // ✏️ 파일 3개 저장
      const write = async (name, blob) => {
        const fh = await subDir.getFileHandle(name, { create: true });
        const w  = await fh.createWritable();
        await w.write(blob); await w.close();
      };
      await write(fileName, xlsxBlob);
      await write(txtName,  new Blob([대본Text], { type: "text/plain;charset=utf-8" }));
      await write(ttsName,  new Blob([ttsText],  { type: "text/plain;charset=utf-8" }));

      // ✏️ 저장 완료 메시지 — 전체 절대 경로 표시
      setSaveMsg(`✅ 저장 완료:\n${fullSavePath}\n\n📊 ${fileName}\n📄 ${txtName}\n📄 ${ttsName}`);
    } else {
      // ✏️ File System API 미지원 → 브라우저 다운로드 폴백
      const dl = (blob, name) => { const u = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = u; a.download = name; a.click(); URL.revokeObjectURL(u); };
      dl(xlsxBlob, fileName);
      dl(new Blob([대본Text], { type: "text/plain;charset=utf-8" }), txtName);
      if (ttsText) dl(new Blob([ttsText], { type: "text/plain;charset=utf-8" }), ttsName);
      setSaveMsg(`✅ 다운로드 완료\n↙ 아래 경로로 파일을 이동해주세요:\n${fullSavePath}`);
    }
  } catch (e) {
    if (e.name === 'AbortError') setSaveMsg("취소됨");
    else setSaveMsg(`❌ 저장 실패: ${e.message}`);
  }
}

function StepOutputViewer({ step, content }) {
  if (!content) return null;
  return (
    <div>
      {step.id === 4 ? <VisualTable content={content} />
       : step.id === 5 ? <ThumbnailTable content={content} />
       : <Raw text={content} />}
    </div>
  );
}

// ── 메인 앱 ─────────────────────────────────────────────────────

export default function VibeAppFactory() {
  const [mode,      setMode]      = useState("topic");
  const [category,  setCategory]  = useState("selfdev");
  const [topic,     setTopic]     = useState("");
  const [url,       setUrl]       = useState("");
  const [target,    setTarget]    = useState([]); // ✏️ 멀티셀렉트
  const [tone,      setTone]      = useState("calm");
  const [length,    setLength]    = useState("mid");
  const [lang,      setLang]      = useState("한국어");
  // ✏️ characterGender 제거
  const [niche, setNiche] = useState("");

  const [phase,          setPhase]          = useState("input");
  const [currentStep,    setCurrentStep]    = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [progress,       setProgress]       = useState(0);
  const [stepOutput,     setStepOutput]     = useState("");
  const [allOutput,      setAllOutput]      = useState([]);
  const [error,          setError]          = useState("");
  const [activeTab,      setActiveTab]      = useState(1);

  // ✏️ AI 주제 생성 상태
  const [generatedTopics,  setGeneratedTopics]  = useState([]);
  const [isGenerating,     setIsGenerating]     = useState(false);
  const [selectedTopicIdx, setSelectedTopicIdx] = useState(null);
  const [loadingMsg,       setLoadingMsg]       = useState("생성 중...");
  const [topicError,       setTopicError]       = useState(""); // ✏️ 에러 표시용
  const [saveMsg,          setSaveMsg]          = useState(""); // ✏️ 저장 완료 메시지
  const [urlMeta,          setUrlMeta]          = useState(null); // ✏️ URL 역설계 시 영상 제목 보존

  // ✏️ 이미지 생성 상태
  const [imgStatus,   setImgStatus]   = useState('idle');
  const [imgMessages, setImgMessages] = useState([]);
  const [imgResults,  setImgResults]  = useState([]);

  // ✏️ 저장완료 화면에서 XLSX 경로 자동 추출 후 이미지 생성
  const handleImageGenFromSave = async () => {
    if (!saveMsg) return;
    const lines = saveMsg.split('\n');
    const pathLine = lines[1]?.trim();
    const xlsxLine = lines[3]?.replace('📊 ', '').trim();
    if (!pathLine || !xlsxLine) {
      setImgStatus('error');
      setImgMessages(["❌ 저장 경로를 찾을 수 없습니다"]);
      return;
    }
    const fullXlsxPath = `${pathLine}\\${xlsxLine}`;
    setImgStatus('running');
    setImgMessages([]);
    setImgResults([]);
    try {
      const result = await generateImagesByPath(fullXlsxPath, ({ step, message }) => {
        setImgMessages(prev =>
          step === 'analyzing' ? [message] : [...prev, message]
        );
      });
      setImgResults(result.results ?? []);
      setImgStatus('done');
    } catch (err) {
      setImgStatus('error');
      setImgMessages(prev => [...prev, err.message]);
    }
  };

  const outputRef = useRef(null);

  useEffect(() => {
    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [stepOutput]);

  // ✏️ 카테고리/타겟 변경 시 칩 초기화
  useEffect(() => {
    setGeneratedTopics([]);
    setSelectedTopicIdx(null);
    setNiche("");
  }, [category, target]);

  // ✏️ AI 주제 생성 함수 (Phase 2 — web_search 실시간 트렌드 반영)
  async function generateTopics() {
    const cat = CATEGORIES.find((c) => c.id === category) || CATEGORIES[1];
    setIsGenerating(true);
    setTopicError(""); // ✏️ 이전 에러 초기화
    setLoadingMsg("🔄 AI 주제 생성 중...");
    setGeneratedTopics([]);
    setSelectedTopicIdx(null);

    try {
      const res = await fetch("/api/claude", { // ✏️ VAF-3 searchLabel/year 제거
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2500,
          messages: [{
            role: "user",
            content: `당신은 유튜브 콘텐츠 전문가입니다.\n채널 카테고리: ${cat.label}\n세부 니치: ${niche || cat.label}\n위 조합에 맞는 최신 트렌드 유튜브 영상 소주제 6개를 생성하세요.\n조건:\n- 2026년 최신 트렌드 반영\n- 시청자 클릭을 유도하는 제목 형식\n- 각 소주제 15자 이내\n- 반드시 JSON 배열로만 응답 (다른 텍스트 없이):\n["소주제1", "소주제2", "소주제3", "소주제4", "소주제5", "소주제6"]` // ✏️ VAF-3 랜덤화
          }]
        }),
      });

      // ✏️ STEP 2: HTTP 상태 코드 먼저 확인
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`API 오류 (${res.status}): ${errText.slice(0, 100)}`);
      }

      // ✏️ STEP 3: text()로 먼저 받기 — 빈 응답 / 파싱 실패 방어
      const rawText = await res.text();
      if (!rawText || rawText.trim() === "") {
        throw new Error("API 응답이 비어있습니다. 잠시 후 다시 시도하세요.");
      }

      // ✏️ STEP 4: JSON 수동 파싱
      let data;
      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error("API 응답 형식 오류: " + rawText.slice(0, 80));
      }

      // ✏️ STEP 5: content 블록에서 text만 추출
      const textBlock = (data.content ?? [])
        .filter((b) => b.type === "text")
        .map((b) => b.text)
        .filter(Boolean)
        .join("\n")
        .trim();

      if (!textBlock) {
        throw new Error("AI가 텍스트 응답을 반환하지 않았습니다.");
      }

      // ✏️ STEP 6: JSON 배열 추출 (코드펜스 제거 후 파싱)
      const clean = textBlock.replace(/```json/gi, "").replace(/```/g, "").trim();
      let topics;
      try {
        topics = JSON.parse(clean);
      } catch {
        const match = clean.match(/\[[\s\S]*?\]/);
        if (match) {
          try { topics = JSON.parse(match[0]); }
          catch { throw new Error("주제 JSON 파싱 실패: " + clean.slice(0, 80)); }
        } else {
          throw new Error("JSON 배열을 찾을 수 없습니다: " + clean.slice(0, 80));
        }
      }

      if (!Array.isArray(topics) || topics.length === 0) {
        throw new Error("주제 배열이 비어있습니다.");
      }
      setGeneratedTopics(topics.slice(0, 6));
    } catch (e) {
      console.error("주제 생성 실패:", e);
      setTopicError(e.message ?? "주제 생성 중 오류가 발생했습니다."); // ✏️
    } finally {
      setIsGenerating(false);
      setLoadingMsg("생성 중..."); // ✏️ t1/t2 clearTimeout 제거
    }
  }

  // ✏️ 칩 선택 핸들러
  function handleSelectTopic(idx, label) {
    if (selectedTopicIdx === idx) {
      setSelectedTopicIdx(null);
      setTopic("");
    } else {
      setSelectedTopicIdx(idx);
      setTopic(label);
    }
  }

  const canStart = mode === "url" ? url.trim() : topic.trim();

  // ✏️ 이미지 생성 핸들러
  async function handleImageGenerate(file) {
    if (!file) { setImgError("XLSX 파일을 선택해주세요"); return; }
    setImgStatus("loading");
    setImgError("");
    setImgResult(null);
    try {
      const result = await generateImages(file, (p) => setImgProgress(p));
      setImgResult(result);
      setImgStatus("done");
    } catch (e) {
      const msg = e.message === "BRIDGE_OFFLINE"
        ? "⚠️ 브릿지 서버를 먼저 실행해주세요 (localhost:8000)"
        : e.message === "COOKIE_EXPIRED"
        ? "⚠️ Gemini 쿠키를 갱신해주세요 (cookies.json)"
        : e.message === "GEM_NOT_FOUND"
        ? "⚠️ Gem '프롬프트 분리(Style & image)' 를 Gemini에서 생성해주세요"
        : `오류: ${e.message}`;
      setImgError(msg);
      setImgStatus("error");
    }
  }

  async function runPipeline() {
    setPhase("running");
    setCurrentStep(0);
    setCompletedSteps([]);
    setProgress(0);
    setAllOutput([]);
    setError("");

    // ✏️ URL 역설계 — 파이프라인 시작 전 YouTube 메타데이터 fetch
    let urlMeta = null;
    if (mode === "url" && url.trim()) {
      setStepOutput("🔍 YouTube 영상 정보 분석 중...");
      urlMeta = await fetchYouTubeMeta(url.trim());
      setUrlMeta(urlMeta); // ✏️ 저장 시점에도 제목 접근 가능하도록 상태 저장
      const matched = await autoMatchCategory(urlMeta?.title, urlMeta?.author);
      if (matched?.categoryId) setCategory(matched.categoryId);
      if (matched?.nicheName)  setNiche(matched.nicheName);
      setStepOutput(urlMeta
        ? `✅ 영상 감지: "${urlMeta.title}" (${urlMeta.author})\n파이프라인 시작...`
        : "⚠️ 영상 정보 자동 추출 실패 — URL 텍스트만으로 진행합니다."
      );
      await new Promise(r => setTimeout(r, 600)); // 사용자 확인 대기
    }
    const prompt = buildHarnessPrompt({ mode, category, topic, url, urlMeta, target: target.includes('전체') ? '전체 시청자' : target.join(', '), tone, length, lang }); // ✏️

    try {
      for (let i = 0; i < STEPS.length; i++) {
        const step = STEPS[i];
        setCurrentStep(step.id);
        setStepOutput("");
        setProgress(Math.round((i / STEPS.length) * 100));

        // ✏️ STEP 4 대사 기반 이미지 연동 — STEP 3 대본 참조
        const scriptOutput = allOutput.find(o => o.step.id === 3)?.content || "";
        const sceneCountInScript = step.id === 4
          ? (scriptOutput.match(/\[SCENE\s+\d+/g) || []).length
          : 0;
        const sceneCountNote = sceneCountInScript > 0
          ? `\n\n⚠️ 총 ${sceneCountInScript}개 씬 전체를 반드시 모두 출력하시오. 마지막 씬까지 빠짐없이 완전히 출력.`
          : "";
        const scriptRef = scriptOutput ? `\n\n[STEP 3 대본 참조 — 반드시 아래 대사 기준으로 이미지 프롬프트 생성]\n${scriptOutput.slice(0, 3000)}` : "";

        const userPrompt = `${prompt}

지금 STEP ${step.id} / 7 ${step.emoji} ${step.label} 부분만 완성 출력하세요.
다른 STEP은 출력하지 마세요. 실제 사용 가능한 완성 콘텐츠로 작성하세요.
STEP 4(비주얼)는 씬명:/Stage:/타임스탬프:/NarrationDuration:/ImageCount:/Grok 파일명:/의미태그:/체류시간(초):/ImagePrompts_KOR:/ImagePrompts_ENG:/VideoPrompts_KOR:/VideoPrompts_ENG:/SFX_KOR:/SFX_ENG:/Narration_ENG:/영어 프롬프트:/한국어 설명:/B-roll:/자막: 형식 엄수.
STEP 5(썸네일)는 안:/컨셉:/영어 프롬프트:/한국어 설명:/텍스트 오버레이:/색상 조합: 형식 엄수.${step.id === 4 ? sceneCountNote + scriptRef : ""}`;

        // ✏️ STEP별 max_tokens 차등 — 대본(STEP 3)은 길이에 따라 최대 8000
        const scriptTokens = { short: 2000, mid: 8000, long30: 16000, long60: 16000 }; // ✏️
        const stepMaxTokens = step.id === 3
          ? (scriptTokens[length] || 6000)
          : step.id === 4 ? 6000
          : 2000;

        const res = await fetch("/api/claude", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: stepMaxTokens,
            stream: true,
            messages: [{ role: "user", content: userPrompt }],
          }),
        });

        if (!res.ok) throw new Error(`API Error: ${res.status}`);

        const reader  = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "", accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop();
          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const d = line.slice(6);
            if (d === "[DONE]") continue;
            try {
              const p = JSON.parse(d);
              if (p.type === "content_block_delta" && p.delta?.text) {
                accumulated += p.delta.text;
                setStepOutput(accumulated);
              }
            } catch {}
          }
        }

        setAllOutput((prev) => [...prev, { step, content: accumulated }]);
        setCompletedSteps((prev) => [...prev, step.id]);
        setProgress(Math.round(((i + 1) / STEPS.length) * 100));
      }
      setPhase("done");
      setProgress(100);
      setActiveTab(1);
    } catch (e) {
      setError(e.message);
      setPhase("input");
    }
  }

  function reset() {
    setPhase("input"); setCurrentStep(0); setCompletedSteps([]); setProgress(0);
    setStepOutput(""); setAllOutput([]); setError(""); setActiveTab(1);
  }

  const currentStepObj = STEPS.find((s) => s.id === currentStep);
  const cat = CATEGORIES.find((c) => c.id === category);
  const activeOutput = allOutput.find((o) => o.step.id === activeTab);

  // ── 공통 버튼 스타일 헬퍼 ───────────────────────────────────
  const chipBtn = (active, accent = "purple") => {
    const colors = {
      purple: { border: "rgba(120,80,255,0.7)", bg: "rgba(120,80,255,0.18)", text: "#c4a8ff" },
      gold:   { border: "rgba(255,180,0,0.7)",  bg: "rgba(255,180,0,0.15)",  text: "#ffd060" },
      green:  { border: "rgba(60,200,120,0.7)", bg: "rgba(60,200,120,0.15)", text: "#60e090" },
    }[accent];
    return {
      padding: "6px 13px", borderRadius: 20, fontSize: 12, cursor: "pointer", transition: "all 0.2s",
      border: active ? `1px solid ${colors.border}` : "1px solid rgba(255,255,255,0.1)",
      background: active ? colors.bg : "rgba(255,255,255,0.04)",
      color: active ? colors.text : "#777",
    };
  };
  const blockBtn = (active, accent = "purple") => {
    const colors = {
      purple: { border: "rgba(120,80,255,0.7)", bg: "rgba(120,80,255,0.18)", text: "#c4a8ff" },
      green:  { border: "rgba(60,200,120,0.7)", bg: "rgba(60,200,120,0.15)", text: "#60e090" },
    }[accent];
    return {
      padding: "11px 0", borderRadius: 10, fontSize: 12, cursor: "pointer", transition: "all 0.2s",
      border: active ? `1px solid ${colors.border}` : "1px solid rgba(255,255,255,0.1)",
      background: active ? colors.bg : "rgba(255,255,255,0.04)",
      color: active ? colors.text : "#777",
    };
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#e8e6f0", fontFamily: "'Pretendard','Noto Sans KR',sans-serif", paddingBottom: 60 }}>

      {/* ── Header ── */}
      <div style={{ borderBottom: "1px solid rgba(120,80,255,0.2)", padding: "13px 22px", display: "flex", alignItems: "center", gap: 12, background: "rgba(10,10,20,0.97)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#7855ff,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🏭</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, letterSpacing: 1, color: "#c4a8ff" }}>VIBE APP FACTORY</div>
          <div style={{ fontSize: 10, color: "#6b6880", marginTop: 1 }}>하네스 엔지니어링 기반 유튜브 콘텐츠 자동 생산</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 5 }}>
          {STEPS.map((st) => (
            <div key={st.id} title={st.label} style={{
              width: 24, height: 24, borderRadius: "50%", fontSize: 10,
              display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s",
              background: completedSteps.includes(st.id) ? "rgba(80,220,120,0.25)" : currentStep === st.id ? "rgba(120,80,255,0.4)" : "rgba(255,255,255,0.05)",
              border: completedSteps.includes(st.id) ? "1px solid rgba(80,220,120,0.5)" : currentStep === st.id ? "1px solid rgba(120,80,255,0.7)" : "1px solid rgba(255,255,255,0.1)",
              color: completedSteps.includes(st.id) ? "#60e090" : currentStep === st.id ? "#c4a8ff" : "#555",
            }}>
              {completedSteps.includes(st.id) ? "✓" : st.id}
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "26px 16px 0" }}>

        {/* ════════════════════ INPUT ════════════════════ */}
        {phase === "input" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {error && <div style={{ background: "rgba(220,60,60,0.15)", border: "1px solid rgba(220,60,60,0.3)", borderRadius: 12, padding: "11px 15px", color: "#ff8080", fontSize: 12 }}>⚠️ {error}</div>}

            {/* 콘텐츠 설정 카드 */}
            <div style={{ background: "#1A1A24", border: "1px solid #2A2A38", borderRadius: 14, padding: 18 }}>
              <div style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 12, letterSpacing: 1.5, fontWeight: 600 }}>콘텐츠 설정</div>

              {/* 모드 */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                {[{ id: "url", icon: "🔍", label: "URL 역설계 모드" }, { id: "topic", icon: "✏️", label: "주제 직접 입력 모드" }].map((m) => (
                  <button key={m.id} onClick={() => setMode(m.id)} style={{
                    padding: "12px 0", fontSize: 13, fontWeight: mode === m.id ? 600 : 400,
                    borderRadius: 10, cursor: "pointer", transition: "all 0.2s",
                    border: mode === m.id ? "1.5px solid #6C5CE7" : "1px solid #3A3A50",
                    background: mode === m.id ? "#6C5CE7" : "#1E1E2E",
                    color: mode === m.id ? "#FFFFFF" : "#D1D5DB",
                  }}>
                    {m.icon} {m.label}
                  </button>
                ))}
              </div>

              {/* ✏️ 카테고리 */}
              <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 7, letterSpacing: 1.5, fontWeight: 600 }}>채널 카테고리</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                {CATEGORIES.map((c) => (
                  <button key={c.id} onClick={() => { setCategory(c.id); setNiche(""); }} style={{
                    display: "flex", alignItems: "center", gap: 5,
                    padding: "6px 14px", borderRadius: 20, fontSize: 13, cursor: "pointer", transition: "all 0.2s",
                    border: category === c.id ? `1.5px solid ${c.dot}` : "1px solid #3A3A50",
                    background: category === c.id ? `${c.dot}33` : "#1E1E2E",
                    color: category === c.id ? "#FFFFFF" : "#D1D5DB",
                    fontWeight: category === c.id ? 600 : 400,
                  }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: c.dot, display: "inline-block", flexShrink: 0 }} />
                    {c.label}
                    {c.hot && <span style={{ background: "#3D2A0A", color: "#F59E0B", fontSize: 11, padding: "2px 8px", borderRadius: 4, fontWeight: 600, marginLeft: 2 }}>HOT</span>}
                  </button>
                ))}
              </div>
              {/* ✏️ 세부 니치 */}
              {(() => {
                const cat = CATEGORIES.find(c => c.id === category);
                return cat ? (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 6, letterSpacing: 1 }}>세부 니치</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {cat.niches.map(n => (
                        <button key={n} onClick={() => setNiche(niche === n ? "" : n)} style={{
                          padding: "4px 12px", borderRadius: 8, fontSize: 12, cursor: "pointer", transition: "all 0.15s",
                          border: niche === n ? `1.5px solid ${cat.dot}` : "1px solid #3A3A50",
                          background: niche === n ? `${cat.dot}33` : "#1E1E2E",
                          color: niche === n ? "#FFFFFF" : "#9CA3AF",
                          fontWeight: niche === n ? 600 : 400,
                        }}>{n}</button>
                      ))}
                    </div>
                  </div>
                ) : <div style={{ marginBottom: 16 }} />;
              })()}

              {/* ✏️ 입력 — AI 주제 생성 포함 */}
              <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 7, letterSpacing: 1.5, fontWeight: 600 }}>
                {mode === "url" ? "유튜브 URL" : "주제 / 키워드"}
              </div>

              {/* AI 주제 생성 버튼 (topic 모드에서만 표시) */}
              {mode === "topic" && (
                <div style={{ marginBottom: 10 }}>
                  <button
                    onClick={generateTopics}
                    disabled={isGenerating}
                    style={{
                      padding: "8px 18px", borderRadius: 8, fontSize: 12, cursor: isGenerating ? "not-allowed" : "pointer",
                      border: "1px solid #6C5CE7", background: isGenerating ? "#1E1E2E" : "linear-gradient(135deg, #1a0e2e, #120e20)",
                      color: "#A29BFE", fontWeight: 600, opacity: isGenerating ? 0.6 : 1, transition: "all 0.2s",
                    }}
                  >
                    {isGenerating ? `⏳ ${loadingMsg}` : "🔄 AI 주제 생성"}
                  </button>

                  {/* ✏️ 에러 메시지 */}
                  {topicError && (
                    <div style={{
                      marginTop: 8, padding: "8px 12px",
                      background: "rgba(221,85,85,0.12)",
                      border: "1px solid rgba(221,85,85,0.35)",
                      borderRadius: 8, fontSize: 12, color: "#ff8080",
                    }}>
                      ⚠️ {topicError}
                    </div>
                  )}

                  {/* 생성된 주제 칩 */}
                  {generatedTopics.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 10 }}>
                      {generatedTopics.map((t, i) => (
                        <button
                          key={i}
                          onClick={() => handleSelectTopic(i, t)}
                          style={{
                            padding: "7px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer", transition: "all 0.2s",
                            border: selectedTopicIdx === i ? "1px solid #6C5CE7" : "1px solid #3A3A50",
                            background: selectedTopicIdx === i ? "#6C5CE7" : "#1E1E2E",
                            color: selectedTopicIdx === i ? "#FFFFFF" : "#D1D5DB",
                            fontWeight: selectedTopicIdx === i ? 600 : 400,
                          }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 직접 입력 필드 */}
              <input
                value={mode === "url" ? url : topic}
                onChange={(e) => {
                  if (mode === "url") setUrl(e.target.value);
                  else { setTopic(e.target.value); setSelectedTopicIdx(null); }
                }}
                placeholder={mode === "url" ? "https://www.youtube.com/watch?v=..." : "또는 직접 입력하세요"}
                style={{ width: "100%", padding: "10px 14px", background: "#1E1E2E", border: "1px solid #3A3A50", borderRadius: 10, color: "#F3F4F6", fontSize: 13, outline: "none", boxSizing: "border-box" }}
              />

              {/* ✏️ 타겟 독자 */}
              <div style={{ fontSize: 12, color: "#9CA3AF", margin: "13px 0 7px", letterSpacing: 1.5, fontWeight: 600 }}>타겟 독자</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {TARGETS.map((t) => (
                  <button key={t} onClick={() => { // ✏️ 전체 버튼 특수 로직
                    if (t === '전체') { setTarget(['전체']); }
                    else { setTarget(prev => { const w = prev.filter(x => x !== '전체'); return w.includes(t) ? w.filter(x => x !== t) : [...w, t]; }); }
                  }} style={{
                    padding: "6px 14px", borderRadius: 20, fontSize: 13, cursor: "pointer", transition: "all 0.2s",
                    border: target.includes(t) ? "1px solid #6C5CE7" : "1px solid #3A3A50",
                    background: target.includes(t) ? "#6C5CE7" : "#1E1E2E",
                    color: target.includes(t) ? "#FFFFFF" : "#D1D5DB",
                    fontWeight: target.includes(t) ? 600 : 400,
                  }}>{t}</button>
                ))}
              </div>

              {/* ✏️ 주인공 캐릭터 섹션 제거 */}
            </div>

            {/* 톤/길이/언어 카드 */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 18 }}>

              <div style={{ fontSize: 10, color: "#6b6880", marginBottom: 8, letterSpacing: 1.5 }}>톤 / 스타일</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, marginBottom: 16 }}>
                {TONES.map((t) => (
                  <button key={t.id} onClick={() => setTone(t.id)} style={blockBtn(tone === t.id)}>
                    {t.emoji} {t.label}
                  </button>
                ))}
              </div>

              {/* 영상 길이 — 4칸 그리드 */}
              <div style={{ fontSize: 10, color: "#6b6880", marginBottom: 8, letterSpacing: 1.5 }}>영상 길이</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 7, marginBottom: 16 }}>
                {LENGTHS.map((l) => (
                  <button key={l.id} onClick={() => setLength(l.id)} style={blockBtn(length === l.id, "green")}>
                    <div style={{ fontWeight: 600, fontSize: 12 }}>{l.label}</div>
                    <div style={{ fontSize: 10, opacity: 0.65, marginTop: 2 }}>{l.sub}</div>
                  </button>
                ))}
              </div>

              <div style={{ fontSize: 10, color: "#6b6880", marginBottom: 8, letterSpacing: 1.5 }}>언어</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 7 }}>
                {LANGS.map((l) => (
                  <button key={l} onClick={() => setLang(l)} style={blockBtn(lang === l)}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* 1행: 🚀 파이프라인 시작 버튼 */}
            <button onClick={runPipeline} disabled={!canStart} style={{
              width: "100%", padding: "14px 0", borderRadius: 14, fontSize: 13, fontWeight: 700, letterSpacing: 1,
              background: canStart ? "linear-gradient(135deg,rgba(120,80,255,0.9),rgba(168,85,247,0.9))" : "rgba(255,255,255,0.05)",
              border: canStart ? "1px solid rgba(120,80,255,0.5)" : "1px solid rgba(255,255,255,0.08)",
              color: canStart ? "#fff" : "#444", cursor: canStart ? "pointer" : "not-allowed", transition: "all 0.2s",
            }}>
              🚀 7-Step 파이프라인 시작
            </button>

          </div>
        )}

        {/* ════════════════════ RUNNING ════════════════════ */}
        {phase === "running" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* 진행률 */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                <span style={{ fontSize: 11, color: "#888" }}>전체 진행률</span>
                <span style={{ fontSize: 13, color: "#c4a8ff", fontWeight: 700 }}>{progress}%</span>
              </div>
              <div style={{ height: 5, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#7855ff,#a855f7)", borderRadius: 3, transition: "width 0.5s ease" }} />
              </div>
            </div>

            {/* 현재 스텝 */}
            {currentStepObj && (
              <div style={{ background: "rgba(120,80,255,0.08)", border: "1px solid rgba(120,80,255,0.25)", borderRadius: 14, padding: 20, textAlign: "center" }}>
                <div style={{ width: 60, height: 60, borderRadius: "50%", border: "2px solid rgba(120,80,255,0.5)", background: "rgba(120,80,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 10px" }}>
                  {currentStepObj.emoji}
                </div>
                <div style={{ fontSize: 10, color: "#888", marginBottom: 2 }}>STEP {currentStepObj.id} / {STEPS.length}</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: "#c4a8ff", marginBottom: 10 }}>{currentStepObj.label}</div>
                <div ref={outputRef} style={{ maxHeight: 170, overflowY: "auto", background: "rgba(0,0,0,0.3)", borderRadius: 10, padding: "9px 13px", fontSize: 11, color: "#9080b0", textAlign: "left", lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: "monospace" }}>
                  {stepOutput || "생성 중..."}
                </div>
              </div>
            )}

            {/* 완료 목록 */}
            {completedSteps.length > 0 && (
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 14 }}>
                <div style={{ fontSize: 10, color: "#6b6880", marginBottom: 9, letterSpacing: 1.5 }}>완료된 단계</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {completedSteps.map((sid) => {
                    const st = STEPS.find((x) => x.id === sid);
                    return (
                      <div key={sid} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderRadius: 8, background: "rgba(60,200,120,0.06)", border: "1px solid rgba(60,200,120,0.15)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(60,200,120,0.2)", border: "1px solid rgba(60,200,120,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#60e090" }}>✓</div>
                          <span style={{ fontSize: 11, color: "#c0c0d0" }}>{st.emoji} {st.label}</span>
                        </div>
                        <span style={{ fontSize: 10, color: "#60e090" }}>완료</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════════════════════ DONE ════════════════════ */}
        {phase === "done" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* 완료 배너 */}
            <div style={{ background: "rgba(60,200,120,0.08)", border: "1px solid rgba(60,200,120,0.25)", borderRadius: 14, padding: 14, textAlign: "center" }}>
              <div style={{ fontSize: 20, marginBottom: 5 }}>🎉</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#60e090" }}>바이브앱 패키지 생성 완료!</div>
              <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>
                {cat?.emoji} {cat?.label} · {target.join(', ')} · {LENGTHS.find(l => l.id === length)?.sub} {/* ✏️ */}
              </div>
            </div>

            {/* XLSX 탭 뷰어 */}
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden" }}>

              {/* 탭 바 — XLSX 시트 구조 */}
              <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.08)", overflowX: "auto", background: "rgba(0,0,0,0.2)" }}>
                {STEPS.map((st) => {
                  const done   = completedSteps.includes(st.id);
                  const active = activeTab === st.id;
                  return (
                    <button key={st.id} onClick={() => done && setActiveTab(st.id)} style={{
                      padding: "9px 14px", fontSize: 11, fontWeight: active ? 600 : 400, whiteSpace: "nowrap",
                      border: "none", borderBottom: active ? "2px solid #c4a8ff" : "2px solid transparent",
                      background: active ? "rgba(120,80,255,0.14)" : "transparent",
                      color: active ? "#c4a8ff" : done ? "#888" : "#444",
                      cursor: done ? "pointer" : "default", transition: "all 0.2s",
                    }}>
                      {st.emoji} {st.label}
                    </button>
                  );
                })}
              </div>

              {/* 탭 콘텐츠 */}
              <div style={{ padding: "16px 16px 20px", minHeight: 120 }}>
                {activeOutput ? (
                  <>
                    <StepOutputViewer step={activeOutput.step} content={activeOutput.content} />
                    {/* ✏️ 대본 탭 전용 TTS 다운로드 버튼 */}
                    {activeTab === 3 && (
                      <button
                        onClick={() => {
                          const tts = extractTTSText(activeOutput.content);
                          downloadTTSTxt(tts, category, mode === "url" ? url : topic);
                        }}
                        style={{
                          padding: "10px 20px", borderRadius: 10, marginTop: 12,
                          border: "1px solid rgba(120,80,255,0.4)",
                          background: "rgba(120,80,255,0.1)",
                          color: "#c4a8ff", fontSize: 13, cursor: "pointer",
                          display: "block",
                        }}
                      >
                        📄 TTS 버전 .txt 다운로드
                      </button>
                    )}
                  </>
                ) : (
                  <div style={{ fontSize: 11, color: "#555", textAlign: "center", padding: "28px 0" }}>위 탭을 선택하세요</div>
                )}
              </div>
            </div>

            {/* ✏️ 전체 저장 버튼 영역 */}
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => downloadAllTxt(allOutput, { category, topic, url, target: target.join(', '), tone, length, lang })}
                style={{ flex: 1, padding: "13px 0", borderRadius: 14, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "#c0b8d8", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
              >
                📄 TXT만 저장
              </button>
              <button
                onClick={async () => {
                  setSaveMsg("");
                  await saveAllFiles(allOutput, { category, topic, url, urlMeta, target: target.join(', '), tone, length, mode, lang, selectedNiche: niche }, setSaveMsg);
                }}
                style={{ flex: 2, padding: "13px 0", borderRadius: 14, background: "rgba(255,180,0,0.12)", border: "1px solid rgba(255,180,0,0.35)", color: "#ffd060", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
              >
                📦 전체 저장 (XLSX+TTS+대본)
              </button>
            </div>
            {/* ✏️ 저장 완료 메시지 */}
            {saveMsg && (
              <div style={{ padding: "10px 14px", borderRadius: 10, background: saveMsg.startsWith("✅") ? "rgba(74,170,74,0.12)" : saveMsg.startsWith("❌") ? "rgba(220,60,60,0.12)" : "rgba(255,180,0,0.08)", border: `1px solid ${saveMsg.startsWith("✅") ? "rgba(74,170,74,0.35)" : saveMsg.startsWith("❌") ? "rgba(220,60,60,0.35)" : "rgba(255,180,0,0.3)"}`, fontSize: 12, color: saveMsg.startsWith("✅") ? "#6adf6a" : saveMsg.startsWith("❌") ? "#f07070" : "#ffd060", whiteSpace: "pre-line", lineHeight: 1.6 }}>
                {saveMsg}
              </div>
            )}

            {/* ✏️ 저장완료 후 이미지/영상 생성 버튼 */}
            {saveMsg && (
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '16px' }}>
                <button
                  onClick={handleImageGenFromSave}
                  disabled={imgStatus === 'running'}
                  style={{
                    padding: '12px 28px', fontSize: '15px', fontWeight: 'bold',
                    borderRadius: '8px', border: 'none',
                    cursor: imgStatus === 'running' ? 'not-allowed' : 'pointer',
                    background: imgStatus === 'running' ? '#888' : '#4F46E5',
                    color: '#fff',
                  }}
                >
                  {imgStatus === 'running' ? '⏳ 생성 중...' : '🎨 이미지 생성'}
                </button>
                <button
                  title="준비 중입니다" disabled
                  style={{
                    padding: '12px 28px', fontSize: '15px', fontWeight: 'bold',
                    borderRadius: '8px', border: 'none',
                    cursor: 'not-allowed', background: '#ccc', color: '#888',
                  }}
                >
                  🎬 영상 생성
                </button>
              </div>
            )}

            {imgMessages.length > 0 && saveMsg && (
              <div style={{
                marginTop: '12px', padding: '12px 16px', borderRadius: '8px',
                background: imgStatus === 'error' ? '#FEF2F2' : '#F0FDF4',
                border: `1px solid ${imgStatus === 'error' ? '#FCA5A5' : '#86EFAC'}`,
                fontSize: '14px', lineHeight: '1.8',
              }}>
                {imgMessages.map((msg, i) => <div key={i}>{msg}</div>)}
              </div>
            )}

            {imgResults.length > 0 && saveMsg && (
              <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {imgResults.map((r, i) => (
                  <span key={i} title={r.prompt_preview} style={{
                    padding: '4px 10px', borderRadius: '20px', fontSize: '13px',
                    background: r.status === '✅' ? '#DCFCE7' : '#FEE2E2',
                    color: r.status === '✅' ? '#166534' : '#991B1B',
                    border: `1px solid ${r.status === '✅' ? '#86EFAC' : '#FCA5A5'}`,
                  }}>
                    {r.scene} {r.status}
                  </span>
                ))}
              </div>
            )}

            <button onClick={reset} style={{ width: "100%", padding: "14px 0", borderRadius: 14, background: "rgba(120,80,255,0.15)", border: "1px solid rgba(120,80,255,0.4)", color: "#c4a8ff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              ↩ 새 콘텐츠 생성
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
