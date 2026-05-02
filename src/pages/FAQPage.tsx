import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import PremiumPageLayout from "@/components/PremiumPageLayout";

const faqData = [
  { question: "Was ist der RAJ NEXUS?", answer: "Der RAJ NEXUS ist ein 3-in-1 Wireless Charger der gleichzeitig ein iPhone, eine Apple Watch und AirPods kabellos lädt. Er ist Qi2.2-zertifiziert und stammt von einer Swiss Brand." },
  { question: "Was kostet der RAJ NEXUS in der Schweiz?", answer: "Der RAJ NEXUS kostet CHF 99 im Early Access (Founder Edition) und CHF 129 nach dem Launch. Der Preis beinhaltet das Ladegerät und ein USB-C Netzteil." },
  { question: "Was ist der Unterschied zwischen Qi2 und Qi2.2?", answer: "Qi2.2 ist die Weiterentwicklung von Qi2 mit verbesserter Energieeffizienz, besserem Wärmemanagement und strengeren Sicherheitsprüfungen. Beide laden iPhones mit bis zu 15W (Qi2.2 unterstützt bis 25W), aber Qi2.2 ist zukunftssicherer und ermöglicht perspektivisch höhere Ladeleistungen." },
  { question: "Wie schnell lädt der RAJ NEXUS mein iPhone?", answer: "Der RAJ NEXUS lädt ein iPhone mit bis zu 25W kabellos – das ist bis zu 3,3x schneller als ein herkömmliches Qi-Ladegerät mit 5W. Ein iPhone ist in ca. 1,5 Stunden vollständig geladen." },
  { question: "Was ist Qi2 und was unterscheidet es von normalem Wireless Charging?", answer: "Qi2 ist der aktuelle Premium-Standard für kabelloses Laden. Dank Magnetausrichtung und bis zu 25 Watt Ladeleistung ist Qi2 schneller, präziser und effizienter als der ältere Qi-Standard." },
  { question: "Welche Geräte sind mit dem RAJ NEXUS kompatibel?", answer: "Der RAJ NEXUS ist kompatibel mit allen Qi2-zertifizierten Geräten — darunter iPhone 13 bis iPhone 17 sowie Android-Geräte mit Qi2-Unterstützung. Ältere Qi-Geräte werden ebenfalls unterstützt." },
  { question: "Kann ich mein Android-Gerät laden?", answer: "Ja. Alle Geräte mit Qi oder Qi2 funktionieren mit dem RAJ NEXUS. Die Ladegeschwindigkeit richtet sich nach den Spezifikationen deines Geräts." },
  { question: "Kann ich mein Samsung Mobile Phone laden?", answer: "Ja. Für optimale Ladeperformance und präzise Magnetausrichtung empfehlen wir eine kompatible magnetische Schutzhülle. Ohne magnetische Hülle ist das Laden möglich, jedoch mit eingeschränkter Effizienz." },
  { question: "Funktioniert der RAJ NEXUS mit einer Schutzhülle?", answer: "Ja — für das beste Ladeerlebnis empfehlen wir eine Qi2-kompatible Schutzhülle. Schlanke, nicht-metallische Hüllen funktionieren ebenfalls. Metallhüllen oder Hüllen mit Kreditkarten können die Ladefunktion beeinträchtigen." },
  { question: "Kann ich mehrere Geräte gleichzeitig laden?", answer: "Ja. Der RAJ NEXUS 3-in-1 lädt Smartphone, Smartwatch und kabellose Kopfhörer gleichzeitig — perfekt für den modernen Alltag." },
  { question: "Ist der RAJ NEXUS zertifiziert?", answer: "Ja. Der RAJ NEXUS trägt sowohl die CE-Zertifizierung als auch die WPC-Zertifizierung (Wireless Power Consortium) und erfüllt höchste Sicherheits- und Qualitätsstandards." },
  { question: "Welches Netzteil wird benötigt?", answer: "Für maximale Leistung empfehlen wir ein USB-C Netzteil mit mindestens 30 Watt. Das Netzteil ist nicht im Lieferumfang enthalten." },
  { question: "Wird RAJ in Zukunft weitere Produkte bringen?", answer: "Ja. RAJ steht für kontinuierliche Innovation im Bereich Premium Wireless Charging. Weitere Produkte sind bereits in Entwicklung — bleib über unseren Newsletter auf dem Laufenden und sei der Erste, der von neuen Launches erfährt." },
];

const FAQItem = ({ item, isOpen, onToggle, index }: {
  item: typeof faqData[0]; isOpen: boolean; onToggle: () => void; index: number;
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  useEffect(() => { if (contentRef.current) setHeight(contentRef.current.scrollHeight); }, [isOpen]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
      className="border-b border-border/60"
    >
      <button onClick={onToggle} className="w-full flex items-start justify-between gap-6 py-6 text-left group">
        <span className="text-base md:text-lg font-light text-foreground leading-snug group-hover:text-primary transition-colors">
          {item.question}
        </span>
        <span className="flex-shrink-0 mt-1 text-muted-foreground group-hover:text-primary transition-colors">
          {isOpen ? <Minus className="w-5 h-5" strokeWidth={1.25} /> : <Plus className="w-5 h-5" strokeWidth={1.25} />}
        </span>
      </button>
      <div
        style={{ height: isOpen ? height : 0 }}
        className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
      >
        <div ref={contentRef} className="pb-6 pr-10">
          <p className="text-muted-foreground leading-relaxed font-light">{item.answer}</p>
        </div>
      </div>
    </motion.div>
  );
};

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <PremiumPageLayout
      title="FAQ – RAJ | Häufig gestellte Fragen"
      metaDescription="Häufig gestellte Fragen zu RAJ Wireless Charging Produkten. Alles über Qi2, Kompatibilität, Ladegeschwindigkeit und mehr."
      eyebrow="Hilfe"
      heading="Häufige Fragen."
      intro="Antworten auf alles rund um RAJ und unsere Produkte."
    >
      <div>
        {faqData.map((item, index) => (
          <FAQItem
            key={index}
            item={item}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex(prev => prev === index ? null : index)}
            index={index}
          />
        ))}
      </div>
    </PremiumPageLayout>
  );
};

export default FAQPage;
