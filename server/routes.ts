import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { google } from "googleapis";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";

import crypto from "crypto";
import fs from "fs";
import path from "path";

const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(64).toString("hex");
const isProduction = process.env.NODE_ENV === "production";

// Helper function to save base64 image to file
function saveBase64Image(base64Data: string, postId: string): string | null {
  try {
    const matches = base64Data.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) return null;
    
    const ext = matches[1] === "jpeg" ? "jpg" : matches[1];
    const imageData = Buffer.from(matches[2], "base64");
    
    const assetsDir = path.join(process.cwd(), "attached_assets", "blog_images");
    if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir, { recursive: true });
    }
    
    const filename = `blog_${postId.substring(0, 8)}_${Date.now()}.${ext}`;
    const filepath = path.join(assetsDir, filename);
    fs.writeFileSync(filepath, imageData);
    
    return `@assets/blog_images/${filename}`;
  } catch (error) {
    console.error("Error saving image:", error);
    return null;
  }
}

interface AuthRequest extends Request {
  user?: { username: string; id: string };
}

function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { username: string; id: string };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
}

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

const resetRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: "Too many password reset requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Google Drive integration - Standard Google Cloud Auth
// This matches how your live Cloud Run instance connects to Drive
async function getGoogleDriveClient() {
  try {
    // This automatically looks for credentials in your environment
    // (e.g., GOOGLE_APPLICATION_CREDENTIALS or default service account)
    const auth = new google.auth.GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    const authClient = await auth.getClient();
    return google.drive({ version: 'v3', auth: authClient });
  } catch (error) {
    console.error("Google Auth Error:", error);
    return null;
  }
}

