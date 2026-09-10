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
    const client = createClient({
      url: env.DATABASE_URL,
      authToken: env.DATABASE_AUTH_TOKEN,
    });
    
    const body = await request.json();
    
    // We generate a UUID manually since SQLite crypto.randomUUID() might not be available
    const id = crypto.randomUUID();
    const likes = 0;
    
    await client.execute({
      sql: "INSERT INTO blog_posts (id, title, category, excerpt, content, image, slug, date, likes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      args: [
        id, 
        body.title || "", 
        body.category || "", 
        body.excerpt || "", 
        body.content || "", 
        body.image || "", 
        body.slug || "", 
        body.date || new Date().toISOString(), 
        likes
      ]
    });
    
    const post = { id, ...body, likes };
    
    return new Response(JSON.stringify(post), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: "Failed to create blog post", details: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}
