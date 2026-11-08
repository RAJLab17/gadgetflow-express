import hero400 from '@/assets/products/nexus-hero-v2-400w.webp.asset.json';
import hero800 from '@/assets/products/nexus-hero-v2-800w.webp.asset.json';
import hero1200 from '@/assets/products/nexus-hero-v2-1200w.webp.asset.json';
import bedside from '@/assets/nexus-carousel/slide-3-900.webp';
import bedsideFull from '@/assets/nexus-carousel/slide-3-1400.webp';
import desk from '@/assets/products/nexus-desk-writing-1000w.webp';
import folds from '@/assets/products/nexus-real-folds-white-tight.webp';
import sofa from '@/assets/products/nexus-sidetable-enjoy-680w.webp';
import skyline from '@/assets/products/nexus-office-skyline-680w.webp';
export const NEXUS_PRICE = 99;
export const NEXUS_PACKAGE = 'Im Paket: NEXUS und USB-C Kabel. Kein Netzteil dabei: du brauchst ein USB-C Netzteil mit mindestens 30 W.';
export const NEXUS_POWER = { minimumWatts: 30, includedAdapter: false, warrantyYears: 3 };
export const NEXUS_GALLERY = [
 {src:hero800.url,full:hero1200.url,srcSet:`${hero400.url} 400w, ${hero800.url} 800w, ${hero1200.url} 1200w`,sizes:'(max-width: 768px) 266px, 700px',thumb:hero400.url,alt:'RAJ NEXUS mit iPhone, Apple Watch und AirPods',studio:true},
 {src:bedside,full:bedsideFull,alt:'RAJ NEXUS nachts auf dem Nachttisch im StandBy-Modus'},
 {src:desk,alt:'RAJ NEXUS auf dem Schreibtisch beim Schreiben'},
 {src:folds,alt:'RAJ NEXUS zusammengeklappt für unterwegs',studio:true},
 {src:sofa,alt:'RAJ NEXUS auf einem Beistelltisch im Wohnzimmer'},
 {src:skyline,alt:'RAJ NEXUS im Büro vor der Skyline'},
] as const;
export const NEXUS_FAQ = [
 ['Lädt der NEXUS mein iPhone mit 25 W?','Mit 25 W laden iPhone 16 und neuer mit iOS 26 (Qi2.2). Ältere iPhones ab iPhone 12 laden ebenfalls, aber langsamer. Für volle Leistung brauchst du ein USB-C Netzteil mit mindestens 30 W.'],
 ['Welche Geräte kann ich laden?','iPhone 12 bis 18, Apple Watch und AirPods mit kabellosem Ladecase. Alle drei gleichzeitig.'],
 ['Ist ein Netzteil dabei?','Nein. Im Paket sind NEXUS und USB-C Kabel. Du brauchst ein USB-C Power-Delivery-Netzteil mit mindestens 30 W, zum Beispiel ein MacBook-Netzteil. Schwächere Netzteile laden langsamer oder brechen ab.'],
 ['Lädt er auch durch die Hülle?','Ja, durch dünne MagSafe-Hüllen wie die MATRIX. Dicke Hüllen, Kartenhalter oder Metallplatten unterbrechen das Laden.'],
 ['Warum lädt mein iPhone über Nacht nur bis 80 %?','Das ist «Optimiertes Laden» oder das 80-%-Limit von iOS. Es schont den Akku. Du findest es unter Einstellungen › Batterie › Laden.'],
 ['Wird der NEXUS warm?','Kabelloses Laden erzeugt etwas Wärme. Der NEXUS hat einen Überhitzungsschutz und reduziert die Leistung, wenn es zu warm wird. Am besten nicht direkt neben der Heizung oder in der Sonne.'],
 ['Wie lange gilt die Garantie?','3 Jahre. Bei einem Defekt meldest du dich bei unserem Support.'],
 ['Versand, Rückgabe und Zahlung','Gratis Versand mit der Post in 2 bis 3 Werktagen. 30 Tage gratis Rückgabe. Bezahlen mit TWINT, Karte oder Apple Pay.'],
 ['Was ist der RAJ NEXUS?','Der RAJ NEXUS ist eine 3-in-1 Ladestation für iPhone, Apple Watch und AirPods mit Qi2.2 und bis zu 25 W. Er ist bei RAJ GmbH aus Weinfelden TG erhältlich.'],
 ['Was kostet der RAJ NEXUS in der Schweiz?','Der RAJ NEXUS kostet CHF 99. Im Paket sind NEXUS und USB-C Kabel, ohne Netzteil. Für volle Leistung brauchst du ein USB-C Power-Delivery-Netzteil mit mindestens 30 W.'],
 ['Wo kann ich den RAJ NEXUS kaufen?','Auf raj.ch direkt von RAJ. Versand innerhalb der Schweiz.'],
 ['Was ist der Unterschied zwischen Qi2 und Qi2.2?','Qi2 lädt iPhones mit bis zu 15 W, Qi2.2 mit bis zu 25 W – ab iPhone 16 mit iOS 26. Für volle Leistung braucht NEXUS ein USB-C Power-Delivery-Netzteil mit mindestens 30 W.'],
] as const;
export const NEXUS_SPECS = [ ['Standard','Qi2.2 · WPC zertifiziert'],['iPhone','bis 25 W, ab iPhone 16 mit iOS 26'],['Geräte','iPhone, Apple Watch, AirPods'],['Material','Aluminium'],['Sicherheit','Überhitzungs- und Überladeschutz'],['Im Paket','NEXUS, USB-C Kabel (ohne Netzteil)'],['Netzteil nötig','USB-C PD, mindestens 30 W'],['Kompatibel','iPhone 12 bis 18, Apple Watch, AirPods mit kabellosem Case'],['Garantie','3 Jahre'] ] as const;
