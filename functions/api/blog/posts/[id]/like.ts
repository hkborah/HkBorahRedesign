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
  const { env, params } = context;
  const id = params.id;
  
  try {
    const client = createClient({
      url: env.DATABASE_URL,
      authToken: env.DATABASE_AUTH_TOKEN,
    });
    
    const post = await client.execute({
      sql: "SELECT id FROM blog_posts WHERE id = ?",
      args: [id]
    });
    
    if (post.rows.length === 0) {
      return new Response(JSON.stringify({ error: "Post not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    
    await client.execute({
      sql: "UPDATE blog_posts SET likes = likes + 1 WHERE id = ?",
      args: [id]
    });
    
    const updated = await client.execute({
      sql: "SELECT likes FROM blog_posts WHERE id = ?",
      args: [id]
    });
    
    return new Response(JSON.stringify({ success: true, likes: updated.rows[0].likes }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to like post" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}
