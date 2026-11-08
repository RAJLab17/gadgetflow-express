import { AIRPODS_VARIANT_IDS, BUNDLE_DISCOUNT } from "@/components/matrix/matrixCommerce";
import apLaub1200 from "@/assets/matrix/real/airpods-cherry-laub-1200.webp.asset.json";
import apLaub800 from "@/assets/matrix/real/airpods-cherry-laub-800.webp.asset.json";
import apLaub400 from "@/assets/matrix/real/airpods-cherry-laub-400.webp.asset.json";
import apSetSee1200 from "@/assets/matrix/real/matrix-cherry-set-see-1200.webp.asset.json";
import apSetSee800 from "@/assets/matrix/real/matrix-cherry-set-see-800.webp.asset.json";
import apSetSee400 from "@/assets/matrix/real/matrix-cherry-set-see-400.webp.asset.json";
import apCherryProduct1200 from "@/assets/matrix/airpods-gallery/airpods-cherry-product-1200.webp.asset.json";
import apCherryProduct800 from "@/assets/matrix/airpods-gallery/airpods-cherry-product-800.webp.asset.json";
import apCherryProduct400 from "@/assets/matrix/airpods-gallery/airpods-cherry-product-400.webp.asset.json";
import apCherryProduct200 from "@/assets/matrix/airpods-gallery/airpods-cherry-product-200.webp.asset.json";
import apCherryDesk1200 from "@/assets/matrix/airpods-gallery/airpods-cherry-desk-1200.webp.asset.json";
import apCherryDesk800 from "@/assets/matrix/airpods-gallery/airpods-cherry-desk-800.webp.asset.json";
import apCherryDesk400 from "@/assets/matrix/airpods-gallery/airpods-cherry-desk-400.webp.asset.json";
import apCherryDesk200 from "@/assets/matrix/airpods-gallery/airpods-cherry-desk-200.webp.asset.json";
import apCherryBag1200 from "@/assets/matrix/airpods-gallery/airpods-cherry-bag-1200.webp.asset.json";
import apCherryBag800 from "@/assets/matrix/airpods-gallery/airpods-cherry-bag-800.webp.asset.json";
import apCherryBag400 from "@/assets/matrix/airpods-gallery/airpods-cherry-bag-400.webp.asset.json";
import apCherryBag200 from "@/assets/matrix/airpods-gallery/airpods-cherry-bag-200.webp.asset.json";
import apCherryBedside1200 from "@/assets/matrix/airpods-gallery/airpods-cherry-bedside-1200.webp.asset.json";
import apCherryBedside800 from "@/assets/matrix/airpods-gallery/airpods-cherry-bedside-800.webp.asset.json";
import apCherryBedside400 from "@/assets/matrix/airpods-gallery/airpods-cherry-bedside-400.webp.asset.json";
import apCherryBedside200 from "@/assets/matrix/airpods-gallery/airpods-cherry-bedside-200.webp.asset.json";
import apOnyxProduct1200 from "@/assets/matrix/airpods-gallery/airpods-onyx-product-1200.webp.asset.json";
import apOnyxProduct800 from "@/assets/matrix/airpods-gallery/airpods-onyx-product-800.webp.asset.json";
import apOnyxProduct400 from "@/assets/matrix/airpods-gallery/airpods-onyx-product-400.webp.asset.json";
import apOnyxProduct200 from "@/assets/matrix/airpods-gallery/airpods-onyx-product-200.webp.asset.json";
import apOnyxDesk1200 from "@/assets/matrix/airpods-gallery/airpods-onyx-desk-1200.webp.asset.json";
import apOnyxDesk800 from "@/assets/matrix/airpods-gallery/airpods-onyx-desk-800.webp.asset.json";
import apOnyxDesk400 from "@/assets/matrix/airpods-gallery/airpods-onyx-desk-400.webp.asset.json";
import apOnyxDesk200 from "@/assets/matrix/airpods-gallery/airpods-onyx-desk-200.webp.asset.json";
import apOnyxBag1200 from "@/assets/matrix/airpods-gallery/airpods-onyx-bag-1200.webp.asset.json";
import apOnyxBag800 from "@/assets/matrix/airpods-gallery/airpods-onyx-bag-800.webp.asset.json";
import apOnyxBag400 from "@/assets/matrix/airpods-gallery/airpods-onyx-bag-400.webp.asset.json";
import apOnyxBag200 from "@/assets/matrix/airpods-gallery/airpods-onyx-bag-200.webp.asset.json";
import apOnyxCafe1200 from "@/assets/matrix/airpods-gallery/airpods-onyx-cafe-1200.webp.asset.json";
import apOnyxCafe800 from "@/assets/matrix/airpods-gallery/airpods-onyx-cafe-800.webp.asset.json";
import apOnyxCafe400 from "@/assets/matrix/airpods-gallery/airpods-onyx-cafe-400.webp.asset.json";
import apOnyxCafe200 from "@/assets/matrix/airpods-gallery/airpods-onyx-cafe-200.webp.asset.json";
import apOnyxCar1200 from "@/assets/matrix/airpods-gallery/airpods-onyx-car-1200.webp.asset.json";
import apOnyxCar800 from "@/assets/matrix/airpods-gallery/airpods-onyx-car-800.webp.asset.json";
import apOnyxCar400 from "@/assets/matrix/airpods-gallery/airpods-onyx-car-400.webp.asset.json";
import apOnyxCar200 from "@/assets/matrix/airpods-gallery/airpods-onyx-car-200.webp.asset.json";
export type FinishId = "cherry" | "onyx";
export type ModelId = "17pro" | "17promax" | "18pro" | "18promax";

