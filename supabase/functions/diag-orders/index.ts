// Temporary diagnostic: checks whether the store token can read orders. Returns only status/error, never the token.
Deno.serve(async () => {
  const token = Deno.env.get('SHOPIFY_ACCESS_TOKEN');
  if (!token) return new Response(JSON.stringify({ ok: false, reason: 'no_token' }), { headers: { 'Content-Type': 'application/json' } });
  const url = 'https://kcvjif-10.myshopify.com/admin/api/2025-07/orders.json?status=any&limit=1&fields=id,email';
  const res = await fetch(url, { headers: { 'X-Shopify-Access-Token': token }, signal: AbortSignal.timeout(10000) });
  const body = await res.text();
  const hasOrders = res.ok && body.includes('"orders"');
  return new Response(JSON.stringify({ ok: res.ok, status: res.status, hasOrders, snippet: res.ok ? null : body.slice(0, 300) }), { headers: { 'Content-Type': 'application/json' } });
});
