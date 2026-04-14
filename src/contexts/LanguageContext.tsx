import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type Language = "de" | "fr";

type Translations = Record<string, Record<Language, string>>;

const translations: Translations = {
  // Header
  "header.product": { de: "Produkt", fr: "Produit" },
  "header.about": { de: "Über uns", fr: "À propos" },
  "header.support": { de: "Support", fr: "Support" },
  "header.buy": { de: "Jetzt kaufen", fr: "Acheter" },
  "header.faq": { de: "FAQ", fr: "FAQ" },
  "header.shipping": { de: "Versand & Rückgabe", fr: "Livraison & Retour" },
  "header.contact": { de: "Kontakt", fr: "Contact" },
  "header.manuals": { de: "Manuals & Downloads", fr: "Manuels & Téléchargements" },

  // Launch Page – Hero
  "launch.scarcity": { de: "Founder Edition — limitiert auf", fr: "Founder Edition — limitée à" },
  "launch.pieces": { de: "Stück", fr: "pièces" },
  "launch.discovered": { de: "Bereits von", fr: "Déjà découvert par" },
  "launch.discoveredSuffix": { de: "Personen entdeckt", fr: "personnes" },
  "launch.headline1": { de: "Du hast ein iPhone für", fr: "Tu as un iPhone à" },
  "launch.subheadline": { de: "Weisst du ob dein Ladegerät zertifiziert ist?", fr: "Sais-tu si ton chargeur est certifié?" },
  "launch.warning": { de: "Nicht zertifizierte Produkte können deine Geräte beschädigen.", fr: "Les produits non certifiés peuvent endommager tes appareils." },
  "launch.certification": { de: "RAJ NEXUS. Qi2.2 zertifiziert. Offiziell.", fr: "RAJ NEXUS. Certifié Qi2.2. Officiel." },

  // Launch Page – Form
  "launch.spotsLeft": { de: "Plätze übrig!", fr: "places restantes!" },
  "launch.only": { de: "Nur", fr: "Seulement" },
  "launch.emailPlaceholder": { de: "Deine Email-Adresse", fr: "Ton adresse e-mail" },
  "launch.cta": { de: "Early Access sichern", fr: "Réserver l'Early Access" },
  "launch.noPayment": { de: "🔒 Keine Zahlungsdaten nötig", fr: "🔒 Aucune donnée de paiement requise" },
  "launch.unsubscribe": { de: "📧 Jederzeit abmeldbar", fr: "📧 Désabonnement à tout moment" },
  "launch.submitted.title": { de: "Du bist dabei.", fr: "Tu es inscrit·e." },
  "launch.submitted.sub": { de: "Wir melden uns als Erstes bei dir — versprochen.", fr: "On te contacte en premier — promis." },

  // Countdown
  "countdown.days": { de: "Tage", fr: "Jours" },
  "countdown.hours": { de: "Std", fr: "Hrs" },
  "countdown.minutes": { de: "Min", fr: "Min" },
  "countdown.seconds": { de: "Sek", fr: "Sec" },

  // Taglines
  "tagline.1": { de: "1 Ladegerät. 3 Geräte. Nur 1 Kabel.", fr: "1 chargeur. 3 appareils. 1 seul câble." },
  "tagline.2": { de: "Präzision. Beständigkeit. Charakter.", fr: "Précision. Constance. Caractère." },
  "tagline.3": { de: "Schweizer Brand. Weltweit zertifiziert. Für immer.", fr: "Marque suisse. Certifiée mondialement. Pour toujours." },

  // Benefits
  "benefits.title": { de: "Benefits für die ersten 100.", fr: "Avantages pour les 100 premiers." },
  "benefits.1": { de: "CHF 30 sparen — CHF 99 statt CHF 129.", fr: "Économise CHF 30 — CHF 99 au lieu de CHF 129." },
  "benefits.2": { de: "Founder Edition mit persönlicher Seriennummer.", fr: "Founder Edition avec numéro de série personnel." },
  "benefits.3": { de: "Lebenslanger Early Access zu neuen RAJ Produkten.", fr: "Early Access à vie pour les nouveaux produits RAJ." },

  // Product Teaser
  "product.subtitle": { de: "Ein Ladegerät für alles. Ohne Kompromisse.", fr: "Un chargeur pour tout. Sans compromis." },

  // Trust Bar
  "trust.swissBrand": { de: "Swiss Brand", fr: "Marque Suisse" },
  "trust.warranty": { de: "3 Jahre Garantie", fr: "3 ans de garantie" },
  "trust.freeShipping": { de: "Kostenloser Versand", fr: "Livraison gratuite" },

  // Why RAJ
  "why.title": { de: "Warum", fr: "Pourquoi" },
  "why.text": {
    de: "RAJ wurde in der Schweiz gegründet. Von jemandem der genug hatte von Kabelsalat, mittelmässigen und nicht zertifizierten Produkten. Wir bauen nicht für den Markt. Wir bauen was wir selbst vermisst haben.",
    fr: "RAJ a été fondée en Suisse. Par quelqu'un qui en avait assez des câbles emmêlés, des produits médiocres et non certifiés. Nous ne construisons pas pour le marché. Nous construisons ce qui nous a toujours manqué.",
  },

  // FAQ
  "faq.title": { de: "Häufige Fragen", fr: "Questions fréquentes" },
  "faq.q1": { de: "Ist RAJ NEXUS mit meinem Gerät kompatibel?", fr: "Le RAJ NEXUS est-il compatible avec mon appareil?" },
  "faq.a1": { de: "Ja. Alle iPhones mit MagSafe (iPhone 12 und neuer), Apple Watch, AirPods Pro & AirPods (3. Gen+). Funktioniert auch mit MagSafe Cases.", fr: "Oui. Tous les iPhones avec MagSafe (iPhone 12 et plus récent), Apple Watch, AirPods Pro & AirPods (3e gén+). Fonctionne aussi avec les coques MagSafe." },
  "faq.q2": { de: "Muss ich kaufen?", fr: "Dois-je acheter?" },
  "faq.a2": { de: "Nein. Die Anmeldung ist unverbindlich. Im Mai erhältst du das Kaufangebot - du entscheidest dann.", fr: "Non. L'inscription est sans engagement. En mai, tu recevras l'offre — tu décideras à ce moment-là." },
  "faq.q3": { de: "Was unterscheidet RAJ NEXUS von anderen Chargern?", fr: "Qu'est-ce qui différencie le RAJ NEXUS des autres chargeurs?" },
  "faq.a3": { de: "Qi2.2 Technologie - der neueste Standard (seit Juli 2025), zertifiziert durch das Wireless Power Consortium (WPC). 25W Schnellladen, effizientere Energie, präzisere Ausrichtung. Dazu: Schweizer Qualitätsanspruch, Premium-Materialien, 3 Jahre Garantie.", fr: "Technologie Qi2.2 — le standard le plus récent (depuis juillet 2025), certifié par le Wireless Power Consortium (WPC). Charge rapide 25W, énergie plus efficace, alignement plus précis. En plus: qualité suisse, matériaux premium, 3 ans de garantie." },
  "faq.q4": { de: "Ist das Laden sicher? Was ist mit Überhitzung?", fr: "La charge est-elle sûre? Qu'en est-il de la surchauffe?" },
  "faq.a4": { de: "Ja. WPC-zertifiziert mit integrierten Sicherheitsmechanismen: Überhitzungsschutz, Überladeschutz, Fremdkörpererkennung. Qi2.2 ist effizienter und erzeugt weniger Hitze als ältere Standards.", fr: "Oui. Certifié WPC avec des mécanismes de sécurité intégrés: protection contre la surchauffe, la surcharge et la détection de corps étrangers. Le Qi2.2 est plus efficace et génère moins de chaleur que les anciens standards." },
  "faq.q5": { de: "Wann wird geliefert?", fr: "Quand sera-t-il livré?" },
  "faq.a5": { de: "Mai 2026. Early Access Mitglieder haben Priorität bei der Auslieferung.", fr: "Mai 2026. Les membres Early Access ont la priorité pour la livraison." },

  // Second CTA
  "cta2.title": { de: "Dein Platz wartet.", fr: "Ta place t'attend." },
  "cta2.submitted": { de: "Du bist dabei!", fr: "Tu es inscrit·e!" },
  "cta2.button": { de: "EARLY ACCESS SICHERN", fr: "RÉSERVER L'EARLY ACCESS" },

  // Footer
  "footer.rights": { de: "Alle Rechte vorbehalten.", fr: "Tous droits réservés." },

  // Sticky CTA
  "sticky.cta": { de: "Early Access sichern · Founder Edition", fr: "Réserver l'Early Access · Founder Edition" },

  // Toast
  "toast.signup": { de: "🇨🇭 Jemand hat sich gerade eingetragen.", fr: "🇨🇭 Quelqu'un vient de s'inscrire." },

  // Errors
  "error.invalidEmail": { de: "Bitte gib eine gültige E-Mail-Adresse ein.", fr: "Merci d'entrer une adresse e-mail valide." },
  "error.failed": { de: "Anmeldung fehlgeschlagen. Bitte versuche es erneut.", fr: "L'inscription a échoué. Merci de réessayer." },

  // Exit Intent Popup
  "exit.title": { de: "Sei dabei. Von Anfang an.", fr: "Sois là. Dès le début." },
  "exit.subtitle": { de: "CHF 99 statt CHF 129 — nur für Waitlist-Mitglieder.", fr: "CHF 99 au lieu de CHF 129 — uniquement pour les membres Waitlist." },
  "exit.button": { de: "MEINEN PLATZ SICHERN", fr: "RÉSERVER MA PLACE" },
  "exit.disclaimer": { de: "Kein Spam. Keine Zahlungsdaten. Jederzeit abmeldbar.", fr: "Pas de spam. Pas de paiement. Désabonnement à tout moment." },
  "exit.submitted.title": { de: "Du bist dabei.", fr: "Tu es inscrit·e." },
  "exit.submitted.sub": { de: "Wir melden uns als Erstes bei dir — versprochen.", fr: "On te contacte en premier — promis." },
};

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "de",
  setLang: () => {},
  t: (key) => key,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    // 1. Check localStorage
    const stored = localStorage.getItem("raj_lang");
    if (stored === "de" || stored === "fr") return stored;

    // 2. Auto-detect from browser — only FR if explicitly French, else DE (prio DE)
    const browserLang = navigator.language?.toLowerCase() || "";
    if (browserLang.startsWith("fr")) return "fr";

    // 3. Default: DE
    return "de";
  });

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("raj_lang", newLang);
  }, []);

  const t = useCallback(
    (key: string): string => {
      const entry = translations[key];
      if (!entry) return key;
      return entry[lang] || entry["de"] || key;
    },
    [lang]
  );

  // Update html lang attribute
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
