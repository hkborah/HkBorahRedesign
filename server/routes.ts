import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { google } from "googleapis";

// Google Drive integration - based on Replit blueprint
let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    console.warn('X_REPLIT_TOKEN not found - Google Drive integration unavailable');
    return null;
  }

  try {
    connectionSettings = await fetch(
      'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=google-drive',
      {
        headers: {
          'Accept': 'application/json',
          'X-Replit-Token': xReplitToken
        }
      }
    ).then(res => res.json()).then(data => data.items?.[0]);

    const accessToken = connectionSettings?.settings?.access_token || connectionSettings?.settings?.oauth?.credentials?.access_token;

    if (!connectionSettings || !accessToken) {
      console.warn('Google Drive not connected');
      return null;
    }
    return accessToken;
  } catch (err) {
    console.error('Error getting access token:', err);
    return null;
  }
}

async function getUncachableGoogleDriveClient() {
  const accessToken = await getAccessToken();
  if (!accessToken) return null;

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: accessToken
  });

  return google.drive({ version: 'v3', auth: oauth2Client });
}

async function saveToGoogleDrive(transcript: string, fileName: string) {
  try {
    const drive = await getUncachableGoogleDriveClient();
    if (!drive) {
      console.log('Google Drive not available, saving to database only');
      return null;
    }

    // Get or create HK Borah folder
    let folderId: string | null = null;
    
    // Search for folder named "HK Borah Ideas"
    const folderSearch = await drive.files.list({
      q: "name='HK Borah Ideas' and mimeType='application/vnd.google-apps.folder' and trashed=false",
      spaces: 'drive',
      fields: 'files(id, name)',
      pageSize: 1,
    });

    if (folderSearch.data.files && folderSearch.data.files.length > 0) {
      folderId = folderSearch.data.files[0].id!;
    } else {
      // Create folder if it doesn't exist
      const folderRes = await drive.files.create({
        requestBody: {
          name: 'HK Borah Ideas',
          mimeType: 'application/vnd.google-apps.folder',
        },
        fields: 'id',
      });
      folderId = folderRes.data.id!;
    }

    // Save transcript file
    const fileRes = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [folderId],
        mimeType: 'text/plain',
      },
      media: {
        mimeType: 'text/plain',
        body: transcript,
      },
      fields: 'id, webViewLink',
    });

    return {
      fileId: fileRes.data.id,
      link: fileRes.data.webViewLink
    };
  } catch (error) {
    console.error('Error saving to Google Drive:', error);
    return null;
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/chat/save", async (req, res) => {
    try {
      const { messages } = req.body;
      
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid messages" });
      }

      // Format transcript from messages
      const transcript = messages
        .map((msg: any) => {
          const role = msg.role === "user" ? "FOUNDER" : "HK BORAH";
          return `[${role}]:\n${msg.content}`;
        })
        .join("\n\n-------------------\n\n");

      // Save to storage
      const session = await storage.saveChatSession(transcript);

      // Attempt to save to Google Drive with timestamp to ensure unique files
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const fileName = `HK_Borah_Idea_Clinic_${timestamp}.txt`;
      const driveResult = await saveToGoogleDrive(transcript, fileName);

      res.json({
        success: true,
        sessionId: session.id,
        transcript,
        googleDrive: driveResult || null,
      });
    } catch (error) {
      console.error("Error saving chat:", error);
      res.status(500).json({ error: "Failed to save chat" });
    }
  });

  app.get("/api/blog/posts", async (req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/posts/:id", async (req, res) => {
    try {
      const post = await storage.getBlogPost(req.params.id);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  app.post("/api/blog/posts", async (req, res) => {
    try {
      const { title, category, excerpt, content, image, slug, date } = req.body;
      const post = await storage.createBlogPost({
        title,
        category,
        excerpt,
        content,
        image,
        slug,
        date,
      });
      res.json(post);
    } catch (error) {
      console.error("Error creating blog post:", error);
      res.status(500).json({ error: "Failed to create blog post" });
    }
  });

  app.put("/api/blog/posts/:id", async (req, res) => {
    try {
      const { title, category, excerpt, content, image, slug, date } = req.body;
      const post = await storage.updateBlogPost(req.params.id, {
        title,
        category,
        excerpt,
        content,
        image,
        slug,
        date,
      });
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error updating blog post:", error);
      res.status(500).json({ error: "Failed to update blog post" });
    }
  });

  app.delete("/api/blog/posts/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteBlogPost(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ error: "Failed to delete blog post" });
    }
  });

  return httpServer;
}
