const BRIDGE_URL = "http://localhost:8000";

export async function checkBridgeHealth() {
  try {
    const res = await fetch(`${BRIDGE_URL}/health`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return { ok: false, detail: "서버 응답 오류" };
    const data = await res.json();
    return {
      ok:          data.status === "ok",
      cookieValid: data.cookie_valid,
      gemsLoaded:  data.gems_loaded,
      gemName:     data.gem_name,
    };
  } catch {
    return { ok: false, detail: "bridge_offline" };
  }
}

export async function generateImages(xlsxFile, onProgress = () => {}) {
  onProgress({ step: "checking", current: 0, total: 0, message: "브릿지 서버 확인 중..." });
  const health = await checkBridgeHealth();

  if (!health.ok) {
    const msg = health.detail === "bridge_offline"
      ? "⚠️ 브릿지 서버를 먼저 실행해주세요 (localhost:8000)"
      : "⚠️ 브릿지 서버 응답 오류";
    onProgress({ step: "error", current: 0, total: 0, message: msg });
    throw new Error(msg);
  }
  if (!health.cookieValid) {
    const msg = "⚠️ Gemini 쿠키를 갱신해주세요 (cookies.json)";
    onProgress({ step: "error", current: 0, total: 0, message: msg });
    throw new Error(msg);
  }

  onProgress({ step: "analyzing", current: 0, total: 0, message: "📊 Gems 분석 중... (프롬프트 분리 중)" });

  const formData = new FormData();
  formData.append("file", xlsxFile);

  let response;
  try {
    response = await fetch(`${BRIDGE_URL}/generate-images`, {
      method: "POST",
      body:   formData,
      signal: AbortSignal.timeout(5 * 60 * 1000),
    });
  } catch (e) {
    const msg = e.name === "TimeoutError"
      ? "⚠️ 요청 시간 초과"
      : `⚠️ 네트워크 오류: ${e.message}`;
    onProgress({ step: "error", current: 0, total: 0, message: msg });
    throw new Error(msg);
  }

  if (!response.ok) {
    let detail = "알 수 없는 오류";
    try { const errData = await response.json(); detail = errData.detail || detail; } catch {}
    const msg = detail.includes("쿠키")
      ? "⚠️ Gemini 쿠키를 갱신해주세요 (cookies.json)"
      : `⚠️ 서버 오류 (${response.status}): ${detail}`;
    onProgress({ step: "error", current: 0, total: 0, message: msg });
    throw new Error(msg);
  }

  const data = await response.json();
  const { total = 0, success = 0, failed = 0 } = data;

  onProgress({ step: "done", current: success, total, message: `✅ 완료: ${success}/${total}장 저장됨` });
  if (data.save_dir) {
    onProgress({ step: "saved", current: success, total, message: `📁 저장위치: ${data.save_dir}` });
  }
  if (failed > 0) {
    onProgress({ step: "partial", current: success, total, message: `⚠️ ${failed}개 씬 생성 실패 (나머지 ${success}개 저장됨)` });
  }
  return data;
}

export async function getGemsList() {
  const res = await fetch(`${BRIDGE_URL}/gems-list`);
  if (!res.ok) throw new Error("Gems 목록 조회 실패");
  return res.json();
}
