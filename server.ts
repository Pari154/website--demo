import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON body parser
  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Example Monitor API (Simulated for now)
  const monitors: any[] = [];
  app.post("/api/monitor", (req, res) => {
    const { query, email, frequency } = req.body;
    monitors.push({ query, email, frequency, lastCheck: new Date() });
    console.log(`Setting up monitor for ${query} for ${email} every ${frequency}`);
    res.json({ success: true, message: "Monitor scheduled successfully" });
  });

  // Simulated Cron Job (runs every minute for demo purposes)
  setInterval(() => {
    if (monitors.length > 0) {
      console.log(`[CRON] Checking ${monitors.length} active monitors...`);
      // In a real app, we would run the Gemini search here and email the user
    }
  }, 60000);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
