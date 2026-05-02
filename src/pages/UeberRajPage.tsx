import PremiumPageLayout from "@/components/PremiumPageLayout";

const UeberRajPage = () => {
  return (
    <PremiumPageLayout
      title="Über RAJ – Schweizer Premium Wireless Charging aus dem Thurgau"
      metaDescription="RAJ ist eine Schweizer Consumer-Electronics-Marke aus dem Thurgau. Premium-Zubehör für das Apple-Ökosystem. Präzision · Beständigkeit · Charakter."
      canonical="https://raj.ch/ueber-raj"
      eyebrow="Über RAJ"
      heading="Swiss Brand."
      intro="Schweizer Consumer-Electronics aus dem Thurgau – mit Anspruch an Präzision, Qualität und Design."
    >
      <div className="space-y-8 text-foreground/85 font-light leading-relaxed text-lg">
        <p>
          RAJ ist eine Schweizer Consumer-Electronics-Marke mit Sitz im Kanton Thurgau. Wir entwickeln
          Premium-Zubehör für das Apple-Ökosystem – mit dem Anspruch an Schweizer Präzision, nachhaltige Qualität
          und kompromissloses Design.
        </p>

        <p>
          Unser erstes Produkt, der RAJ NEXUS 3-in-1 Wireless Charger, vereint Funktionalität und Ästhetik: Ein
          Ladegerät, ein Kabel, drei Geräte geladen. Qi2.2-zertifiziert, faltbar, verstellbar – Swiss Brand.
        </p>

        <div className="my-14 py-10 border-y border-border text-center space-y-3">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground font-medium">Unsere Werte</p>
          <p className="text-xl md:text-2xl font-light text-primary tracking-[0.15em]">
            PRÄZISION · BESTÄNDIGKEIT · CHARAKTER
          </p>
        </div>

        <p>RAJ steht für Produkte die funktionieren. Einfach. Ohne Kompromisse.</p>

        <p className="text-2xl md:text-3xl font-light text-foreground italic text-center pt-12">
          Power. Always There.
        </p>
      </div>
    </PremiumPageLayout>
  );
};

export default UeberRajPage;
