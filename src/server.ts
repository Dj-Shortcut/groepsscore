import http from "http";
import { URL } from "url";
import { leaderboardHandler } from "./routes/leaderboard.js";

const DEFAULT_PORT = 8080;
const envPort = Number(process.env.PORT);
const PORT = Number.isFinite(envPort) && envPort > 0 ? envPort : DEFAULT_PORT;
const HOST = process.env.HOST ?? "0.0.0.0";

const VERIFY_TOKEN = "groepsscore_verify_2026";

const server = http.createServer((req, res) => {
  console.log("REQ IN:", req.method, req.url);

  /* --------------------------------------------------
   * Facebook Webhook verification (GET)
   * -------------------------------------------------- */
  if (req.method === "GET" && req.url?.startsWith("/webhook/facebook")) {
    const url = new URL(req.url, `http://${req.headers.host}`);

    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");

    if (mode === "subscribe" && token === VERIFY_TOKEN && challenge) {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(challenge);
      return;
    }

    res.writeHead(403, { "Content-Type": "text/plain" });
    res.end("Forbidden");
    return;
  }

  /* --------------------------------------------------
   * Facebook Webhook events (POST)
   * -------------------------------------------------- */
  if (req.method === "POST" && req.url === "/webhook/facebook") {
    let body = "";

    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", () => {
      console.log("FB WEBHOOK EVENT:", body);
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("EVENT_RECEIVED");
    });

    return;
  }

  /* --------------------------------------------------
   * Leaderboard
   * -------------------------------------------------- */
  if (req.method === "GET" && req.url?.startsWith("/leaderboard")) {
    leaderboardHandler(res);
    return;
  }

  /* --------------------------------------------------
   * Health check (Fly.io)
   * -------------------------------------------------- */
  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        status: "ok",
        service: "groepsscore",
        time: Date.now()
      })
    );
    return;
  }

  /* --------------------------------------------------
   * Fallback
   * -------------------------------------------------- */
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "not_found" }));
});

server.listen(PORT, HOST, () => {
  console.log(`🚀 Groepscore server running on http://${HOST}:${PORT}`);
});
