import thumb0 from "./responsive/17-cherry-cherry-cosmic-orange-thumb.webp.asset.json";
import mobile0 from "./responsive/17-cherry-cherry-cosmic-orange-mobile.webp.asset.json";
import thumb1 from "./uploaded-renders/cherry-deepblue-17-v1-thumb.webp.asset.json";
import mobile1 from "./uploaded-renders/cherry-deepblue-17-v1-mobile.webp.asset.json";
import full1 from "./uploaded-renders/cherry-deepblue-17-v1-full.webp.asset.json";
import thumb2 from "./uploaded-renders/cherry-silver-17-v1-thumb.webp.asset.json";
import mobile2 from "./uploaded-renders/cherry-silver-17-v1-mobile.webp.asset.json";
import full2 from "./uploaded-renders/cherry-silver-17-v1-full.webp.asset.json";
import thumb3 from "./uploaded-renders/cherry-darkcherry-v4-thumb.webp.asset.json";
import mobile3 from "./uploaded-renders/cherry-darkcherry-v4-mobile.webp.asset.json";
import full3 from "./uploaded-renders/cherry-darkcherry-v4-full.webp.asset.json";
import thumb4 from "./uploaded-renders/cherry-darkgrey-v1-thumb.webp.asset.json";
import mobile4 from "./uploaded-renders/cherry-darkgrey-v1-mobile.webp.asset.json";
import full4 from "./uploaded-renders/cherry-darkgrey-v1-full.webp.asset.json";
import thumb5 from "./uploaded-renders/cherry-silver-18-v1-thumb.webp.asset.json";
import mobile5 from "./uploaded-renders/cherry-silver-18-v1-mobile.webp.asset.json";
import full5 from "./uploaded-renders/cherry-silver-18-v1-full.webp.asset.json";
import thumb6 from "./uploaded-renders/cherry-skyblue-18-v1-thumb.webp.asset.json";
import mobile6 from "./uploaded-renders/cherry-skyblue-18-v1-mobile.webp.asset.json";
import full6 from "./uploaded-renders/cherry-skyblue-18-v1-full.webp.asset.json";
import thumb7 from "./responsive/18-onyx-onyx-darkgrey-thumb.webp.asset.json";
import mobile7 from "./responsive/18-onyx-onyx-darkgrey-mobile.webp.asset.json";
import thumb8 from "./responsive/18-onyx-onyx-skyblue-thumb.webp.asset.json";
import mobile8 from "./responsive/18-onyx-onyx-skyblue-mobile.webp.asset.json";
import thumb9 from "./responsive/onyx-orange-thumb.webp.asset.json";
import mobile9 from "./responsive/onyx-orange-mobile.webp.asset.json";
import full9 from "./hq-reference-webp/onyx-orange.webp";
import thumb10 from "./responsive/onyx-blue-thumb.webp.asset.json";
import mobile10 from "./responsive/onyx-blue-mobile.webp.asset.json";
import full10 from "./hq-reference-webp/onyx-blue.webp";
import thumb11 from "./responsive/onyx-silver-thumb.webp.asset.json";
import mobile11 from "./responsive/onyx-silver-mobile.webp.asset.json";
import full11 from "./hq-reference-webp/onyx-silver.webp";
import thumb12 from "./responsive/onyx-darkcherry-thumb.webp.asset.json";
import mobile12 from "./responsive/onyx-darkcherry-mobile.webp.asset.json";
import full12 from "./hq-reference-webp/onyx-darkcherry.webp";
import thumb13 from "./responsive/airpods-cherry-bolt-thumb.webp.asset.json";
import thumb14 from "./responsive/airpods-onyx-original-bolt-thumb.webp.asset.json";
import two17 from "./responsive/two-cases-17-thumb.webp.asset.json";
import two18 from "./responsive/two-cases-18-thumb.webp.asset.json";
export const renderSizes = new Map<string, { mobile: string; thumb: string }>([
  ["/__l5e/assets-v1/26a65acd-2239-4e4f-95cf-bc3c2a82d5ee/17-cherry-cherry-cosmic-orange.webp", { mobile: mobile0.url, thumb: thumb0.url }],
  [full1.url, { mobile: mobile1.url, thumb: thumb1.url }],
  [full2.url, { mobile: mobile2.url, thumb: thumb2.url }],
  [full3.url, { mobile: mobile3.url, thumb: thumb3.url }],
  [full4.url, { mobile: mobile4.url, thumb: thumb4.url }],
  [full5.url, { mobile: mobile5.url, thumb: thumb5.url }],
  [full6.url, { mobile: mobile6.url, thumb: thumb6.url }],
  ["/__l5e/assets-v1/697504bf-8065-41c7-b5c9-f77f58ad7f5a/18-onyx-onyx-darkgrey.webp", { mobile: mobile7.url, thumb: thumb7.url }],
  ["/__l5e/assets-v1/fd40f8d5-0eff-43ae-a89d-ce17b762c90a/18-onyx-onyx-skyblue.webp", { mobile: mobile8.url, thumb: thumb8.url }],
  [full9, { mobile: mobile9.url, thumb: thumb9.url }],
  [full10, { mobile: mobile10.url, thumb: thumb10.url }],
  [full11, { mobile: mobile11.url, thumb: thumb11.url }],
  [full12, { mobile: mobile12.url, thumb: thumb12.url }],
]);
export const airpodsThumbs = { cherry: thumb13.url, onyx: thumb14.url };
export const twoCaseThumbs = { "17": two17.url, "18": two18.url };
// Mobile slot capped at 266px so even 3x screens pick the 800w file, never 1200w.
export const renderImageSizes = "(max-width: 1023px) 266px, 1200px";
export const renderSrcSet = (src: string) => {
  const sized = renderSizes.get(src);
  return sized ? `${sized.mobile} 800w, ${src} 1200w` : undefined;
};
