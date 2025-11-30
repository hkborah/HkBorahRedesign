import { type User, type InsertUser, type ChatSession } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  saveChatSession(transcript: string): Promise<ChatSession>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private chatSessions: Map<string, ChatSession>;

  constructor() {
    this.users = new Map();
    this.chatSessions = new Map();
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
}

export const storage = new MemStorage();
