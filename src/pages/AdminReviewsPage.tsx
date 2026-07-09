import { useEffect, useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { Check, X, Trash2, MessageSquare, Download, ShieldCheck, RefreshCw, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import StarRating from "@/components/reviews/StarRating";

const FN_URL = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/admin-reviews`;
const ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const TOKEN_KEY = "raj_admin_token";

interface AdminReview {
  id: string;
  product_id: string;
  customer_name: string;
  customer_email: string | null;
  rating: number;
  title: string;
  comment: string;
  verified_purchase: boolean;
  status: string;
  helpful_count: number;
  founder_response: string | null;
  created_at: string;
  photo_preview_url?: string | null;
  photo_path?: string | null;
}

type Tab = "pending" | "approved" | "rejected";

const AdminReviewsPage = () => {
  const [token, setToken] = useState<string>(() => localStorage.getItem(TOKEN_KEY) ?? "");
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<Tab>("pending");
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [responseFor, setResponseFor] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");

  const call = useCallback(
    async (path: string, init?: RequestInit) => {
      const res = await fetch(`${FN_URL}${path}`, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          apikey: ANON,
          Authorization: `Bearer ${ANON}`,
          "x-admin-token": token,
          ...(init?.headers ?? {}),
        },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? `HTTP ${res.status}`);
      return data;
    },
    [token]
  );

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await call(`?action=list&status=${tab}`);
      setReviews(data.reviews ?? []);
      setAuthed(true);
      localStorage.setItem(TOKEN_KEY, token);
    } catch (e) {
      const msg = (e as Error).message;
      if (msg === "unauthorized") {
        setAuthed(false);
        localStorage.removeItem(TOKEN_KEY);
        toast({ title: "Falsches Passwort", variant: "destructive" });
      } else {
        toast({ title: "Fehler", description: msg, variant: "destructive" });
      }
    } finally {
      setLoading(false);
    }
  }, [tab, token, call]);

  useEffect(() => {
    if (token) load();
  }, [tab, token, load]);

  const act = async (id: string, action: "approve" | "reject" | "delete", extra?: Record<string, unknown>) => {
    try {
      await call(`?action=${action}`, { method: "POST", body: JSON.stringify({ id, ...extra }) });
      toast({ title: action === "approve" ? "Freigegeben" : action === "reject" ? "Abgelehnt" : "Gelöscht" });
      setReviews((rs) => rs.filter((r) => r.id !== id));
    } catch (e) {
      toast({ title: "Fehler", description: (e as Error).message, variant: "destructive" });
    }
  };

  const respond = async (id: string) => {
    if (!responseText.trim()) return;
    try {
      await call(`?action=respond`, { method: "POST", body: JSON.stringify({ id, response: responseText }) });
      toast({ title: "Antwort gespeichert" });
      setResponseFor(null);
      setResponseText("");
      load();
    } catch (e) {
      toast({ title: "Fehler", description: (e as Error).message, variant: "destructive" });
    }
  };

  const exportCsv = async () => {
    try {
      const data = await call(`?action=emails`);
      const rows: Array<Record<string, string>> = data.emails ?? [];
      const header = "Name,Email,Sterne,Status,Datum";
      const csv = [
        header,
        ...rows.map(
          (r) =>
            `"${String(r.customer_name).replace(/"/g, '""')}","${r.customer_email ?? ""}",${r.rating},${r.status},${r.created_at}`
        ),
      ].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `raj-reviews-emails-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: `${rows.length} Emails exportiert` });
    } catch (e) {
      toast({ title: "Fehler", description: (e as Error).message, variant: "destructive" });
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
    setAuthed(false);
    setReviews([]);
  };

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50 p-6">
        <Helmet>
          <title>Admin · Reviews</title>
          <meta name="robots" content="noindex,nofollow" />
        </Helmet>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            load();
          }}
          className="w-full max-w-sm rounded-2xl border border-stone-200 bg-white p-8 shadow-sm"
        >
          <div className="mb-6 flex items-center gap-2">
            <ShieldCheck className="text-stone-900" size={20} />
            <h1 className="text-lg font-medium text-stone-900">Admin · Reviews</h1>
          </div>
          <label className="mb-2 block text-sm text-stone-700">Admin-Token</label>
          <Input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="••••••••"
            autoFocus
          />
          <Button type="submit" className="mt-4 w-full bg-stone-900 hover:bg-stone-800">
            Einloggen
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Helmet>
        <title>Admin · Reviews</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <h1 className="text-lg font-medium text-stone-900">Reviews Admin</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={exportCsv}>
              <Download size={14} className="mr-1.5" />
              Emails als CSV
            </Button>
            <Button variant="ghost" size="sm" onClick={load}>
              <RefreshCw size={14} />
            </Button>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut size={14} />
            </Button>
          </div>
        </div>
        <div className="mx-auto flex max-w-5xl gap-1 px-6">
          {(["pending", "approved", "rejected"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`border-b-2 px-3 py-2 text-sm transition ${
                tab === t ? "border-stone-900 text-stone-900" : "border-transparent text-stone-500 hover:text-stone-900"
              }`}
            >
              {t === "pending" ? "Ausstehend" : t === "approved" ? "Freigegeben" : "Abgelehnt"}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        {loading ? (
          <p className="py-12 text-center text-sm text-stone-500">Lädt…</p>
        ) : reviews.length === 0 ? (
          <p className="py-12 text-center text-sm text-stone-500">Keine Bewertungen in dieser Ansicht.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <article key={r.id} className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <StarRating value={r.rating} readOnly size={14} />
                      {r.verified_purchase && (
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                          Verifiziert
                        </span>
                      )}
                    </div>
                    <h2 className="mt-1 font-medium text-stone-900">{r.title}</h2>
                    <p className="text-xs text-stone-500">
                      {r.customer_name}{r.customer_email ? <> · <span className="font-mono">{r.customer_email}</span></> : null} ·{" "}
                      {new Date(r.created_at).toLocaleString("de-CH")}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {tab !== "approved" && (
                      <Button size="sm" onClick={() => act(r.id, "approve")} className="bg-emerald-600 hover:bg-emerald-700">
                        <Check size={14} className="mr-1" /> Freigeben
                      </Button>
                    )}
                    {tab !== "rejected" && (
                      <Button size="sm" variant="outline" onClick={() => act(r.id, "reject")}>
                        <X size={14} className="mr-1" /> Ablehnen
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => act(r.id, "delete")}>
                      <Trash2 size={14} className="text-red-600" />
                    </Button>
                  </div>
                </div>

                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-stone-700">{r.comment}</p>

                {r.photo_preview_url && (
                  <a
                    href={r.photo_preview_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-block overflow-hidden rounded-lg border border-stone-200 hover:border-stone-400"
                  >
                    <img
                      src={r.photo_preview_url}
                      alt="Kundenfoto"
                      className="h-32 w-32 object-cover"
                    />
                  </a>
                )}

                {r.founder_response && (
                  <div className="mt-3 rounded-lg bg-stone-50 p-3 text-sm text-stone-700">
                    <strong>Deine Antwort:</strong> {r.founder_response}
                  </div>
                )}

                {tab === "approved" && (
                  <div className="mt-3">
                    {responseFor === r.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                          rows={3}
                          placeholder="Deine Antwort als Gründer…"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => respond(r.id)}>Speichern</Button>
                          <Button size="sm" variant="ghost" onClick={() => setResponseFor(null)}>Abbrechen</Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setResponseFor(r.id);
                          setResponseText(r.founder_response ?? "");
                        }}
                      >
                        <MessageSquare size={14} className="mr-1.5" />
                        {r.founder_response ? "Antwort bearbeiten" : "Antworten"}
                      </Button>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminReviewsPage;
