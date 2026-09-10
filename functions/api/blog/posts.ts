import { createClient } from "@libsql/client/web";

export async function onRequestGet(context: any) {
  const { env } = context;
  try {
    const client = createClient({
      url: env.DATABASE_URL,
      authToken: env.DATABASE_AUTH_TOKEN,
    });
    
    const result = await client.execute("SELECT * FROM blog_posts ORDER BY date DESC");
    
    return new Response(JSON.stringify(result.rows), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch blog posts" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
