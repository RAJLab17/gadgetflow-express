import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { CheckCircle2, XCircle, AlertCircle, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface UrlCheck {
  url: string;
  status: number | null;
  contentType: string | null;
  ok: boolean;
  error?: string;
}
interface SitemapCheck extends UrlCheck {
  xmlValid: boolean;
  locCount: number;
  locs: string[];
  xmlError?: string;
}
interface SeoReport {
  checkedAt: string;
  robots: UrlCheck & { sitemapsListed: string[] };
  sitemaps: SitemapCheck[];
  crossCheck: { inRobotsButNotFound: string[]; inFsButNotInRobots: string[] };
  pageChecks: UrlCheck[];
  summary: { totalUrls: number; okUrls: number; failedUrls: number; overallOk: boolean };
}

const StatusIcon = ({ ok }: { ok: boolean }) =>
  ok ? (
    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
  ) : (
    <XCircle className="w-4 h-4 text-red-600 shrink-0" />
  );

const SeoCheckPage = () => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<SeoReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runCheck = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: invokeErr } = await supabase.functions.invoke("seo-check");
      if (invokeErr) throw invokeErr;
      setReport(data as SeoReport);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>SEO Check – RAJ Admin</title>
        <meta name="robots" content="noindex,nofollow" />
        <link rel="canonical" href="https://raj.ch/seo-check" />
      </Helmet>
      <div className="min-h-screen bg-[#f0ede6] py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-light tracking-tight text-foreground">SEO Check</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Validiert robots.txt, alle Sitemaps und sämtliche darin gelisteten URLs auf raj.ch.
              </p>
            </div>
            <Button onClick={runCheck} disabled={loading} className="gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              {loading ? "Prüft…" : report ? "Erneut prüfen" : "Check starten"}
            </Button>
          </div>

          {error && (
            <div className="border border-red-300 bg-red-50 p-4 mb-6 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <div>
                <p className="font-medium text-red-900">Fehler beim Check</p>
                <p className="text-sm text-red-800 mt-1">{error}</p>
              </div>
            </div>
          )}

          {!report && !loading && !error && (
            <div className="border border-border/60 bg-background p-8 text-center text-muted-foreground">
              Klicke „Check starten" um robots.txt + Sitemaps + alle URLs live zu validieren.
            </div>
          )}

          {report && (
            <div className="space-y-6">
              {/* Summary */}
              <div
                className={`border p-6 ${
                  report.summary.overallOk
                    ? "border-emerald-300 bg-emerald-50"
                    : "border-amber-300 bg-amber-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <StatusIcon ok={report.summary.overallOk} />
                  <div>
                    <p className="font-medium">
                      {report.summary.overallOk
                        ? "Alle Checks bestanden"
                        : `${report.summary.failedUrls} Probleme gefunden`}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {report.summary.okUrls}/{report.summary.totalUrls} OK · geprüft{" "}
                      {new Date(report.checkedAt).toLocaleString("de-CH")}
                    </p>
                  </div>
                </div>
              </div>

              {/* robots.txt */}
              <section className="border border-border/60 bg-background p-6">
                <h2 className="text-lg font-medium mb-4">robots.txt</h2>
                <div className="flex items-center gap-2 text-sm mb-3">
                  <StatusIcon ok={report.robots.ok} />
                  <code className="text-xs">{report.robots.url}</code>
                  <span className="text-muted-foreground">
                    {report.robots.status} · {report.robots.contentType ?? "—"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">Sitemaps in robots.txt:</p>
                <ul className="text-xs space-y-1">
                  {report.robots.sitemapsListed.map((s) => (
                    <li key={s}>
                      <code>{s}</code>
                    </li>
                  ))}
                  {report.robots.sitemapsListed.length === 0 && (
                    <li className="text-red-700">Keine Sitemaps gelistet!</li>
                  )}
                </ul>
              </section>

              {/* Cross-check */}
              {(report.crossCheck.inRobotsButNotFound.length > 0 ||
                report.crossCheck.inFsButNotInRobots.length > 0) && (
                <section className="border border-amber-300 bg-amber-50 p-6">
                  <h2 className="text-lg font-medium mb-3">Abgleich robots ↔ Sitemaps</h2>
                  {report.crossCheck.inRobotsButNotFound.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-amber-900">
                        In robots.txt aber nicht erreichbar:
                      </p>
                      <ul className="text-xs mt-1 space-y-1">
                        {report.crossCheck.inRobotsButNotFound.map((u) => (
                          <li key={u}>
                            <code>{u}</code>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {report.crossCheck.inFsButNotInRobots.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-amber-900">
                        Bekannt, aber nicht in robots.txt referenziert:
                      </p>
                      <ul className="text-xs mt-1 space-y-1">
                        {report.crossCheck.inFsButNotInRobots.map((u) => (
                          <li key={u}>
                            <code>{u}</code>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </section>
              )}

              {/* Sitemaps */}
              <section className="border border-border/60 bg-background p-6">
                <h2 className="text-lg font-medium mb-4">Sitemaps</h2>
                <div className="space-y-3">
                  {report.sitemaps.map((s) => (
                    <div key={s.url} className="border border-border/40 p-3">
                      <div className="flex items-center gap-2 text-sm">
                        <StatusIcon ok={s.ok && s.xmlValid} />
                        <code className="text-xs flex-1 break-all">{s.url}</code>
                        <span className="text-xs text-muted-foreground">
                          {s.status} · {s.locCount} URLs
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 ml-6">
                        {s.contentType ?? "—"} ·{" "}
                        {s.xmlValid ? "XML valid" : `XML invalid${s.xmlError ? `: ${s.xmlError}` : ""}`}
                      </p>
                      {s.error && <p className="text-xs text-red-700 mt-1 ml-6">{s.error}</p>}
                    </div>
                  ))}
                </div>
              </section>

              {/* Page checks */}
              <section className="border border-border/60 bg-background p-6">
                <h2 className="text-lg font-medium mb-4">
                  URL-Crawl ({report.pageChecks.length} URLs)
                </h2>
                <div className="space-y-1 max-h-[600px] overflow-auto">
                  {report.pageChecks
                    .sort((a, b) => Number(a.ok) - Number(b.ok))
                    .map((p) => (
                      <div key={p.url} className="flex items-center gap-2 text-xs py-1">
                        <StatusIcon ok={p.ok} />
                        <code className="flex-1 break-all">{p.url}</code>
                        <span className="text-muted-foreground tabular-nums">
                          {p.status ?? "ERR"}
                        </span>
                      </div>
                    ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SeoCheckPage;
