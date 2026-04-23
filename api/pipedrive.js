export default async function handler(req, res) {
  // Allow requests from any origin (your dashboard)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  const apiKey = process.env.PIPEDRIVE_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "API key not configured" });

  // Build the Pipedrive URL from the incoming request path
  const path = req.query.path || "users/me";
  const params = new URLSearchParams(req.query);
  params.delete("path");
  params.set("api_token", apiKey);

  const pipedriveUrl = `https://api.pipedrive.com/v1/${path}?${params.toString()}`;

  try {
    const response = await fetch(pipedriveUrl);
    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Pipedrive request failed", detail: err.message });
  }
}
