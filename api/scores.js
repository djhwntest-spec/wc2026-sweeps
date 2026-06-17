// Vercel Serverless Function — proxies football-data.org so the browser
// can fetch it without CORS issues. Token lives as Vercel env var.

export default async function handler(req, res) {
  const token = process.env.FOOTBALL_DATA_TOKEN;
  if (!token) {
    res.status(500).json({ error: "FOOTBALL_DATA_TOKEN not set in Vercel environment variables" });
    return;
  }
  try {
    const resp = await fetch(
      "https://api.football-data.org/v4/competitions/WC/matches",
      { headers: { "X-Auth-Token": token } }
    );
    const text = await resp.text();
    res.status(resp.status);
    res.setHeader("content-type", "application/json");
    res.setHeader("cache-control", "public, max-age=60");
    res.setHeader("access-control-allow-origin", "*");
    res.send(text);
  } catch (err) {
    res.status(502).json({ error: "Proxy fetch failed: " + (err && err.message ? err.message : String(err)) });
  }
}
