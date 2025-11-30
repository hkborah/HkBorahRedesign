import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

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

      res.json({
        success: true,
        sessionId: session.id,
        transcript,
      });
    } catch (error) {
      console.error("Error saving chat:", error);
      res.status(500).json({ error: "Failed to save chat" });
    }
  });

  return httpServer;
}
