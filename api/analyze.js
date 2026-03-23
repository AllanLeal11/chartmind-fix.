export default async function handler(request) {
  const headers = { "Content-Type": "application/json" };

  try {
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Método no permitido" }), { status: 405, headers });
    }

    const body = await request.json();
    const { symbol, timeframe } = body;

    if (!symbol || !timeframe) {
      return new Response(JSON.stringify({ error: "Faltan parámetros" }), { status: 400, headers });
    }

    const apiKey = process.env.TWELVEDATA_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Falta API KEY" }), { status: 500, headers });
    }

    const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${timeframe}&outputsize=100&apikey=${apiKey}`;

    // Timeout de 10 segundos
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    let response;
    try {
      response = await fetch(url, { signal: controller.signal });
    } catch (e) {
      return new Response(JSON.stringify({ 
        error: "Fetch falló", 
        detalle: e.message,
        url_intentada: url.replace(apiKey, "***") // oculta la key
      }), { status: 504, headers });
    } finally {
      clearTimeout(timeout);
    }

    const text = await response.text();

    if (!text) {
      return new Response(JSON.stringify({ error: "Respuesta vacía" }), { status: 500, headers });
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return new Response(JSON.stringify({ error: "No es JSON válido", raw: text }), { status: 500, headers });
    }

    if (data.status === "error") {
      return new Response(JSON.stringify({ error: data.message }), { status: 502, headers });
    }

    return new Response(JSON.stringify(data), { status: 200, headers });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers });
  }
}
