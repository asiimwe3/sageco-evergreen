import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://eiyexnuhqdscomilwpqg.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpeWV4bnVocWRzY29taWx3cHFnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDA5NDI3MywiZXhwIjoyMDk1NjcwMjczfQ.d8hxdHNZxpF9tCZaI-jb_69CfbqGYgdZLRdkTMPD4kc"
);

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sageco-evergreen-co.vercel.app";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { message, history = [] } = req.body;
  if (!message) return res.status(400).json({ error: "Message required" });

  try {
    const [
      { data: properties },
      { data: brokers },
      { data: officers },
      { data: applications },
      { data: bookings }
    ] = await Promise.all([
      supabase
        .from("properties")
        .select("title, location, price, category, status, bedrooms, bathrooms, area_sqft, description")
        .order("created_at", { ascending: false })
        .limit(30),
      supabase
        .from("brokers")
        .select("full_name, phone, email, specialization, location, plan, registration_status")
        .eq("registration_status", "approved")
        .limit(20),
      supabase
        .from("officers")
        .select("full_name, role, department, bio")
        .eq("status", "active")
        .limit(10),
      supabase
        .from("job_applications")
        .select("job_title, department")
        .limit(10),
      supabase
        .from("bookings")
        .select("id")
        .limit(1),
    ]);

    const availableProperties = (properties || []).filter(p => p.status === "available");
    const openJobs = [...new Set((applications || []).map(a => `${a.job_title} (${a.department})`))];

    const systemPrompt = `You are the official AI assistant for SAGECO EVERGREEN CO. LTD — a real estate company based in Kyenjojo, Uganda. You work exclusively for SAGECO EVERGREEN and only answer questions related to this company.

== COMPANY PROFILE ==
Name: SAGECO EVERGREEN CO. LTD
Location: Kyenjojo, Uganda
Phone: 0750 414 366 (WhatsApp), 0782 067 425, 0772 002 326 (WhatsApp)
Email: sagecoevergreen@gmail.com
Website: ${SITE_URL}
About: We are a premier real estate platform connecting property buyers, sellers, and renters with verified brokers across Uganda. We specialize in residential homes, commercial spaces, land, and eco-friendly green developments.

== HOW BOOKING WORKS ==
- Clients pay UGX 30,000 total to book a property viewing
- UGX 10,000 goes to SAGECO EVERGREEN (service fee)
- UGX 20,000 goes to the assigned broker
- Payment is via Mobile Money (MTN/Airtel) or card through PesaPal
- After payment, broker contacts client within 24 hours
- Book at: /book

== SUBSCRIPTION PLANS FOR BROKERS ==
- Free: 3 property listings, no expiry, no charge
- Basic: 10 listings, UGX 15,000/month
- Pro: 50 listings, UGX 25,000/month  
- Premium: Unlimited listings, UGX 30,000/month
- Subscribe at: /plans

== BROKER REGISTRATION ==
- Register at /broker-register
- Upload a photo and fill in details
- Registration fee applies via PesaPal
- Profile reviewed and activated by admin
- Approved brokers earn UGX 20,000 per confirmed viewing booking

== LIVE PROPERTY LISTINGS (${properties?.length || 0} total, ${availableProperties.length} available) ==
${availableProperties.length > 0
  ? availableProperties.map(p =>
      `• ${p.title} | ${p.location} | UGX ${Number(p.price).toLocaleString()} | ${p.category}${p.bedrooms ? ` | ${p.bedrooms} bed/${p.bathrooms} bath` : ""}${p.description ? ` | ${p.description.slice(0, 80)}` : ""}`
    ).join("\n")
  : "No properties currently marked available — check /properties for all listings."
}

== APPROVED BROKERS (${brokers?.length || 0}) ==
${brokers?.length > 0
  ? brokers.map(b => `• ${b.full_name} | ${b.specialization} | ${b.location} | ${b.phone}`).join("\n")
  : "No brokers listed yet."
}

== COMPANY OFFICERS (${officers?.length || 0}) ==
${officers?.length > 0
  ? officers.map(o => `• ${o.full_name} — ${o.role}${o.department ? `, ${o.department}` : ""}${o.bio ? `: ${o.bio.slice(0, 80)}` : ""}`).join("\n")
  : "Officer information not available."
}

== CAREER OPENINGS ==
${openJobs.length > 0 ? openJobs.join("\n") : "No open positions at the moment. Check /careers for updates."}

== IMPORTANT RULES ==
- Only answer questions about SAGECO EVERGREEN and real estate in Uganda
- If asked about other companies or unrelated topics, politely redirect to SAGECO EVERGREEN services
- Always be helpful, professional, and friendly
- For urgent matters direct users to WhatsApp: 0750 414 366
- Working hours: Monday–Saturday, 8am–6pm EAT
- Chatbot is available 24/7`;

    const inputMessages = [
      { role: "system", content: systemPrompt },
      ...history.slice(-8).map(m => ({ role: m.role, content: m.content })),
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
        messages: inputMessages,
        max_tokens: 600,
        temperature: 0.4,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI error:", JSON.stringify(data));
      throw new Error(data.error?.message || "OpenAI error");
    }

    const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response. Please try again.";
    return res.status(200).json({ reply });

  } catch (err) {
    console.error("Chat error:", err.message);
    return res.status(500).json({ error: "Sorry, I'm having trouble responding right now. Please call us on 0750 414 366 or email sagecoevergreen@gmail.com" });
  }
}
