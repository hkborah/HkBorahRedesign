import { type User, type InsertUser, type ChatSession, type BlogPost, type InsertBlogPost, type PasswordResetToken } from "@shared/schema";
import { db } from "./db";
import { eq, inArray, desc } from "drizzle-orm";
import { users, chatSessions, blogPosts, passwordResetTokens } from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPassword(username: string, newPasswordHash: string): Promise<boolean>;
  saveChatSession(transcript: string): Promise<ChatSession>;
  getAllChatSessions(): Promise<ChatSession[]>;
  getChatSession(id: string): Promise<ChatSession | undefined>;
  deleteChatSession(id: string): Promise<boolean>;
  deleteChatSessions(ids: string[]): Promise<number>;
  deleteAllChatSessions(): Promise<number>;
  getAllBlogPosts(): Promise<BlogPost[]>;
  getLatestBlogPosts(limit: number): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, post: InsertBlogPost): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<boolean>;
  incrementBlogPostLikes(id: string): Promise<number>;
  createPasswordResetToken(username: string, token: string, expiresAt: Date): Promise<PasswordResetToken>;
  getValidPasswordResetToken(token: string): Promise<PasswordResetToken | undefined>;
  markPasswordResetTokenUsed(token: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserPassword(username: string, newPasswordHash: string): Promise<boolean> {
    const [updatedUser] = await db
      .update(users)
      .set({ password: newPasswordHash })
      .where(eq(users.username, username))
      .returning();
    return !!updatedUser;
  }

  async saveChatSession(transcript: string): Promise<ChatSession> {
    const [session] = await db.insert(chatSessions).values({ transcript }).returning();
    return session;
  }

  async getAllChatSessions(): Promise<ChatSession[]> {
    return await db.select().from(chatSessions).orderBy(desc(chatSessions.createdAt));
  }

  async getChatSession(id: string): Promise<ChatSession | undefined> {
    const [session] = await db.select().from(chatSessions).where(eq(chatSessions.id, id));
    return session;
  }

  async deleteChatSession(id: string): Promise<boolean> {
    const [deleted] = await db.delete(chatSessions).where(eq(chatSessions.id, id)).returning();
    return !!deleted;
  }

  async deleteChatSessions(ids: string[]): Promise<number> {
    if (ids.length === 0) return 0;
    const deleted = await db.delete(chatSessions).where(inArray(chatSessions.id, ids)).returning();
    return deleted.length;
  }

  async deleteAllChatSessions(): Promise<number> {
    const deleted = await db.delete(chatSessions).returning();
    return deleted.length;
  }

  async getAllBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  }

  async getLatestBlogPosts(limit: number): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt)).limit(limit);
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const randomLikes = Math.floor(Math.random() * 21) + 10;
    const [post] = await db.insert(blogPosts).values({ ...insertPost, likes: randomLikes }).returning();
    return post;
  }

  async updateBlogPost(id: string, insertPost: InsertBlogPost): Promise<BlogPost | undefined> {
    const [updatedPost] = await db
      .update(blogPosts)
      .set(insertPost)
      .where(eq(blogPosts.id, id))
      .returning();
    return updatedPost;
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    const [deleted] = await db.delete(blogPosts).where(eq(blogPosts.id, id)).returning();
    return !!deleted;
  }

  async incrementBlogPostLikes(id: string): Promise<number> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    if (!post) return 0;
    const newLikes = (post.likes ?? 0) + 1;
    await db.update(blogPosts).set({ likes: newLikes }).where(eq(blogPosts.id, id));
    return newLikes;
  }

  async createPasswordResetToken(username: string, token: string, expiresAt: Date): Promise<PasswordResetToken> {
    const [resetToken] = await db.insert(passwordResetTokens).values({ username, token, expiresAt }).returning();
    return resetToken;
  }

  async getValidPasswordResetToken(token: string): Promise<PasswordResetToken | undefined> {
    const [resetToken] = await db.select().from(passwordResetTokens).where(eq(passwordResetTokens.token, token));
    if (resetToken && resetToken.used === "false" && resetToken.expiresAt && resetToken.expiresAt > new Date()) {
        return resetToken;
    }
    return undefined;
  }

  async markPasswordResetTokenUsed(token: string): Promise<boolean> {
    const [updated] = await db
      .update(passwordResetTokens)
      .set({ used: "true" })
      .where(eq(passwordResetTokens.token, token))
      .returning();
    return !!updated;
  }
}

export const storage = new DatabaseStorage();