export interface Slide { src: string; md: string; sm: string; thumb: string; alt: string; fit?: "cover" | "contain" }

export interface Finish {
  id: FinishId;
  name: string;
  base: string;
  weave: string;
  edge: string;
  price: number;
  variantId: string;
  sku: string;
  /** Produktfoto zuerst, danach bis zu 4 Lifestyle-Fotos (feste CDN-Adressen). */
  slides: Slide[];
}

export const AIRPODS_PRICE = 35;
/** Vier Lifestyle-Fotos für das Product-Schema (feste Adressen, Produktfotos stehen davor). */
export const AIRPODS_SCHEMA_LIFESTYLE = [apCherryDesk1200, apCherryBag1200, apCherryBedside1200, apOnyxDesk1200].map((a) => `https://raj.ch${a.url}`);
export const IPHONE_CASE_PRICE = 59;

export const FINISHES: Finish[] = [
  {
    id: "cherry",
    name: "Cherry Carbon",
    base: "#7b4b60",
    weave: "#a66f83",
    edge: "#4f2b3a",
    price: AIRPODS_PRICE,
    variantId: AIRPODS_VARIANT_IDS.cherry,
    sku: "RAJ-MTX-AP4-CHY",
    slides: [
      { src: apCherryProduct1200.url, md: apCherryProduct800.url, sm: apCherryProduct400.url, thumb: apCherryProduct200.url, alt: "MATRIX AirPods Hülle in Cherry Carbon mit goldenem Karabiner", fit: "contain" },
      { src: apLaub1200.url, md: apLaub800.url, sm: apLaub400.url, thumb: apLaub400.url, alt: "RAJ Hülle für AirPods in Cherry Carbon mit goldenem Karabiner im Herbstlaub", fit: "cover" },
      { src: apCherryBag1200.url, md: apCherryBag800.url, sm: apCherryBag400.url, thumb: apCherryBag200.url, alt: "MATRIX AirPods Case in Cherry Carbon – Bag", fit: "cover" },
      { src: apCherryDesk1200.url, md: apCherryDesk800.url, sm: apCherryDesk400.url, thumb: apCherryDesk200.url, alt: "MATRIX AirPods Case in Cherry Carbon – Desk", fit: "cover" },
      { src: apCherryBedside1200.url, md: apCherryBedside800.url, sm: apCherryBedside400.url, thumb: apCherryBedside200.url, alt: "MATRIX AirPods Case in Cherry Carbon – Bedside", fit: "cover" },
      { src: apSetSee1200.url, md: apSetSee800.url, sm: apSetSee400.url, thumb: apSetSee400.url, alt: "RAJ MATRIX Hülle und AirPods-Hülle in Cherry Carbon, in der Hand am See", fit: "cover" },
    ],
  },
  {
    id: "onyx",
    name: "Onyx Carbon",
    base: "#16171a",
    weave: "#33363c",
    edge: "#08090a",
    price: AIRPODS_PRICE,
    variantId: AIRPODS_VARIANT_IDS.onyx,
    sku: "RAJ-MTX-AP4-ONX",
    slides: [
      { src: apOnyxProduct1200.url, md: apOnyxProduct800.url, sm: apOnyxProduct400.url, thumb: apOnyxProduct200.url, alt: "MATRIX AirPods Hülle in Onyx Carbon", fit: "contain" },
      { src: apLaub1200.url, md: apLaub800.url, sm: apLaub400.url, thumb: apLaub400.url, alt: "RAJ Hülle für AirPods in Cherry Carbon mit goldenem Karabiner im Herbstlaub", fit: "cover" },
      { src: apOnyxBag1200.url, md: apOnyxBag800.url, sm: apOnyxBag400.url, thumb: apOnyxBag200.url, alt: "MATRIX AirPods Case in Onyx Carbon – Bag", fit: "cover" },
      { src: apOnyxDesk1200.url, md: apOnyxDesk800.url, sm: apOnyxDesk400.url, thumb: apOnyxDesk200.url, alt: "MATRIX AirPods Case in Onyx Carbon – Desk", fit: "cover" },
      { src: apOnyxCafe1200.url, md: apOnyxCafe800.url, sm: apOnyxCafe400.url, thumb: apOnyxCafe200.url, alt: "MATRIX AirPods Case in Onyx Carbon – Cafe", fit: "cover" },
      { src: apOnyxCar1200.url, md: apOnyxCar800.url, sm: apOnyxCar400.url, thumb: apOnyxCar200.url, alt: "MATRIX AirPods Case in Onyx Carbon – Car", fit: "cover" },
      { src: apSetSee1200.url, md: apSetSee800.url, sm: apSetSee400.url, thumb: apSetSee400.url, alt: "RAJ MATRIX Hülle und AirPods-Hülle in Cherry Carbon, in der Hand am See", fit: "cover" },
    ],
  },
];

