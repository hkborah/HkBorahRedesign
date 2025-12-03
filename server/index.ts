import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import cors from "cors";
import { createServer } from "http";
import path from "path";

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Simple logging helper
function log(message: string) {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [express] ${message}`);
}

// Configure CORS to allow requests from your domains
app.use(cors({
  origin: [
    "https://hkborah.com",
    "https://www.hkborah.com",
    "https://hk-borah.web.app",
    // Allow Replit preview domains for development
    /https:\/\/.*\.replit\.dev$/,
    // Allow local development
    "http://localhost:5000",
    "http://0.0.0.0:5000"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const httpServer = createServer(app);
  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the index.html under
  // public is overwritten by react-router-dom router
  if (app.get("env") === "development") {
    const { setupVite } = await import("./vite");
    await setupVite(app, httpServer);
  } else {
    // In production, serve static files from dist/public
    const distPath = path.resolve(process.cwd(), "dist", "public");
    app.use(express.static(distPath));
    
    // Handle client-side routing - serve index.html for all non-API routes
    // Skip API routes and static assets (files with extensions)
    app.get("*", (req, res) => {
      const reqPath = req.path;
      // Don't serve index.html for API routes or files with extensions
      if (reqPath.startsWith("/api") || reqPath.includes(".")) {
        res.status(404).send("Not found");
        return;
      }
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client
  const port = 5000;
  httpServer.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();