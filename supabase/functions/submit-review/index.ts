import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { z } from 'npm:zod@3'
import { verifyPurchase } from './verify-purchase.ts'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const SHOPIFY_ACCESS_TOKEN = Deno.env.get('SHOPIFY_ACCESS_TOKEN')
const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')
const BREVO_API_KEY = Deno.env.get('BREVO_API_KEY')
const NOTIFY_TO = 'founder@raj.ch'
const NOTIFY_FROM_EMAIL = 'noreply@raj.ch'
const NOTIFY_FROM_NAME = 'RAJ Reviews'

const Schema = z.object({
  product_id: z.enum(['nexus', 'matrix', 'airpods-case']).default('nexus'),
  order_number: z.string().trim().max(80).optional(),
  customer_name: z.string().trim().min(2).max(80),
  customer_email: z.string().trim().email().max(255),
  rating: z.number().int().min(1).max(5),
  title: z.string().trim().min(3).max(120),
  comment: z.string().trim().min(20).max(1500),
  website: z.string().max(0).optional(), // honeypot
})


const MAX_BYTES = 10 * 1024 * 1024
const MAX_PHOTOS = 1
const RATE_LIMIT = 10
const RATE_WINDOW_MS = 10 * 60 * 1000

// Detect image type from file content (magic bytes), not from name/extension.
function sniffImage(b: Uint8Array): { ext: string; mime: string } | null {
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return { ext: 'jpg', mime: 'image/jpeg' }
  if (b.length >= 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 && b[4] === 0x0d && b[5] === 0x0a && b[6] === 0x1a && b[7] === 0x0a) return { ext: 'png', mime: 'image/png' }
  const ascii = (o: number, n: number) => String.fromCharCode(...b.slice(o, o + n))
  if (b.length >= 12 && ascii(0, 4) === 'RIFF' && ascii(8, 4) === 'WEBP') return { ext: 'webp', mime: 'image/webp' }
  if (b.length >= 12 && ascii(4, 4) === 'ftyp' && ['heic', 'heix', 'heim', 'heis', 'hevc', 'hevx', 'mif1', 'msf1', 'heif'].includes(ascii(8, 4))) return { ext: 'heic', mime: 'image/heic' }
  return null
}

async function hashIp(ip: string) {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('raj-review:' + ip))
  return Array.from(new Uint8Array(d)).map((x) => x.toString(16).padStart(2, '0')).join('')
}

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
    let raw: Record<string, unknown> = {}
    const files: File[] = []
    const ctype = req.headers.get('content-type') ?? ''
    if (ctype.includes('multipart/form-data')) {
      const form = await req.formData().catch(() => null)
      if (!form) return json({ error: 'invalid_input' }, 400)
      for (const [k, v] of form.entries()) {
        if (k === 'photos' && v instanceof File) files.push(v)
        else if (typeof v === 'string') raw[k] = k === 'rating' ? Number(v) : v
      }
    } else {
      raw = await req.json().catch(() => ({}))
    }
    const parsed = Schema.safeParse(raw)
    if (!parsed.success) {
      return json({ error: 'invalid_input', issues: parsed.error.flatten().fieldErrors }, 400)
    }
    const data = parsed.data
    if (!SUPABASE_URL || !SERVICE_ROLE) return json({ error: 'service_unavailable' }, 503)
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE)

    // Validate photos before anything is stored
    if (files.length > MAX_PHOTOS) return json({ error: 'too_many_photos' }, 400)
    const photos: { bytes: Uint8Array; ext: string; mime: string }[] = []
    for (const f of files) {
      if (f.size > MAX_BYTES) return json({ error: 'photo_too_large' }, 400)
      const bytes = new Uint8Array(await f.arrayBuffer())
      const kind = sniffImage(bytes)
      if (!kind) return json({ error: 'invalid_photo_type' }, 400)
      photos.push({ bytes, ...kind })
    }
    {
      const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || req.headers.get('cf-connecting-ip') || 'unknown'
      const ipHash = await hashIp(ip)
      const since = new Date(Date.now() - RATE_WINDOW_MS).toISOString()
      const { count, error: rateError } = await supabase
        .from('review_upload_attempts')
        .select('id', { count: 'exact', head: true })
        .eq('ip_hash', ipHash)
        .gte('created_at', since)
      if (rateError) return json({ error: 'service_unavailable' }, 503)
      if ((count ?? 0) + 1 > RATE_LIMIT) return json({ error: 'rate_limited' }, 429)
      const { error: attemptError } = await supabase.from('review_upload_attempts').insert({ ip_hash: ipHash })
      if (attemptError) return json({ error: 'service_unavailable' }, 503)
      await supabase.from('review_upload_attempts').delete().lt('created_at', new Date(Date.now() - 24 * 3600 * 1000).toISOString())
    }

    let verifiedPurchase = false
    try {
      verifiedPurchase = await verifyPurchase(data.product_id, data.order_number, data.customer_email, SHOPIFY_ACCESS_TOKEN)
    } catch {
      return json({ error: 'Die Kaufprüfung ist gerade nicht verfügbar. Bitte später erneut versuchen oder ohne Bestellnummer bewerten.' }, 503)
    }

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
        photo_path: null,
      })
      .select('id')
      .single()

    if (insertErr || !review) {
      return json({ error: 'insert_failed', details: insertErr?.message }, 500)
    }

    // Store photos only together with the saved review; random names, no overwrite
    if (photos.length) {
      const paths: string[] = []
      for (const p of photos) {
        const path = `pending/${crypto.randomUUID()}.${p.ext}`
        const { error: upErr } = await supabase.storage.from('review-photos').upload(path, p.bytes, { contentType: p.mime, upsert: false })
        if (upErr) {
          if (paths.length) await supabase.storage.from('review-photos').remove(paths)
          await supabase.from('reviews').delete().eq('id', review.id)
          return json({ error: 'photo_upload_failed' }, 500)
        }
        paths.push(path)
      }
      await supabase.from('reviews').update({ photo_path: paths[0] }).eq('id', review.id)
    }

    const { error: emailErr } = await supabase
      .from('review_emails')
      .insert({ review_id: review.id, email: data.customer_email })

    if (emailErr) {
      const { data: r } = await supabase.from('reviews').select('photo_path').eq('id', review.id).maybeSingle()
      if (r?.photo_path) await supabase.storage.from('review-photos').remove([r.photo_path])
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
