import { createClient } from "@libsql/client/web";

export async function onRequestPost(context: any) {
  const { env, request } = context;
  
  try {
    const data = await request.json();
    const messages = data.messages;

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Invalid messages" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const transcript = messages
      .map((msg: any) => {
        const role = msg.role === "user" ? "FOUNDER" : "HK BORAH";
        return `[${role}]:\n${msg.content}`;
      })
      .join("\n\n-------------------\n\n");

    const client = createClient({
      url: env.DATABASE_URL,
      authToken: env.DATABASE_AUTH_TOKEN,
    });
    
    // Save to Turso via raw SQL
    // We generate a UUID manually since SQLite crypto.randomUUID() might not be available
    const id = crypto.randomUUID();
    
    await client.execute({
      sql: "INSERT INTO chat_sessions (id, transcript) VALUES (?, ?)",
      args: [id, transcript]
    });
    
    return new Response(JSON.stringify({
      success: true,
      sessionId: id,
      transcript,
      googleDrive: null // Google Drive save only happens via the AI Studio Admin Panel
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to save chat" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
