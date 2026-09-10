import { createClient } from "@libsql/client/web";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function onRequest(context: any) {
  const { request, env, params } = context;
  
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const id = params.id;
  
  try {
    const client = createClient({
      url: env.DATABASE_URL,
      authToken: env.DATABASE_AUTH_TOKEN,
    });
    
    if (request.method === "GET") {
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
    }
    
    if (request.method === "PUT") {
      const body = await request.json();
      await client.execute({
        sql: "UPDATE blog_posts SET title=?, category=?, excerpt=?, content=?, image=?, slug=?, date=? WHERE id=?",
        args: [body.title || "", body.category || "", body.excerpt || "", body.content || "", body.image || "", body.slug || "", body.date || "", id]
      });
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    
    if (request.method === "DELETE") {
      await client.execute({
        sql: "DELETE FROM blog_posts WHERE id=?",
        args: [id]
      });
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Method not allowed. Use GET, PUT, or DELETE." }), { 
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
    
  } catch (error: any) {
    return new Response(JSON.stringify({ error: "Failed to process request", details: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}
