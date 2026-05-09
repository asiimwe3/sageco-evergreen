export default async function handler(req, res) {
  // IPN handler - log the payment notification
  console.log('PesaPal IPN received:', req.body || req.query)
  // TODO: Update booking status in your database here
  return res.status(200).json({ message: 'IPN received' })
}
