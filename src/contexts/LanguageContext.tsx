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
  "launch.newSubline.deviceNames": { de: "iPhone · AirPods · Apple Watch", fr: "iPhone · AirPods · Apple Watch", it: "iPhone · AirPods · Apple Watch" },
  "launch.newSubline.action": { de: "Alles gleichzeitig laden.", fr: "Tout charger en même temps.", it: "Caricare tutto contemporaneamente." },
  "launch.reinforcer": { de: "Swiss Brand.", fr: "Swiss Brand.", it: "Swiss Brand." },
  "launch.conviction": { de: "Mehr als ein Ladegerät.", fr: "Plus qu'un chargeur.", it: "Più di un caricatore." },
  "launch.conviction2.bold": { de: "Premium Materialien. Echte Leistung. Fairer Preis.", fr: "Matériaux premium. Vraie performance. Prix juste.", it: "Materiali premium. Prestazioni reali. Prezzo giusto." },
  "launch.conviction2.sub": { de: "Präzise. Zuverlässig. Durchdacht.", fr: "Précis. Fiable. Réfléchi.", it: "Preciso. Affidabile. Pensato." },

  // Launch Page – Form
  "launch.spotsLeft": { de: "Plätze verfügbar!", fr: "places disponibles!", it: "posti disponibili!" },
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
    de: "Wir haben selbst gesucht. Ein Ladegerät das Design, Leistung und Qualität verbindet. Zu einem fairen Preis. Wir haben es nicht gefunden. Also haben wir es selbst gebaut. In der Schweiz. Für Menschen die wissen was sie wollen. Und die sich nicht mit Mittelmass zufrieden geben.",
    fr: "Nous avons cherché nous-mêmes. Un chargeur qui allie design, performance et qualité. À un prix juste. Nous ne l'avons pas trouvé. Alors nous l'avons construit nous-mêmes. En Suisse. Pour les gens qui savent ce qu'ils veulent. Et qui ne se contentent pas de la médiocrité.",
    it: "Abbiamo cercato noi stessi. Un caricatore che unisce design, prestazioni e qualità. A un prezzo giusto. Non l'abbiamo trovato. Quindi l'abbiamo costruito noi stessi. In Svizzera. Per chi sa cosa vuole. E non si accontenta della mediocrità.",
  },

  // Hero Badges
  "badge.swissBrand": { de: "Swiss Brand", fr: "Marque Suisse", it: "Brand Svizzero" },
  "badge.qi22": { de: "Qi2.2 Zertifiziert", fr: "Certifié Qi2.2", it: "Certificato Qi2.2" },
  "badge.warranty": { de: "3 Jahre Garantie", fr: "3 ans de garantie", it: "3 anni di garanzia" },
  "badge.shipping": { de: "Gratis Versand", fr: "Livraison gratuite", it: "Spedizione gratuita" },
  "badge.returns": { de: "14 Tage Rückgabe", fr: "14 jours de retour", it: "14 giorni di reso" },

  // CTA Block (Hero)
  "cta.founderBadge": { de: "Founder Edition · Nur 100 Stück", fr: "Founder Edition · Seulement 100 pièces", it: "Founder Edition · Solo 100 pezzi" },
  "cta.headline": { de: "Sei dabei. Von Anfang an.", fr: "Sois là. Dès le début.", it: "Sii presente. Fin dall'inizio." },
  "cta.savings": { de: "Du sparst CHF 30", fr: "Tu économises CHF 30", it: "Risparmi CHF 30" },
  "cta.benefit1": { de: "Lebenslanger Early Access zu neuen RAJ Produkten.", fr: "Early Access à vie aux nouveaux produits RAJ.", it: "Early Access a vita ai nuovi prodotti RAJ." },
  "cta.benefit2": { de: "Founder Edition mit persönlicher Seriennummer.", fr: "Founder Edition avec numéro de série personnel.", it: "Founder Edition con numero di serie personale." },
  "cta.benefit3": { de: "CHF 30 sparen — CHF 99 statt CHF 129.", fr: "Économise CHF 30 — CHF 99 au lieu de CHF 129.", it: "Risparmia CHF 30 — CHF 99 invece di CHF 129." },
  "cta.priceWarning": { de: "Nur jetzt zum Founder-Preis – danach CHF 129", fr: "Uniquement maintenant au prix Founder – ensuite CHF 129", it: "Solo ora al prezzo Founder – poi CHF 129" },
  "cta.button": { de: "Jetzt Early Access sichern", fr: "Obtenir l'Early Access", it: "Ottieni l'Early Access" },
  "cta.thanks": { de: "Danke — du bist auf der Liste.", fr: "Merci — tu es sur la liste.", it: "Grazie — sei sulla lista." },
  "cta.trust": { de: "Kostenlose Reservierung · Keine Zahlungsdaten · Kein Spam", fr: "Réservation gratuite · Aucune donnée de paiement · Pas de spam", it: "Prenotazione gratuita · Nessun dato di pagamento · Niente spam" },
  "cta.registeredPrefix": { de: "Bereits", fr: "Déjà", it: "Già" },
  "cta.registeredPeople": { de: "Personen", fr: "personnes", it: "persone" },
  "cta.registeredSuffix": { de: "haben sich registriert.", fr: "se sont inscrites.", it: "si sono registrate." },
  "cta.headlineLine1": { de: "Sei dabei.", fr: "Sois là.", it: "Sii presente." },
  "cta.headlineLine2": { de: "Von Anfang an.", fr: "Dès le début.", it: "Fin dall'inizio." },
  "cta.spotsTakenPrefix": { de: "von", fr: "sur", it: "su" },
  "cta.spotsTakenSuffix": { de: "Founder-Plätzen sind bereits vergeben.", fr: "places Founder sont déjà prises.", it: "posti Founder sono già stati assegnati." },
  "cta.joinFirst100": { de: "Werde Teil der ersten 100.", fr: "Rejoins les 100 premiers.", it: "Unisciti ai primi 100." },
  "cta.priceEndsIn": { de: "Founder-Preis endet in", fr: "Le prix Founder se termine dans", it: "Il prezzo Founder finisce tra" },
  "cta.priceNow": { de: "Jetzt", fr: "Maintenant", it: "Ora" },
  "cta.priceAfter": { de: "danach", fr: "ensuite", it: "poi" },
  "cta.reserved": { de: "Dein Founder-Platz ist reserviert.", fr: "Ta place Founder est réservée.", it: "Il tuo posto Founder è riservato." },
  "cta.formLabel": { de: "Erhalte Zugang zum Launch", fr: "Accède au lancement", it: "Accedi al lancio" },
  "cta.emailPlaceholder": { de: "E-Mail Adresse", fr: "Adresse e-mail", it: "Indirizzo e-mail" },
  "cta.submitButton": { de: "Founder Platz sichern", fr: "Réserver ma place Founder", it: "Assicurati il posto Founder" },
  "cta.socialProof": { de: "Jemand hat sich gerade einen Founder-Platz gesichert", fr: "Quelqu'un vient de réserver une place Founder", it: "Qualcuno si è appena assicurato un posto Founder" },
  "countdown.daysShort": { de: "Tage", fr: "Jours", it: "Giorni" },
  "countdown.hoursShort": { de: "Std", fr: "Hrs", it: "Ore" },
  "countdown.minutesShort": { de: "Min", fr: "Min", it: "Min" },
  "countdown.secondsShort": { de: "Sek", fr: "Sec", it: "Sec" },

  // Countdown labels (full)
  "countdown.daysLong": { de: "Tage", fr: "Jours", it: "Giorni" },
  "countdown.hoursLong": { de: "Stunden", fr: "Heures", it: "Ore" },
  "countdown.minutesLong": { de: "Minuten", fr: "Minutes", it: "Minuti" },
  "countdown.secondsLong": { de: "Sekunden", fr: "Secondi", it: "Secondi" },

  // Sticky CTA (new)
  "sticky.imIn": { de: "Ich bin dabei", fr: "Je suis partant", it: "Ci sto" },

  // Hero Carousel
  "carousel.heroLine1": { de: "Ein Kabel. Drei Geräte.", fr: "Un câble. Trois appareils.", it: "Un cavo. Tre dispositivi." },
  "carousel.heroLine2": { de: "Kein Kabelchaos mehr.", fr: "Fini le chaos des câbles.", it: "Mai più caos di cavi." },
  "carousel.s0.headline": { de: "Alles, was du brauchst.", fr: "Tout ce qu'il te faut.", it: "Tutto ciò che ti serve." },
  "carousel.s0.sub": { de: "An einem Ort.", fr: "En un seul endroit.", it: "In un unico posto." },
  "carousel.s1.headline": { de: "Schluss mit Kabelchaos.", fr: "Fini le chaos de câbles.", it: "Basta col caos dei cavi." },
  "carousel.s1.sub": { de: "Alles an einem Ort — ordentlich, elegant, bereit.", fr: "Tout au même endroit — net, élégant, prêt.", it: "Tutto in un posto — ordinato, elegante, pronto." },
  "carousel.s2.headline": { de: "One Place. All Your Power.", fr: "One Place. All Your Power.", it: "One Place. All Your Power." },
  "carousel.s2.sub": { de: "iPhone. Apple Watch. AirPods. Gleichzeitig.", fr: "iPhone. Apple Watch. AirPods. Simultanément.", it: "iPhone. Apple Watch. AirPods. Contemporaneamente." },
  "carousel.s3.headline": { de: "Schnell. Stabil. Zuverlässig.", fr: "Rapide. Stable. Fiable.", it: "Veloce. Stabile. Affidabile." },
  "carousel.s3.sub": { de: "Optimiert für deinen Alltag.", fr: "Optimisé pour ton quotidien.", it: "Ottimizzato per la tua quotidianità." },
  "carousel.s4.headline": { de: "Faltbar. 250g. Überall dabei.", fr: "Pliable. 250g. Partout avec toi.", it: "Pieghevole. 250g. Sempre con te." },
  "carousel.s4.sub": { de: "Perfekt für unterwegs und den Schreibtisch.", fr: "Parfait en déplacement et au bureau.", it: "Perfetto in viaggio e alla scrivania." },
  "carousel.s5.headline": { de: "POWER. ALWAYS THERE.", fr: "POWER. ALWAYS THERE.", it: "POWER. ALWAYS THERE." },
  "carousel.s5.sub": { de: "", fr: "", it: "" },

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
  "cta2.button": { de: "JETZT EARLY ACCESS SICHERN", fr: "OBTENIR L'EARLY ACCESS", it: "OTTIENI L'EARLY ACCESS" },

  // Footer
  "footer.rights": { de: "Alle Rechte vorbehalten.", fr: "Tous droits réservés.", it: "Tutti i diritti riservati." },

  // Sticky CTA
  "sticky.cta": { de: "Platz sichern · Founder Edition", fr: "Réserver ma place · Founder Edition", it: "Assicurati il posto · Founder Edition" },

  // Toast
  "toast.signup": { de: "Jemand hat sich gerade eingetragen.", fr: "Quelqu'un vient de s'inscrire.", it: "Qualcuno si è appena iscritto." },

  // Errors
  "error.invalidEmail": { de: "Bitte gib eine gültige E-Mail-Adresse ein.", fr: "Merci d'entrer une adresse e-mail valide.", it: "Inserisci un indirizzo e-mail valido." },
  "error.failed": { de: "Anmeldung fehlgeschlagen. Bitte versuche es erneut.", fr: "L'inscription a échoué. Merci de réessayer.", it: "Iscrizione fallita. Riprova." },

  // Hero Conversion v2 — neue Keys
  "hero.eyebrow": { de: "Founder Edition · Nur 100 Stück · Schweiz", fr: "Founder Edition · Seulement 100 pièces · Suisse", it: "Founder Edition · Solo 100 pezzi · Svizzera" },
  "hero.h1.line1": { de: "iPhone, AirPods & Apple Watch.", fr: "iPhone, AirPods & Apple Watch.", it: "iPhone, AirPods & Apple Watch." },
  "hero.h1.line2": { de: "Eine Ladestation. Eine Bewegung.", fr: "Une station. Un geste.", it: "Una stazione. Un gesto." },
  "hero.sub": { de: "Trag dich ein und sichere dir CHF 30 Rabatt + lebenslangen Early Access zu allen RAJ Produkten — exklusiv für die ersten 100.", fr: "Inscris-toi et obtiens CHF 30 de remise + un accès anticipé à vie à tous les produits RAJ — exclusif pour les 100 premiers.", it: "Iscriviti e ottieni CHF 30 di sconto + accesso anticipato a vita a tutti i prodotti RAJ — esclusivo per i primi 100." },
  "hero.youAre": { de: "Du wärst Founder", fr: "Tu serais Founder", it: "Saresti Founder" },
  "hero.cta.primary": { de: "Ja, ich sichere mir Founder", fr: "Oui, je réserve Founder", it: "Sì, prenoto Founder" },
  "hero.cta.submitting": { de: "Sichere Platz…", fr: "Réservation…", it: "Riservo…" },
  "hero.benefit.save": { de: "CHF 30 Rabatt", fr: "CHF 30 remise", it: "CHF 30 sconto" },
  "hero.benefit.cable": { de: "Lebenslanger Early Access", fr: "Accès anticipé à vie", it: "Accesso anticipato a vita" },
  "hero.benefit.serial": { de: "Eigene Seriennummer", fr: "Numéro de série perso", it: "Numero di serie personale" },
  "hero.miniFaq.shipping": { de: "Gratis Versand CH", fr: "Livraison gratuite CH", it: "Spedizione gratuita CH" },
  "hero.miniFaq.returns": { de: "30 Tage Rückgabe", fr: "30 jours de retour", it: "30 giorni di reso" },
  "hero.miniFaq.noCommit": { de: "Unverbindlich · Kein Spam", fr: "Sans engagement · Pas de spam", it: "Senza impegno · Niente spam" },
  "hero.scrollHint": { de: "So funktioniert's", fr: "Comment ça marche", it: "Come funziona" },
  "hero.priceLine": { de: "Founder-Preis CHF 99 statt CHF 129 — endet in", fr: "Prix Founder CHF 99 au lieu de CHF 129 — finit dans", it: "Prezzo Founder CHF 99 invece di CHF 129 — finisce tra" },
  "hero.success.title": { de: "Willkommen, Founder.", fr: "Bienvenue, Founder.", it: "Benvenuto, Founder." },
  "hero.success.sub": { de: "Du bist offiziell Founder", fr: "Tu es officiellement Founder", it: "Sei ufficialmente Founder" },
  "hero.success.next": { de: "Wir senden dir am 6. Mai 20:00 deinen exklusiven Kauflink — vor allen anderen.", fr: "Nous t'enverrons le 6 mai à 20h00 ton lien d'achat exclusif — avant tous les autres.", it: "Ti invieremo il 6 maggio alle 20:00 il tuo link d'acquisto esclusivo — prima di tutti." },
  "hero.sticky.label": { de: "Founder-Preis sichern", fr: "Réserver prix Founder", it: "Prezzo Founder" },
  "hero.sticky.cta": { de: "Sichern", fr: "Réserver", it: "Prenota" },
  "hero.live.justJoined": { de: "wurde gerade Founder", fr: "vient de devenir Founder", it: "è appena diventato Founder" },
  "hero.live.newFromCity": { de: "Neue Anmeldung aus", fr: "Nouvelle inscription depuis", it: "Nuova iscrizione da" },
  "hero.live.viewingFromCity": { de: "Jemand schaut gerade aus", fr: "Quelqu'un regarde depuis", it: "Qualcuno sta guardando da" },
  "hero.foundersJoined": { de: "Founder dabei", fr: "Founders inscrits", it: "Founder iscritti" },
  "hero.today": { de: "heute", fr: "aujourd'hui", it: "oggi" },

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
