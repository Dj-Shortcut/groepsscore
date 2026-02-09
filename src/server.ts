import http from "http";
import { leaderboardHandler } from "./routes/leaderboard.js";
import { verifyFacebookWebhook } from "./webhookVerification.js";
import { verifyFacebookSignature } from "./verifyFacebookSignature.js";
import { generateWeeklyLeaderboardText } from "./leaderboard.js";
import { postToFacebookGroup } from "./facebook/postToGroup.js";

const DEFAULT_PORT = 8080;
const PORT = Number(process.env.PORT) || DEFAULT_PORT;
const HOST = "0.0.0.0";

function getAdminToken(req: http.IncomingMessage): string | undefined {
  const authorizationHeader = req.headers.authorization;
  if (typeof authorizationHeader === "string") {
    const bearerPrefix = "Bearer ";
    if (authorizationHeader.startsWith(bearerPrefix)) {
      return authorizationHeader.slice(bearerPrefix.length);
    }
  }

  const xAdminTokenHeader = req.headers["x-admin-token"];
  return typeof xAdminTokenHeader === "string" ? xAdminTokenHeader : undefined;
}

function isAuthorizedAdminRequest(req: http.IncomingMessage): boolean {
  const expectedToken = process.env.ADMIN_POST_TOKEN;
  if (!expectedToken) {
    console.warn("ADMIN_POST_TOKEN is not configured");
    return false;
  }

  const providedToken = getAdminToken(req);
  return providedToken === expectedToken;
}

const server = http.createServer(async function (req, res) {
  if (!req || !req.url || !req.method) {
    res.writeHead(400);
    res.end("Bad Request");
    console.info("REQ", req?.method ?? "UNKNOWN", req?.url ?? "UNKNOWN", 400);
    return;
  }

  const url = new URL(req.url, "http://" + req.headers.host);

  const send = function (
    statusCode: number,
    body?: string,
    headers?: http.OutgoingHttpHeaders
  ): void {
    if (headers) {
      res.writeHead(statusCode, headers);
    } else {
      res.writeHead(statusCode);
    }

    res.end(body);
    console.info("REQ", req.method, url.pathname, statusCode);
  };

  // =========================
  // Facebook webhook VERIFY
  // =========================
  if (req.method === "GET" && url.pathname === "/webhook/facebook") {
    const result = verifyFacebookWebhook(
      url,
      process.env.FB_VERIFY_TOKEN
    );

    if (result.status === 200) {
      send(200, result.body, { "Content-Type": "text/plain" });
      return;
    }

    send(403, result.body);
    return;
  }

  // =========================
  // Facebook webhook EVENTS
  // =========================
  if (req.method === "POST" && url.pathname === "/webhook/facebook") {
    let rawBody = "";

    req.on("data", function (chunk) {
      rawBody += Buffer.isBuffer(chunk) ? chunk.toString("utf8") : String(chunk);
    });

    req.on("error", function () {
      send(400, "Bad Request");
    });

    req.on("end", function () {
      const signatureHeader = req.headers["x-hub-signature-256"];
      const signature =
        typeof signatureHeader === "string"
          ? signatureHeader
          : undefined;

      if (!process.env.FB_APP_SECRET) {
        console.warn("FB_APP_SECRET is not configured");
        send(403, "Invalid signature");
        return;
      }

      const valid = verifyFacebookSignature(rawBody, signature);

      if (!valid) {
        console.warn("Invalid Facebook signature");
        send(403, "Invalid signature");
        return;
      }

      let payload: unknown;
      try {
        payload = rawBody.length > 0 ? JSON.parse(rawBody) : {};
      } catch (_error) {
        send(400, "Invalid JSON payload");
        return;
      }

      const objectValue =
        payload && typeof payload === "object" && "object" in payload
          ? String((payload as { object?: unknown }).object ?? "")
          : "";

      if (objectValue !== "page") {
        send(200, "EVENT_RECEIVED");
        return;
      }

      send(200, "EVENT_RECEIVED");
    });

    return;
  }

  // =========================
  // Admin posting endpoints
  // =========================
  if (req.method === "POST" && url.pathname === "/admin/post-test") {
    if (!isAuthorizedAdminRequest(req)) {
      send(403, JSON.stringify({ error: "forbidden" }), {
        "Content-Type": "application/json",
      });
      return;
    }

    try {
      await postToFacebookGroup(process.env.FB_GROUP_ID || "", "testbericht");
      send(200, JSON.stringify({ status: "ok" }), {
        "Content-Type": "application/json",
      });
    } catch (error) {
      send(500, JSON.stringify({ error: (error as Error).message }), {
        "Content-Type": "application/json",
      });
    }
    return;
  }

  if (req.method === "POST" && url.pathname === "/admin/post-leaderboard") {
    if (!isAuthorizedAdminRequest(req)) {
      send(403, JSON.stringify({ error: "forbidden" }), {
        "Content-Type": "application/json",
      });
      return;
    }

    try {
      const leaderboardText = generateWeeklyLeaderboardText();
      await postToFacebookGroup(process.env.FB_GROUP_ID || "", leaderboardText);
      send(200, JSON.stringify({ status: "ok" }), {
        "Content-Type": "application/json",
      });
    } catch (error) {
      send(500, JSON.stringify({ error: (error as Error).message }), {
        "Content-Type": "application/json",
      });
    }
    return;
  }

  // =========================
  // Health check
  // =========================
  if (req.method === "GET" && url.pathname === "/health") {
    send(
      200,
      JSON.stringify({
        status: "ok",
        time: Date.now(),
      }),
      { "Content-Type": "application/json" }
    );
    return;
  }

  // =========================
  // Leaderboard
  // =========================
  if (req.method === "GET" && url.pathname.startsWith("/leaderboard")) {
    leaderboardHandler(res);
    console.info("REQ", req.method, url.pathname, 200);
    return;
  }

  // =========================
  // Fallback
  // =========================
  send(404, JSON.stringify({ error: "not_found" }), {
    "Content-Type": "application/json",
  });
});

server.listen(PORT, HOST, function () {
  console.log("Server running on " + HOST + ":" + PORT);
});
