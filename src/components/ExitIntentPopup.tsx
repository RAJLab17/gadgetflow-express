import { useState, useEffect, useRef, useCallback } from "react";
import { X, Mail, Loader2, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { useLanguage } from "@/contexts/LanguageContext";

const COOKIE_KEY = "raj_exit_popup_shown";
const MOBILE_TIMEOUT = 30000;

const ExitIntentPopup = () => {
  const { t } = useLanguage();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const shownRef = useRef(false);
  const lastScrollY = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const wasAlreadyShown = () => localStorage.getItem(COOKIE_KEY) === "true";

  const showPopup = useCallback(() => {
    if (shownRef.current || wasAlreadyShown()) return;
    shownRef.current = true;
    localStorage.setItem(COOKIE_KEY, "true");
    setShow(true);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (e.clientY <= 0) showPopup();
    };
    document.addEventListener("mouseleave", handler);
    return () => document.removeEventListener("mouseleave", handler);
  }, [showPopup]);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (!isMobile) return;

    timerRef.current = setTimeout(() => {
      showPopup();
    }, MOBILE_TIMEOUT);

    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = lastScrollY.current - currentY;
      lastScrollY.current = currentY;
      if (delta > 80 && currentY < 300) {
        showPopup();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [showPopup]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error(t("error.invalidEmail"));
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("brevo-waitlist", {
        body: { email: email.trim() },
      });
      if (error) throw error;
      if (data?.success) {
        setIsSubmitted(true);
        if (typeof window !== "undefined" && (window as any).fbq) {
          (window as any).fbq("track", "Lead");
        }
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.5 },
          colors: ["#9b6b3f", "#f0ede6"],
        });
      } else {
        throw new Error(data?.error || "Unbekannter Fehler");
      }
    } catch {
      toast.error(t("error.failed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => setShow(false)}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 md:p-10 z-10">
        <button
          onClick={() => setShow(false)}
          className="absolute top-4 right-4 text-muted-foreground/60 hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="text-center space-y-3 py-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-primary/15 flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-[#9b6b3f]" />
            </div>
            <p className="text-lg font-bold text-foreground">{t("exit.submitted.title")}</p>
            <p className="text-sm text-[#9b6b3f]">
              {t("exit.submitted.sub")}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-extrabold text-foreground leading-tight">
                {t("exit.title")}
              </h2>
              <p className="text-sm md:text-base text-muted-foreground">
                {t("exit.subtitle")}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                <input
                  type="email"
                  placeholder={t("launch.emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#9b6b3f] focus:ring-2 focus:ring-[#9b6b3f]/20 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-[#9b6b3f] text-white font-bold text-sm tracking-wide hover:bg-[#8a5d35] transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  t("exit.button")
                )}
              </button>
            </form>

            <p className="text-xs text-muted-foreground/70 text-center">
              {t("exit.disclaimer")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExitIntentPopup;
