import http from "http";
import { leaderboardHandler } from "./routes/leaderboard.js";

const DEFAULT_PORT = 8080;
const PORT = Number(process.env.PORT) || DEFAULT_PORT;
const HOST = "0.0.0.0";

const server = http.createServer((req, res) => {
  if (!req.url || !req.method) {
    res.writeHead(400);
    res.end("Bad Request");
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  console.log("REQ IN:", req.method, url.pathname);

  // 🔹 Facebook Webhook verification
  if (req.method === "GET" && url.pathname === "/webhook/facebook") {
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");

    if (
      mode === "subscribe" &&
      token === process.env.FB_VERIFY_TOKEN &&
      challenge
    ) {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(challenge);
      return;
    }

    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  // 🔹 Health check
  if (req.method === "GET" && url.pathname === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        status: "ok",
        time: Date.now(),
      })
    );
    return;
  }

  // 🔹 Leaderboard
  if (req.method === "GET" && url.pathname.startsWith("/leaderboard")) {
    leaderboardHandler(res);
    return;
  }

  // 🔻 Fallback
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "not_found" }));
});

server.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`);
});
