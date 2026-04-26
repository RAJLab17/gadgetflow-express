import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Loader2, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { trackMetaEvent } from "@/lib/meta-pixel";

interface LaunchSecondCTAProps {
  onSignupSuccess: () => void;
}

const LaunchSecondCTA = ({ onSignupSuccess }: LaunchSecondCTAProps) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [hpWebsite, setHpWebsite] = useState("");
  const [hpCompany, setHpCompany] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error(t("error.invalidEmail"));
      return;
    }
    if (hpWebsite || hpCompany) {
      setIsSubmitted(true);
      return;
    }
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("brevo-subscribe", {
        body: { email: email.trim() },
      });
      if (error) throw error;
      if (data?.success) {
        setIsSubmitted(true);
        onSignupSuccess();
        trackMetaEvent("Lead", { email: email.trim() });
      } else {
        throw new Error(data?.error || "Unbekannter Fehler");
      }
    } catch (error) {
      console.error("Launch signup failed:", error);
      toast.error(t("error.failed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-[#9b6b3f] py-12 md:py-28">
      <div className="container mx-auto px-4 max-w-lg text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-8"
        >
          {t("cta2.title")}
        </motion.h2>

        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 bg-white/10 rounded-2xl border border-white/20 text-center space-y-4"
          >
            <div className="w-14 h-14 mx-auto rounded-full bg-white/20 flex items-center justify-center">
              <Check className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white">{t("cta2.submitted")}</h3>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-3"
          >
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                left: "-9999px",
                top: "auto",
                width: "1px",
                height: 0,
                opacity: 0,
                overflow: "hidden",
                pointerEvents: "none",
              }}
            >
              <label htmlFor="hp-website-2">Leave this field empty</label>
              <input
                id="hp-website-2"
                type="text"
                name="website"
                value={hpWebsite}
                onChange={(e) => setHpWebsite(e.target.value)}
                autoComplete="off"
                tabIndex={-1}
              />
              <label htmlFor="hp-company-2">Leave this field empty</label>
              <input
                id="hp-company-2"
                type="text"
                name="company"
                value={hpCompany}
                onChange={(e) => setHpCompany(e.target.value)}
                autoComplete="off"
                tabIndex={-1}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9b6b3f]" />
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
                  placeholder={t("launch.emailPlaceholder")}
                  required
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-white border border-white text-[#1a1a1a] placeholder:text-[#999] focus:outline-none focus:ring-2 focus:ring-white/40 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3.5 rounded-xl bg-[#1a1a1a] text-white font-bold hover:bg-black transition-all disabled:opacity-60 flex items-center justify-center gap-2 whitespace-nowrap text-sm sm:text-base"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Founder Platz sichern <span aria-hidden>→</span>
                  </>
                )}
              </button>
            </div>
          </motion.form>
        )}
      </div>
    </section>
  );
};

export default LaunchSecondCTA;
