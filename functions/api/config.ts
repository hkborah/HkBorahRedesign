export async function onRequestGet(context: any) {
  const { env } = context;
  return new Response(JSON.stringify({
    googleClientId: env.VITE_GOOGLE_CLIENT_ID || "",
    isProduction: true,
  }), {
    headers: { "Content-Type": "application/json" }
  });
}
