export default async function handler(request) {
  return new Response(JSON.stringify({ ok: true, mensaje: "handler funcionando" }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}
