import { useState } from "react";
import { Loader2, Check, Mail, Bell, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { trackMetaEvent } from "@/lib/meta-pixel";

const StickyVoranmeldenButton = () => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Bitte gib eine gültige E-Mail-Adresse ein.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke("brevo-subscribe", {
        body: { email: email.trim() },
      });
      if (error) throw error;
      const submitted = email.trim();
      trackMetaEvent("Lead", { email: submitted });
      setDone(true);
      setEmail("");
    } catch (err) {
      console.error("Voranmelden signup failed:", err);
      toast.error("Anmeldung fehlgeschlagen. Bitte versuche es erneut.");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setOpen(false);
    // small delay so the user sees the success state before reset
    setTimeout(() => setDone(false), 400);
  };

  return (
    <>
      {/* Sticky Button — top right, below header */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Voranmelden"
        className="fixed top-20 right-4 md:top-24 md:right-6 z-40 inline-flex items-center gap-2 rounded-full bg-[#9b6b3f] hover:bg-[#8a5e37] text-white text-xs md:text-sm font-medium px-4 py-2.5 shadow-[0_8px_24px_-8px_rgba(155,107,63,0.5)] hover:shadow-[0_12px_28px_-8px_rgba(155,107,63,0.6)] transition-all duration-300 hover:-translate-y-0.5"
      >
        <Bell className="w-3.5 h-3.5 md:w-4 md:h-4" strokeWidth={2} />
        <span className="tracking-wide">Voranmelden</span>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeModal}
              className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              role="dialog"
              aria-modal="true"
              className="fixed inset-x-3 z-[61] mx-auto max-w-md top-[max(1rem,env(safe-area-inset-top))] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 md:w-[calc(100%-1.5rem)] max-h-[calc(100dvh-2rem)] overflow-y-auto"
            >
              <div className="relative bg-background rounded-2xl border border-border shadow-[0_30px_80px_-20px_rgba(0,0,0,0.4)] p-5 sm:p-6 md:p-8">
                <button
                  onClick={closeModal}
                  aria-label="Schliessen"
                  className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                {done ? (
                  <div className="py-4 text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center mx-auto">
                      <Check className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-base font-medium text-foreground">
                      Du wirst als Erster informiert.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="text-center space-y-2">
                      <span className="text-[10px] tracking-[0.3em] uppercase text-primary font-medium">
                        Voranmelden
                      </span>
                      <h3 className="text-xl md:text-2xl font-light tracking-tight">
                        Beim Launch sofort benachrichtigt werden
                      </h3>
                      <p className="text-sm text-muted-foreground font-light">
                        Trag deine Email ein — wir informieren dich am 14. Mai 2026.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email-Adresse"
                          required
                          autoFocus
                          disabled={loading}
                          className="pl-10 bg-white border-border focus:border-[#9b6b3f] focus:ring-[#9b6b3f]/20"
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#9b6b3f] hover:bg-[#8a5e37] text-white font-medium"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Voranmelden"}
                      </Button>
                    </form>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default StickyVoranmeldenButton;
