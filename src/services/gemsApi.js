const BRIDGE_URL = "http://localhost:8000";

/**
 * 브릿지 서버 헬스 체크
 * @returns {Promise<{ok: boolean, data: object}>}
 */
export async function checkBridgeHealth() {
  try {
    const res = await fetch(`${BRIDGE_URL}/health`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return { ok: false, data: null };
    const data = await res.json();
    return { ok: true, data };
  } catch {
    return { ok: false, data: null };
  }
}

/**
 * XLSX 파일을 Gems 브릿지 서버로 전송하여 이미지 생성
 * @param {File} xlsxFile - 업로드할 XLSX 파일
 * @param {(progress: {step: string, current: number, total: number, message: string}) => void} onProgress
 * @returns {Promise<object>} - 서버 응답 JSON
 */
export async function generateImages(xlsxFile, onProgress) {
  onProgress?.({ step: "health", current: 0, total: 0, message: "🔌 브릿지 서버 연결 확인 중..." });

  const health = await checkBridgeHealth();
  if (!health.ok) {
    throw new Error("BRIDGE_OFFLINE");
  }
  if (!health.data?.cookie_valid) {
    throw new Error("COOKIE_EXPIRED");
  }
  if (!health.data?.gems_loaded) {
    throw new Error("GEM_NOT_FOUND");
  }

  onProgress?.({ step: "upload", current: 0, total: 0, message: "📊 Gems 분석 중... (프롬프트 분리 중)" });

  const formData = new FormData();
  formData.append("file", xlsxFile);

  const res = await fetch(`${BRIDGE_URL}/generate-images`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "서버 오류");
  }

  const data = await res.json();

  onProgress?.({
    step: "done",
    current: data.success,
    total: data.total,
    message: `✅ 완료: ${data.success}/${data.total}장 저장됨`,
  });

  return data;
}
