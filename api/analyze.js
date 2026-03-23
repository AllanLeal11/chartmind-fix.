export default async function handler(request) {
  try {
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Método no permitido" }), {
        status: 405
      });
    }

    const body = await request.json();
    const { symbol, timeframe } = body;

    const apiKey = process.env.TWELVEDATA_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Falta API KEY" }), {
        status: 500
      });
    }

    const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${timeframe}&apikey=${apiKey}`;

    const response = await fetch(url);
    const text = await response.text();

    if (!text) {
      return new Response(JSON.stringify({ error: "Respuesta vacía" }), {
        status: 500
      });
    }

    let data;

    try {
      data = JSON.parse(text);
    } catch (e) {
      return new Response(JSON.stringify({ error: "No es JSON válido", raw: text }), {
        status: 500
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200
    });

  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 500
    });
  }
}
