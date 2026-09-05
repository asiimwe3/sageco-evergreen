// Polling endpoint for the crash-alert pipeline.
//
// The scheduled Base44 workflow calls this every 15 minutes (via a backend
// function) to check for new crash reports. It reads crash files from the
// private asiimwe3/sageco-crash-reports repo that have not been processed
// yet, returns them, and advances the marker file (_processed.json at the
// repo root) so the same crash is never reported twice.
//
// GET /api/crash-pending   (header: x-poll-key: <CRASH_POLL_KEY>)
// Response: { "newCrashes": [ {file, received, version, device, androidVersion, report}, ... ] }

const OWNER = "asiimwe3";
const REPO = "sageco-crash-reports";
const MARKER_PATH = "_processed.json";
const MAX_PER_POLL = 5;

function gh(token, path, options = {}) {
  return fetch(`https://api.github.com/repos/${OWNER}/${REPO}/${path}`, {
    ...options,
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "User-Agent": "sageco-crash-reporter",
      ...(options.headers || {}),
    },
  });
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  if (req.method !== "GET") {
    return res.status(405).json({ error: "get_only" });
  }

  try {
    const expectedKey = process.env.CRASH_POLL_KEY;
    if (!expectedKey || req.headers["x-poll-key"] !== expectedKey) {
      return res.status(401).json({ error: "unauthorized" });
    }

    const token = process.env.CRASH_GH_TOKEN_B64
      ? Buffer.from(process.env.CRASH_GH_TOKEN_B64, "base64").toString("utf8")
      : null;
    if (!token) {
      return res.status(500).json({ error: "token_not_configured" });
    }

    // 1. List crash files first (ISO-timestamp names sort correctly).
    const listResp = await gh(token, "contents/crashes");
    if (listResp.status === 404) {
      return res.status(200).json({ newCrashes: [] });
    }
    if (!listResp.ok) {
      const detail = await listResp.text();
      return res.status(502).json({ error: "github_list_failed", detail: detail.slice(0, 300) });
    }
    const files = (await listResp.json())
      .map((f) => f.name)
      .filter((n) => n.endsWith(".json"))
      .sort();

    // 2. Read the marker (last processed crash filename).
    let markerSha = null;
    let last = null;
    const markerResp = await gh(token, `contents/${MARKER_PATH}`);

    if (markerResp.status === 404) {
      // First contact ever: create the marker IMMEDIATELY, pointing at the
      // newest existing file. This guarantees the next poll has a marker, so
      // no crash submitted later can be swallowed by a repeat "first run".
      // Crashes already in the repo are considered pre-existing history.
      const initial = files.length ? files[files.length - 1] : "";
      const putResp = await gh(token, `contents/${MARKER_PATH}`, {
        method: "PUT",
        body: JSON.stringify({
          message: "Initialize crash poll marker",
          content: Buffer.from(JSON.stringify({ last: initial }, null, 2), "utf8").toString("base64"),
        }),
      });
      if (!putResp.ok) {
        // Could not establish the marker - fail loudly so we retry next poll
        // instead of silently losing anything submitted meanwhile.
        return res.status(502).json({ error: "marker_init_failed" });
      }
      return res.status(200).json({ newCrashes: [] });
    }
    if (!markerResp.ok) {
      return res.status(502).json({ error: "marker_read_failed" });
    }
    const marker = await markerResp.json();
    markerSha = marker.sha;
    last = (JSON.parse(Buffer.from(marker.content, "base64").toString("utf8")) || {}).last || "";

    // 3. Pick unprocessed files (names sort after the marker).
    const pending = files.filter((n) => n > last);
    const batch = pending.slice(0, MAX_PER_POLL);

    // 4. Fetch the content of each new crash file.
    const newCrashes = [];
    for (const name of batch) {
      const fileResp = await gh(token, `contents/crashes/${name}`);
      if (!fileResp.ok) continue;
      const file = await fileResp.json();
      try {
        const parsed = JSON.parse(Buffer.from(file.content, "base64").toString("utf8"));
        newCrashes.push({ file: name, ...parsed });
      } catch {
        newCrashes.push({ file: name, report: "(unreadable report)" });
      }
    }

    // 5. Advance the marker to the newest file we processed.
    if (batch.length) {
      const putResp = await gh(token, `contents/${MARKER_PATH}`, {
        method: "PUT",
        body: JSON.stringify({
          message: "Advance crash poll marker",
          content: Buffer.from(
            JSON.stringify({ last: batch[batch.length - 1] }, null, 2),
            "utf8"
          ).toString("base64"),
          sha: markerSha,
        }),
      });
      if (!putResp.ok) {
        // Marker failed to advance - return the crashes but flag it, so the
        // caller knows the next poll may repeat them.
        return res.status(200).json({ newCrashes, markerError: true });
      }
    }

    return res.status(200).json({ newCrashes });
  } catch (e) {
    return res.status(500).json({ error: "server_error", detail: String(e).slice(0, 300) });
  }
}
