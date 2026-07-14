import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-token',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const ADMIN_TOKEN = Deno.env.get('REVIEWS_ADMIN_TOKEN')!
const BUCKET = 'review-photos'
const APPROVED_URL_TTL = 60 * 60 * 24 * 365 * 10 // 10 years
const ADMIN_URL_TTL = 60 * 15 // 15 minutes for admin previews
// Bake image transform into signed URL. 1000px @ q72 covers mobile lightbox
// (~1050 CSS×DPR) while shrinking the image from ~460 KiB to ~40-60 KiB.
const APPROVED_TRANSFORM = { width: 1000, quality: 72, resize: 'contain' as const }

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

      const reviews = await Promise.all(
        (data ?? []).map(async (r: any) => {
          let preview_url: string | null = r.photo_url ?? null
          if (r.photo_path && !preview_url) {
            const { data: signed } = await supabase.storage
              .from(BUCKET)
              .createSignedUrl(r.photo_path, ADMIN_URL_TTL)
            preview_url = signed?.signedUrl ?? null
          }
          return {
            ...r,
            customer_email: r.review_emails?.email ?? null,
            photo_preview_url: preview_url,
            review_emails: undefined,
          }
        })
      )
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

      // Load current photo info for actions that need it
      const { data: current } = await supabase
        .from('reviews')
        .select('photo_path, photo_url')
        .eq('id', id)
        .maybeSingle()

      if (action === 'approve') {
        const update: Record<string, unknown> = { status: 'approved' }
        // Move pending photo to approved/ and store a long-lived signed URL
        if (current?.photo_path && current.photo_path.startsWith('pending/')) {
          const newPath = current.photo_path.replace(/^pending\//, 'approved/')
          const { error: moveErr } = await supabase.storage.from(BUCKET).move(current.photo_path, newPath)
          if (moveErr && !/exists/i.test(moveErr.message)) throw moveErr
          const { data: signed, error: signErr } = await supabase.storage
            .from(BUCKET)
            .createSignedUrl(newPath, APPROVED_URL_TTL, { transform: APPROVED_TRANSFORM })
          if (signErr) throw signErr
          update.photo_path = newPath
          update.photo_url = signed?.signedUrl ?? null
        }
        const { error } = await supabase.from('reviews').update(update).eq('id', id)
        if (error) throw error
        return json({ ok: true })
      }
      if (action === 'reject') {
        const update: Record<string, unknown> = { status: 'rejected', photo_url: null }
        if (current?.photo_path) {
          await supabase.storage.from(BUCKET).remove([current.photo_path]).catch(() => {})
          update.photo_path = null
        }
        const { error } = await supabase.from('reviews').update(update).eq('id', id)
        if (error) throw error
        return json({ ok: true })
      }
      if (action === 'delete') {
        if (current?.photo_path) {
          await supabase.storage.from(BUCKET).remove([current.photo_path]).catch(() => {})
        }
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
        return json({ error: 'unknown_action' }, 400)
      }
    }

    // Re-sign all approved photos with the current transform. Idempotent.
    if (req.method === 'POST' && action === 'resign_approved') {
      const { data: rows, error } = await supabase
        .from('reviews')
        .select('id, photo_path')
        .eq('status', 'approved')
        .not('photo_path', 'is', null)
      if (error) throw error
      let updated = 0
      for (const r of rows ?? []) {
        const { data: signed, error: signErr } = await supabase.storage
          .from(BUCKET)
          .createSignedUrl(r.photo_path as string, APPROVED_URL_TTL, { transform: APPROVED_TRANSFORM })
        if (signErr || !signed?.signedUrl) continue
        const { error: upErr } = await supabase
          .from('reviews')
          .update({ photo_url: signed.signedUrl })
          .eq('id', r.id)
        if (!upErr) updated++
      }
      return json({ ok: true, updated, total: rows?.length ?? 0 })
    }

    return json({ error: 'unknown_action' }, 400)
  } catch (e) {
    return json({ error: (e as Error).message }, 500)
  }
})