async function saveToGoogleDrive(transcript: string, fileName: string) {
  try {
    const drive = await getGoogleDriveClient();
    if (!drive) {
      console.log('Google Drive not available - Auth failed or credentials missing');
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
  // Register object storage routes for file uploads
  registerObjectStorageRoutes(app);

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

      // Save to storage (Database)
      const session = await storage.saveChatSession(transcript);

      // Save to Google Drive
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

  // --- Chat Session Routes ---

  app.get("/api/chat/sessions", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const sessions = await storage.getAllChatSessions();
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching chat sessions:", error);
      res.status(500).json({ error: "Failed to fetch chat sessions" });
    }
  });

  app.get("/api/chat/sessions/:id", async (req, res) => {
    try {
      const session = await storage.getChatSession(req.params.id);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      console.error("Error fetching chat session:", error);
      res.status(500).json({ error: "Failed to fetch chat session" });
    }
  });

  app.delete("/api/chat/sessions/:id", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const deleted = await storage.deleteChatSession(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Session not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting chat session:", error);
      res.status(500).json({ error: "Failed to delete chat session" });
    }
  });

  app.post("/api/chat/sessions/delete-multiple", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids)) {
        return res.status(400).json({ error: "ids must be an array" });
      }
      const deleted = await storage.deleteChatSessions(ids);
      res.json({ success: true, deleted });
    } catch (error) {
      console.error("Error deleting chat sessions:", error);
      res.status(500).json({ error: "Failed to delete chat sessions" });
    }
  });

  app.delete("/api/chat/sessions", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const deleted = await storage.deleteAllChatSessions();
      res.json({ success: true, deleted });
    } catch (error) {
      console.error("Error deleting all chat sessions:", error);
      res.status(500).json({ error: "Failed to delete all chat sessions" });
    }
  });

  // --- Blog Routes ---

  app.get("/api/blog/posts", async (req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/latest/:limit", async (req, res) => {
    try {
      const limit = parseInt(req.params.limit) || 4;
      const posts = await storage.getLatestBlogPosts(limit);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching latest blog posts:", error);
      res.status(500).json({ error: "Failed to fetch latest blog posts" });
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

  app.post("/api/blog/posts", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const { title, category, excerpt, content, image, slug, date } = req.body;
      
      // First create the post (may have placeholder or base64 image)
      const post = await storage.createBlogPost({
        title,
        category,
        excerpt,
        content,
        image: image || "",
        slug,
        date,
      });
      
      // If image is base64, save to file and update post with real path
      if (image && image.startsWith("data:image")) {
        const savedPath = saveBase64Image(image, post.id);
        if (savedPath) {
          await storage.updateBlogPost(post.id, {
            title: post.title,
            category: post.category,
            excerpt: post.excerpt,
            content: post.content,
            image: savedPath,
            slug: post.slug,
            date: post.date,
          });
          post.image = savedPath;
        }
      }
      
      res.json(post);
    } catch (error) {
      console.error("Error creating blog post:", error);
      res.status(500).json({ error: "Failed to create blog post" });
    }
  });

  app.put("/api/blog/posts/:id", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const { title, category, excerpt, content, image, slug, date } = req.body;
      
      // Convert base64 image to file if needed (skip if already @assets path)
      let finalImage = image;
      if (image && image.startsWith("data:image")) {
        const savedPath = saveBase64Image(image, req.params.id);
        if (savedPath) {
          finalImage = savedPath;
        }
      }
      
      const post = await storage.updateBlogPost(req.params.id, {
        title,
        category,
        excerpt,
        content,
        image: finalImage,
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

  app.delete("/api/blog/posts/:id", authenticateToken, async (req: AuthRequest, res) => {
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

  // --- Blog Post Like Route ---
  app.post("/api/blog/posts/:id/like", async (req, res) => {
    try {
      const postId = req.params.id;
      
      if (!postId || typeof postId !== "string" || postId.length < 1) {
        return res.status(400).json({ error: "Invalid post ID" });
      }
      
      const post = await storage.getBlogPost(postId);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      
      const newLikeCount = await storage.incrementBlogPostLikes(postId);
      res.json({ success: true, likes: newLikeCount });
    } catch (error) {
      console.error("Error liking blog post:", error);
      res.status(500).json({ error: "Failed to like post" });
    }
  });

  // --- Authentication Routes ---
  app.post("/api/auth/login", authRateLimiter, async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }
      
      const user = await storage.getUserByUsername(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      const isHashed = user.password.startsWith('$2');
      let passwordValid = false;
      
      if (isHashed) {
        passwordValid = await bcrypt.compare(password, user.password);
      } else {
        passwordValid = password === user.password;
        if (passwordValid) {
          const hashedPassword = await bcrypt.hash(password, 10);
          await storage.updateUserPassword(email, hashedPassword);
        }
      }
      
      if (!passwordValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      const token = jwt.sign(
        { username: user.username, id: user.id },
        JWT_SECRET,
        { expiresIn: "24h" }
      );
      
      res.json({ success: true, token });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Authentication failed" });
    }
  });

  // --- Password Reset Routes ---
  app.post("/api/auth/forgot-password", resetRateLimiter, async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
      
      // Check if user exists
      const user = await storage.getUserByUsername(email);
      if (!user) {
        // Don't reveal if user exists - always return success
        return res.json({ success: true, message: "If an account exists with this email, a reset link will be sent." });
      }
      
      // Generate reset token (secure random string)
      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry
      
      // Save token to database
      await storage.createPasswordResetToken(email, token, expiresAt);
      
      // Build reset URL
      const resetUrl = `${req.headers.origin || 'https://hkborah.com'}/reset-password?token=${token}`;
      
      // Send email using Resend integration
      const { sendPasswordResetEmail } = await import("./email");
      const emailSent = await sendPasswordResetEmail(email, resetUrl);
      
      if (!emailSent) {
        console.error("Failed to send password reset email, but token was created");
      }
      
      res.json({ 
        success: true, 
        message: "If an account exists with this email, a reset link will be sent."
      });
    } catch (error) {
      console.error("Error requesting password reset:", error);
      res.status(500).json({ error: "Failed to process password reset request" });
    }
  });

  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      
      if (!token || !newPassword) {
        return res.status(400).json({ error: "Token and new password are required" });
      }
      
      if (newPassword.length < 6) {
        return res.status(400).json({ error: "New password must be at least 6 characters" });
      }
      
      // Validate token
      const resetToken = await storage.getValidPasswordResetToken(token);
      if (!resetToken) {
        return res.status(400).json({ error: "Invalid or expired reset token" });
      }
      
      // Hash and save new password
      const saltRounds = 10;
      const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);
      const updated = await storage.updateUserPassword(resetToken.username, newPasswordHash);
      
      if (!updated) {
        return res.status(500).json({ error: "Failed to update password" });
      }
      
      // Mark token as used
      await storage.markPasswordResetTokenUsed(token);
      
      res.json({ success: true, message: "Password has been reset successfully" });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ error: "Failed to reset password" });
    }
  });

  // --- Password Change Route ---
  app.post("/api/auth/change-password", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const username = req.user?.username;
      
      if (!username || !currentPassword || !newPassword) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      
      if (newPassword.length < 6) {
        return res.status(400).json({ error: "New password must be at least 6 characters" });
      }
      
      // Get user and verify current password
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Check if password is hashed (starts with $2) or plaintext
      const isHashed = user.password.startsWith('$2');
      let passwordValid = false;
      
      if (isHashed) {
        passwordValid = await bcrypt.compare(currentPassword, user.password);
      } else {
        passwordValid = currentPassword === user.password;
      }
      
      if (!passwordValid) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }
      
      // Hash and save new password
      const saltRounds = 10;
      const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);
      const updated = await storage.updateUserPassword(username, newPasswordHash);
      
      if (!updated) {
        return res.status(500).json({ error: "Failed to update password" });
      }
      
      res.json({ success: true, message: "Password changed successfully" });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({ error: "Failed to change password" });
    }
  });

  // Admin endpoint to convert base64 images to files for social media sharing
  app.post("/api/admin/convert-images", authenticateToken, async (req: AuthRequest, res) => {
    try {
      // Get all blog posts with base64 images
      const posts = await storage.getAllBlogPosts();
      const base64Posts = posts.filter((p: { image?: string | null }) => p.image && p.image.startsWith("data:image"));
      
      console.log(`Found ${base64Posts.length} posts with base64 images`);
      
      const assetsDir = path.join(process.cwd(), "attached_assets", "blog_images");
      if (!fs.existsSync(assetsDir)) {
        fs.mkdirSync(assetsDir, { recursive: true });
      }
      
      const converted: string[] = [];
      
      for (const post of base64Posts) {
        const base64Data = post.image!;
        
        // Extract mime type and data
        const matches = base64Data.match(/^data:image\/(\w+);base64,(.+)$/);
        if (!matches) {
          console.log(`Skipping ${post.id} - invalid format`);
          continue;
        }
        
        const ext = matches[1] === "jpeg" ? "jpg" : matches[1];
        const imageData = Buffer.from(matches[2], "base64");
        
        // Create filename from post ID
        const filename = `blog_${post.id.substring(0, 8)}.${ext}`;
        const filepath = path.join(assetsDir, filename);
        
        // Save image file
        fs.writeFileSync(filepath, imageData);
        console.log(`Saved: ${filename}`);
        
        // Update database with new path
        const newImagePath = `@assets/blog_images/${filename}`;
        await storage.updateBlogPost(post.id, {
          title: post.title,
          category: post.category,
          excerpt: post.excerpt,
          content: post.content,
          image: newImagePath,
          slug: post.slug,
          date: post.date,
        });
        converted.push(post.title);
        console.log(`Updated DB: ${post.title.substring(0, 40)}...`);
      }
      
      res.json({ 
        success: true, 
        message: `Converted ${converted.length} images`,
        converted 
      });
    } catch (error) {
      console.error("Error converting images:", error);
      res.status(500).json({ error: "Failed to convert images" });
    }
  });

  // Admin endpoint to backup blog posts to JSON file
  app.post("/api/admin/backup-posts", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      
      // Create backup directory
      const backupDir = path.join(process.cwd(), "data");
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }
      
      // Save posts to JSON file
      const backupPath = path.join(backupDir, "blog_posts_backup.json");
      fs.writeFileSync(backupPath, JSON.stringify(posts, null, 2));
      
      console.log(`Backed up ${posts.length} posts to ${backupPath}`);
      
      res.json({ 
        success: true, 
        message: `Backed up ${posts.length} blog posts to data/blog_posts_backup.json`,
        postCount: posts.length
      });
    } catch (error) {
      console.error("Error backing up posts:", error);
      res.status(500).json({ error: "Failed to backup posts" });
    }
  });

  return httpServer;
}