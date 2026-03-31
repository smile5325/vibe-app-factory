import { useState, useRef, useEffect } from "react";

const CATEGORIES = [
  { id: "philosophy", label: "철학/인문", emoji: "🧠", persona: "인문학 강연자" },
  { id: "selfdev", label: "자기계발", emoji: "💡", persona: "라이프스타일 코치" },
  { id: "business", label: "비즈니스", emoji: "💼", persona: "비즈니스 전략가" },
  { id: "tech", label: "테크/AI", emoji: "🤖", persona: "AI 리서처" },
  { id: "crypto", label: "크립토/금융", emoji: "💰", persona: "금융 분석가" },
  { id: "travel", label: "여행", emoji: "🌍", persona: "글로벌 크리에이터" },
  { id: "cooking", label: "요리", emoji: "🍳", persona: "푸드 크리에이터" },
  { id: "education", label: "교육", emoji: "📚", persona: "지식 크리에이터" },
  { id: "entertainment", label: "엔터테인먼트", emoji: "😂", persona: "예능 크리에이터" },
  { id: "other", label: "기타", emoji: "✨", persona: "콘텐츠 크리에이터" },
];

const TARGETS = ["20대 직장인", "30대 부모", "투자자", "학생", "시니어", "전문가"];
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

function buildHarnessPrompt({ mode, category, topic, url, target, tone, length, lang }) {
  const cat = CATEGORIES.find((c) => c.id === category) || CATEGORIES[0];
  const toneObj = TONES.find((t) => t.id === tone) || TONES[0];
  const lengthObj = LENGTHS.find((l) => l.id === length) || LENGTHS[0];
  const inputContext = mode === "url"
    ? `### 분석 URL ###\n${url}`
    : `### 주제/키워드 ###\n${topic}`;

  return `=== VIBE APP FACTORY — HARNESS ENGINE v2.0 ===

## [LAYER 1: PERSONA]
당신은 유튜브 ${cat.label} 분야 최고 전문가이자 ${cat.persona}입니다.
10년 이상 영상 콘텐츠 제작 경험. 알고리즘 최적화와 시청자 심리를 깊이 이해합니다.

## [LAYER 2: CONTEXT]
채널 카테고리: ${cat.emoji} ${cat.label} | 타겟: ${target} | 톤: ${toneObj.emoji} ${toneObj.label}
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

[ 원본 대본 ]
(${lengthObj.sub} 분량 전체 나레이션. [씬명] 구분. [침묵N초][CUT] 마커 포함. 오프닝 훅 + 클로징 CTA)

[ TTS 버전 (마커 제거) ]
(마커 없는 낭독용 버전)

---

### STEP 4 / 7 🎨 비주얼
씬별로 아래 형식으로 최소 5씬 이상 작성:

씬명: [씬 제목]
타임스탬프: [0:00-0:15]
영어 프롬프트: cinematic 16:9, [상세 영어 프롬프트]
한국어 설명: [한국어 설명]
B-roll: [키워드1, 키워드2, 키워드3]
자막: [화면에 표시할 핵심 자막]

(각 씬 사이 반드시 빈 줄 추가)

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
      cur = { 씬명: t.slice(3).trim(), 타임스탬프: "", 영어: "", 한국어: "", broll: "", 자막: "" };
    } else if (cur) {
      if (t.startsWith("타임스탬프:"))    cur.타임스탬프 = t.slice(5).trim();
      else if (t.startsWith("영어 프롬프트:")) cur.영어    = t.slice(8).trim();
      else if (t.startsWith("한국어 설명:"))  cur.한국어   = t.slice(6).trim();
      else if (t.startsWith("B-roll:"))      cur.broll    = t.slice(6).trim();
      else if (t.startsWith("자막:"))        cur.자막     = t.slice(3).trim();
    }
  }
  if (cur) blocks.push(cur);
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
              <td style={s.td}><span style={{ color: "#c4a8ff", fontWeight: 600 }}>{b.씬명}</span></td>
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
  const [target,    setTarget]    = useState("20대 직장인");
  const [tone,      setTone]      = useState("calm");
  const [length,    setLength]    = useState("mid");
  const [lang,      setLang]      = useState("한국어");

  const [phase,          setPhase]          = useState("input");
  const [currentStep,    setCurrentStep]    = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [progress,       setProgress]       = useState(0);
  const [stepOutput,     setStepOutput]     = useState("");
  const [allOutput,      setAllOutput]      = useState([]);
  const [error,          setError]          = useState("");
  const [activeTab,      setActiveTab]      = useState(1);
  const outputRef = useRef(null);

  useEffect(() => {
    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [stepOutput]);

  const canStart = mode === "url" ? url.trim() : topic.trim();

  async function runPipeline() {
    setPhase("running");
    setCurrentStep(0);
    setCompletedSteps([]);
    setProgress(0);
    setAllOutput([]);
    setError("");

    const prompt = buildHarnessPrompt({ mode, category, topic, url, target, tone, length, lang });

    try {
      for (let i = 0; i < STEPS.length; i++) {
        const step = STEPS[i];
        setCurrentStep(step.id);
        setStepOutput("");
        setProgress(Math.round((i / STEPS.length) * 100));

        const userPrompt = `${prompt}

지금 STEP ${step.id} / 7 ${step.emoji} ${step.label} 부분만 완성 출력하세요.
다른 STEP은 출력하지 마세요. 실제 사용 가능한 완성 콘텐츠로 작성하세요.
STEP 4(비주얼)는 씬명:/타임스탬프:/영어 프롬프트:/한국어 설명:/B-roll:/자막: 형식 엄수.
STEP 5(썸네일)는 안:/컨셉:/영어 프롬프트:/한국어 설명:/텍스트 오버레이:/색상 조합: 형식 엄수.`;

        const res = await fetch("/api/claude", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1500,
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
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 18 }}>
              <div style={{ fontSize: 10, color: "#6b6880", marginBottom: 12, letterSpacing: 1.5 }}>콘텐츠 설정</div>

              {/* 모드 */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                {[{ id: "url", icon: "🔍", label: "URL 역설계 모드" }, { id: "topic", icon: "✏️", label: "주제 직접 입력 모드" }].map((m) => (
                  <button key={m.id} onClick={() => setMode(m.id)} style={{ ...blockBtn(mode === m.id), padding: "12px 0", fontSize: 13, fontWeight: mode === m.id ? 600 : 400 }}>
                    {m.icon} {m.label}
                  </button>
                ))}
              </div>

              {/* 카테고리 */}
              <div style={{ fontSize: 10, color: "#6b6880", marginBottom: 7, letterSpacing: 1.5 }}>채널 카테고리</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                {CATEGORIES.map((c) => (
                  <button key={c.id} onClick={() => setCategory(c.id)} style={chipBtn(category === c.id)}>
                    {c.emoji} {c.label}
                  </button>
                ))}
              </div>

              {/* 입력 */}
              <div style={{ fontSize: 10, color: "#6b6880", marginBottom: 7, letterSpacing: 1.5 }}>
                {mode === "url" ? "유튜브 URL" : "주제 / 키워드"}
              </div>
              <input
                value={mode === "url" ? url : topic}
                onChange={(e) => mode === "url" ? setUrl(e.target.value) : setTopic(e.target.value)}
                placeholder={mode === "url" ? "https://www.youtube.com/watch?v=..." : "예: 30대 직장인이 퇴근 후 부업하는 법"}
                style={{ width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#e8e6f0", fontSize: 13, outline: "none", boxSizing: "border-box" }}
              />

              {/* 타겟 */}
              <div style={{ fontSize: 10, color: "#6b6880", margin: "13px 0 7px", letterSpacing: 1.5 }}>타겟 독자</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {TARGETS.map((t) => (
                  <button key={t} onClick={() => setTarget(t)} style={chipBtn(target === t, "gold")}>{t}</button>
                ))}
              </div>
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

            <button onClick={runPipeline} disabled={!canStart} style={{
              width: "100%", padding: "16px 0", borderRadius: 14, fontSize: 14, fontWeight: 700, letterSpacing: 1,
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
                {cat?.emoji} {cat?.label} · {target} · {LENGTHS.find(l => l.id === length)?.sub}
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
                {activeOutput
                  ? <StepOutputViewer step={activeOutput.step} content={activeOutput.content} />
                  : <div style={{ fontSize: 11, color: "#555", textAlign: "center", padding: "28px 0" }}>위 탭을 선택하세요</div>
                }
              </div>
            </div>

            <button onClick={reset} style={{ width: "100%", padding: "14px 0", borderRadius: 14, background: "rgba(120,80,255,0.15)", border: "1px solid rgba(120,80,255,0.4)", color: "#c4a8ff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              ↩ 새 콘텐츠 생성
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
