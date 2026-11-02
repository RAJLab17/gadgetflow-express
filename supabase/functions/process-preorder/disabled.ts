export function disabledPreorderResponse(req: Request, cors: Record<string, string>): Response {
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
  return new Response(JSON.stringify({ error: 'preorder_processing_disabled' }), {
    status: 410,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}