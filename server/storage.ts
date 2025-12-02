import { type User, type InsertUser, type ChatSession, type BlogPost, type InsertBlogPost } from "@shared/schema";
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";

// Initialize database connection
const db = drizzle(process.env.DATABASE_URL!, { schema });

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPassword(username: string, newPasswordHash: string): Promise<boolean>;
  saveChatSession(transcript: string): Promise<ChatSession>;
  getAllChatSessions(): Promise<ChatSession[]>;
  getChatSession(id: string): Promise<ChatSession | undefined>;
  getAllBlogPosts(): Promise<BlogPost[]>;
  getLatestBlogPosts(limit: number): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, post: InsertBlogPost): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<boolean>;
}

export class DrizzleStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.query.users.findFirst({
      where: eq(schema.users.id, id),
    });
    return result;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.query.users.findFirst({
      where: eq(schema.users.username, username),
    });
    return result;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const result = await db.insert(schema.users).values({
      id,
      ...insertUser,
    }).returning();
    return result[0];
  }

  async updateUserPassword(username: string, newPasswordHash: string): Promise<boolean> {
    const result = await db.update(schema.users)
      .set({ password: newPasswordHash })
      .where(eq(schema.users.username, username))
      .returning();
    return result.length > 0;
  }

  async saveChatSession(transcript: string): Promise<ChatSession> {
    const id = randomUUID();
    const result = await db.insert(schema.chatSessions).values({
      id,
      transcript,
    }).returning();
    return result[0];
  }

  async getAllChatSessions(): Promise<ChatSession[]> {
    const sessions = await db.query.chatSessions.findMany({
      orderBy: (chatSessions, { desc }) => [desc(chatSessions.createdAt)],
    });
    return sessions;
  }

  async getChatSession(id: string): Promise<ChatSession | undefined> {
    const result = await db.query.chatSessions.findFirst({
      where: eq(schema.chatSessions.id, id),
    });
    return result;
  }

  async getAllBlogPosts(): Promise<BlogPost[]> {
    const posts = await db.query.blogPosts.findMany({
      orderBy: (blogPosts, { desc }) => [desc(blogPosts.createdAt)],
    });
    return posts;
  }

  async getLatestBlogPosts(limit: number): Promise<BlogPost[]> {
    const posts = await db.query.blogPosts.findMany({
      orderBy: (blogPosts, { desc }) => [desc(blogPosts.createdAt)],
      limit,
    });
    return posts;
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    const result = await db.query.blogPosts.findFirst({
      where: eq(schema.blogPosts.id, id),
    });
    return result;
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = randomUUID();
    const result = await db.insert(schema.blogPosts).values({
      id,
      ...insertPost,
    }).returning();
    return result[0];
  }

  async updateBlogPost(id: string, insertPost: InsertBlogPost): Promise<BlogPost | undefined> {
    const result = await db.update(schema.blogPosts)
      .set(insertPost)
      .where(eq(schema.blogPosts.id, id))
      .returning();
    return result[0];
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    const result = await db.delete(schema.blogPosts)
      .where(eq(schema.blogPosts.id, id));
    return true;
  }
}

export const storage = new DrizzleStorage();

// Initialize with default blog posts
const defaultBlogPosts = [
  {
    title: "Architecting an IPO-Ready Conglomerate",
    excerpt: "As an investor and advisor, I detail how the Architectural Scaling Framework was deployed to transform a chaotic, multi-vertical company into a disciplined, IPO-ready enterprise.",
    content: "A Longitudinal Case Study by H.K. Borah, Investor & Advisor\n\n# Case Study: Architecting a Vertically Integrated Growth Engine\n\nHow the Architectural Scaling Framework was deployed to transform a chaotic, multi-vertical company into a disciplined, IPO-ready enterprise.",
    date: "Nov 15, 2024",
    slug: "architecting-ipo-conglomerate",
    image: "@assets/generated_images/blueprint_architecture_framework_design.png",
    category: "FEATURED INTELLIGENCE"
  },
  {
    title: "The Six Sigma Secret to Startup Scaling",
    excerpt: "How a system from manufacturing can build you a flawless, repeatable growth engine by engineering chaos out of your operations.",
    content: "A Cross-Disciplinary Thesis\n\n# The Six Sigma Secret to Startup Scaling\n\nHow a system from manufacturing can build you a flawless, repeatable growth engine by engineering chaos out of your operations.",
    date: "Nov 8, 2024",
    slug: "six-sigma-scaling",
    image: "@assets/generated_images/six_sigma_manufacturing_process_flow.png",
    category: "THOUGHTS"
  },
  {
    title: "Your First Board Meeting Is Not a Report",
    excerpt: "Why the traditional board meeting is an architectural flaw, and how to transform it into your most valuable strategic asset.",
    content: "A Contrarian Manifesto\n\n# Your First Board Meeting Is Not a Report\n\nBy HK Borah\n\nPublished: 21 January, 2025\n\n## I. Introduction: The Unexamined Architectural Flaw in Startup Governance",
    date: "Nov 1, 2024",
    slug: "first-board-meeting",
    image: "@assets/generated_images/strategic_board_meeting_collaboration.png",
    category: "WAR STORIES"
  }
];

// Seed default posts if they don't exist
(async () => {
  try {
    const existingPosts = await storage.getAllBlogPosts();
    if (existingPosts.length === 0) {
      for (const post of defaultBlogPosts) {
        await storage.createBlogPost(post);
      }
    }
  } catch (error) {
    console.error("Error seeding blog posts:", error);
  }
})();
