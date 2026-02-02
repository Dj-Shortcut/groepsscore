import http from "http";

const PORT = process.env.PORT
  ? Number(process.env.PORT)
  : 3000;

const server = http.createServer((req, res) => {
  // Health check (voor Fly, CI, jezelf)
  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        status: "ok",
        service: "groepscore",
        time: Date.now()
      })
    );
    return;
  }

  // Fallback
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      error: "not_found"
    })
  );
});

server.listen(PORT, () => {
  console.log(`🚀 Groepscore server running on port ${PORT}`);
});
