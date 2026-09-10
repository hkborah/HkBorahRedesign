import { createClient } from "@libsql/client/web";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders });
}

export async function onRequestPost(context: any) {
  const { env, request } = context;
  
  try {
    const data = await request.json();
    const messages = data.messages;

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Invalid messages" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
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
      googleDrive: null 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to save chat" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}
