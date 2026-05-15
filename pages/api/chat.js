import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { message, history = [] } = req.body;
  if (!message) return res.status(400).json({ error: "Message required" });

  try {
    const [{ data: properties }, { data: brokers }, { data: applications }] =
      await Promise.all([
        supabase
          .from("properties")
          .select("title, location, price, category, status, bedrooms, bathrooms, area_sqft, description")
          .eq("status", "available")
          .order("created_at", { ascending: false })
          .limit(20),
        supabase
          .from("brokers")
          .select("full_name, phone, email, specialization, location, plan, registration_status")
          .eq("registration_status", "approved")
          .limit(20),
        supabase
          .from("job_applications")
          .select("job_title, department")
          .limit(10),
      ]);

    const openJobs = [...new Set((applications || []).map(a => `${a.job_title} (${a.department})`))];

    const liveData = `
COMPANY INFO:
- Name: SAGECO EVERGREEN CO. LTD
- Location: Kyenjojo, Uganda
- Phone: 0750 414 366 (WhatsApp), 0782 067 425, 0772 002 326
- Email: sagecoevergreen@gmail.com

AVAILABLE PROPERTIES (${properties?.length || 0} listings):
${properties?.map(p => `• ${p.title} | ${p.location} | UGX ${Number(p.price).toLocaleString()} | ${p.category}${p.bedrooms ? ` | ${p.bedrooms}bed/${p.bathrooms}bath` : ""}`).join("\n") || "No properties available right now."}

APPROVED BROKERS (${brokers?.length || 0}):
${brokers?.map(b => `• ${b.full_name} | ${b.specialization} | ${b.location} | ${b.phone}`).join("\n") || "No brokers listed."}

CAREER OPENINGS:
${openJobs.length ? openJobs.join("\n") : "Check /careers for updates."}

BOOKING INFO:
Clients pay UGX 30,000 total to book a viewing. Visit /book to get started.
    `.trim();

    // Build input array for Responses API
    // Prepend conversation history then the new user message with live data injected
    const inputMessages = [
      ...history.slice(-6).map(m => ({
        role: m.role,
        content: m.content,
      })),
      {
        role: "user",
        content: `${message}\n\n[LIVE SITE DATA]\n${liveData}`,
      },
    ];

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "OpenAI-Beta": "responses=v1",
      },
      body: JSON.stringify({
        prompt: {
          id: "pmpt_6a06cb6cdab081979f512da93ca5f10406038a73cf0331e1",
          version: "1",
        },
        input: inputMessages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI Responses API error:", JSON.stringify(data));
      throw new Error(data.error?.message || "OpenAI error");
    }

    // Extract text from the response output
    const output = data.output || [];
    let reply = "";
    for (const item of output) {
      if (item.type === "message" && Array.isArray(item.content)) {
        for (const block of item.content) {
          if (block.type === "output_text") {
            reply += block.text;
          }
        }
      }
    }

    if (!reply) reply = "Sorry, I couldn't generate a response. Please try again.";
    return res.status(200).json({ reply });

  } catch (err) {
    console.error("Chat error:", err.message);
    return res.status(500).json({ error: "Sorry, I'm having trouble responding. Please try again." });
  }
}
