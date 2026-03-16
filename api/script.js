// api/script.js — Vercel serverless function
// Actua como proxy entre el frontend y Google Apps Script
// Evita el problema de CORS

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzz0Ay5S19ffgDlYxVFJxIFZ7rgt-4strhct89NBuMwWpiqrloQojkowmvfA-eGlINa/exec";

export default async function handler(req, res) {
  // Headers CORS para el frontend
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const params = new URLSearchParams(req.query);
    const url    = `${SCRIPT_URL}?${params.toString()}`;

    const response = await fetch(url);
    const text     = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { ok: false, error: "Respuesta inválida del script", raw: text };
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}
