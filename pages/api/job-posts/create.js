import { supabaseAdmin as supabase } from '../../../lib/supabaseAdmin.js'
const LISTING_FEE = 5000

const sanitize = (value, max = 2000) =>
  typeof value === "string" ? value.trim().slice(0, max) : ""

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" })

  const {
    employer_name,
    contact_name,
    email,
    phone,
    job_title,
    department,
    job_type,
    location,
    deadline,
    summary,
    requirements,
    amount_ugx,
    pesapal_ref,
  } = req.body

  if (!employer_name || !contact_name || !email || !phone || !job_title || !job_type || !location || !summary || !requirements || !pesapal_ref) {
    return res.status(400).json({ error: "Missing required fields" })
  }

  if (amount_ugx !== LISTING_FEE) {
    return res.status(400).json({ error: "Invalid listing fee" })
  }

  const message = [
    "JOB_POST_INTENT",
    `ref=${sanitize(pesapal_ref, 80)}`,
    `amount=${LISTING_FEE}`,
    `employer=${sanitize(employer_name, 200)}`,
    `contact=${sanitize(contact_name, 200)}`,
    `phone=${sanitize(phone, 80)}`,
    `title=${sanitize(job_title, 200)}`,
    `department=${sanitize(department, 120)}`,
    `type=${sanitize(job_type, 80)}`,
    `location=${sanitize(location, 160)}`,
    `deadline=${sanitize(deadline, 40)}`,
    `summary=${sanitize(summary)}`,
    `requirements=${sanitize(requirements)}`,
  ].join("\n")

  try {
    const { error } = await supabase.from("contact_messages").insert([{
      name: sanitize(contact_name, 200),
      email: sanitize(email, 200),
      message,
      status: "job_post_pending",
    }])

    if (error) return res.status(500).json({ error: error.message })

    return res.status(200).json({ ok: true, ref: pesapal_ref })
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" })
  }
}
