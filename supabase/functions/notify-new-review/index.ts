import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')
const BREVO_API_KEY = Deno.env.get('BREVO_API_KEY')
const NOTIFY_TO = 'founder@raj.ch'
const NOTIFY_FROM_EMAIL = 'noreply@raj.ch'
const NOTIFY_FROM_NAME = 'RAJ Reviews'

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string)
  )

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const body = await req.json()
    const name = String(body.customer_name ?? '').slice(0, 120)
    const email = String(body.customer_email ?? '').slice(0, 255)
    const rating = Number(body.rating ?? 0)
    const title = String(body.title ?? '').slice(0, 200)
    const comment = String(body.comment ?? '').slice(0, 2000)
    const product = String(body.product_id ?? 'nexus').slice(0, 60)

    if (!name || !email || !title || !comment || !(rating >= 1 && rating <= 5)) {
      return new Response(JSON.stringify({ error: 'invalid_input' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (!LOVABLE_API_KEY || !BREVO_API_KEY) {
      return new Response(JSON.stringify({ error: 'email_not_configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating)
    const html = `
      <div style="font-family:-apple-system,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1c1917">
        <p style="font-size:12px;letter-spacing:0.15em;text-transform:uppercase;color:#78716c;margin:0 0 8px">Neue Bewertung</p>
        <h1 style="font-size:22px;font-weight:500;margin:0 0 16px">${escape(title)}</h1>
        <p style="font-size:22px;color:#d4a574;letter-spacing:2px;margin:0 0 16px">${stars}</p>
        <p style="margin:0 0 4px"><strong>${escape(name)}</strong> &lt;${escape(email)}&gt;</p>
        <p style="font-size:13px;color:#78716c;margin:0 0 20px">Produkt: ${escape(product)}</p>
        <div style="background:#f5f5f4;border-radius:12px;padding:16px;margin:0 0 24px;white-space:pre-line;line-height:1.55">${escape(comment)}</div>
        <p style="font-size:13px;color:#78716c">Status: <strong>ausstehend</strong> – im Admin-Panel freigeben:</p>
        <p><a href="https://raj.ch/admin/reviews" style="background:#1c1917;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;display:inline-block">Bewertung prüfen</a></p>
      </div>`

    const res = await fetch('https://connector-gateway.lovable.dev/brevo/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'X-Connection-Api-Key': BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: NOTIFY_FROM_NAME, email: NOTIFY_FROM_EMAIL },
        to: [{ email: NOTIFY_TO }],
        replyTo: { email, name },
        subject: `🌟 Neue ${rating}★ Bewertung von ${name}`,
        htmlContent: html,
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('Brevo error', res.status, text)
      return new Response(JSON.stringify({ error: 'send_failed', status: res.status }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