export const MODELS: { id: ModelId; short: string; name: string; status: string }[] = [
  { id: "17pro", short: "17 Pro", name: "iPhone 17 Pro", status: "Verfügbar" },
  { id: "17promax", short: "17 Pro Max", name: "iPhone 17 Pro Max", status: "Verfügbar" },
  { id: "18pro", short: "18 Pro", name: "iPhone 18 Pro", status: "Vorbestellung" },
  { id: "18promax", short: "18 Pro Max", name: "iPhone 18 Pro Max", status: "Vorbestellung" },
];

export const BUNDLE_TOTAL = AIRPODS_PRICE + IPHONE_CASE_PRICE - BUNDLE_DISCOUNT;

export const GALLERY_SIZES = "(max-width: 767px) 100vw, 460px";
export const slideSrcSet = (s: Slide) => `${s.sm} 400w, ${s.md} 800w, ${s.src} 1200w`;


export const AIRPODS_FAQ = [
 ['Passt die Hülle auf meine AirPods?','Ja, auf AirPods 4 (mit und ohne aktive Geräuschunterdrückung) und AirPods 5. Die Ladecases haben laut Apple dieselben Masse. Für AirPods Pro gibt es die Hülle nicht.'],
 ['Kann ich kabellos laden, ohne die Hülle abzunehmen?','Ja, wenn dein Ladecase kabelloses Laden unterstützt: AirPods 4 mit ANC und AirPods 5. Zum Beispiel auf dem RAJ NEXUS.'],
 ['Ist das echtes Carbon?','Ja. Die Oberfläche ist aus echtem Carbon, gleich wie bei der MATRIX iPhone Hülle, auf einer Hartschale aus Polycarbonat. Der Karabiner ist aus eloxiertem Aluminium.'],
 ['Wofür ist der Karabiner?','Damit hängst du das Case an Tasche, Rucksack oder Schlüsselbund. Du kannst ihn abnehmen.'],
 ['Wann kommt meine Bestellung?','Gratis Versand mit der Post in 2 bis 3 Werktagen, mit Sendungsverfolgung.'],
 ['Kann ich zurückgeben?','30 Tage ab Erhalt, ohne Gebrauchsspuren und in der Originalverpackung. Die Rücksendeetikette ist gratis.'],
] as const;
export const airpodsNeedsModel = (bundle:boolean,model:ModelId|null) => bundle && !model;
