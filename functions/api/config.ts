const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders });
}

export async function onRequestGet(context: any) {
  const { env } = context;
  return new Response(JSON.stringify({
    googleClientId: env.VITE_GOOGLE_CLIENT_ID || "",
    isProduction: true,
  }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}
