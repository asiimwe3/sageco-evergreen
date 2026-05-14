import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const RESEND_API_KEY = process.env.RESEND_API_KEY
const NOTIFY_EMAIL = "derickasiimwe849@gmail.com"
const FROM_EMAIL = "SAGECO EVERGREEN <onboarding@resend.dev>"

async function sendEmail(subject, html) {
  if (!RESEND_API_KEY) {
    console.warn("No RESEND_API_KEY — skipping email")
    return
  }
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [NOTIFY_EMAIL],
      subject,
      html
    })
  })
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()

  const {
    job_id, job_title, department,
    full_name, email, phone,
    cover_letter, experience, cv_url
  } = req.body

  if (!full_name || !email || !phone || !job_id) {
    return res.status(400).json({ error: "Missing required fields" })
  }

  try {
    // Save to Supabase
    const { error } = await supabase.from("job_applications").insert([{
      job_id,
      job_title,
      department,
      full_name,
      email,
      phone,
      cover_letter: cover_letter || null,
      experience: experience || null,
      cv_url: cv_url || null,
      status: "received"
    }])

    if (error) console.error("DB insert error:", error.message)

    // Send email notification
    await sendEmail(
      `New Job Application — ${job_title}`,
      `<div style="font-family:sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#16a34a">New Application Received</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px;font-weight:bold;color:#555">Position</td><td style="padding:8px">${job_title}</td></tr>
          <tr style="background:#f9f9f9"><td style="padding:8px;font-weight:bold;color:#555">Department</td><td style="padding:8px">${department || "N/A"}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;color:#555">Name</td><td style="padding:8px">${full_name}</td></tr>
          <tr style="background:#f9f9f9"><td style="padding:8px;font-weight:bold;color:#555">Email</td><td style="padding:8px"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding:8px;font-weight:bold;color:#555">Phone</td><td style="padding:8px">${phone}</td></tr>
          <tr style="background:#f9f9f9"><td style="padding:8px;font-weight:bold;color:#555">Experience</td><td style="padding:8px">${experience || "Not specified"}</td></tr>
          ${cv_url ? `<tr><td style="padding:8px;font-weight:bold;color:#555">CV</td><td style="padding:8px"><a href="${cv_url}">Download CV</a></td></tr>` : ""}
        </table>
        ${cover_letter ? `<div style="margin-top:16px"><strong style="color:#555">Cover Letter:</strong><p style="color:#333;line-height:1.6">${cover_letter.replace(/\n/g,"<br>")}</p></div>` : ""}
        <hr style="margin:24px 0;border:none;border-top:1px solid #eee"/>
        <p style="color:#999;font-size:12px">SAGECO EVERGREEN CO.LTD · Kyenjojo, Uganda</p>
      </div>`
    )

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error("Apply error:", err.message)
    return res.status(500).json({ error: "Failed to submit application" })
  }
}

export const config = { api: { bodyParser: { sizeLimit: "1mb" } } }
