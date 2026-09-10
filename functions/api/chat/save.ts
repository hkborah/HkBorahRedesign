import { createClient } from "@libsql/client/web";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function onRequest(context: any) {
  const { request, env } = context;

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed. Use POST." }), { 
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
  
  try {
    const data = await request.json();
    const messages = data.messages;
    const transcript = messages.map((msg: any) => `[${msg.role === "user" ? "FOUNDER" : "HK BORAH"}]:\n${msg.content}`).join("\n\n-------------------\n\n");

    const client = createClient({ url: env.DATABASE_URL, authToken: env.DATABASE_AUTH_TOKEN });
    const id = crypto.randomUUID();
    
    await client.execute({ sql: "INSERT INTO chat_sessions (id, transcript) VALUES (?, ?)", args: [id, transcript] });
    
    return new Response(JSON.stringify({ success: true, sessionId: id, transcript, googleDrive: null }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: "Failed to save chat", details: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}
