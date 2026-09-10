import { createClient } from "@libsql/client/web";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function onRequest(context: any) {
  const { request, env } = context;

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method === "GET") {
    try {
      const client = createClient({
        url: env.DATABASE_URL,
        authToken: env.DATABASE_AUTH_TOKEN,
      });

      const result = await client.execute("SELECT * FROM chat_sessions ORDER BY created_at DESC");

      const sessions = result.rows.map((row: any) => ({
        id: row.id,
        transcript: row.transcript,
        createdAt: row.created_at || new Date().toISOString()
      }));

      return new Response(JSON.stringify(sessions), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    } catch (error: any) {
      return new Response(JSON.stringify({ error: "Failed to fetch chat sessions", details: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  }
  
  if (request.method === "DELETE") {
    try {
      const client = createClient({
        url: env.DATABASE_URL,
        authToken: env.DATABASE_AUTH_TOKEN,
      });

      await client.execute("DELETE FROM chat_sessions");

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    } catch (error: any) {
      return new Response(JSON.stringify({ error: "Failed to delete chat sessions", details: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  }

  return new Response(JSON.stringify({ error: "Method not allowed. Use GET or DELETE." }), {
    status: 405,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}
