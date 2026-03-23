export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método no permitido" });
    }

    const { symbol, timeframe } = req.body;

    const apiKey = process.env.TWELVEDATA_API_KEY;

    if (!apiKey) {
      throw new Error("Falta TWELVEDATA_API_KEY");
    }

    const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${timeframe}&apikey=${apiKey}`;

    const response = await fetch(url);
    const text = await response.text();

    if (!text) {
      throw new Error("Respuesta vacía de la API");
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("Respuesta inválida:", text);
      throw new Error("La API no devolvió JSON válido");
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error("ERROR:", error);
    return res.status(500).json({
      error: error.message
    });
  }
}
