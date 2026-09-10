import { createClient } from "@libsql/client/web";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function onRequest(context: any) {
  const { request, env, params } = context;
  
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed. Use GET." }), { 
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  const limit = parseInt(params.limit) || 4;
  
  try {
    const client = createClient({
      url: env.DATABASE_URL,
      authToken: env.DATABASE_AUTH_TOKEN,
    });
    
    const result = await client.execute({ sql: "SELECT * FROM blog_posts ORDER BY date DESC LIMIT ?", args: [limit] });
    
    return new Response(JSON.stringify(result.rows), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: "Failed to fetch", details: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}
