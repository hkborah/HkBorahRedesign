import { type User, type InsertUser, type ChatSession, type BlogPost, type InsertBlogPost } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  saveChatSession(transcript: string): Promise<ChatSession>;
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, post: InsertBlogPost): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private chatSessions: Map<string, ChatSession>;
  private blogPosts: Map<string, BlogPost>;

  constructor() {
    this.users = new Map();
    this.chatSessions = new Map();
    this.blogPosts = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async saveChatSession(transcript: string): Promise<ChatSession> {
    const id = randomUUID();
    const session: ChatSession = {
      id,
      transcript,
      createdAt: new Date(),
    };
    this.chatSessions.set(id, session);
    return session;
  }

  async getAllBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values());
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = randomUUID();
    const post: BlogPost = {
      ...insertPost,
      id,
      createdAt: new Date(),
      image: insertPost.image || null,
      category: insertPost.category || null,
    };
    this.blogPosts.set(id, post);
    return post;
  }

  async updateBlogPost(id: string, insertPost: InsertBlogPost): Promise<BlogPost | undefined> {
    const post: BlogPost = {
      ...insertPost,
      id,
      createdAt: new Date(),
      image: insertPost.image || null,
      category: insertPost.category || null,
    };
    this.blogPosts.set(id, post);
    return post;
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    return this.blogPosts.delete(id);
  }
}

export const storage = new MemStorage();

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

// Seed default posts
(async () => {
  for (const post of defaultBlogPosts) {
    await storage.createBlogPost(post);
  }
})();
