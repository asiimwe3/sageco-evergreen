// Receives crash reports from the SAGECO Evergreen Android app and stores
// them as timestamped files in the private asiimwe3/sageco-crash-reports
// GitHub repository, so the developer can read them remotely.
//
// POST body: {
//   "report": "<full stack trace>",
//   "version": "4.1.0 (32)",
//   "device": "Samsung SM-A125F",
//   "androidVersion": "11"
// }

const OWNER = "asiimwe3";
const REPO = "sageco-crash-reports";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "post_only" });
  }

  try {
    const token = process.env.CRASH_GH_TOKEN;
    if (!token) {
      return res.status(500).json({ error: "token_not_configured" });
    }

    const body = typeof req.body === "object" ? req.body : JSON.parse(req.body || "{}");
    const report = String(body.report || "").slice(0, 20000);
    const version = String(body.version || "unknown").slice(0, 50);
    const device = String(body.device || "unknown").slice(0, 100);
    const androidVersion = String(body.androidVersion || "unknown").slice(0, 20);

    if (!report) {
      return res.status(400).json({ error: "empty_report" });
    }

    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const path = `crashes/${stamp}-${Math.random().toString(36).slice(2, 8)}.json`;
    const content = JSON.stringify(
      { received: new Date().toISOString(), version, device, androidVersion, report },
      null,
      2
    );

    const putResp = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
          "User-Agent": "sageco-crash-reporter",
        },
        body: JSON.stringify({
          message: `Crash report from ${device} (v${version})`,
          content: Buffer.from(content, "utf8").toString("base64"),
        }),
      }
    );

    if (!putResp.ok) {
      const detail = await putResp.text();
      return res.status(502).json({ error: "github_write_failed", detail: detail.slice(0, 300) });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: "server_error", detail: String(e).slice(0, 300) });
  }
}
