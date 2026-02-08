import http from "http";
import { leaderboardHandler } from "./routes/leaderboard.js";
import { verifyFacebookWebhook } from "./webhookVerification.js";
import { verifyFacebookSignature } from "./verifyFacebookSignature.js";

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
    const result = verifyFacebookWebhook(url, process.env.FB_VERIFY_TOKEN);

    if (result.status === 200) {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(result.body);
      return;
    }

    res.writeHead(403);
    res.end(result.body);
    return;
  }
// 🔹 Facebook Webhook events
if (req.method === "POST" && url.pathname === "/webhook/facebook") {
  let body = "";

  req.on("data", chunk => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const signature = req.headers["x-hub-signature-256"] as string | undefined;

    const valid = verifyFacebookSignature(body, signature);

    if (!valid) {
      console.warn("❌ Invalid Facebook signature");
      res.writeHead(403);
      res.end("Invalid signature");
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
