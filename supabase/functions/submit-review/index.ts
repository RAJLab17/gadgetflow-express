import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { z } from 'npm:zod@3'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')
const BREVO_API_KEY = Deno.env.get('BREVO_API_KEY')
const NOTIFY_TO = 'founder@raj.ch'
const NOTIFY_FROM_EMAIL = 'noreply@raj.ch'
const NOTIFY_FROM_NAME = 'RAJ Reviews'

const Schema = z.object({
  product_id: z.string().trim().min(1).max(60).default('nexus'),
  customer_name: z.string().trim().min(2).max(80),
  customer_email: z.string().trim().email().max(255),
  rating: z.number().int().min(1).max(5),
  title: z.string().trim().min(3).max(120),
  comment: z.string().trim().min(20).max(1500),
  website: z.string().max(0).optional(), // honeypot
})

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string)
  )

async function sendFounderNotification(data: {
  customer_name: string
  customer_email: string
  rating: number
  title: string
  comment: string
  product_id: string
}) {
  if (!LOVABLE_API_KEY || !BREVO_API_KEY) return
  const stars = '★'.repeat(data.rating) + '☆'.repeat(5 - data.rating)
  const html = `
    <div style="font-family:-apple-system,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1c1917">
      <p style="font-size:12px;letter-spacing:0.15em;text-transform:uppercase;color:#78716c;margin:0 0 8px">Neue Bewertung</p>
      <h1 style="font-size:22px;font-weight:500;margin:0 0 16px">${escape(data.title)}</h1>
      <p style="font-size:22px;color:#d4a574;letter-spacing:2px;margin:0 0 16px">${stars}</p>
      <p style="margin:0 0 4px"><strong>${escape(data.customer_name)}</strong> &lt;${escape(data.customer_email)}&gt;</p>
      <p style="font-size:13px;color:#78716c;margin:0 0 20px">Produkt: ${escape(data.product_id)}</p>
      <div style="background:#f5f5f4;border-radius:12px;padding:16px;margin:0 0 24px;white-space:pre-line;line-height:1.55">${escape(data.comment)}</div>
      <p><a href="https://raj.ch/admin/reviews" style="background:#1c1917;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;display:inline-block">Bewertung prüfen</a></p>
    </div>`
  try {
    await fetch('https://connector-gateway.lovable.dev/brevo/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'X-Connection-Api-Key': BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: NOTIFY_FROM_NAME, email: NOTIFY_FROM_EMAIL },
        to: [{ email: NOTIFY_TO }],
        replyTo: { email: data.customer_email, name: data.customer_name },
        subject: `🌟 Neue ${data.rating}★ Bewertung von ${data.customer_name}`,
        htmlContent: html,
      }),
    })
  } catch (e) {
    console.error('notify send failed', e)
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405)

  try {
    const raw = await req.json().catch(() => ({}))
    const parsed = Schema.safeParse(raw)
    if (!parsed.success) {
      return json({ error: 'invalid_input', issues: parsed.error.flatten().fieldErrors }, 400)
    }
    const data = parsed.data
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE)

    const { data: orderRow } = await supabase
      .from('preorders')
      .select('id')
      .ilike('customer_email', data.customer_email)
      .limit(1)
      .maybeSingle()
    const verifiedPurchase = !!orderRow

    const { data: review, error: insertErr } = await supabase
      .from('reviews')
      .insert({
        product_id: data.product_id,
        customer_name: data.customer_name,
        rating: data.rating,
        title: data.title,
        comment: data.comment,
        status: 'pending',
        verified_purchase: verifiedPurchase,
      })
      .select('id')
      .single()

    if (insertErr || !review) {
      return json({ error: 'insert_failed', details: insertErr?.message }, 500)
    }

    const { error: emailErr } = await supabase
      .from('review_emails')
      .insert({ review_id: review.id, email: data.customer_email })

    if (emailErr) {
      await supabase.from('reviews').delete().eq('id', review.id)
      return json({ error: 'email_store_failed', details: emailErr.message }, 500)
    }

    // Fire-and-forget founder notification (inlined; no public notify endpoint)
    sendFounderNotification({
      customer_name: data.customer_name,
      customer_email: data.customer_email,
      rating: data.rating,
      title: data.title,
      comment: data.comment,
      product_id: data.product_id,
    }).catch(() => {})

    return json({ ok: true, id: review.id })
  } catch (e) {
    return json({ error: (e as Error).message }, 500)
  }
})
