import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { storage } from "./storage";

const socialCrawlers = [
  'linkedinbot',
  'facebookexternalhit',
  'twitterbot',
  'slackbot',
  'whatsapp',
  'telegrambot',
  'pinterest',
  'discordbot'
];

function isSocialCrawler(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return socialCrawlers.some(crawler => ua.includes(crawler));
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // Serve attached_assets as /assets for OG images
  const assetsPath = path.resolve(__dirname, "..", "attached_assets");
  app.use("/assets", express.static(assetsPath));

  app.use(express.static(distPath));

  // Handle blog post URLs for social media crawlers
  app.get("/journal/:id", async (req, res, next) => {
    const userAgent = req.headers['user-agent'] || '';
    
    if (!isSocialCrawler(userAgent)) {
      return next();
    }

    try {
      const post = await storage.getBlogPost(req.params.id);
      if (!post) {
        return next();
      }

      // Resolve image URL
      let imageUrl = post.image || '';
      if (imageUrl.startsWith('data:')) {
        // For base64 images, use a default OG image
        imageUrl = 'https://hkborah.com/og-default.png';
      } else if (imageUrl.startsWith('@assets/')) {
        // Map @assets paths to public URLs
        const assetPath = imageUrl.replace('@assets/', '');
        imageUrl = `https://hkborah.com/assets/${assetPath}`;
      } else if (!imageUrl.startsWith('http')) {
        imageUrl = `https://hkborah.com${imageUrl}`;
      }

      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${post.title} | HK Borah</title>
  <meta name="description" content="${post.excerpt || ''}" />
  
  <!-- Open Graph -->
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${post.title}" />
  <meta property="og:description" content="${post.excerpt || ''}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:url" content="https://hkborah.com/journal/${post.id}" />
  <meta property="og:site_name" content="HK Borah" />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${post.title}" />
  <meta name="twitter:description" content="${post.excerpt || ''}" />
  <meta name="twitter:image" content="${imageUrl}" />
  
  <!-- Redirect to actual page -->
  <meta http-equiv="refresh" content="0;url=https://hkborah.com/journal/${post.id}" />
</head>
<body>
  <h1>${post.title}</h1>
  <p>${post.excerpt || ''}</p>
</body>
</html>`;

      res.set('Content-Type', 'text/html');
      return res.send(html);
    } catch (error) {
      console.error('Error serving OG tags:', error);
      return next();
    }
  });

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
