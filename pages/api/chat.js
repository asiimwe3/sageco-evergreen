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

    // Get unique open job titles
    const openJobs = [...new Set((applications || []).map(a => `${a.job_title} (${a.department})`))];

    const context = `
You are a friendly and professional customer support assistant for SAGECO EVERGREEN CO. LTD, a premier real estate company based in Kyenjojo, Uganda.
Be concise, warm, and helpful. Use simple language. Answer questions about properties, brokers, careers, and how to book viewings.
Never make up data — only use what is provided below.
For bookings direct users to /book. For careers direct to /careers. For contact direct to /contact or WhatsApp +256750414366.

COMPANY INFO:
- Name: SAGECO EVERGREEN CO. LTD
- Location: Kyenjojo, Uganda
- Phone: 0750 414 366 (WhatsApp), 0782 067 425, 0772 002 326
- Email: sagecoevergreen@gmail.com
- Website: https://sageco-evergreen-rho.vercel.app

AVAILABLE PROPERTIES (${properties?.length || 0} listings):
${properties?.map(p => `• ${p.title} | ${p.location} | UGX ${Number(p.price).toLocaleString()} | ${p.category}${p.bedrooms ? ` | ${p.bedrooms}bed/${p.bathrooms}bath` : ""} | ${p.area_sqft} sqft`).join("\n") || "No properties available right now."}

APPROVED BROKERS (${brokers?.length || 0}):
${brokers?.map(b => `• ${b.full_name} | ${b.specialization} | ${b.location} | ${b.phone} | ${b.email} | Plan: ${b.plan}`).join("\n") || "No brokers listed."}

CAREER OPENINGS:
${openJobs.length ? openJobs.map(j => `• ${j}`).join("\n") : "No open positions currently. Check /careers for updates."}

HOW TO BOOK A VIEWING:
Clients pay UGX 30,000 (split: UGX 10,000 to SAGECO, UGX 20,000 to the broker). Visit /book to get started.
`.trim();

    const messages = [
      { role: "system", content: context },
      ...history.slice(-6),
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
    console.error("Chat error:", err.message);
    return res.status(500).json({ error: "Sorry, I'm having trouble responding. Please try again." });
  }
}
