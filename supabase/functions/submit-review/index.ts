import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { z } from 'npm:zod@3'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

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

    // Verified purchase = email exists in preorders
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
      // Roll back the review so we never have an orphan with no email record
      await supabase.from('reviews').delete().eq('id', review.id)
      return json({ error: 'email_store_failed', details: emailErr.message }, 500)
    }

    // Fire-and-forget founder notification
    try {
      await supabase.functions.invoke('notify-new-review', {
        body: {
          customer_name: data.customer_name,
          customer_email: data.customer_email,
          rating: data.rating,
          title: data.title,
          comment: data.comment,
          product_id: data.product_id,
        },
      })
    } catch (_) {
      // non-blocking
    }

    return json({ ok: true, id: review.id })
  } catch (e) {
    return json({ error: (e as Error).message }, 500)
  }
})
