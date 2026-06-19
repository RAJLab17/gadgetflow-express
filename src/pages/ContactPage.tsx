import { useState } from "react";
import { ArrowLeft, Loader2, Send, Check, Mail, User, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PremiumPageLayout from "@/components/PremiumPageLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const ContactPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      toast({
        title: "Bitte füllen Sie alle Felder aus.",
        variant: "destructive",
      });
      return;
    }

    if (!email.includes("@")) {
      toast({
        title: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/contact-form`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            message: message.trim(),
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Senden fehlgeschlagen");
      }

      setIsSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
      toast({
        title: "Nachricht gesendet",
        description: "Vielen Dank – wir melden uns bei Ihnen.",
      });
    } catch (err) {
      console.error("Contact form error:", err);
      toast({
        title: "Senden fehlgeschlagen",
        description:
          "Bitte versuchen Sie es erneut oder schreiben Sie uns direkt an founder@raj.ch.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PremiumPageLayout
      title="Kontakt – RAJ"
      metaDescription="Kontaktieren Sie RAJ. Wir freuen uns auf Ihre Nachricht."
      canonical="https://raj.ch/kontakt"
      eyebrow="Kontakt"
      heading={
        <>
          Schreiben Sie
          <br />
          <span className="text-primary italic">uns.</span>
        </>
      }
      intro="Haben Sie Fragen zum RAJ NEXUS oder zu unserem Sortiment? Wir sind für Sie da."
    >
      <div className="space-y-16">
        {/* Back button */}
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-primary transition-colors -mt-4 group"
        >
          <ArrowLeft
            className="w-4 h-4 transition-transform group-hover:-translate-x-1"
            strokeWidth={1.5}
          />
          Zurück
        </button>

        {isSuccess ? (
          <div className="raj-fade text-center py-12" style={{ animationDuration: "600ms" }}>
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Check className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-2xl md:text-3xl font-light tracking-tight mb-3">
              Vielen Dank für Ihre Nachricht
            </h2>
            <p className="text-muted-foreground font-light max-w-md mx-auto leading-relaxed">
              Wir haben Ihre Anfrage erhalten und melden uns so schnell wie möglich bei Ihnen.
            </p>
            <button
              onClick={() => setIsSuccess(false)}
              className="mt-8 inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              Neue Nachricht senden
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8 max-w-xl">
            {/* Name */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-foreground flex items-center gap-2"
              >
                <User className="w-4 h-4 text-primary" strokeWidth={1.5} />
                Name
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ihr Name"
                disabled={isLoading}
                required
                className="h-12"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-foreground flex items-center gap-2"
              >
                <Mail className="w-4 h-4 text-primary" strokeWidth={1.5} />
                E-Mail
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ihre@email.ch"
                disabled={isLoading}
                required
                className="h-12"
              />
            </div>

            {/* Nachricht */}
            <div className="space-y-2">
              <label
                htmlFor="message"
                className="text-sm font-medium text-foreground flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-primary" strokeWidth={1.5} />
                Nachricht
              </label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Wie können wir Ihnen helfen?"
                disabled={isLoading}
                required
                rows={6}
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              size="lg"
              className="w-full sm:w-auto min-w-[200px]"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Senden
            </Button>
          </form>
        )}

        {/* Contact info */}
        <div className="border-t border-border/60 pt-12 space-y-6">
          <p className="text-xs tracking-[0.3em] uppercase text-primary font-medium">
            — Direkter Kontakt
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border border-border/60 bg-gradient-to-br from-muted/30 to-transparent">
              <p className="text-sm text-muted-foreground mb-1">E-Mail</p>
              <a
                href="mailto:founder@raj.ch"
                className="text-foreground font-medium hover:text-primary transition-colors"
              >
                founder@raj.ch
              </a>
            </div>
            <div className="p-6 rounded-xl border border-border/60 bg-gradient-to-br from-muted/30 to-transparent">
              <p className="text-sm text-muted-foreground mb-1">Web</p>
              <a
                href="https://raj.ch"
                className="text-foreground font-medium hover:text-primary transition-colors"
              >
                raj.ch
              </a>
            </div>
          </div>
        </div>
      </div>
    </PremiumPageLayout>
  );
};

export default ContactPage;
