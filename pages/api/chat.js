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
    // Fetch latest data from Supabase
    const [{ data: properties }, { data: brokers }, { data: projects }, { data: careers }] =
      await Promise.all([
        supabase.from("properties").select("title, location, price, type, status, bedrooms, bathrooms, size_sqft").order("created_at", { ascending: false }).limit(20),
        supabase.from("brokers").select("full_name, phone, email, specialization, location").limit(20),
        supabase.from("projects").select("name, description, location, status").limit(20),
        supabase.from("careers").select("title, department, type, location").limit(10),
      ]);

    const context = `
You are a helpful customer support assistant for SAGECO EVERGREEN, a premier real estate platform in Uganda.
Be friendly, professional, and concise. Answer questions about properties, brokers, projects, careers, and bookings.
If someone wants to book a viewing, direct them to /book. For contact, direct to /contact.

CURRENT LIVE DATA (as of now):

PROPERTIES (${properties?.length || 0} listings):
${properties?.map(p => `- ${p.title} | ${p.location} | UGX ${p.price?.toLocaleString()} | ${p.type} | ${p.bedrooms}bed/${p.bathrooms}bath | ${p.size_sqft}sqft | Status: ${p.status}`).join("\n") || "No properties listed."}

BROKERS (${brokers?.length || 0} available):
${brokers?.map(b => `- ${b.full_name} | ${b.specialization} | ${b.location} | ${b.phone} | ${b.email}`).join("\n") || "No brokers listed."}

GREEN PROJECTS (${projects?.length || 0}):
${projects?.map(p => `- ${p.name} | ${p.location} | ${p.status}: ${p.description}`).join("\n") || "No projects listed."}

CAREERS (${careers?.length || 0} openings):
${careers?.map(c => `- ${c.title} | ${c.department} | ${c.type} | ${c.location}`).join("\n") || "No open positions."}
`.trim();

    // Build messages array
    const messages = [
      { role: "system", content: context },
      ...history.slice(-6), // keep last 6 messages for context
      { role: "user", content: message },
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "OpenAI error");

    const reply = data.choices[0].message.content;
    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Chat error:", err);
    return res.status(500).json({ error: "Sorry, I'm having trouble responding. Please try again." });
  }
}
