import { useEffect, useState, FormEvent, useRef } from "react";
import { X, Mail, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { trackMetaEvent } from "@/lib/meta-pixel";

const STORAGE_KEY = "raj_exit_intent_shown";
const GOLD = "#9b6b3f";

const getSupabase = () =>
  import("@/integrations/supabase/client").then((m) => m.supabase);

interface Props {
  alreadySignedUp?: boolean;
  onSignupSuccess?: () => void;
}

const ExitIntentPopup = ({ alreadySignedUp, onSignupSuccess }: Props) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const lastScrollY = useRef(0);
  const scrollUpStart = useRef<number | null>(null);
  const mountedAt = useRef(Date.now());

  useEffect(() => {
    if (alreadySignedUp) return;
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY) === "1") return;

    const trigger = () => {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") return;
      sessionStorage.setItem(STORAGE_KEY, "1");
      setOpen(true);
    };

    // Desktop: mouse leaves through top of viewport
    const onMouseOut = (e: MouseEvent) => {
      if (e.clientY <= 0 && !e.relatedTarget) {
        if (Date.now() - mountedAt.current < 3000) return;
        trigger();
      }
    };

    // Mobile: fast upward scroll after at least 10s on page
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastScrollY.current;
      const onPageMs = Date.now() - mountedAt.current;

      if (delta < -8 && onPageMs > 10000 && y < 200) {
        if (scrollUpStart.current === null) scrollUpStart.current = Date.now();
        // Quick burst of upward scroll near the top
        trigger();
      } else if (delta > 0) {
        scrollUpStart.current = null;
      }
      lastScrollY.current = y;
    };

    document.addEventListener("mouseout", onMouseOut);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      document.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("scroll", onScroll);
    };
  }, [alreadySignedUp]);

  const close = () => setOpen(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Bitte gültige E-Mail eingeben");
      return;
    }
    setSubmitting(true);
    try {
      const supabase = await getSupabase();
      const { data, error } = await supabase.functions.invoke("brevo-subscribe", {
        body: { email: email.trim() },
      });
      if (error) throw error;
      if (data?.success) {
        setSubmitted(true);
        trackMetaEvent("Lead", { email: email.trim() });
        onSignupSuccess?.();
        setTimeout(() => setOpen(false), 2200);
      } else {
        throw new Error(data?.error || "Unbekannter Fehler");
      }
    } catch (err) {
      console.error("Exit-intent signup failed:", err);
      toast.error("Anmeldung fehlgeschlagen. Bitte erneut versuchen.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-intent-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={close}
      />

      {/* Popup */}
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in"
        style={{ border: "1px solid rgba(155,107,63,0.2)" }}
      >
        <button
          onClick={close}
          aria-label="Schliessen"
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-[#888] hover:text-[#1a1a1a] hover:bg-[#f5f0e8] transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gold accent strip */}
        <div className="h-1.5 w-full" style={{ backgroundColor: GOLD }} />

        <div className="px-6 pt-7 pb-6 sm:px-8 sm:pt-8 sm:pb-7 text-center">
          {submitted ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: GOLD }}
              >
                <Check className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#1a1a1a]">
                Founder-Platz reserviert!
              </h3>
              <p className="text-sm text-[#666]">
                Du erhältst am Launch-Tag deinen exklusiven Kauflink.
              </p>
            </div>
          ) : (
            <>
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3 text-[10px] font-semibold tracking-[0.18em] uppercase"
                style={{
                  color: GOLD,
                  backgroundColor: "rgba(155,107,63,0.08)",
                  border: "1px solid rgba(155,107,63,0.2)",
                }}
              >
                Warte!
              </div>

              <h3
                id="exit-intent-title"
                className="text-[22px] sm:text-2xl font-extrabold text-[#1a1a1a] leading-tight mb-2"
              >
                Verliere nicht <span style={{ color: GOLD }}>CHF 30</span>.
              </h3>

              <p className="text-[14px] sm:text-[15px] text-[#555] leading-snug mb-5">
                Wenn du jetzt gehst, zahlst du am Launch-Tag den vollen Preis.
                Founder-Plätze sind <span className="font-semibold text-[#1a1a1a]">begrenzt auf 100</span> — sichere dir deinen Rabatt in 10 Sekunden.
              </p>

              {/* Price comparison */}
              <div className="flex items-center justify-center gap-3 mb-5 text-sm">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] uppercase tracking-wider text-[#888] font-medium">Founder</span>
                  <span className="text-xl font-extrabold text-[#1a1a1a] tabular-nums">CHF 99</span>
                </div>
                <div className="text-[#ccc] text-2xl font-light">→</div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] uppercase tracking-wider text-[#888] font-medium">Später</span>
                  <span className="text-xl font-bold text-[#888] line-through tabular-nums">CHF 129</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9b6b3f] pointer-events-none" />
                  <input
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck={false}
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Deine E-Mail"
                    required
                    disabled={submitting}
                    autoFocus
                    className="w-full pl-10 pr-3 py-3 rounded-xl bg-white border-2 border-[#9b6b3f] text-[#1a1a1a] placeholder:text-[#aaa] text-[15px] font-medium focus:outline-none focus:ring-4 focus:ring-[#9b6b3f]/20 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-4 py-3 rounded-xl text-white font-bold text-[15px] hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-60 inline-flex items-center justify-center gap-2"
                  style={{ backgroundColor: GOLD, boxShadow: "0 6px 20px -6px rgba(155,107,63,0.45)" }}
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>Sichere mir die CHF 30 <span aria-hidden>→</span></>
                  )}
                </button>
              </form>

              <button
                type="button"
                onClick={close}
                className="mt-3 text-[11px] text-[#999] hover:text-[#666] underline underline-offset-2 transition-colors"
              >
                Nein danke, ich zahle später den vollen Preis
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExitIntentPopup;
