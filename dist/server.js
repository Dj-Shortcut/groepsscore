import http from "http";
import { leaderboardHandler } from "./routes/leaderboard.js";
const PORT = Number(process.env.PORT) || 8080;
const HOST = "0.0.0.0";
const server = http.createServer((req, res) => {
    console.log("REQ IN:", req.method, req.url);
    // Leaderboard
    if (req.method === "GET" && req.url?.startsWith("/leaderboard")) {
        leaderboardHandler(res);
        return;
    }
    // Health check
    if (req.method === "GET" && req.url === "/health") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
            status: "ok",
            service: "groepscore",
            time: Date.now(),
        }));
        return;
    }
    // Fallback
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
        error: "not_found",
    }));
});
server.listen(PORT, HOST, () => {
    console.log(`🚀 Groepscore server running on http://${HOST}:${PORT}`);
});
//# sourceMappingURL=server.js.map