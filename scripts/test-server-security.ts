import { expect, test } from 'bun:test';
import ts from 'typescript';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { disabledPreorderResponse } from '../supabase/functions/process-preorder/disabled';

function files(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? files(path) : path.endsWith('.ts') ? [path] : [];
  });
}

test('disabled preorder processing never reads a submitted order and repeated calls change nothing', async () => {
  const request = new Request('https://example.invalid', { method: 'POST', body: JSON.stringify({ orderNumber: 'RAJ-TEST' }) });
  for (let i = 0; i < 3; i++) {
    const response = disabledPreorderResponse(request, {});
    expect(response.status).toBe(410);
    expect(await response.json()).toEqual({ error: 'preorder_processing_disabled' });
    expect(request.bodyUsed).toBe(false);
  }
});

test('disabled preorder preflight remains available', () => {
  const response = disabledPreorderResponse(new Request('https://example.invalid', { method: 'OPTIONS' }), { 'Access-Control-Allow-Origin': '*' });
  expect(response.status).toBe(200);
  expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
});

test('all server logs accept only fixed messages, HTTP status or safe booleans', () => {
  const allowed = new Set(['response.status', 'metaRes.status', 'Boolean(shopifyDraftOrderId)']);
  const unsafe: string[] = [];
  for (const path of files('supabase/functions')) {
    const source = ts.createSourceFile(path, readFileSync(path, 'utf8'), ts.ScriptTarget.Latest, true);
    function visit(node: ts.Node) {
      if (ts.isCallExpression(node) && /^console\.(log|error|warn|info|debug)$/.test(node.expression.getText(source))) {
        for (const arg of node.arguments) {
          const value = arg.getText(source);
          const fixed = ts.isStringLiteral(arg) || ts.isNoSubstitutionTemplateLiteral(arg);
          const listOnly = ts.isTemplateExpression(arg) && arg.templateSpans.every((span) => span.expression.getText(source) === 'listId');
          if ((!fixed && !listOnly && !allowed.has(value)) || (fixed && value.includes('@'))) unsafe.push(`${path}: ${value}`);
        }
      }
      ts.forEachChild(node, visit);
    }
    visit(source);
  }
  expect(unsafe).toEqual([]);
});

// Exercise the unchanged handlers with fake provider/database transports; no real signups are created.
async function handler(name: string, providerStatus = 201, providerBody = '') {
  let run: ((req: Request) => Promise<Response>) | undefined;
  const logs: string[] = [];
  const calls: { url: string; body: any }[] = [];
  const code = readFileSync(`supabase/functions/${name}/index.ts`, 'utf8').replace(/^import .*;\n/gm, '');
  const js = ts.transpile(code, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None });
  new Function('serve', 'Deno', 'fetch', 'console', js)(
    (fn: typeof run) => { run = fn; },
    { env: { get: (key: string) => key === 'RESEND_API_KEY' ? undefined : 'test-fixture' } },
    async (url: string, options: RequestInit) => {
      calls.push({ url, body: JSON.parse(String(options.body)) });
      return new Response(providerBody || null, { status: providerStatus });
    },
    { log: (...args: unknown[]) => logs.push(JSON.stringify(args)), error: (...args: unknown[]) => logs.push(JSON.stringify(args)) },
  );
  if (!run) throw new Error('Handler was not registered');
  return { run, calls, logs };
}

test('signup still sends the email to Brevo and stores the live signup counter', async () => {
  const h = await handler('brevo-subscribe');
  const r = await h.run(new Request('https://example.invalid', { method: 'POST', body: JSON.stringify({ email: 'Security.Fixture@example.invalid' }) }));
  expect(await r.json()).toEqual({ success: true });
  expect(h.calls[0].body).toEqual({ email: 'security.fixture@example.invalid', listIds: [4], updateEnabled: true });
  expect(h.calls[1].body).toEqual({ email: 'security.fixture@example.invalid' });
  expect(h.logs.join('')).not.toContain('@');
});

test.each([['apex', 14], ['nexus', 8]])('waitlist keeps %s on list %i without logging email', async (product, list) => {
  const h = await handler('brevo-waitlist');
  const r = await h.run(new Request('https://example.invalid', { method: 'POST', body: JSON.stringify({ email: 'fixture@example.invalid', product, variant: 'Silver' }) }));
  expect(await r.json()).toEqual({ success: true });
  expect(h.calls[0].body.listIds).toEqual([list]);
  expect(h.calls[0].body.email).toBe('fixture@example.invalid');
  expect(h.logs.join('')).not.toContain('@');
});

test.each(['brevo-subscribe', 'brevo-waitlist'])('%s never logs provider errors containing an email', async (name) => {
  const h = await handler(name, 400, JSON.stringify({ code: 'duplicate_parameter', message: 'fixture@example.invalid already exists' }));
  const r = await h.run(new Request('https://example.invalid', { method: 'POST', body: JSON.stringify({ email: 'fixture@example.invalid' }) }));
  expect(r.status).toBe(200);
  expect(h.logs.join('')).not.toContain('@');
});

test('newsletter keeps its existing no-key success and duplicate response without email logs', async () => {
  const h = await handler('newsletter-signup');
  const request = () => new Request('https://example.invalid', { method: 'POST', body: JSON.stringify({ email: 'fixture@example.invalid' }) });
  expect(await (await h.run(request())).json()).toEqual({ success: true });
  expect(await (await h.run(request())).json()).toEqual({ success: true, message: 'Bereits angemeldet' });
  expect(h.calls).toHaveLength(0);
  expect(h.logs.join('')).not.toContain('@');
});