import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type Language = "de" | "fr" | "it";

type Translations = Record<string, Record<Language, string>>;

const translations: Translations = {
  // Header
  "header.product": { de: "Produkt", fr: "Produit", it: "Prodotto" },
  "header.about": { de: "Über uns", fr: "À propos", it: "Chi siamo" },
  "header.support": { de: "Support", fr: "Support", it: "Supporto" },
  "header.buy": { de: "Jetzt kaufen", fr: "Acheter", it: "Acquista ora" },
  "header.faq": { de: "FAQ", fr: "FAQ", it: "FAQ" },
  "header.shipping": { de: "Versand & Rückgabe", fr: "Livraison & Retour", it: "Spedizione & Reso" },
  "header.contact": { de: "Kontakt", fr: "Contact", it: "Contatto" },
  "header.manuals": { de: "Manuals & Downloads", fr: "Manuels & Téléchargements", it: "Manuali & Download" },

  // Launch Page – Hero
  "launch.scarcity": { de: "Founder Edition — limitiert auf", fr: "Founder Edition — limitée à", it: "Founder Edition — limitata a" },
  "launch.pieces": { de: "Stück", fr: "pièces", it: "pezzi" },
  "launch.discovered": { de: "Bereits von", fr: "Déjà découvert par", it: "Già scoperto da" },
  "launch.discoveredSuffix": { de: "Personen entdeckt", fr: "personnes", it: "persone" },
  "launch.provocation.prefix": { de: "Endlich kein", fr: "Enfin fini le", it: "Finalmente basta col" },
  "launch.provocation.highlight": { de: "Kabelchaos", fr: "chaos de câbles", it: "caos dei cavi" },
  "launch.provocation.suffix": { de: "mehr.", fr: ".", it: "." },
  "launch.headline1": { de: "Du hast ein iPhone für", fr: "Tu as un iPhone à", it: "Hai un iPhone da" },
  "launch.subheadline": { de: "Weisst du ob dein Ladegerät zertifiziert ist?", fr: "Sais-tu si ton chargeur est certifié?", it: "Sai se il tuo caricatore è certificato?" },
  "launch.warning": { de: "Nicht zertifizierte Produkte können deine Geräte beschädigen.", fr: "Les produits non certifiés peuvent endommager tes appareils.", it: "I prodotti non certificati possono danneggiare i tuoi dispositivi." },
  "launch.certification": { de: "Die meisten kabellosen Ladegeräte auf dem Markt sind nicht Qi2.2 zertifiziert. RAJ NEXUS schon.", fr: "La plupart des chargeurs sans fil sur le marché ne sont pas certifiés Qi2.2. RAJ NEXUS, si.", it: "La maggior parte dei caricatori wireless sul mercato non è certificata Qi2.2. RAJ NEXUS sì." },
  "launch.newHeadline.combined": { de: "Ein Ladegerät. Ein Kabel. Drei Geräte.", fr: "Un chargeur. Un câble. Trois appareils.", it: "Un caricatore. Un cavo. Tre dispositivi." },
  "launch.newHeadline.top": { de: "Ein Ladegerät. Ein Kabel.", fr: "Un chargeur. Un câble.", it: "Un caricatore. Un cavo." },
  "launch.newHeadline.bottom": { de: "Drei Geräte.", fr: "Trois appareils.", it: "Tre dispositivi." },
  "launch.newSubline.devices": { de: "📱 · 🎧 · ⌚", fr: "📱 · 🎧 · ⌚", it: "📱 · 🎧 · ⌚" },
  "launch.newSubline.deviceNames": { de: "Smartphone · AirPods · Apple Watch", fr: "Smartphone · AirPods · Apple Watch", it: "Smartphone · AirPods · Apple Watch" },
  "launch.newSubline.action": { de: "Alles gleichzeitig laden.", fr: "Tout charger en même temps.", it: "Caricare tutto contemporaneamente." },
  "launch.reinforcer": { de: "Swiss Brand.", fr: "Swiss Brand.", it: "Swiss Brand." },
  "launch.conviction": { de: "Das bessere Ladegerät.", fr: "Le meilleur chargeur.", it: "Il caricatore migliore." },
  "launch.conviction2.bold": { de: "Premium Materialien. Echte Leistung. Fairer Preis.", fr: "Matériaux premium. Vraie performance. Prix juste.", it: "Materiali premium. Prestazioni reali. Prezzo giusto." },
  "launch.conviction2.sub": { de: "Präzise. Zuverlässig. Durchdacht.", fr: "Précis. Fiable. Réfléchi.", it: "Preciso. Affidabile. Pensato." },

  // Launch Page – Form
  "launch.spotsLeft": { de: "verfügbar!", fr: "disponibles!", it: "disponibili!" },
  "launch.only": { de: "Nur noch", fr: "Plus que", it: "Solo ancora" },
  "launch.emailPlaceholder": { de: "E-Mail Adresse", fr: "Adresse e-mail", it: "Indirizzo e-mail" },
  "launch.cta": { de: "Platz sichern", fr: "Réserver ma place", it: "Assicurati il posto" },
  "launch.noPayment": { de: "Keine Zahlungsdaten nötig", fr: "Aucune donnée de paiement requise", it: "Nessun dato di pagamento richiesto" },
  "launch.unsubscribe": { de: "Kein Spam", fr: "Pas de spam", it: "Niente spam" },
  "launch.infoOnly": { de: "Nur Info E-Mails", fr: "Uniquement e-mails d'info", it: "Solo e-mail informative" },
  "launch.submitted.title": { de: "Du bist dabei.", fr: "Tu es inscrit·e.", it: "Sei dei nostri." },
  "launch.submitted.sub": { de: "Wir melden uns als Erstes bei dir — versprochen.", fr: "On te contacte en premier — promis.", it: "Ti contatteremo per primo — promesso." },

  // Countdown
  "countdown.days": { de: "Tage", fr: "Jours", it: "Giorni" },
  "countdown.hours": { de: "Std", fr: "Hrs", it: "Ore" },
  "countdown.minutes": { de: "Min", fr: "Min", it: "Min" },
  "countdown.seconds": { de: "Sek", fr: "Sec", it: "Sec" },

  // Taglines
  "tagline.1": { de: "Power. Always There.", fr: "Power. Always There.", it: "Power. Always There." },
  "tagline.2": { de: "Präzision. Beständigkeit. Charakter.", fr: "Précision. Constance. Caractère.", it: "Precisione. Costanza. Carattere." },
  "tagline.3": { de: "Schweizer Brand. Weltweit zertifiziert.", fr: "Marque suisse. Certifiée mondialement.", it: "Brand svizzero. Certificato a livello mondiale." },

  // Benefits
  "benefits.title": { de: "Benefits für die ersten 100.", fr: "Avantages pour les 100 premiers.", it: "Vantaggi per i primi 100." },
  "benefits.1": { de: "CHF 30 sparen — CHF 99 statt CHF 129.", fr: "Économise CHF 30 — CHF 99 au lieu de CHF 129.", it: "Risparmia CHF 30 — CHF 99 invece di CHF 129." },
  "benefits.2": { de: "Founder Edition mit persönlicher Seriennummer.", fr: "Founder Edition avec numéro de série personnel.", it: "Founder Edition con numero di serie personale." },
  "benefits.3": { de: "Lebenslanger Early Access zu neuen RAJ Produkten.", fr: "Early Access à vie pour les nouveaux produits RAJ.", it: "Early Access a vita per i nuovi prodotti RAJ." },

  // Product Teaser
  "product.subtitle": { de: "Ein Ladegerät für alles. Ohne Kompromisse.", fr: "Un chargeur pour tout. Sans compromis.", it: "Un caricatore per tutto. Senza compromessi." },

  // Trust Bar
  "trust.swissBrand": { de: "Swiss Brand", fr: "Marque Suisse", it: "Brand Svizzero" },
  "trust.warranty": { de: "3 Jahre Garantie", fr: "3 ans de garantie", it: "3 anni di garanzia" },
  "trust.freeShipping": { de: "Kostenloser Versand", fr: "Livraison gratuite", it: "Spedizione gratuita" },

  // Why RAJ
  "why.title": { de: "Warum", fr: "Pourquoi", it: "Perché" },
  "why.text": {
    de: "Wir haben selbst gesucht. Ein Ladegerät das Design, Leistung und Qualität verbindet — zu einem fairen Preis. Wir haben es nicht gefunden. Also haben wir es gebaut. In der Schweiz. Für Menschen die keine Kompromisse machen — und wissen was sie wollen.",
    fr: "Nous avons cherché nous-mêmes. Un chargeur qui allie design, performance et qualité — à un prix juste. Nous ne l'avons pas trouvé. Alors nous l'avons construit. En Suisse. Pour ceux qui ne font aucun compromis — et savent ce qu'ils veulent.",
    it: "Abbiamo cercato noi stessi. Un caricatore che unisce design, prestazioni e qualità — a un prezzo giusto. Non l'abbiamo trovato. Quindi l'abbiamo costruito. In Svizzera. Per chi non scende a compromessi — e sa cosa vuole.",
  },

  // FAQ
  "faq.title": { de: "Häufige Fragen", fr: "Questions fréquentes", it: "Domande frequenti" },
  "faq.q1": { de: "Ist RAJ NEXUS mit meinem Gerät kompatibel?", fr: "Le RAJ NEXUS est-il compatible avec mon appareil?", it: "Il RAJ NEXUS è compatibile con il mio dispositivo?" },
  "faq.a1": { de: "Ja. iPhone 12 und neuer mit MagSafe, Apple Watch Series 1–Ultra, AirPods Pro & AirPods 3. Generation+. Funktioniert auch mit MagSafe Cases. Dank Qi2.2 auch kompatibel mit Samsung Galaxy S25 und anderen Qi2-fähigen Android Geräten.", fr: "Oui. iPhone 12 et plus récent avec MagSafe, Apple Watch Series 1–Ultra, AirPods Pro & AirPods 3e génération+. Fonctionne aussi avec les coques MagSafe. Grâce au Qi2.2, également compatible avec le Samsung Galaxy S25 et d'autres appareils Android compatibles Qi2.", it: "Sì. iPhone 12 e successivi con MagSafe, Apple Watch Series 1–Ultra, AirPods Pro e AirPods 3a generazione+. Funziona anche con le custodie MagSafe. Grazie al Qi2.2, compatibile anche con Samsung Galaxy S25 e altri dispositivi Android compatibili Qi2." },
  "faq.q2": { de: "Muss ich mich zum Kauf verpflichten?", fr: "Dois-je m'engager à acheter?", it: "Devo impegnarmi all'acquisto?" },
  "faq.a2": { de: "Nein. Die Anmeldung ist unverbindlich. Im Mai erhältst du das Kaufangebot - du entscheidest dann.", fr: "Non. L'inscription est sans engagement. En mai, tu recevras l'offre — tu décideras à ce moment-là.", it: "No. L'iscrizione è senza impegno. A maggio riceverai l'offerta — deciderai tu." },
  "faq.q3": { de: "Was unterscheidet RAJ NEXUS von anderen Chargern?", fr: "Qu'est-ce qui différencie le RAJ NEXUS des autres chargeurs?", it: "Cosa distingue il RAJ NEXUS dagli altri caricatori?" },
  "faq.a3": { de: "Qi2.2 Technologie - der neueste Standard (seit Juli 2025), zertifiziert durch das Wireless Power Consortium (WPC). 25W Schnellladen, effizientere Energie, präzisere Ausrichtung. Dazu: Schweizer Qualitätsanspruch, Premium-Materialien, 3 Jahre Garantie.", fr: "Technologie Qi2.2 — le standard le plus récent (depuis juillet 2025), certifié par le Wireless Power Consortium (WPC). Charge rapide 25W, énergie plus efficace, alignement plus précis. En plus: qualité suisse, matériaux premium, 3 ans de garantie.", it: "Tecnologia Qi2.2 — lo standard più recente (da luglio 2025), certificato dal Wireless Power Consortium (WPC). Ricarica rapida 25W, energia più efficiente, allineamento più preciso. In più: qualità svizzera, materiali premium, 3 anni di garanzia." },
  "faq.q4": { de: "Ist das Laden sicher? Was ist mit Überhitzung?", fr: "La charge est-elle sûre? Qu'en est-il de la surchauffe?", it: "La ricarica è sicura? E il surriscaldamento?" },
  "faq.a4": { de: "Ja. WPC-zertifiziert mit integrierten Sicherheitsmechanismen: Überhitzungsschutz, Überladeschutz, Fremdkörpererkennung. Qi2.2 ist effizienter und erzeugt weniger Hitze als ältere Standards.", fr: "Oui. Certifié WPC avec des mécanismes de sécurité intégrés: protection contre la surchauffe, la surcharge et la détection de corps étrangers. Le Qi2.2 est plus efficace et génère moins de chaleur que les anciens standards.", it: "Sì. Certificato WPC con meccanismi di sicurezza integrati: protezione dal surriscaldamento, dalla sovraccarica e rilevamento di corpi estranei. Il Qi2.2 è più efficiente e genera meno calore rispetto agli standard precedenti." },
  "faq.q5": { de: "Wann kann ich meinen RAJ NEXUS erwarten?", fr: "Quand puis-je recevoir mon RAJ NEXUS?", it: "Quando posso aspettarmi il mio RAJ NEXUS?" },
  "faq.a5": { de: "Mai 2026. Early Access Mitglieder haben Priorität bei der Auslieferung.", fr: "Mai 2026. Les membres Early Access ont la priorité pour la livraison.", it: "Maggio 2026. I membri Early Access hanno la priorità nella consegna." },

  // Second CTA
  "cta2.title": { de: "Dein Platz wartet.", fr: "Ta place t'attend.", it: "Il tuo posto ti aspetta." },
  "cta2.submitted": { de: "Du bist dabei!", fr: "Tu es inscrit·e!", it: "Sei dei nostri!" },
  "cta2.button": { de: "PLATZ SICHERN", fr: "RÉSERVER MA PLACE", it: "ASSICURATI IL POSTO" },

  // Footer
  "footer.rights": { de: "Alle Rechte vorbehalten.", fr: "Tous droits réservés.", it: "Tutti i diritti riservati." },

  // Sticky CTA
  "sticky.cta": { de: "Platz sichern · Founder Edition", fr: "Réserver ma place · Founder Edition", it: "Assicurati il posto · Founder Edition" },

  // Toast
  "toast.signup": { de: "🇨🇭 Jemand hat sich gerade eingetragen.", fr: "🇨🇭 Quelqu'un vient de s'inscrire.", it: "🇨🇭 Qualcuno si è appena iscritto." },

  // Errors
  "error.invalidEmail": { de: "Bitte gib eine gültige E-Mail-Adresse ein.", fr: "Merci d'entrer une adresse e-mail valide.", it: "Inserisci un indirizzo e-mail valido." },
  "error.failed": { de: "Anmeldung fehlgeschlagen. Bitte versuche es erneut.", fr: "L'inscription a échoué. Merci de réessayer.", it: "Iscrizione fallita. Riprova." },

  // Exit Intent Popup
  "exit.title": { de: "Sei dabei. Von Anfang an.", fr: "Sois là. Dès le début.", it: "Sii presente. Fin dall'inizio." },
  "exit.subtitle": { de: "CHF 99 statt CHF 129 — nur für Waitlist-Mitglieder.", fr: "CHF 99 au lieu de CHF 129 — uniquement pour les membres Waitlist.", it: "CHF 99 invece di CHF 129 — solo per i membri della Waitlist." },
  "exit.button": { de: "MEINEN PLATZ SICHERN", fr: "RÉSERVER MA PLACE", it: "ASSICURARMI IL MIO POSTO" },
  "exit.disclaimer": { de: "Kein Spam. Keine Zahlungsdaten. Jederzeit abmeldbar.", fr: "Pas de spam. Pas de paiement. Désabonnement à tout moment.", it: "Niente spam. Nessun dato di pagamento. Cancellazione in qualsiasi momento." },
  "exit.submitted.title": { de: "Du bist dabei.", fr: "Tu es inscrit·e.", it: "Sei dei nostri." },
  "exit.submitted.sub": { de: "Wir melden uns als Erstes bei dir — versprochen.", fr: "On te contacte en premier — promis.", it: "Ti contatteremo per primo — promesso." },
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
    if (stored === "de" || stored === "fr" || stored === "it") return stored;

    // 2. Auto-detect from browser — only FR if explicitly French, else DE (prio DE)
    const browserLang = navigator.language?.toLowerCase() || "";
    if (browserLang.startsWith("fr")) return "fr";
    if (browserLang.startsWith("it")) return "it";

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
