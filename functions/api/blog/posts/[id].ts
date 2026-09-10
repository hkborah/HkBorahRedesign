import { createClient } from "@libsql/client/web";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders });
}

export async function onRequestGet(context: any) {
  const { env, params } = context;
  const id = params.id;
  
  try {
    const client = createClient({
      url: env.DATABASE_URL,
      authToken: env.DATABASE_AUTH_TOKEN,
    });
    
    let result = await client.execute({
      sql: "SELECT * FROM blog_posts WHERE id = ?",
      args: [id]
    });
    
    if (result.rows.length === 0) {
      result = await client.execute({
        sql: "SELECT * FROM blog_posts WHERE slug = ?",
        args: [id]
      });
    }
    
    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: "Post not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    
    return new Response(JSON.stringify(result.rows[0]), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch blog post" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}
