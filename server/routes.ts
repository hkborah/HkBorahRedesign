import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { google } from "googleapis";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";

import crypto from "crypto";
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(64).toString("hex");
const isProduction = process.env.NODE_ENV === "production";

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

  app.put("/api/blog/posts/:id", authenticateToken, async (req: AuthRequest, res) => {
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

  return httpServer;
}