import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-token',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const ADMIN_TOKEN = Deno.env.get('REVIEWS_ADMIN_TOKEN')!

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const token = req.headers.get('x-admin-token') ?? ''
  if (!ADMIN_TOKEN || token !== ADMIN_TOKEN) {
    return json({ error: 'unauthorized' }, 401)
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE)
  const url = new URL(req.url)
  const action = url.searchParams.get('action') ?? 'list'

  try {
    if (req.method === 'GET' && action === 'list') {
      const status = url.searchParams.get('status') ?? 'pending'
      const { data, error } = await supabase
        .from('reviews')
        .select('*, review_emails(email)')
        .eq('status', status)
        .order('created_at', { ascending: false })
        .limit(500)
      if (error) throw error
      const reviews = (data ?? []).map((r: any) => ({
        ...r,
        customer_email: r.review_emails?.email ?? null,
        review_emails: undefined,
      }))
      return json({ reviews })
    }

    if (req.method === 'GET' && action === 'emails') {
      const { data, error } = await supabase
        .from('reviews')
        .select('customer_name, rating, status, created_at, review_emails(email)')
        .order('created_at', { ascending: false })
        .limit(5000)
      if (error) throw error
      const emails = (data ?? []).map((r: any) => ({
        customer_name: r.customer_name,
        customer_email: r.review_emails?.email ?? null,
        rating: r.rating,
        status: r.status,
        created_at: r.created_at,
      }))
      return json({ emails })
    }

    if (req.method === 'POST') {
      const body = await req.json().catch(() => ({}))
      const id = body.id as string | undefined
      if (!id) return json({ error: 'missing_id' }, 400)

      if (action === 'approve') {
        const { error } = await supabase.from('reviews').update({ status: 'approved' }).eq('id', id)
        if (error) throw error
        return json({ ok: true })
      }
      if (action === 'reject') {
        const { error } = await supabase.from('reviews').update({ status: 'rejected' }).eq('id', id)
        if (error) throw error
        return json({ ok: true })
      }
      if (action === 'delete') {
        const { error } = await supabase.from('reviews').delete().eq('id', id)
        if (error) throw error
        return json({ ok: true })
      }
      if (action === 'respond') {
        const response = (body.response as string | undefined)?.trim()
        if (!response) return json({ error: 'missing_response' }, 400)
        const { error } = await supabase
          .from('reviews')
          .update({ founder_response: response, founder_responded_at: new Date().toISOString() })
          .eq('id', id)
        if (error) throw error
        return json({ ok: true })
      }
    }

    return json({ error: 'unknown_action' }, 400)
  } catch (e) {
    return json({ error: (e as Error).message }, 500)
  }
})
