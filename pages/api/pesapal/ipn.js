// SageCo Evergreen — PesaPal IPN (direct PesaPal + Supabase, no Base44 proxy)
import { createClient } from '@supabase/supabase-js'

const BASE_URL = process.env.PESAPAL_ENV === 'sandbox'
  ? 'https://cybqa.pesapal.com/v3'
  : 'https://pay.pesapal.com/v3'
const CONSUMER_KEY = process.env.PESAPAL_CONSUMER_KEY
const CONSUMER_SECRET = process.env.PESAPAL_CONSUMER_SECRET

const supabaseUrl = 'https://emldbjqegftrngxypeca.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtbGRianFlZ2Z0cm5neHlwZWNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODMyNDM1MiwiZXhwIjoyMDkzOTAwMzUyfQ.qxKXCKisdivaO-x1nrGcnpmQL8K5Fcs2l69LizuAyLk'
const supabaseAdmin = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    let notification
    if (req.method === 'GET') {
      notification = {
        OrderTrackingId: req.query.OrderTrackingId,
        OrderNotificationType: req.query.OrderNotificationType,
        OrderMerchantReference: req.query.OrderMerchantReference,
      }
    } else {
      notification = req.body
    }

    const { OrderTrackingId, OrderMerchantReference } = notification
    if (!OrderTrackingId && !OrderMerchantReference) {
      return res.status(400).json({ error: 'Missing reference' })
    }

    // Get PesaPal token
    const tokenRes = await fetch(`${BASE_URL}/api/Auth/RequestToken`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ consumer_key: CONSUMER_KEY, consumer_secret: CONSUMER_SECRET })
    })
    const tokenData = await tokenRes.json()

    // Get transaction status
    const statusRes = await fetch(`${BASE_URL}/api/Transactions/GetTransactionStatus?orderTrackingId=${OrderTrackingId}`, {
      headers: { Accept: 'application/json', Authorization: `Bearer ${tokenData.token}` }
    })
    const statusData = await statusRes.json()

    const paymentStatus = statusData.payment_status_description || statusData.status || 'UNKNOWN'
    const reference = OrderMerchantReference || statusData.merchant_reference || ''
    if (!reference) return res.status(400).json({ error: 'No reference' })

    // Update transaction in Supabase
    const { data: updatedTxn } = await supabaseAdmin
      .from('transactions')
      .select('*')
      .eq('reference', reference)
      .single()

    if (updatedTxn) {
      await supabaseAdmin.from('transactions').update({
        status: paymentStatus === 'Completed' ? 'completed' : 'failed',
        pesapal_payment_status: paymentStatus,
        pesapal_payment_method: statusData.payment_method || null,
        updated_at: new Date().toISOString(),
      }).eq('reference', reference)

      // Create double-entry ledger on completion
      if (paymentStatus === 'Completed') {
        const amt = parseFloat(updatedTxn.amount) || 0
        const revAccount = (updatedTxn.type === 'broker_registration' || updatedTxn.type === 'broker_activation') ? 'broker_fees' : 'viewing_fees'

        await supabaseAdmin.from('ledger_entries').insert([
          { transaction_id: updatedTxn.id, account: 'cash', entry_type: 'debit', amount: amt, description: `Cash — ${updatedTxn.type} — ${reference}` },
          { transaction_id: updatedTxn.id, account: revAccount, entry_type: 'credit', amount: amt, description: `Revenue — ${updatedTxn.type} — ${reference}` },
        ])

        // Activate broker if registration payment
        if (updatedTxn.type === 'broker_registration' && updatedTxn.broker_id) {
          await supabaseAdmin.from('brokers').update({
            registration_status: 'active', verified: true
          }).eq('id', updatedTxn.broker_id)
        }
      }
    }

    return res.status(200).json({ success: true, reference, status: paymentStatus })
  } catch (err) {
    console.error('[pesapal/ipn]', err.message)
    return res.status(200).json({ success: false })
  }
}
