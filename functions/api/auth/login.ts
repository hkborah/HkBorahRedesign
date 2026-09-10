import { createClient } from "@libsql/client/web";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function onRequestOptions(context: any) {
  return new Response(null, { headers: corsHeaders });
}

export async function onRequestPost(context: any) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const { credential } = body;

    if (!credential) {
      return new Response(JSON.stringify({ error: "Missing credential" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Verify Google ID token using Google's public endpoint
    const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
    if (!verifyRes.ok) {
      return new Response(JSON.stringify({ error: "Invalid Google token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const payload = await verifyRes.json();
    const email = payload.email?.toLowerCase();

    // STRICT ENFORCEMENT: Only superadmin can log in
    if (email !== "hkborah@gmail.com") {
      return new Response(JSON.stringify({ error: "Access denied. Only the super admin (hkborah@gmail.com) can log in." }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const client = createClient({
      url: env.DATABASE_URL,
      authToken: env.DATABASE_AUTH_TOKEN,
    });

    let result = await client.execute({
      sql: "SELECT * FROM users WHERE username = ?",
      args: [email]
    });

    let user = result.rows[0];

    // Create superadmin if not exists
    if (!user) {
      const id = crypto.randomUUID();
      await client.execute({
        sql: "INSERT INTO users (id, username, password) VALUES (?, ?, ?)",
        args: [id, email, "google-oauth"]
      });
      user = { id, username: email };
    }

    // Generate a simple base64 token payload for the frontend
    const token = btoa(JSON.stringify({ username: email, id: user.id, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }));

    return new Response(JSON.stringify({ success: true, token, user: { username: email } }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: "Authentication failed", details: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}

export async function onRequest(context: any) {
  const { request } = context;
  if (request.method !== "POST" && request.method !== "OPTIONS") {
    return new Response(JSON.stringify({ error: "Method not allowed. Use POST." }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}
