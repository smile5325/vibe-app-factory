import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// ✏️ loadEnv로 .env 파일 직접 읽기 (prefix "" = VITE_ 없는 키도 포함)
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  function localApiPlugin() {
    return {
      name: "local-api-proxy",
      configureServer(server) {
        server.middlewares.use("/api/claude", (req, res) => {
          if (req.method !== "POST") {
            res.statusCode = 405;
            res.end("Method Not Allowed");
            return;
          }

          const apiKey = env.ANTHROPIC_API_KEY; // ✏️ process.env 대신 loadEnv 결과 사용
          if (!apiKey) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "ANTHROPIC_API_KEY가 .env 파일에 없습니다." }));
            return;
          }

          const chunks = [];
          req.on("data", (chunk) => chunks.push(chunk));
          req.on("end", async () => {
            try {
              const body = Buffer.concat(chunks).toString();
              const upstream = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "x-api-key": apiKey,
                  "anthropic-version": "2023-06-01",
                },
                body,
              });

              res.statusCode = upstream.status;
              res.setHeader(
                "Content-Type",
                upstream.headers.get("content-type") || "application/json"
              );

              const reader = upstream.body.getReader();
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                res.write(value);
              }
              res.end();
            } catch (e) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: e.message }));
            }
          });
        });
      },
    };
  }

  return {
    plugins: [react(), localApiPlugin()],
    server: { port: 5178 },
  };
});
