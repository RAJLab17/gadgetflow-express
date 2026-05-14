import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trackMetaEvent } from "@/lib/meta-pixel";
import { CheckCircle2, XCircle, AlertCircle, RefreshCw, Send } from "lucide-react";

type StatusData = {
  status?: string;
  pixel_id_configured?: boolean;
  access_token_configured?: boolean;
  pixel_id?: string | null;
  pixel_name?: string | null;
  last_fired_time?: string | null;
  checked_at?: string;
  error?: unknown;
};

const StatusRow = ({ label, value, ok }: { label: string; value: React.ReactNode; ok?: boolean }) => (
  <div className="flex items-center justify-between border-b border-border/50 py-3">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="flex items-center gap-2 text-sm font-medium">
      {ok === true && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
      {ok === false && <XCircle className="h-4 w-4 text-destructive" />}
      {value}
    </span>
  </div>
);

const MetaCapiStatusPage = () => {
  const [data, setData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(false);
  const [testEventId, setTestEventId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<"idle" | "ok" | "error">("idle");

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const { data: res, error } = await supabase.functions.invoke("meta-capi-status");
      if (error) throw error;
      setData(res as StatusData);
    } catch (err) {
      setData({ status: "error", error: String(err) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const sendTestEvent = async () => {
    setTestResult("idle");
    const id = `test-${Date.now()}`;
    setTestEventId(id);
    try {
      await trackMetaEvent("PageView", {
        eventId: id,
        customData: { source: "capi-status-page", test: true },
      });
      setTestResult("ok");
      setTimeout(fetchStatus, 1500);
    } catch {
      setTestResult("error");
    }
  };

  const isActive = data?.status === "active";
  const isMisconfigured = data?.status === "misconfigured";
  const isInvalid = data?.status === "token_invalid";

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <Helmet>
        <title>Meta CAPI Status | RAJ</title>
        <meta name="robots" content="noindex,nofollow" />
        <link rel="canonical" href="https://raj.ch/meta-capi-status" />
      </Helmet>

      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-light tracking-tight mb-2">Meta CAPI Status</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Live-Check der Conversions API & Browser Pixel Verbindung.
        </p>

        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {isActive && <CheckCircle2 className="h-6 w-6 text-emerald-600" />}
              {(isInvalid || isMisconfigured) && <XCircle className="h-6 w-6 text-destructive" />}
              {!data && <AlertCircle className="h-6 w-6 text-muted-foreground" />}
              <div>
                <div className="font-medium">
                  {isActive && "Aktiv & verbunden"}
                  {isInvalid && "Token ungültig oder blockiert"}
                  {isMisconfigured && "Konfiguration fehlt"}
                  {!data && (loading ? "Lade…" : "—")}
                </div>
                {data?.checked_at && (
                  <div className="text-xs text-muted-foreground">
                    Geprüft: {new Date(data.checked_at).toLocaleString("de-CH")}
                  </div>
                )}
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={fetchStatus} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          <StatusRow label="Pixel ID konfiguriert" value={data?.pixel_id ?? "—"} ok={data?.pixel_id_configured} />
          <StatusRow label="Access Token konfiguriert" value={data?.access_token_configured ? "Ja" : "Nein"} ok={data?.access_token_configured} />
          <StatusRow label="Pixel Name" value={data?.pixel_name ?? "—"} />
          <StatusRow
            label="Letztes Event empfangen"
            value={
              data?.last_fired_time
                ? new Date(data.last_fired_time).toLocaleString("de-CH")
                : "Noch keins"
            }
          />

          {data?.error != null && (
            <div className="mt-4 rounded-md bg-destructive/10 p-3 text-xs text-destructive">
              <pre className="whitespace-pre-wrap break-all">
                {JSON.stringify(data.error, null, 2)}
              </pre>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="font-medium mb-2">Test-Event senden</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Feuert ein <code className="text-xs">PageView</code> über Browser Pixel + Conversions API mit identischer
            Event-ID (Deduplication-Test).
          </p>
          <Button onClick={sendTestEvent} className="gap-2">
            <Send className="h-4 w-4" />
            Test-Event feuern
          </Button>
          {testEventId && (
            <div className="mt-4 text-xs text-muted-foreground">
              Event ID: <code>{testEventId}</code>
              {testResult === "ok" && <span className="ml-2 text-emerald-600">✓ Gesendet</span>}
              {testResult === "error" && <span className="ml-2 text-destructive">✗ Fehler</span>}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default MetaCapiStatusPage;
