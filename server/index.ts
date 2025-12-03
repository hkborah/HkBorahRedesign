import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import cors from "cors";
import { createServer } from "http";
import path from "path";
import fs from "fs";
import { storage } from "./storage";

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
    
    // Handle blog posts with dynamic Open Graph meta tags for social sharing
    app.get("/journal/:id", async (req, res) => {
      try {
        const post = await storage.getBlogPost(req.params.id);
        const indexPath = path.join(distPath, "index.html");
        let html = fs.readFileSync(indexPath, "utf-8");
        
        if (post) {
          // Get the base URL for absolute image paths
          const baseUrl = `https://${req.get("host")}`;
          
          // Handle different image formats (base64, URL, or relative path)
          let imageUrl = post.image || "";
          if (!imageUrl || imageUrl.startsWith("data:")) {
            // No image or base64 images can't be used for OG tags, use default
            imageUrl = `${baseUrl}/favicon.png`;
          } else if (!imageUrl.startsWith("http")) {
            imageUrl = `${baseUrl}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
          }
          
          // Clean excerpt for meta description
          const description = (post.excerpt || "").replace(/"/g, "&quot;").substring(0, 200);
          const title = (post.title || "HK Borah").replace(/"/g, "&quot;");
          
          // Replace existing OG meta tags with dynamic ones
          html = html.replace(
            /<meta property="og:title" content="[^"]*" \/>/,
            `<meta property="og:title" content="${title}" />`
          );
          html = html.replace(
            /<meta property="og:description" content="[^"]*" \/>/,
            `<meta property="og:description" content="${description}" />`
          );
          html = html.replace(
            /<meta name="twitter:title" content="[^"]*" \/>/,
            `<meta name="twitter:title" content="${title}" />`
          );
          html = html.replace(
            /<meta name="twitter:description" content="[^"]*" \/>/,
            `<meta name="twitter:description" content="${description}" />`
          );
          
          // Add og:image and twitter:image tags (insert after og:type)
          const ogImageTag = `<meta property="og:image" content="${imageUrl}" />`;
          const twitterImageTag = `<meta name="twitter:image" content="${imageUrl}" />`;
          
          if (!html.includes('og:image')) {
            html = html.replace(
              /<meta property="og:type" content="[^"]*" \/>/,
              `<meta property="og:type" content="article" />\n    ${ogImageTag}`
            );
          }
          if (!html.includes('twitter:image')) {
            html = html.replace(
              /<meta name="twitter:card" content="[^"]*" \/>/,
              `<meta name="twitter:card" content="summary_large_image" />\n    ${twitterImageTag}`
            );
          }
        }
        
        res.send(html);
      } catch (error) {
        console.error("Error serving journal post:", error);
        res.sendFile(path.join(distPath, "index.html"));
      }
    });
    
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