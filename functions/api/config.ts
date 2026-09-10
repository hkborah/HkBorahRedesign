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

  if (request.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed. Use GET." }), { 
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  return new Response(JSON.stringify({
    googleClientId: env.VITE_GOOGLE_CLIENT_ID || "",
    isProduction: true,
  }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}
