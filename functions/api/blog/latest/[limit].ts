import { createClient } from "@libsql/client/web";

export async function onRequestGet(context: any) {
  const { env, params } = context;
  const limit = parseInt(params.limit) || 4;
  
  try {
    const client = createClient({
      url: env.DATABASE_URL,
      authToken: env.DATABASE_AUTH_TOKEN,
    });
    
    const result = await client.execute({
      sql: "SELECT * FROM blog_posts ORDER BY date DESC LIMIT ?",
      args: [limit]
    });
    
    return new Response(JSON.stringify(result.rows), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch latest blog posts" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
