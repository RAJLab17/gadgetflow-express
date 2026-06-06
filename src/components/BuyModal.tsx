import { useEffect, useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Mail, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { trackMetaEvent } from "@/lib/meta-pixel";
import logoTransparent from "@/assets/logo-transparent.webp";

const D = {
  bg: "#0A0A0A",
  surface: "#141312",
  beige: "#E8DCC4",
  muted: "#A89B82",
  mutedDim: "#6E665A",
  gold: "#C9A876",
};

interface BuyModalProps {
  open: boolean;
  onClose: () => void;
}

const BuyModal = ({ open, onClose }: BuyModalProps) => {
  const [email, setEmail] = useState("");
  const [hp1, setHp1] = useState("");
  const [hp2, setHp2] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    if (hp1 || hp2) { setDone(true); return; }
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("brevo-subscribe", {
        body: { email: email.trim() },
      });
      if (error) throw error;
      if (data?.success) {
        setDone(true);
        trackMetaEvent("Lead", { email: email.trim() });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          style={{ background: "rgba(10,10,10,0.85)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            className="relative w-full rounded-2xl"
            style={{
              maxWidth: 420,
              background: D.surface,
              border: `1px solid ${D.gold}55`,
              padding: 32,
              boxShadow: "0 30px 80px -20px rgba(0,0,0,0.7)",
            }}
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Schliessen"
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 inline-flex items-center justify-center rounded-full transition-opacity hover:opacity-100"
              style={{ color: D.muted, opacity: 0.8 }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M1 1l12 12M13 1L1 13" />
              </svg>
            </button>

            <div className="flex justify-center">
              <img src={logoTransparent} alt="RAJ" style={{ maxWidth: 60, height: "auto" }} />
            </div>

            {done ? (
              <div className="mt-6 flex flex-col items-center text-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                  style={{ background: `${D.gold}20`, border: `1px solid ${D.gold}` }}
                >
                  <Check className="w-5 h-5" style={{ color: D.gold }} />
                </div>
                <p className="text-base" style={{ color: D.beige, fontWeight: 300 }}>
                  Du wirst als Erster informiert.
                </p>
              </div>
            ) : (
              <>
                <h3
                  className="text-xl text-center"
                  style={{ color: D.beige, fontWeight: 300, marginTop: 20 }}
                >
                  Bald verfügbar.
                </h3>
                <p
                  className="text-[12px] text-center"
                  style={{ color: D.muted, marginTop: 8 }}
                >
                  Ab 16. Juni. Founder Edition. Nur 100 Stück.
                </p>

                <form onSubmit={submit} className="mt-6">
                  <div style={{ position: "absolute", left: "-9999px" }} aria-hidden>
                    <input value={hp1} onChange={(e) => setHp1(e.target.value)} tabIndex={-1} autoComplete="off" />
                    <input value={hp2} onChange={(e) => setHp2(e.target.value)} tabIndex={-1} autoComplete="off" />
                  </div>
                  <div
                    className="flex items-center gap-2 px-4 rounded-full"
                    style={{ background: "#FFFFFF", border: `1px solid rgba(0,0,0,0.1)` }}
                  >
                    <Mail className="w-4 h-4 shrink-0" style={{ color: "#8a8278" }} />
                    <input
                      type="email"
                      required
                      autoFocus
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="deine@email.ch"
                      className="flex-1 bg-transparent outline-none px-1 py-3 text-sm"
                      style={{ color: "#1a1714" }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={busy}
                    className="mt-3 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs font-semibold uppercase tracking-[0.24em] transition-all hover:scale-[1.01] disabled:opacity-60"
                    style={{
                      background: `linear-gradient(180deg, ${D.gold}, #8a5a35)`,
                      color: "#1a1410",
                      boxShadow: `0 14px 34px -12px ${D.gold}80, inset 0 1px 0 rgba(255,255,255,0.28)`,
                    }}
                  >
                    {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <>Benachrichtige mich <ArrowRight className="w-3.5 h-3.5" /></>}
                  </button>
                  <p
                    className="text-[10px] uppercase tracking-[0.22em] text-center mt-4"
                    style={{ color: D.mutedDim }}
                  >
                    Unverbindlich · Jederzeit abmeldbar
                  </p>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BuyModal;
